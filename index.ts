import configureHotReload from "bun-hot-reload";
import Database from "bun:sqlite";
import { Item } from "./src/models/item";
import { serveRoutes } from "./src/serveRoutes";

const db = new Database("./db/db.sqlite3", { strict: true, create: true });
db.exec("PRAGMA journal_mode = WAL;");

db.exec(`CREATE TABLE IF NOT EXISTS rooms
  (id TEXT PRIMARY KEY, created_at INTEGER, updated_at INTEGER)`);
db.exec(`CREATE TABLE IF NOT EXISTS items
  (id TEXT PRIMARY KEY, room_id TEXT, item_type TEXT, mime_type TEXT, summary TEXT, created_at INTEGER, updated_at INTEGER)`);

const result = db.query(`SELECT * FROM rooms`);
if (result.values().length === 0) {
  const id = Bun.randomUUIDv7();

  db.query(
    `INSERT INTO rooms (id, created_at, updated_at) VALUES ($id, $created_at, $updated_at)`
  ).all({
    id: id,
    created_at: Math.floor(Date.now() / 1000),
    updated_at: Math.floor(Date.now() / 1000),
  });

  console.log("Inserted a new room", id);
}

const routes = {
  "/api/rooms/:roomId": [
    {
      method: "GET",
      handler: async (params: Record<string, string>, request: Request) => {
        const result = db.query(`SELECT * FROM rooms WHERE id = $room_id`).get({
          room_id: params.roomId,
        });

        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  ],
  "/api/rooms/:roomId/items": [
    {
      method: "GET",
      handler: async (params: Record<string, string>) => {
        const result = db
          .query(`SELECT * FROM items WHERE room_id = $room_id`)
          .as(Item)
          .all({
            room_id: params.roomId,
          });

        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  ],
  "/api/rooms/:roomId/upload": [
    {
      method: "POST",
      handler: async (params: Record<string, string>, request: Request) => {
        const body = (await request.json()) as {
          item_type: string;
          summary: string;
          mime_type: string;
        };

        const itemId = Bun.randomUUIDv7();

        db.query(
          `INSERT INTO items (id, room_id, item_type, summary, created_at, updated_at) VALUES ($id, $room_id, $item_type, $summary, $created_at, $updated_at)`
        ).run({
          id: itemId,
          room_id: params.roomId,
          item_type: body.item_type,
          summary: body.summary,
          mime_type: body.mime_type,
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
        });

        return new Response(
          JSON.stringify({
            id: itemId,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      },
    },
  ],
  "/api/items/:itemId/upload": [
    {
      method: "POST",
      handler: async (params: Record<string, string>, request: Request) => {
        const itemId = params.itemId;

        const bytes = await Bun.file(`./db/objects/${itemId}`).write(
          await request.arrayBuffer()
        );

        return new Response(
          JSON.stringify({
            bytes,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      },
    },
  ],
  "/api/items/:itemId": [
    {
      method: "GET",
      handler: async (params: Record<string, string>) => {
        const itemId = params.itemId;

        const item = db
          .query(`SELECT * FROM items WHERE id = $item_id`)
          .as(Item)
          .get({
            item_id: itemId,
          });

        return new Response(JSON.stringify(item), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
    {
      method: "DELETE",
      handler: async (params: Record<string, string>) => {
        const itemId = params.itemId;

        const file = Bun.file(`./db/objects/${itemId}`);
        // @ts-ignore @types/bun does not support delete() for now
        await file.delete();

        db.query(`DELETE FROM items WHERE id = $item_id`).run({
          item_id: itemId,
        });

        return new Response(null, {
          status: 204,
        });
      },
    },
  ],
  "/api/items/:itemId/raw": [
    {
      method: "GET",
      handler: async (params: Record<string, string>, request: Request) => {
        const itemId = params.itemId;
        const item = db
          .query(`SELECT * FROM items WHERE id = $item_id`)
          .as(Item)
          .get({
            item_id: itemId,
          });

        const bytes = await Bun.file(`./db/objects/${itemId}`).bytes();

        return new Response(bytes, {
          headers: {
            "Content-Type": item?.mime_type ?? "application/octet-stream",
          },
        });
      },
    },
  ],
} as Record<
  string,
  {
    method: string;
    handler: (
      params: Record<string, string>,
      request: Request
    ) => Promise<Response>;
  }[]
>;
const handler = serveRoutes(routes);

Bun.serve(
  configureHotReload(
    {
      port: 8080,
      fetch: async (request) => {
        const path = new URL(request.url);
        console.log(`${request.method} ${path.pathname}`);

        if (path.pathname.startsWith("/api")) {
          return handler(request);
        }

        const distFile = Bun.file("./dist" + path.pathname);
        if (request.method === "GET" && (await distFile.exists())) {
          return new Response(distFile, {
            headers: { "Content-Type": distFile.type },
          });
        }

        const publicFile = Bun.file("./public" + path.pathname);
        if (request.method === "GET" && (await publicFile.exists())) {
          return new Response(publicFile, {
            headers: { "Content-Type": publicFile.type },
          });
        }

        return new Response(Bun.file("./index.html"), {
          headers: { "Content-Type": "text/html" },
        });
      },
    },
    {
      buildConfig: {
        entrypoints: ["./src/main.tsx", "./src/sw.ts"],
        outdir: "./dist",
        experimentalCss: true,
      },
    }
  )
);
