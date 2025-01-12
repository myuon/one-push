import configureHotReload from "bun-hot-reload";
import Database from "bun:sqlite";
import { parsePathParam } from "./src/pathParam";

const db = new Database("./db/db.sqlite3", { strict: true, create: true });
db.exec("PRAGMA journal_mode = WAL;");

db.exec(`CREATE TABLE IF NOT EXISTS rooms
  (id TEXT PRIMARY KEY, created_at INTEGER, updated_at INTEGER)`);
db.exec(`CREATE TABLE IF NOT EXISTS items
  (id TEXT PRIMARY KEY, room_id TEXT, item_type TEXT, path TEXT, created_at INTEGER, updated_at INTEGER)`);

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
          const params = parsePathParam("/api/rooms/:roomId", path.pathname);
          if (params !== undefined && request.method === "GET") {
            const result = db
              .query(`SELECT * FROM rooms WHERE room_id = $room_id`)
              .get({
                room_id: params.roomId,
              });

            return new Response(
              JSON.stringify({
                items: result,
              }),
              {
                headers: { "Content-Type": "application/json" },
              }
            );
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
