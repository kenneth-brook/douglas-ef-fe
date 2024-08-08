import ApiService from '../../../../services/apiService.js';
import { attachCoordinatesHandler } from './formHelpers/coordinatesHelper.js';
import { attachSocialMediaHandler } from './formHelpers/socialMediaHelper.js';
import { attachLogoUploadHandler } from './formHelpers/logoUploadHelper.js';
import { attachImageUploadHandler } from './formHelpers/imageUploadHelper.js';
import { attachSpecialDayHandlers } from './formHelpers/specialDayHelper.js';
import { initializeMenuSelection } from './formHelpers/menuSelectionHelper.js';
import { initializeTinyMCE } from './formHelpers/tinyMCEHelper.js';

const apiService = new ApiService();

export const eatForm = () => {
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
          <input type="file" id="logoUpload" name="logoUrl" accept="image/*">
        </div>
        <div id="logo-preview" class="thumbnail-container"></div>
      </div>
      <div class="form-section" id="image-upload-section">
        <div class="form-group">
          <label for="imageUpload">Upload Images:</label>
          <input type="file" id="imageUpload" name="imageUrls" multiple>
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
          <div class="form-group">
            <label for="averageCost">Average Cost:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
              <select id="averageCost" name="averageCost"></select>
            </div>
          </div>
        </div>
        <ul id="menu-type-list"></ul>
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
      <input type="hidden" id="businessId" name="businessId" value="">

      <button type="button" id="submitButton">Submit</button>
    </form>
  `;
};

export const initializeEatForm = async (formContainer, data = null) => {
  attachCoordinatesHandler(formContainer);
  attachSocialMediaHandler(formContainer);
  attachLogoUploadHandler(formContainer);
  attachImageUploadHandler(formContainer);
  attachSpecialDayHandlers(formContainer);
  initializeTinyMCE('#description');
  await initializeMenuSelection(formContainer);

  if (data) {
    populateEatForm(formContainer, data);
  }

  const submitButton = formContainer.querySelector('#submitButton');
  console.log('Submit button found:', submitButton); // Debugging statement

  if (submitButton) {
    console.log('Attaching event listener to submit button'); // Debugging statement
    submitButton.addEventListener('click', handleSubmit);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission

  console.log('Submit button clicked'); // Debugging statement

  const form = document.getElementById('combined-form');
  const formData = new FormData(form);

  // Log form data for debugging
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    const response = await apiService.fetch('eat-form-submission', { // Updated endpoint
      method: 'POST',
      body: formData,
    });

    console.log('Response:', response); // Debugging statement

    if (response.ok) {
      alert('Form submitted successfully!');
    } else {
      const errorData = await response.text(); // Read response as text to debug
      console.error('Error response text:', errorData);
      alert('Error submitting form. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Error submitting form. Please try again.');
  }
};

// Event listener attachment
document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.querySelector('.tab-content');
  initializeEatForm(formContainer);

  const submitButton = formContainer.querySelector('#submitButton');
  console.log('Submit button found:', submitButton); // Debugging statement

  if (submitButton) {
    console.log('Attaching event listener to submit button'); // Debugging statement
    submitButton.addEventListener('click', handleSubmit);
  }
});

const populateEatForm = async (formContainer, data) => {
  Object.keys(data).forEach(key => {
    const input = formContainer.querySelector(`[name="${key}"]`);
    if (input) {
      if (input.type === 'checkbox') {
        input.checked = data[key];
      } else if (input.tagName === 'TEXTAREA') {
        input.value = data[key];
      } else if (input.type === 'file') {
        // Handle file inputs if necessary
      } else {
        input.value = data[key];
      }
    }
  });

  if (data.social_platforms) {
    const socialMediaList = formContainer.querySelector('#social-media-list');
    data.social_platforms.forEach(platform => {
      const listItem = document.createElement('li');
      listItem.textContent = `${platform.platform}: ${platform.address}`;
      socialMediaList.appendChild(listItem);
    });
  }

  if (data.menu_types) {
    const menuTypeList = formContainer.querySelector('#menu-type-list');
    const fetchedMenuTypes = await getMenuTypes();
    data.menu_types.forEach(typeId => {
      const type = fetchedMenuTypes.find(t => t.id === typeId);
      if (type) {
        const listItem = document.createElement('li');
        listItem.textContent = type.name;
        listItem.dataset.id = type.id;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-button';
        removeButton.addEventListener('click', () => {
          const index = data.menu_types.indexOf(type.id);
          if (index > -1) {
            data.menu_types.splice(index, 1);
          }
          menuTypeList.removeChild(listItem);
        });

        listItem.appendChild(removeButton);
        menuTypeList.appendChild(listItem);
      }
    });
  }

  if (data.images) {
    const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
    const imageFileListContainer = formContainer.querySelector('#image-file-list');

    data.images.forEach(url => {
      const uniqueFilename = url.split('/').pop();
      const displayFilename = uniqueFilename.replace(/^\d{8}T\d{9}Z_/, ''); // Remove date string from display
      const imgSrc = `https://douglas.365easyflow.com/easyflow-images/${url}`;
      const img = document.createElement('img');
      img.src = imgSrc;
      img.className = 'thumbnail';

      const thumbnailContainer = document.createElement('div');
      thumbnailContainer.className = 'thumbnail-container';
      thumbnailContainer.dataset.source = 'database'; // Custom attribute to denote DB image
      
      img.addEventListener('mouseover', () => {
        const enlargeImg = document.createElement('img');
        enlargeImg.src = imgSrc;
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
        const index = data.images.indexOf(url);
        if (index > -1) {
          data.images.splice(index, 1);
        }
        imageThumbnailsContainer.removeChild(thumbnailContainer);
        imageFileListContainer.removeChild(listItem);
      });

      thumbnailContainer.appendChild(img);
      thumbnailContainer.appendChild(removeButton);
      imageThumbnailsContainer.appendChild(thumbnailContainer);

      const listItem = document.createElement('li');
      listItem.textContent = displayFilename;
      listItem.dataset.originalFilename = uniqueFilename; // Store original filename for processing
      imageFileListContainer.appendChild(listItem);
    });
  }

  if (data.logo) {
    const logoPreviewContainer = formContainer.querySelector('#logo-preview');
    const imgSrc = `https://douglas.365easyflow.com/easyflow-images/${data.logo}`;
    const displayFilename = data.logo.replace(/^\d{15}_/, ''); // Remove date string from display
    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'thumbnail';

    img.addEventListener('mouseover', () => {
      const enlargeImg = document.createElement('img');
      enlargeImg.src = imgSrc;
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
      formContainer.logoUrl = '';
      logoPreviewContainer.innerHTML = '';
    });

    logoPreviewContainer.appendChild(img);
    logoPreviewContainer.appendChild(removeButton);
  }

  // Set specific fields manually if they are not auto-populated
  formContainer.querySelector('#businessId').value = data.id;
  formContainer.querySelector('#businessName').value = data.name;
  formContainer.querySelector('#streetAddress').value = data.street_address;
  formContainer.querySelector('#mailingAddress').value = data.mailing_address;
  formContainer.querySelector('#city').value = data.city;
  formContainer.querySelector('#state').value = data.state;
  formContainer.querySelector('#zipCode').value = data.zip;
  formContainer.querySelector('#latitude').value = data.lat;
  formContainer.querySelector('#longitude').value = data.long;
  formContainer.querySelector('#phone').value = data.phone;
  formContainer.querySelector('#email').value = data.email;
  formContainer.querySelector('#website').value = data.web;
  formContainer.querySelector('#description').value = data.description;

  if (data.active) {
    formContainer.querySelector('#active-toggle').checked = true;
    document.getElementById('toggle-status').textContent = 'Active';
    document.getElementById('toggle-status').style.color = 'green';
  } else {
    formContainer.querySelector('#active-toggle').checked = false;
    document.getElementById('toggle-status').textContent = 'Inactive';
    document.getElementById('toggle-status').style.color = 'red';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.querySelector('.tab-content');
  initializeEatForm(formContainer);
});
