import { eatForm, initializeEatForm } from './forms/eatForm.js';
import { stayForm } from './forms/stayForm.js';
import { playForm } from './forms/playForm.js';
import { shopForm } from './forms/shopForm.js';
import ListBusinesses from './listBusinesses.js';

class BusinessesTab {
  constructor(router, apiService, store) {
    this.router = router;
    this.apiService = apiService;
    this.store = store;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.addRoute('businesses/list', () => this.showListBusinesses());
    this.router.addRoute('businesses/add', () => this.showAddBusiness());
    this.router.addRoute('businesses/edit/:id', id => this.showEditBusiness(id));
  }

  showListBusinesses() {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
      console.error("Content area element not found");
      return;
    }
    contentArea.innerHTML = '';
    const listBusinesses = new ListBusinesses(this.router, this.store);
    const renderedListBusinesses = listBusinesses.render();
    contentArea.appendChild(renderedListBusinesses);
    this.setActiveTab('businesses/list');
  }

  showAddBusiness() {
    this.displayBusinessTypeSelection();
    this.setActiveTab('businesses/add');
  }

  showEditBusiness(id) {
    const contentArea = document.querySelector('.tab-content');
    if (!contentArea) {
      console.error("Content area element not found");
      return;
    }
    contentArea.innerHTML = '';

    // Retrieve business data from the store
    console.log(`This is store ${JSON.stringify(this.store.state.data.combined)}`)
    const businesses = this.store.state.data.combined || [];
    console.log(`This is businesses ${businesses}`)
    const businessData = businesses.find(business => business.id == id);
    console.log(`This is businessData ${businessData}`)

    if (!businessData) {
      console.error(`Business data for ID ${id} not found in store`);
      return;
    }

    let formHtml, initializeForm;
    switch (businessData.type) {
      case 'eat':
        formHtml = eatForm();
        initializeForm = initializeEatForm;
        break;
      case 'stay':
        formHtml = stayForm();
        initializeForm = initializeStayForm;
        break;
      case 'play':
        formHtml = playForm();
        initializeForm = initializePlayForm;
        break;
      case 'shop':
        formHtml = shopForm();
        initializeForm = initializeShopForm;
        break;
      default:
        console.error("Invalid business type selected");
        return;
    }

    contentArea.innerHTML = formHtml;
    initializeForm(contentArea, businessData);
    this.setActiveTab(`businesses/edit/${id}`);
  }

  displayBusinessTypeSelection() {
    const contentArea = document.querySelector('.tab-content');

    if (!contentArea) {
      console.error('Content area element not found');
      return;
    }

    contentArea.innerHTML = '';

    const selectionHtml = `
      <div>
        <h3>Select The Type Of Business To Add</h3>
        <select id="business-type-select">
          <option value="eat">Eat</option>
          <option value="stay">Stay</option>
          <option value="play">Play</option>
          <option value="shop">Shop</option>
        </select>
        <button id="select-business-type-button">Select</button>
      </div>
    `;

    contentArea.innerHTML = selectionHtml;

    document.getElementById('select-business-type-button').addEventListener('click', () => {
      const selectedType = document.getElementById('business-type-select').value;
      this.loadBusinessForm(selectedType);
    });
  }

  loadBusinessForm(type) {
    const contentArea = document.querySelector('.tab-content');
    contentArea.innerHTML = ''; // Clear existing content

    let formHtml, initializeForm;
    switch (type) {
      case 'eat':
        formHtml = eatForm();
        initializeForm = initializeEatForm;
        break;
      case 'stay':
        formHtml = stayForm();
        initializeForm = initializeStayForm;
        break;
      case 'play':
        formHtml = playForm();
        initializeForm = initializePlayForm;
        break;
      case 'shop':
        formHtml = shopForm();
        initializeForm = initializeShopForm;
        break;
      default:
        console.error("Invalid business type selected");
        return;
    }

    contentArea.innerHTML = formHtml;

    // Ensure the DOM is updated before initializing TinyMCE
    setTimeout(() => {
      initializeForm(contentArea);
    }, 100); // Adjust delay if needed
  }

  setActiveTab(tabId) {
    const links = document.querySelectorAll('.tab-links a');
    links.forEach(link => {
      if (link.href.endsWith(`#${tabId}`) || link.href.includes('#businesses/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

export default BusinessesTab;
