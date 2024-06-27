import ApiService from '../../../services/apiService.js';
import config from '../../../utils/config.js';

const apiService = new ApiService();

export const eventForm = () => {
  return `
    <form id="event-form" enctype="multipart/form-data">
      <div class="form-section">
        <div class="form-group">
          <label for="eventName">Event Name:</label>
          <input type="text" id="eventName" name="eventName" required>
        </div>
      </div>
      <div class="form-section">
        <div class="form-group">
          <label for="streetAddress">Street Address:</label>
          <input type="text" id="streetAddress" name="streetAddress" required>
        </div>
        <div class="form-group">
          <label for="city">City:</label>
          <input type="text" id="city" name="city" required>
        </div>
        <div class="form-group">
          <label for="state">State:</label>
          <input type="text" id="state" name="state" required>
        </div>
        <div class="form-group">
          <label for="zipCode">Zip Code:</label>
          <input type="text" id="zipCode" name="zipCode" required>
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
          <label for="startDate">Start Date:</label>
          <input type="date" id="startDate" name="startDate" required>
        </div>
        <div class="form-group">
          <label for="endDate">End Date:</label>
          <input type="date" id="endDate" name="endDate" required>
        </div>
        <div class="form-group">
          <label for="startTime">Start Time:</label>
          <input type="time" id="startTime" name="startTime" required>
        </div>
        <div class="form-group">
          <label for="endTime">End Time:</label>
          <input type="time" id="endTime" name="endTime" required>
        </div>
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
          <label for="logoUpload">Event Logo:</label>
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
          <label for="description">Event Description:</label>
          <textarea id="description" class="description" name="description"></textarea>
        </div>
      </div>
      <button type="button" id="submitEventButton">Submit</button>
    </form>
  `;
}

export const attachCoordinatesHandler = (formContainer) => {
    const autofillButton = formContainer.querySelector('#autofill-button');
    autofillButton.addEventListener('click', handleAutofill);
  };
  
  const getUniqueFilename = (filename) => {
    const date = new Date().toISOString().replace(/[-:.]/g, '');
    console.log(`${date}_${filename}`);
    return `${date}_${filename}`;
  };
  
  const uploadFilesToDreamHost = async (formData) => {
    try {
      console.log('Uploading files to DreamHost');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value.name}`);
      }
  
      const response = await fetch('https://douglas.365easyflow.com/easyflow-images/upload.php', {
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
    const platformInput = formContainer.querySelector('#socialPlatform');
    const addressInput = formContainer.querySelector('#socialAddress');
  
    if (!addButton || !socialMediaList || !platformInput || !addressInput) {
      console.error('One or more elements not found for Social Media handlers');
      return;
    }
  
    const socialMediaPairs = [];
  
    addButton.addEventListener('click', () => {
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
  
  export const initializeEventForm = async (formContainer) => {
    attachCoordinatesHandler(formContainer);
    attachSocialMediaHandler(formContainer);
    attachLogoUploadHandler(formContainer);
    attachImageUploadHandler(formContainer);
    initializeTinyMCE('#description');
    
    const submitButton = formContainer.querySelector('#submitEventButton');
    const eventForm = formContainer.querySelector('#event-form');
    
    submitButton.addEventListener('click', async (event) => {
      event.preventDefault();
      console.log('Submit button clicked and default prevented');
      
      // Save TinyMCE content back to the textarea
      tinymce.triggerSave();
      
      const formData = new FormData(eventForm);
  
      // Collect the uploaded URLs from formContainer
      const logoUrl = formContainer.logoUrl || '';
      const imageUrls = formContainer.imageUrls || [];
      
      // Append to form data
      formData.append('logoUrl', logoUrl);
      formData.append('imageUrls', JSON.stringify(imageUrls));
      
      // Include social media pairs
      const socialMediaPairs = formContainer.socialMediaPairs || [];
      formData.append('socialMedia', JSON.stringify(socialMediaPairs));
      
      // Log form data for debugging
      console.log('Form Data to be submitted:');
      for (let key of formData.keys()) {
        console.log(key, formData.get(key));
      }
      
      try {
        const initialFormData = new URLSearchParams();
        initialFormData.append('eventName', formData.get('eventName'));
        initialFormData.append('streetAddress', formData.get('streetAddress'));
        initialFormData.append('city', formData.get('city'));
        initialFormData.append('state', formData.get('state'));
        initialFormData.append('zipCode', formData.get('zipCode'));
        initialFormData.append('latitude', formData.get('latitude') || '');
        initialFormData.append('longitude', formData.get('longitude') || '');
        initialFormData.append('startDate', formData.get('startDate'));
        initialFormData.append('endDate', formData.get('endDate'));
        initialFormData.append('startTime', formData.get('startTime'));
        initialFormData.append('endTime', formData.get('endTime'));
        initialFormData.append('description', formData.get('description'));
        initialFormData.append('phone', formData.get('phone'));
        initialFormData.append('email', formData.get('email'));
        initialFormData.append('website', formData.get('website'));
        initialFormData.append('logoUrl', logoUrl);
        initialFormData.append('imageUrls', JSON.stringify(imageUrls));
        initialFormData.append('socialMedia', JSON.stringify(socialMediaPairs));
  
        const response = await apiService.submitEventForm(initialFormData);
        console.log('Event form submitted successfully', response);
        // Optionally navigate to the list view after successful submission
      } catch (error) {
        console.error('Error submitting event form:', error);
      }
    });
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('.tab-content');
    if (formContainer) {
      initializeEventForm(formContainer);
    }
  });