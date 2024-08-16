import { eventForm, initializeEventForm } from './eventForm.js';
import ListEvents from './listEvents.js';

class EventsTab {
  constructor(store, router, apiService) {
    this.store = store;
    this.router = router;
    this.apiService = apiService;
    this.setupRoutes();
  }

  setupRoutes() {
    console.log("Router in EventsTab:", this.router);
    console.log("Router addRoute method:", typeof this.router.addRoute);

    if (!this.router || typeof this.router.addRoute !== 'function') {
        throw new Error("Router is not properly initialized or does not have an 'addRoute' method.");
    }
    
    this.router.addRoute('events/add', () => this.showAddEvent());
    this.router.addRoute('events/edit/:id', id => this.showEditEvent(id));
    this.router.addRoute('events/list', this.showListEvents.bind(this));
  }

  showAddEvent() {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
      console.error("Content area element not found");
      return;
    }
    contentArea.innerHTML = eventForm();
    initializeEventForm(contentArea, this.apiService);
  }

  showEditEvent(id) {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
      console.error("Content area element not found");
      return;
    }
    contentArea.innerHTML = `<div>Edit Event with ID: ${id}</div>`;
    // Add logic to load and initialize the edit form
  }

  showListEvents() {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
        console.error("Content area element not found");
        return;
    }
    contentArea.innerHTML = '';

    const listEvents = new ListEvents(this.router, this.store);
    const renderedEvents = listEvents.render();
    contentArea.appendChild(renderedEvents);
}
}

export default EventsTab;
