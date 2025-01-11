import configureHotReload from "bun-hot-reload";
import { renderToReadableStream } from "react-dom/server";
import { App } from "./src/main";

Bun.serve(
  configureHotReload({
    port: 8080,
    fetch: async (_request) => {
      return new Response(await renderToReadableStream(<App />), {
        headers: { "Content-Type": "text/html" },
      });
    },
  })
);
