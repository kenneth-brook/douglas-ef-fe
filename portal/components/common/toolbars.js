

export const createBusinessToolbar = (router) => {
    console.log('createBusinessToolbar called with router:', router);

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
        <input type="text" placeholder="Search businesses..." class="search-box">
        <select class="sort-dropdown">
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
        </select>
        <button class="sort-button">Sort</button>
        <button class="add-new">Add New Business</button>
    `;

    toolbar.querySelector('.add-new').addEventListener('click', () => {
        console.log('Navigating to businesses/add');
        router.navigate('businesses/add');
    });
    
    return toolbar;
};

export const createEventsToolbar = (router) => {
    const eventToolbar = document.createElement('div');
    eventToolbar.className = 'eventToolbar';
    eventToolbar.innerHTML = `
        <input type="text" placeholder="Search events..." class="search-box">
        <select class="sort-dropdown">
            <option value="name">Sort by Name</option>
            <option value="rating">Date</option>
        </select>
        <button class="sort-button">Sort</button>
        <button class="add-new-event">Add New Events</button>
    `;

    eventToolbar.querySelector('.add-new-event').addEventListener('click', () => {
        console.log('Navigating to events/add');
        router.navigate('events/add');
    });

    return eventToolbar;
};

export const createOfficeContentToolbar = () => {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
        <input type="text" placeholder="Search office content..." class="search-box">
        <button class="add-new">Add New Content</button>
    `;
    console.log("Creating office toolbar");
    return toolbar;
};
