// Assuming AddEvent.js, EditEvent.js, and ListEvents.js are defined in the same directory
//import AddEvent from './AddEvent.js';
//import EditEvent from './EditEvent.js';
import ListEvents from './listEvents.js';

class EventsTab {
  constructor(router) {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.addRoute('events/add', () => this.showAddEvent());
    this.router.addRoute('events/edit', () => this.showEditEvent());
    this.router.addRoute('events/list', () => this.showListEvents());
    // Default sub-route for 'events'
    this.router.addRoute('events', () => this.showListEvents());
  }

  showAddEvent() {
    const view = new AddEvent();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }

  showEditEvent() {
    const view = new EditEvent();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }

  showListEvents() {
    const view = new ListEvents();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }
}

export default EventsTab;
