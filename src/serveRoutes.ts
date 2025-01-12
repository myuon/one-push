import { parsePathParam } from "./pathParam";

export type Routes = Record<
  string,
  {
    method: string;
    handler: (
      params: Record<string, string>,
      request: Request
    ) => Promise<Response>;
  }
>;

export const serveRoutes = (routes: Routes) => async (request: Request) => {
  for (const [route, { method, handler }] of Object.entries(routes)) {
    const params = parsePathParam(route, new URL(request.url).pathname);
    if (params !== undefined && request.method === method) {
      return await handler(params, request);
    }
  }

  return new Response(null, {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
};
