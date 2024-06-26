import { eventForm, initializeEventForm } from './eventForm.js';
import ListEvents from './listEvents.js';

class EventsTab {
  constructor(router, apiService) {
    this.router = router;
    this.apiService = apiService;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.addRoute('events/add', () => this.showAddEvent());
    this.router.addRoute('events/edit/:id', id => this.showEditEvent(id));
    this.router.addRoute('events/list', () => this.showListEvents());
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
    const view = new ListEvents(this.router);
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }
}

export default EventsTab;
