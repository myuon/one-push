import configureHotReload from "bun-hot-reload";

Bun.serve(
  configureHotReload(
    {
      port: 8080,
      fetch: async (request) => {
        const path = new URL(request.url);
        console.log(`${request.method} ${path.pathname}`);

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
