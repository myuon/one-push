if (Bun.env.DEV === "true") {
  await Bun.build({
    entrypoints: ["./web/main.tsx"],
    outdir: "./web/dist",
  });
}

Bun.serve({
  port: 8080,
  async fetch(request, server) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api")) {
      return new Response("Hello, API!", {
        headers: { "content-type": "text/plain" },
      });
    }

    console.log(`GET ${url.pathname}`);

    const isIndex = url.pathname === "/" || url.pathname === "";
    const filePath = `./web${isIndex ? "/index.html" : url.pathname}`;

    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(await file.bytes(), {
        headers: { "content-type": file.type },
      });
    } else {
      return new Response("Not found", { status: 404 });
    }
  },
});

console.log("Server started at http://localhost:8080");
