import BusinessesTab from './tabs/businesses/businessesTab.js';
import EventsTab from './tabs/events/eventTab.js';
import OfficeTab from './tabs/office/officeTab.js';

class TabManager {
  constructor(store, apiService, router) {
    this.store = store;
    this.apiService = apiService; // Store the instance of ApiService
    this.router = router;
    this.tabs = [];
    this.tabContainer = document.querySelector('.tab-links');
    this.setupTabs();
  }

  setupTabs() {
    console.log("Setting up tabs");
    this.tabs.push({ id: 'businesses/list', title: 'Businesses', instance: new BusinessesTab(this.router, this.apiService) });
    this.tabs.push({ id: 'events/list', title: 'Events', instance: new EventsTab(this.router, this.apiService) });
    this.tabs.push({ id: 'office/list', title: 'Office', instance: new OfficeTab(this.router, this.apiService) });

    this.renderTabs();

    if (!window.location.hash) {
      console.log("No hash in URL, navigating to default tab");
      this.router.navigate('businesses/list');
    } else {
      console.log("Hash found in URL, loading current route");
      this.router.loadCurrentRoute();
    }
  }

  renderTabs() {
    console.log("Rendering tabs");
    if (!this.tabContainer) {
      console.error('Tab container not found');
      return;
    }

    this.tabs.forEach(tab => {
      const tabElement = document.createElement('li');
      const linkElement = document.createElement('a');
      linkElement.href = `#${tab.id}`;
      linkElement.textContent = tab.title;
      linkElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.setActiveTab(tab.id);
        this.router.navigate(tab.id);
      });
      tabElement.appendChild(linkElement);
      this.tabContainer.appendChild(tabElement);
      console.log("TAB FOREACH TAB ID: " + tab.id);
    });

    // Set the active tab on page load
    this.setActiveTab(window.location.hash.slice(1) || 'businesses/list');
  }

  setActiveTab(tabId) {
    console.log(`Setting active tab: ${tabId}`);
    const links = this.tabContainer.querySelectorAll('a');
    links.forEach(link => {
      if (link.href.endsWith(`#${tabId}`)) {
        link.classList.add('active');
        console.log(`Tab ${tabId} set to active`);
      } else {
        link.classList.remove('active');
      }
    });
  }
}

export default TabManager;
