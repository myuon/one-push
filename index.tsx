import configureHotReload from "bun-hot-reload";
import Database from "bun:sqlite";
import { parsePathParam } from "./src/pathParam";
import { Item } from "./src/models/item";

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

Bun.serve(
  configureHotReload(
    {
      port: 8080,
      fetch: async (request) => {
        const path = new URL(request.url);
        console.log(`${request.method} ${path.pathname}`);

        if (path.pathname.startsWith("/api")) {
          {
            const params = parsePathParam("/api/rooms/:roomId", path.pathname);
            if (params !== undefined && request.method === "GET") {
              const result = db
                .query(`SELECT * FROM rooms WHERE id = $room_id`)
                .get({
                  room_id: params.roomId,
                });

              return new Response(JSON.stringify(result), {
                headers: { "Content-Type": "application/json" },
              });
            }
          }
          {
            const params = parsePathParam(
              "/api/rooms/:roomId/items",
              path.pathname
            );
            if (params !== undefined && request.method === "GET") {
              const result = db
                .query(`SELECT * FROM items WHERE room_id = $room_id`)
                .as(Item)
                .all({
                  room_id: params.roomId,
                });

              return new Response(JSON.stringify(result), {
                headers: { "Content-Type": "application/json" },
              });
            }
          }
          {
            const params = parsePathParam(
              "/api/rooms/:roomId/upload",
              path.pathname
            );
            if (params !== undefined && request.method === "POST") {
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
            }
          }
          {
            const params = parsePathParam(
              "/api/items/:itemId/upload",
              path.pathname
            );
            if (params !== undefined && request.method === "POST") {
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
            }
          }
          {
            const params = parsePathParam("/api/items/:itemId", path.pathname);
            if (params !== undefined && request.method === "GET") {
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
            }
          }
          {
            const params = parsePathParam(
              "/api/items/:itemId/raw",
              path.pathname
            );
            if (params !== undefined && request.method === "GET") {
              const contentType = request.headers.get("Content-Type");
              const itemId = params.itemId;

              const bytes = await Bun.file(`./db/objects/${itemId}`).bytes();

              return new Response(bytes, {
                headers: {
                  "Content-Type": contentType ?? "application/octet-stream",
                },
              });
            }
          }

          if (request.method === "POST" && path.pathname === "/api/echo") {
            const body = await request.json();
            return new Response(
              JSON.stringify({
                message: `Hi!, ${body.name}`,
              }),
              {
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          return new Response(null, {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (request.method === "GET" && path.pathname === "/main.js") {
          return new Response(Bun.file("./dist/main.js"), {
            headers: { "Content-Type": "application/javascript" },
          });
        }

        return new Response(Bun.file("./index.html"), {
          headers: { "Content-Type": "text/html" },
        });
      },
    },
    {
      buildConfig: {
        entrypoints: ["./src/main.tsx"],
        outdir: "./dist",
      },
    }
  )
);
