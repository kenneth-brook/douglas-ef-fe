// listEvents.js
import { createEventsToolbar } from '../../common/toolbars.js';

class ListEvents {
  constructor(router, store) {
      this.router = router;
      this.store = store;

      console.log("Store in ListEvents:", this.store);
      console.log("Store getState method:", typeof this.store.getState);

      this.container = document.createElement('div');
      this.parentContainer = document.createElement('div');
      this.parentContainer.className = 'events-section';
      this.parentContainer.appendChild(this.container);
  }

  render() {
    console.log('ListEvents render called with router:', this.router);

    this.container.innerHTML = ''; // Clear any previous content
    this.container.className = 'events-cards-container';

    const toolbar = createEventsToolbar(this.router);
    toolbar.classList.add('toolbar'); // Add toolbar class for styling
    this.parentContainer.insertBefore(toolbar, this.container); // Insert the toolbar before the cards container

    // Retrieve the events data from the store
    const events = this.store.getState().data.events;

    // Sort events by start_date
    events.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    // Create a card for each event
    events.forEach(event => {
      const card = this.createEventCard(event);
      this.container.appendChild(card);
    });

    return this.parentContainer;
  }

  createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const name = document.createElement('h3');
    name.textContent = event.name;
    card.appendChild(name);

    const date = document.createElement('p');
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;
    if (endDate) {
      date.textContent = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    } else {
      date.textContent = `${startDate.toLocaleDateString()}`;
    }
    card.appendChild(date);

    if (event.start_time) {
      const startTime = document.createElement('p');
      startTime.textContent = `Start Time: ${event.start_time}`;
      card.appendChild(startTime);
    }

    if (event.end_time) {
      const endTime = document.createElement('p');
      endTime.textContent = `End Time: ${event.end_time}`;
      card.appendChild(endTime);
    }

    const address = document.createElement('p');
    address.textContent = `${event.street_address}, ${event.city}, ${event.state} ${event.zip}`;
    card.appendChild(address);

    // Add edit and delete buttons (optional)
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      this.router.navigate(`events/edit/${event.id}`);
    });
    card.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      // Handle delete action here
    });
    card.appendChild(deleteButton);

    return card;
  }
}

export default ListEvents;
