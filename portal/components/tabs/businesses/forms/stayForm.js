import ApiService from '../../../../services/apiService.js';
import config from '../../../../utils/config.js';

const apiService = new ApiService();

export const stayForm = () => {
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
            <label for="menuType">Stay Type:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
              <select id="menuType" name="menuType"></select>
              <button type="button" id="add-menu-type">Add Selection</button>
            </div>
          </div>
          <div class="form-group">
            <label for="newMenuType">New Stay Type:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="text" id="newMenuType" name="newMenuType">
              <button type="button" id="add-new-menu-type">Add</button>
            </div>
          </div>
          <div class="form-group">
            <label for="averageCost">Average Cost:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
              <select id="averageCost" name="averageCost"></select>
            </div>
          </div>
        </div>
        <ul id="menu-type-list"></ul>
      </div>

      <button type="button" id="submitButton">Submit</button>
    </form>
  `;
}

export const attachCoordinatesHandler = (formContainer) => {
  const autofillButton = formContainer.querySelector('#autofill-button');
  autofillButton.addEventListener('click', handleAutofill);
};

const getUniqueFilename = (filename) => {
  const date = new Date().toISOString().replace(/[-:.]/g, '');
  console.log(`${date}_${filename}`)
  return `${date}_${filename}`;
};

const uploadFilesToDreamHost = async (formData) => {
  try {
    console.log('Uploading files to DreamHost');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value.name}`);
    }

    const response = await fetch('https://dev.365easyflow.com/easyflow-images/upload.php', {
      method: 'POST',
      body: formData,
    });

    const responseBody = await response.text();
    console.log('Raw response body:', responseBody);

    const result = JSON.parse(responseBody);
    console.log('Upload result:', result);

    if (result.length === 0) {
      console.error('Upload result is empty:', result);
      throw new Error('Upload to DreamHost failed: empty result');
    }

    return result;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
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
  const addButton = formContainer.querySelector('#add-social-media');
  const socialMediaList = formContainer.querySelector('#social-media-list');
  const socialMediaPairs = [];

  addButton.addEventListener('click', () => {
    const platformInput = formContainer.querySelector('#socialPlatform');
    const addressInput = formContainer.querySelector('#socialAddress');
    const platform = platformInput.value.trim();
    const address = addressInput.value.trim();

    if (platform && address) {
      socialMediaPairs.push({ platform, address });
      const listItem = document.createElement('li');
      listItem.textContent = `${platform}: ${address}`;
      listItem.dataset.platform = platform;
      listItem.dataset.address = address;
      socialMediaList.appendChild(listItem);

      // Clear inputs
      platformInput.value = '';
      addressInput.value = '';
    }
  });

  // Store the social media pairs in the form container for later retrieval
  formContainer.socialMediaPairs = socialMediaPairs;
};

/* Logo Upload */

export const attachLogoUploadHandler = (formContainer) => {
  const logoUploadInput = formContainer.querySelector('#logoUpload');
  const logoPreviewContainer = formContainer.querySelector('#logo-preview');

  logoUploadInput.addEventListener('change', async () => {
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
          formContainer.logoUrl = ''; // Reset the logo URL
        });

        logoPreviewContainer.appendChild(img);
        logoPreviewContainer.appendChild(removeButton);
      };
      reader.readAsDataURL(file);

      // Upload file to DreamHost
      const uniqueFilename = getUniqueFilename(file.name);
      const logoFormData = new FormData();
      logoFormData.append('imageFiles[]', file, uniqueFilename); // Use 'imageFiles[]' key to match server-side script

      try {
        const uploadResult = await uploadFilesToDreamHost(logoFormData);
        if (uploadResult && uploadResult[0]) {
          formContainer.logoUrl = `uploads/${uniqueFilename}`;
          console.log('Logo URL:', formContainer.logoUrl);
        } else {
          console.error('Failed to upload logo:', uploadResult);
        }
      } catch (error) {
        console.error('Error during logo upload:', error);
      }
    }
  });
};

/* Images Upload */

