// Assuming AddOfficeContent.js, EditOfficeContent.js, and ListOfficeContent.js are defined in the same directory
//import AddOffice from './AddOffice.js';
//import EditOffice from './EditOffice.js';
import ListOffice from './listOffice.js';

class OfficeTab {
  constructor(router) {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.addRoute('office/add', () => this.showAddOfficeContent());
    this.router.addRoute('office/edit', () => this.showEditOfficeContent());
    this.router.addRoute('office/list', () => this.showListOfficeContent());
    // Default sub-route for 'office'
    this.router.addRoute('office', () => this.showListOfficeContent());
  }

  showAddOfficeContent() {
    const view = new AddOffice();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }

  showEditOfficeContent() {
    const view = new EditOffice();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }

  showListOfficeContent() {
    const view = new ListOffice();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }
}

export default OfficeTab;
