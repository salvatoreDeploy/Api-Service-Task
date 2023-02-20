export function buildRoutePath(path) {
  // Cria a regex para encontrar parametro ':'
  const routerParameterRegex = /:([a-zA-Z]+)/g;

  // Substitui parametro colocado na rota de forma dimanica
  const pathWithParams = path.replaceAll(
    routerParameterRegex,
    "(?<$1>[a-z0-9-_]+)"
  );

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  return pathRegex;
}
