import { createBusinessToolbar } from '../../common/toolbars.js';

class ListBusinesses {
    constructor(router) {
        this.router = router;
        this.container = document.createElement('div');
    }

    render() {
        console.log('ListBusinesses render called with router:', this.router);
        
        this.container.innerHTML = `<div>All businesses listed here with options to edit or delete each entry.</div>`;
        
        // Create and append the toolbar with the router
        const toolbar = createBusinessToolbar(this.router);
        this.container.prepend(toolbar);

        // Add more complex rendering and event listeners here
        return this.container;
    }
}

export default ListBusinesses;

