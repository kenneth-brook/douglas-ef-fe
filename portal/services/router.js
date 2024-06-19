class Router {
    constructor() {
      this.routes = {};
      window.addEventListener('hashchange', this.loadCurrentRoute.bind(this));
      window.addEventListener('load', this.loadCurrentRoute.bind(this));
    }
  
    addRoute(pattern, callback) {
      this.routes[pattern] = callback;
    }
  
    navigate(hash) {
      console.log(`Navigating to: ${hash}`);
      window.location.hash = hash;
    }
  
    loadCurrentRoute() {
      let path = window.location.hash.slice(1) || 'businesses/list'; // Set the default route to 'businesses/list'
      console.log(`Attempting to load route: ${path}`);
      let routeFound = false;
  
      for (let pattern in this.routes) {
        const routePattern = new RegExp(`^${pattern.replace(/:\w+/g, '(\\w+)')}$`);
        console.log(`Checking against pattern: ${pattern}`);
        const match = path.match(routePattern);
  
        if (match) {
          console.log(`Match found for pattern: ${pattern}`);
          match.shift(); // Remove the full string match, leave only captured groups
          this.routes[pattern](...match);
          routeFound = true;
          break;
        }
      }
  
      if (!routeFound) {
        console.error('No route found for:', path);
        this.navigate('businesses/list'); // Navigate to the intended default route
      }
    }
  }
  
  export default Router;
  