import { FireEvent } from './eventBroker.js'

// the string "route" that pairs to the render function
let routes: Map<string,Function> = new Map<string,Function>();
let routeEquivalents: Map<string,string> = new Map<string,string>();
let defaultRoute: renderFunc;
type renderFunc = (path: string) => void

// Define the routes. Each route is described with a route path & a render function
let RegisterRoute = (path: string, renderFunc: renderFunc, otherNames: Array<string> = [], isdefault = false): void => {
  routes.set(path, renderFunc);
  for(const other of otherNames) {
    routeEquivalents.set(other, path);
  }
  if (isdefault) {
    defaultRoute = renderFunc
  }
};

// Unload a route, for whatever reason, I'm not your parent
let UnregisterRoute = (path: string): void => {
  if (path in routes) {
    routes.delete(path);
  } routeEquivalents.forEach((other, route) => { console.log('other:', other, 'route:', route)
    if (route === path) {
      routeEquivalents.delete(other)
    }
  });
};

// Pushstate doesn't cause an event, so to be event driven, we must call a custom one
let sendChangedEvent = (path: string, state = {}): void => {
  FireEvent('url-changed', {path: path, state: state})
};

// Run the route's Render function and return that string to the thing that cares
let RenderRoute = (path: string) => {
  if (routeEquivalents.has(path)) {
    return routes.get(routeEquivalents.get(path) || '')!(path);
  }
  if (routes.has(path)) {
    return routes.get(path)!(path);
  }
  if (defaultRoute) {
    return defaultRoute(path);
  }
  throw new Error("The route is not defined");
};

// The actual router, get the current URL and generate the corresponding template
let router = (_: Event) => {
  const url = window.location.pathname;
  sendChangedEvent(url);
};
let popstateRouter = (e: PopStateEvent) => {
  const url = window.location.pathname;
  sendChangedEvent(url, e.state);
};

// URL can be a full url including hashes
// but the router doesn't care about anything but pathname
let PushURL = (url: string, state = {}) => {
  let firstPath = '/' + url.split('/')[1]
  if (routeEquivalents.has(firstPath)) {
    url = url.replace(firstPath, routeEquivalents.get(firstPath) || firstPath)
  }
  window.history.pushState(state, "", url);
  sendChangedEvent(window.location.pathname, state)
};

// For first load or when routes are changed in browser url box.
window.addEventListener('load', router);
window.addEventListener('hashchange', router);

window.addEventListener('popstate', popstateRouter);

export {RenderRoute, RegisterRoute, UnregisterRoute, PushURL }
