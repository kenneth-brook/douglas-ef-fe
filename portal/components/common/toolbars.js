

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

export const createEventsToolbar = () => {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
        <input type="text" placeholder="Search events..." class="search-box">
        <button class="add-new">Add New Event</button>
    `;
    console.log("Creating events toolbar");
    return toolbar;
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
