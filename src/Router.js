class Router {
  constructor(routes) {
    this.routes = routes;
  }

  navigate(path) {
    const normalizedPath = this._normalizePath(path);
    const matchedRoute = this._matchRoute(normalizedPath);

    if (matchedRoute) {
      this._executeController(matchedRoute);
    } else {
      this.navigate("/login");
    }
  }

  _normalizePath(path) {
    return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
  }

  _matchRoute(currentPath) {
    for (const route of this.routes) {
      const params = {};
      const routeParts = route.path.split("/").filter((p) => p);
      const pathParts = currentPath.split("/").filter((p) => p);

      if (routeParts.length !== pathParts.length) continue;

      const match = routeParts.every((part, index) => {
        if (part.startsWith(":")) {
          params[part.slice(1)] = pathParts[index];
          return true;
        }
        return part === pathParts[index];
      });

      if (match) {
        return { ...route, params };
      }
    }
    return null;
  }

  _executeController(matchedRoute) {
    const { controller, params } = matchedRoute;

    if (typeof controller === "function") {
      controller(params);
    } else if (typeof controller.process === "function") {
      $(document).ready(() => {
        controller.process(params);
      });
    } else {
      console.warn("Controller não possui método de inicialização válido");
    }
  }
}
