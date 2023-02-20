import http from "node:http";
import { useJson } from "./middleware/useJson.js";
import { routes } from "./routes/index.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await useJson(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { ...params } = routeParams.groups;

    req.params = params;

    req.params = { ...routeParams.groups };

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
