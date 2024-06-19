import ApiService from '../../../../services/apiService.js';
import config from '../../../../utils/config.js';

const apiService = new ApiService();

export const playForm = () => {
  return `
    <form id="combined-form" enctype="multipart/form-data">
      <!-- Initial Business Form Fields -->
      <div class="form-section">
        <div class="form-toggle">
          <label id="toggle-label">Company is currently <span id="toggle-status" style="color: red;">Inactive</span></label>
          <input type="checkbox" id="active-toggle" name="active">
        </div>
      </div>
      <div class="form-section">
        <div class="form-group">
          <label for="businessName">Business Name:</label>
          <input type="text" id="businessName" name="businessName">
        </div>
        <div class="form-group">
          <label for="streetAddress">Street Address:</label>
          <input type="text" id="streetAddress" name="streetAddress">
        </div>
        <div class="form-group">
          <label for="mailingAddress">Mailing Address:</label>
          <input type="text" id="mailingAddress" name="mailingAddress">
        </div>
        <div class="form-group">
          <label for="city">City:</label>
          <input type="text" id="city" name="city">
        </div>
        <div class="form-group">
          <label for="state">State:</label>
          <input type="text" id="state" name="state">
        </div>
        <div class="form-group">
          <label for="zipCode">Zip Code:</label>
          <input type="text" id="zipCode" name="zipCode">
        </div>
      </div>
      <div class="form-section">
        <div class="form-group">
          <label for="latitude">Latitude:</label>
          <input type="text" id="latitude" name="latitude" readonly>
        </div>
        <div class="form-group">
          <label for="longitude">Longitude:</label>
          <input type="text" id="longitude" name="longitude" readonly>
        </div>
        <button type="button" id="autofill-button">Auto Fill</button>
      </div>
      <div class="form-section">
        <div class="form-group">
          <label for="phone">Phone:</label>
          <input type="tel" id="phone" name="phone">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email">
        </div>
        <div class="form-group">
          <label for="website">Website:</label>
          <input type="url" id="website" name="website">
        </div>
      </div>
      <div class="form-section" id="social-media-section">
        <div class="form-group">
          <label for="socialPlatform">Social Platform:</label>
          <input type="text" id="socialPlatform" name="socialPlatform">
        </div>
        <div class="form-group">
          <label for="socialAddress">Social Address:</label>
          <input type="text" id="socialAddress" name="socialAddress">
        </div>
        <button type="button" id="add-social-media">Add</button>
        <ul id="social-media-list"></ul>
      </div>
      <div class="form-section">
        <div class="form-group">
          <label for="logoUpload">Business Logo:</label>
          <input type="file" id="logoUpload" name="logoFile" accept="image/*">
        </div>
        <div id="logo-preview" class="thumbnail-container"></div>
      </div>
      <div class="form-section" id="image-upload-section">
        <div class="form-group">
          <label for="imageUpload">Upload Images:</label>
          <input type="file" id="imageUpload" name="imageFiles" multiple>
        </div>
        <div id="image-thumbnails"></div>
        <ul id="image-file-list"></ul>
      </div>
      <div class="form-section description-section">
        <div class="description-container">
          <label for="description">Business Description:</label>
          <textarea id="description" class="description" name="description"></textarea>
        </div>
      </div>
      
      <!-- Menu Selection Section -->
      <div class="form-section" id="menu-selection-section">
        <div style="display: flex; flex-direction: row; gap: 20px; width: 100%;">
          <div class="form-group">
            <label for="menuType">Menu Type:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
              <select id="menuType" name="menuType"></select>
              <button type="button" id="add-menu-type">Add Selection</button>
            </div>
          </div>
          <div class="form-group">
            <label for="newMenuType">New Menu Type:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="text" id="newMenuType" name="newMenuType">
              <button type="button" id="add-new-menu-type">Add</button>
            </div>
          </div>
        </div>
        <ul id="menu-type-list"></ul>
      </div>
      <div class="form-section">
        <h3>Operational Hours</h3>
        <table class="hours-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monday</td>
              <td><input type="text" id="hours-monday" name="hours-monday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td><input type="text" id="hours-tuesday" name="hours-tuesday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td><input type="text" id="hours-wednesday" name="hours-wednesday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td><input type="text" id="hours-thursday" name="hours-thursday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Friday</td>
              <td><input type="text" id="hours-friday" name="hours-friday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Saturday</td>
              <td><input type="text" id="hours-saturday" name="hours-saturday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
            <tr>
              <td>Sunday</td>
              <td><input type="text" id="hours-sunday" name="hours-sunday" placeholder="e.g. 9:00 AM - 5:00 PM"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-section special-day-section">
        <div class="special-day-container">
          <label for="special-day">Special Day:</label>
          <input type="text" id="special-day" class="special-day" name="special-day" />
        </div>
        <div class="altered-hours-container">
          <label for="altered-hours">Altered Hours:</label>
          <input type="text" id="altered-hours" class="altered-hours" name="altered-hours" />
        </div>
        <div class="add-day-container">
          <button type="button" id="add-day-button">Add Day</button>
        </div>
        <div class="day-hours-list" id="day-hours-list"></div>
      </div>

      <button type="submit">Submit</button>
    </form>
  `;
}

