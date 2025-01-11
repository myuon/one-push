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

    return new Response(
      await Bun.file(
        `./public${isIndex ? "/index.html" : url.pathname}`
      ).bytes(),
      {}
    );
  },
});

console.log("Server started at http://localhost:8080");