export const attachImageUploadHandler = (formContainer) => {
  const imageUploadInput = formContainer.querySelector('#imageUpload');
  const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
  const imageFileListContainer = formContainer.querySelector('#image-file-list');

  formContainer.imageUrls = []; // Initialize image URLs array

  imageUploadInput.addEventListener('change', async () => {
    const files = imageUploadInput.files;

    for (const file of files) {
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
          const index = formContainer.imageUrls.indexOf(file.name);
          if (index > -1) {
            formContainer.imageUrls.splice(index, 1);
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

      // Upload file to DreamHost
      const uniqueFilename = getUniqueFilename(file.name);
      const imageFormData = new FormData();
      imageFormData.append('imageFiles[]', file, uniqueFilename); // Use 'imageFiles[]' key to match server-side script

      try {
        const uploadResult = await uploadFilesToDreamHost(imageFormData);
        if (uploadResult && uploadResult[0]) {
          formContainer.imageUrls.push(`uploads/${uniqueFilename}`);
          console.log('Image URLs:', formContainer.imageUrls);
        } else {
          console.error('Failed to upload image:', uploadResult);
        }
      } catch (error) {
        console.error('Error during image upload:', error);
      }
    }
  });
};

/* Description */

export const initializeTinyMCE = (selector) => {
  tinymce.init({
    selector: selector,
    license_key: 'gpl',
    plugins: 'link code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
    setup: (editor) => {
      editor.on('change', () => {
        editor.save(); // Ensure the content is saved to the textarea
      });
    },
  });
};

/* Initialization Function */

export const initializeStayForm = async (formContainer) => {
  attachCoordinatesHandler(formContainer);
  attachSocialMediaHandler(formContainer);
  attachLogoUploadHandler(formContainer);
  attachImageUploadHandler(formContainer);
  initializeTinyMCE('#description');
  await initializeMenuSelection(formContainer);
}

export const initializeMenuSelection = async (formContainer) => {
  const menuTypeDropdown = formContainer.querySelector('#menuType');
  const averageCostDropdown = formContainer.querySelector('#averageCost');
  const addMenuTypeButton = formContainer.querySelector('#add-menu-type');
  const addNewMenuTypeButton = formContainer.querySelector('#add-new-menu-type');
  const newMenuTypeInput = formContainer.querySelector('#newMenuType');
  const menuTypeList = formContainer.querySelector('#menu-type-list');

  const menuTypes = [];

  const fetchedMenuTypes = await getMenuTypes();
  if (fetchedMenuTypes && Array.isArray(fetchedMenuTypes)) {
    fetchedMenuTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      menuTypeDropdown.appendChild(option);
    });
  } else {
    console.error('Error fetching menu types:', fetchedMenuTypes);
  }

  const fetchedAverageCosts = await getAverageCosts();
  if (fetchedAverageCosts && Array.isArray(fetchedAverageCosts)) {
    fetchedAverageCosts.forEach(cost => {
      const option = document.createElement('option');
      option.value = cost.id;
      option.textContent = `${cost.symbol} - ${cost.description}`;
      averageCostDropdown.appendChild(option);
    });
  } else {
    console.error('Error fetching average costs:', fetchedAverageCosts);
  }

  addMenuTypeButton.addEventListener('click', () => {
    const selectedOption = menuTypeDropdown.options[menuTypeDropdown.selectedIndex];
    if (selectedOption) {
      const listItem = createMenuListItem(selectedOption.textContent, selectedOption.value);
      menuTypeList.appendChild(listItem);
      menuTypes.push({ id: selectedOption.value, name: selectedOption.textContent });
    }
  });

  addNewMenuTypeButton.addEventListener('click', async () => {
    const newMenuType = newMenuTypeInput.value.trim();
    if (newMenuType) {
      const response = await addNewMenuType(newMenuType);
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
        console.error('Error adding new menu type:', response);
      }
    }
  });

  // Attach menuTypes to formContainer for later use
  formContainer.menuTypes = menuTypes;

  function createMenuListItem(name, id) {
    const listItem = document.createElement('li');
    listItem.textContent = name;
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
};

export const getMenuTypes = async () => {
  const tableName = `stay_type`;
  try {
    const response = await apiService.fetch(`menu-types?table=${tableName}`);
    console.log('Fetched menu types:', response); // Logging the response
    return response; // Assuming response is the expected array
  } catch (error) {
    console.error(`Error fetching menu types:`, error);
    return [];
  }
};

export const getAverageCosts = async () => {
  const tableName = `stay_cost`;
  try {
    console.log(`Fetching average costs for table: ${tableName}`);
    const response = await apiService.fetch(`average-costs?table=${tableName}`);
    console.log('Fetched average costs:', response); // Logging the response
    return response;
  } catch (error) {
    console.error(`Error fetching average costs:`, error);
    return [];
  }
};

export const addNewMenuType = async (newMenuType) => {
  const tableName = `stay_type`;
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

// Function to handle adding social media entries
function addSocialMediaEntry() {
  const platform = document.getElementById('socialPlatform').value;
  const address = document.getElementById('socialAddress').value;

  if (platform && address) {
    const listItem = document.createElement('li');
    listItem.textContent = `${platform}: ${address}`;
    listItem.setAttribute('data-platform', platform);
    listItem.setAttribute('data-address', address);

    const socialMediaList = document.getElementById('social-media-list');
    socialMediaList.appendChild(listItem);

    // Clear inputs
    document.getElementById('socialPlatform').value = '';
    document.getElementById('socialAddress').value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.querySelector('.tab-content');
  if (formContainer) {
    initializeStayForm(formContainer);
  }
});