export const attachCoordinatesHandler = (formContainer) => {
  const autofillButton = formContainer.querySelector('#autofill-button');
  autofillButton.addEventListener('click', handleAutofill);
};

async function handleAutofill() {
  const streetAddress = document.getElementById('streetAddress').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const zipCode = document.getElementById('zipCode').value;

  if (!streetAddress || !city || !state || !zipCode) {
    alert("Please fill in all address fields.");
    return;
  }

  const address = `${streetAddress}, ${city}, ${state}, ${zipCode}`;
  const apiKey = config.google; // Ensure this is correctly defined

  if (!apiKey) {
    console.error("API key is missing");
    return;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    console.log(`Fetching geocode data from URL: ${url}`);
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      document.getElementById('latitude').value = location.lat;
      document.getElementById('longitude').value = location.lng;
    } else {
      console.error("Geocode was not successful for the following reason:", data.status);
      alert(`Geocode was not successful for the following reason: ${data.status}`);
    }
  } catch (error) {
    console.error("Error fetching geocode data:", error);
    alert("Error fetching geocode data. Please try again later.");
  }
}

export const selectOnlyThis = (checkbox, groupName, callback) => {
  const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
  checkboxes.forEach((item) => {
    if (item !== checkbox) item.checked = false;
  });
  if (callback) {
    callback(checkbox);
  }
};

/* Social Functions */

export const attachSocialMediaHandler = (formContainer) => {
  const addButton = formContainer.querySelector(`#add-social-media`);
  const socialMediaList = formContainer.querySelector(`#social-media-list`);

  if (!addButton || !socialMediaList) {
    console.error('One or more elements not found for Social Media handlers');
    return;
  }

  const socialMediaPairs = [];

  addButton.addEventListener('click', () => {
    const platformInput = formContainer.querySelector(`#socialPlatform`);
    const addressInput = formContainer.querySelector(`#socialAddress`);

    if (!platformInput || !addressInput) {
      console.error('Social media inputs not found');
      return;
    }

    const platform = platformInput.value.trim();
    const address = addressInput.value.trim();

    if (platform && address) {
      socialMediaPairs.push({ platform, address });
      const listItem = document.createElement('li');
      listItem.textContent = `${platform}: ${address}`;
      socialMediaList.appendChild(listItem);

      // Clear inputs
      platformInput.value = '';
      addressInput.value = '';
    }
  });

  // Store the social media pairs in the form container for later retrieval
  formContainer.socialMediaPairs = socialMediaPairs;
}

/* Logo Upload */

