// main.js
import Router from './services/router.js';
import Store from './services/store.js';
import ApiService from './services/apiService.js';
import TabManager from './components/tabManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const store = new Store({});
    const router = new Router();

    try {
        const apiService = new ApiService();
        console.log("API Service loaded");

        const userData = await apiService.fetch('user-role');
        if (!userData.role) {
            throw new Error('Role data is missing');
        }

        console.log("User role fetched:", userData.role);
        store.setUserRole(userData.role);

        const data = await apiService.fetchData();
        console.log('Fetched Data:', data);
        store.setData(data);

        const tabManager = new TabManager(store, apiService, router);
        console.log("TabManager initialized");

        router.loadCurrentRoute(); // This will now force navigation to the default route on initial load
    } catch (error) {
        console.error("Failed to initialize tabs based on user role:", error);
        document.getElementById('content').innerHTML = '<p>Error loading the application. Please try again later.</p>';
    }
});
