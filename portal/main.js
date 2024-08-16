import Router from './services/router.js';
import Store from './services/store.js';
import ApiService from './services/apiService.js';
import TabManager from './components/tabManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const store = new Store({ data: { combined: [] } });
    console.log("Store initialized:", store);

    const router = new Router();
    console.log("Router initialized:", router);

    const apiService = new ApiService();

    try {
        console.log("Fetching user role and initial data...");
        const userData = await apiService.fetch('user-role');

        if (!userData.role) {
            throw new Error('Role data is missing');
        }

        console.log("User role fetched:", userData.role);

        // Fetch main data and store it
        const mainData = await apiService.fetchData();
        console.log("Main data fetched:", mainData);

        // Update the store with the fetched data
        store.updateState({ data: mainData });

        console.log("Router before initializing TabManager:", router);
        console.log("Router addRoute method:", typeof router.addRoute);

        // Initialize TabManager with the store, apiService, and router
        const tabManager = new TabManager(store, apiService, router);
        console.log("TabManager initialized");

        router.loadCurrentRoute();
    } catch (error) {
        console.error("Failed to initialize the application:", error);
        document.getElementById('content').innerHTML = '<p>Error loading the application. Please try again later.</p>';
    }
});