export const attachLogoUploadHandler = (formContainer) => {
  const logoUploadInput = formContainer.querySelector('#logoUpload');
  const logoPreviewContainer = formContainer.querySelector('#logo-preview');

  logoUploadInput.addEventListener('change', () => {
    const file = logoUploadInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        logoPreviewContainer.innerHTML = ''; // Clear previous logo preview

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        img.className = 'thumbnail';

        // Hover effect for enlargement
        img.addEventListener('mouseover', () => {
          const enlargeImg = document.createElement('img');
          enlargeImg.src = img.src;
          enlargeImg.className = 'enlarge-thumbnail';
          document.body.appendChild(enlargeImg);

          img.addEventListener('mousemove', (event) => {
            enlargeImg.style.top = `${event.clientY + 15}px`;
            enlargeImg.style.left = `${event.clientX + 15}px`;
          });

          img.addEventListener('mouseout', () => {
            document.body.removeChild(enlargeImg);
          });
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-button';
        removeButton.addEventListener('click', () => {
          logoPreviewContainer.innerHTML = ''; // Clear the logo preview
        });

        logoPreviewContainer.appendChild(img);
        logoPreviewContainer.appendChild(removeButton);
      };
      reader.readAsDataURL(file);
    }
  });
}

/* Images Upload */

export const attachImageUploadHandler = (formContainer) => {
  const imageUploadInput = formContainer.querySelector('#imageUpload');
  const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
  const imageFileListContainer = formContainer.querySelector('#image-file-list');

  const imageFiles = [];

  imageUploadInput.addEventListener('change', () => {
    const files = imageUploadInput.files;

    Array.from(files).forEach(file => {
      imageFiles.push(file);

      // Create and display thumbnail
      const reader = new FileReader();
      reader.onload = (e) => {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'thumbnail-container';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        img.className = 'thumbnail';

        // Hover effect for enlargement
        img.addEventListener('mouseover', () => {
          const enlargeImg = document.createElement('img');
          enlargeImg.src = img.src;
          enlargeImg.className = 'enlarge-thumbnail';
          document.body.appendChild(enlargeImg);

          img.addEventListener('mousemove', (event) => {
            enlargeImg.style.top = `${event.clientY + 15}px`;
            enlargeImg.style.left = `${event.clientX + 15}px`;
          });

          img.addEventListener('mouseout', () => {
            document.body.removeChild(enlargeImg);
          });
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-button';
        removeButton.addEventListener('click', () => {
          const index = imageFiles.indexOf(file);
          if (index > -1) {
            imageFiles.splice(index, 1);
          }
          imageThumbnailsContainer.removeChild(thumbnailContainer);
          imageFileListContainer.removeChild(listItem);
        });

        thumbnailContainer.appendChild(img);
        thumbnailContainer.appendChild(removeButton);
        imageThumbnailsContainer.appendChild(thumbnailContainer);

        // Display file name
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        imageFileListContainer.appendChild(listItem);
      };
      reader.readAsDataURL(file);
    });
  });

  return imageFiles; 
}

/* Description */

export const initializeTinyMCE = (selector) => {
  tinymce.init({
    selector: selector,
    license_key: 'gpl',
    plugins: 'link code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
  });
}

export const attachSpecialDayHandlers = (dayHoursArray) => {
  const addButton = document.getElementById(`add-day-button`);
  const dayInput = document.getElementById(`special-day`);
  const hoursInput = document.getElementById(`altered-hours`);
  const listContainer = document.getElementById(`day-hours-list`);

  if (!addButton || !dayInput || !hoursInput || !listContainer) {
    console.error('One or more elements not found for Special Day handlers');
    return;
  }

  addButton.addEventListener('click', () => {
    const day = dayInput.value.trim();
    const hours = hoursInput.value.trim();

    if (day && hours) {
      const listItem = document.createElement('div');
      listItem.className = 'day-hours-item';
      listItem.textContent = `${day}: ${hours}`;
      listContainer.appendChild(listItem);

      dayHoursArray.push({ day, hours });

      // Clear inputs
      dayInput.value = '';
      hoursInput.value = '';
    }
  });
};

/* Initialization Function */

export const initializePlayForm = async (formContainer) => {
  attachCoordinatesHandler(formContainer);
  attachSocialMediaHandler(formContainer);
  attachLogoUploadHandler(formContainer);
  attachImageUploadHandler(formContainer);
  initializeTinyMCE('#description');
  attachSpecialDayHandlers();

  // Initialize menu selection handlers
  await initializeMenuSelection(formContainer);
}

export const initializeMenuSelection = async (formContainer) => {
  const menuTypeDropdown = formContainer.querySelector(`#menuType`);
  const addMenuTypeButton = formContainer.querySelector(`#add-menu-type`);
  const addNewMenuTypeButton = formContainer.querySelector(`#add-new-menu-type`);
  const newMenuTypeInput = formContainer.querySelector(`#newMenuType`);
  const menuTypeList = formContainer.querySelector(`#menu-type-list`);

  const menuTypes = [];

  const fetchedMenuTypes = await getMenuTypes();
  console.log('Fetched menu types:', fetchedMenuTypes);
  if (fetchedMenuTypes && fetchedMenuTypes.forEach) {
    fetchedMenuTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      menuTypeDropdown.appendChild(option);
    });
  } else {
    console.error(`Error fetching menu types:`, fetchedMenuTypes);
  }

  // Add existing menu type selection
  addMenuTypeButton.addEventListener('click', () => {
    const selectedOption = menuTypeDropdown.options[menuTypeDropdown.selectedIndex];
    if (selectedOption) {
      const listItem = createMenuListItem(selectedOption.textContent, selectedOption.value);
      menuTypeList.appendChild(listItem);
      menuTypes.push({ id: selectedOption.value, name: selectedOption.textContent });
    }
  });

  // Add new menu type
  addNewMenuTypeButton.addEventListener('click', async () => {
    const newMenuType = newMenuTypeInput.value.trim();
    console.log(`Adding new menu type: ${newMenuType}`);
    if (newMenuType) {
      const response = await addNewMenuType(newMenuType);
      console.log('Add new menu type response:', response);
      if (response && response.id) {
        const option = document.createElement('option');
        option.value = response.id;
        option.textContent = newMenuType;
        menuTypeDropdown.appendChild(option);

        const listItem = createMenuListItem(newMenuType, response.id);
        menuTypeList.appendChild(listItem);
        menuTypes.push({ id: response.id, name: newMenuType });

        newMenuTypeInput.value = ''; // Clear the input field
      } else {
        console.error(`Error adding new menu type:`, response);
      }
    }
  });

  // Attach to form submission to include menu type data
  const form = formContainer.querySelector(`#combined-form`);
  console.log('Form found for submission:', form);
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const menuTypesInput = document.createElement('input');
      menuTypesInput.type = 'hidden';
      menuTypesInput.name = `menuTypes-play`;
      menuTypesInput.value = JSON.stringify(menuTypes);
      form.appendChild(menuTypesInput);

      form.submit(); // Submit the form after appending the hidden input
    });
  } else {
    console.error('Form not found in the form container');
  }

  // Helper function to create list items with a remove button
  function createMenuListItem(name, id) {
    const listItem = document.createElement('li');
    listItem.textContent = `${name}`;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.style.color = 'red';
    removeButton.style.marginLeft = '10px';
    removeButton.addEventListener('click', () => {
      menuTypeList.removeChild(listItem);
      const index = menuTypes.findIndex(type => type.id === id);
      if (index > -1) {
        menuTypes.splice(index, 1);
      }
    });
    listItem.appendChild(removeButton);
    return listItem;
  }
}

export const getMenuTypes = async () => {
  const tableName = `play_type`;
  try {
    const response = await apiService.fetch(`menu-types?table=${tableName}`);
    console.log('Fetched menu types:', response); // Logging the response
    return response; // Assuming response is the expected array
  } catch (error) {
    console.error(`Error fetching menu types:`, error);
    return [];
  }
};

export const addNewMenuType = async (newMenuType) => {
  const tableName = `play_type`;
  try {
    const response = await apiService.fetch('menu-types', {
      method: 'POST',
      body: JSON.stringify({ name: newMenuType, table: tableName }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('New menu type added:', response); // Logging the response
    return response; // Assuming response is the expected object
  } catch (error) {
    console.error(`Error adding new menu type:`, error);
    return { id: Date.now(), name: newMenuType }; // Fallback to a mock response
  }
};
