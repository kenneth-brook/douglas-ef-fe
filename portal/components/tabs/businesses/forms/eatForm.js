import ApiService from '../../../../services/apiService.js';
import config from '../../../../utils/config.js';

const apiService = new ApiService();

// Main form template
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
                <!-- Business Details -->
                ${renderBusinessDetailsSection()}
            </div>
            <div class="form-section">
                <!-- Latitude, Longitude and Auto Fill -->
                ${renderLatLongSection()}
            </div>
            <div class="form-section">
                <!-- Contact Details -->
                ${renderContactDetailsSection()}
            </div>
            <div class="form-section" id="social-media-section">
                ${renderSocialMediaSection()}
            </div>
            <div class="form-section">
                ${renderLogoUploadSection()}
            </div>
            <div class="form-section" id="image-upload-section">
                ${renderImageUploadSection()}
            </div>
            <div class="form-section description-section">
                ${renderDescriptionSection()}
            </div>
            <div class="form-section" id="menu-selection-section">
                ${renderMenuSelectionSection()}
            </div>
            <div class="form-section special-day-section">
                ${renderSpecialDaySection()}
            </div>
            <input type="hidden" id="businessId" name="businessId" value="">
            <button type="button" id="submitButton">Submit</button>
        </form>
    `;
};

// Rendering functions for different sections
const renderBusinessDetailsSection = () => `
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
`;

const renderLatLongSection = () => `
    <div class="form-group">
        <label for="latitude">Latitude:</label>
        <input type="text" id="latitude" name="latitude" readonly>
    </div>
    <div class="form-group">
        <label for="longitude">Longitude:</label>
        <input type="text" id="longitude" name="longitude" readonly>
    </div>
    <button type="button" id="autofill-button">Auto Fill</button>
`;

const renderContactDetailsSection = () => `
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
`;

const renderSocialMediaSection = () => `
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
`;

const renderLogoUploadSection = () => `
    <div class="form-group">
        <label for="logoUpload">Business Logo:</label>
        <input type="file" id="logoUpload" name="logoUrl" accept="image/*">
    </div>
    <div id="logo-preview" class="thumbnail-container"></div>
`;

const renderImageUploadSection = () => `
    <div class="form-group">
        <label for="imageUpload">Upload Images:</label>
        <input type="file" id="imageUpload" name="imageUrls" multiple>
    </div>
    <div id="image-thumbnails"></div>
    <ul id="image-file-list"></ul>
`;

const renderDescriptionSection = () => `
    <div class="description-container">
        <label for="description">Business Description:</label>
        <textarea id="description" class="description" name="description"></textarea>
    </div>
`;

const renderMenuSelectionSection = () => `
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
`;

const renderSpecialDaySection = () => `
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
`;

// Coordinate handling
export const attachCoordinatesHandler = (formContainer) => {
    const autofillButton = formContainer.querySelector('#autofill-button');
    if (autofillButton) {
        autofillButton.addEventListener('click', handleAutofill);
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
    const apiKey = config.google;

    if (!apiKey) {
        console.error("API key is missing");
        return;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
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

// Social Media handling
export const attachSocialMediaHandler = (formContainer) => {
    const addButton = formContainer.querySelector('#add-social-media');
    const socialMediaList = formContainer.querySelector('#social-media-list');
    const platformInput = formContainer.querySelector('#socialPlatform');
    const addressInput = formContainer.querySelector('#socialAddress');

    if (!addButton || !socialMediaList || !platformInput || !addressInput) {
        console.error('One or more elements not found for Social Media handlers');
        return;
    }

    const socialMediaPairs = formContainer.socialMediaPairs || [];

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

    formContainer.socialMediaPairs = socialMediaPairs;
};

// Logo upload handling
export const attachLogoUploadHandler = (formContainer, existingLogoUrl = '') => {
    const logoUploadInput = formContainer.querySelector('#logoUpload');
    const logoPreviewContainer = formContainer.querySelector('#logo-preview');

    // If there is an existing logo, display it
    if (existingLogoUrl) {
        displayLogo(existingLogoUrl, logoPreviewContainer, formContainer);
    }

    if (logoUploadInput) {
        logoUploadInput.addEventListener('change', async () => {
            const file = logoUploadInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    logoPreviewContainer.innerHTML = ''; // Clear previous preview
                    displayLogo(e.target.result, logoPreviewContainer, formContainer, file);
                };
                reader.readAsDataURL(file);
            }
        });
    }
};

// Image upload handling
export const attachImageUploadHandler = (formContainer, existingImages ) => {
    existingImages = Array.isArray(existingImages) ? existingImages : [];

    const imageUploadInput = formContainer.querySelector('#imageUpload');
    const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
    const imageFileListContainer = formContainer.querySelector('#image-file-list');

    // Initialize imageUrls with existing images
    formContainer.imageUrls = [...existingImages];
    console.log('image url after push to formContainer: ', formContainer.imageUrls)

    // Function to display images (both existing and new)
    const displayImage = (url, fileName, file = null, isExisting = false) => {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'thumbnail-container';

        const img = document.createElement('img');
        img.src = url.startsWith('data:') ? url : `https://douglas.365easyflow.com/easyflow-images/${url}`;
        img.alt = fileName;
        img.className = 'thumbnail';

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-button';
        removeButton.addEventListener('click', () => {
            const index = formContainer.imageUrls.indexOf(isExisting ? url : `uploads/${fileName}`);
            if (index > -1) {
                formContainer.imageUrls.splice(index, 1);
            }
            imageThumbnailsContainer.removeChild(thumbnailContainer);
            imageFileListContainer.removeChild(listItem);
        });

        thumbnailContainer.appendChild(img);
        thumbnailContainer.appendChild(removeButton);
        imageThumbnailsContainer.appendChild(thumbnailContainer);

        const listItem = document.createElement('li');
        listItem.textContent = fileName;
        imageFileListContainer.appendChild(listItem);

        if (file) {
            // Upload new file and update imageUrls
            const uniqueFilename = getUniqueFilename(file.name);
            const imageFormData = new FormData();
            imageFormData.append('imageFiles[]', file, uniqueFilename);

            uploadFilesToDreamHost(imageFormData)
                .then((uploadResult) => {
                    if (uploadResult && uploadResult[0]) {
                        formContainer.imageUrls.push(`uploads/${uniqueFilename}`);
                        console.log('Image URLs:', formContainer.imageUrls);
                    } else {
                        console.error('Failed to upload image:', uploadResult);
                    }
                })
                .catch((error) => {
                    console.error('Error during image upload:', error);
                });
        } else {
            console.log('Loaded existing image:', url);
        }
    };

    // Display existing images
    existingImages.forEach((imageUrl) => {
        const fileName = imageUrl.split('/').pop();
        displayImage(imageUrl, fileName, null, true);
    });

    // Handle new image uploads
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', () => {
            const files = imageUploadInput.files;

            for (const file of files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    displayImage(e.target.result, file.name, file);
                };
                reader.readAsDataURL(file);
            }
        });
    }
};

// Display functions for Logo and Image
function displayLogo(url, container, formContainer, file = null) {
    const img = document.createElement('img');
    img.src = url.startsWith('data:') ? url : `https://douglas.365easyflow.com/easyflow-images/${url}`;
    img.className = 'thumbnail';
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-button';
    removeButton.addEventListener('click', () => {
        container.innerHTML = '';
        formContainer.logoUrl = ''; // Clear the stored URL or file
    });

    container.appendChild(img);
    container.appendChild(removeButton);

    if (file) {
        uploadFile(file, formContainer, 'logo');
    } else {
        formContainer.logoUrl = url; // Keep existing URL
    }
}

const initializeAverageCostDropdown = async (formContainer, selectedCost = null) => {
    const averageCostDropdown = formContainer.querySelector('#averageCost');
    
    if (!averageCostDropdown) {
        console.error('Average Cost dropdown element not found');
        return;
    }

    const averageCosts = await getAverageCosts();

    if (averageCosts && Array.isArray(averageCosts)) {
        averageCosts.forEach(cost => {
            const option = document.createElement('option');
            option.value = cost.id;
            option.textContent = `${cost.symbol}: ${cost.description}`;
            if (selectedCost && String(cost.id) === String(selectedCost)) {
                option.selected = true;
            }
            averageCostDropdown.appendChild(option);
        });
    } else {
        console.error('Error fetching or populating average costs:', averageCosts);
    }
};


// Initialize form components
export const initializeEatForm = (formContainer, businessData) => {
    if (!formContainer.imageUrls) {
        formContainer.imageUrls = [];
    }

    console.log('Received businessData in eatForm:', businessData);
    console.log('initializeEatForm called with formContainer:', formContainer);

    attachCoordinatesHandler(formContainer);
    attachSocialMediaHandler(formContainer, businessData ? businessData.socialMedia : []);
    attachLogoUploadHandler(formContainer, businessData ? businessData.logoUrl : '');
    attachImageUploadHandler(formContainer, businessData ? businessData.images : []);
    initializeTinyMCE('#description', businessData ? businessData.description : '');
    initializeAverageCostDropdown(formContainer, businessData ? businessData.cost : null);

    const activeToggle = formContainer.querySelector('#active-toggle');
    const toggleStatus = formContainer.querySelector('#toggle-status');

    if (businessData && businessData.active) {
        activeToggle.checked = true;
        toggleStatus.textContent = 'Active';
        toggleStatus.style.color = 'green';
    } else {
        activeToggle.checked = false;
        toggleStatus.textContent = 'Inactive';
        toggleStatus.style.color = 'red';
    }

    activeToggle.addEventListener('change', () => {
        if (activeToggle.checked) {
            toggleStatus.textContent = 'Active';
            toggleStatus.style.color = 'green';
        } else {
            toggleStatus.textContent = 'Inactive';
            toggleStatus.style.color = 'red';
        }
    });
};

// TinyMCE initialization
const initializeTinyMCE = (selector, content = '') => {
    tinymce.init({
        selector: selector,
        license_key: 'gpl',
        plugins: 'link code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
        setup: (editor) => {
            editor.on('init', () => {
                if (content) {
                    editor.setContent(content);
                }
            });
        },
    });
};

export const initializeEatFormWrapper = (formContainer, businessData) => {
    if (!businessData) {
        businessData = {}; // Set to an empty object if null to avoid accessing properties on null
    }

    console.log('Received businessData in eatForm:', businessData);
    initializeEatForm(formContainer, businessData);

    const selectedMenuTypes = businessData.menu_types || []; // Safely access menu_types
    console.log('Initializing menu selection with:', { formContainer, selectedMenuTypes });

    initializeMenuSelection(formContainer, businessData.menu_types || []);
};

// Menu Selection logic
export const initializeMenuSelection = async (formContainer, selectedMenuTypes = []) => {
    const menuTypeDropdown = formContainer.querySelector('#menuType');
    const menuTypeList = formContainer.querySelector('#menu-type-list');
    const addMenuTypeButton = formContainer.querySelector('#add-menu-type');
    const addNewMenuTypeButton = formContainer.querySelector('#add-new-menu-type');
    const newMenuTypeInput = formContainer.querySelector('#newMenuType');

    const menuTypes = [];

    const fetchedMenuTypes = await getMenuTypes();
    if (fetchedMenuTypes && Array.isArray(fetchedMenuTypes)) {
        fetchedMenuTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            menuTypeDropdown.appendChild(option);
        });

        selectedMenuTypes.forEach(selectedTypeId => {
            const type = fetchedMenuTypes.find(t => String(t.id) === String(selectedTypeId));
            if (type) {
                const listItem = createMenuListItem(type.name, type.id);
                menuTypeList.appendChild(listItem);
                menuTypes.push({ id: type.id, name: type.name });
            }
        });
    } else {
        console.error('Error fetching menu types:', fetchedMenuTypes);
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
    const tableName = `eat_type`;
    try {
        const response = await apiService.fetch(`menu-types?table=${tableName}`);
        return response;
    } catch (error) {
        console.error(`Error fetching menu types:`, error);
        return [];
    }
};

// Fetch average costs from the backend
export const getAverageCosts = async () => {
    const tableName = `eat_cost`;
    try {
        const response = await apiService.fetch(`average-costs?table=${tableName}`);
        return response;
    } catch (error) {
        console.error(`Error fetching average costs:`, error);
        return [];
    }
};

// Handle file uploads
async function uploadFile(file, formContainer, type) {
    const formData = new FormData();
    const uniqueFilename = getUniqueFilename(file.name);
    formData.append('file', file, uniqueFilename);

    try {
        const response = await fetch('https://douglas.365easyflow.com/easyflow-images/upload.php', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result && result[0]) {
            const uploadedUrl = `https://douglas.365easyflow.com/easyflow-images/uploads/${uniqueFilename}`;
            if (type === 'logo') {
                formContainer.logoUrl = uploadedUrl;
            } else if (type === 'image') {
                formContainer.imageUrls.push(uploadedUrl);
            }
        } else {
            console.error('Failed to upload file:', result);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

// Handle special days selection
export const attachSpecialDayHandlers = (formContainer) => {
    const specialDays = [];
    const addDayButton = formContainer.querySelector('#add-day-button');

    if (addDayButton) {
        addDayButton.addEventListener('click', () => {
            const specialDayInput = formContainer.querySelector('#special-day');
            const alteredHoursInput = formContainer.querySelector('#altered-hours');
            const specialDay = specialDayInput.value.trim();
            const alteredHours = alteredHoursInput.value.trim();

            if (specialDay && alteredHours) {
                specialDays.push({ day: specialDay, hours: alteredHours });

                const dayHoursList = formContainer.querySelector('#day-hours-list');
                const listItem = document.createElement('div');
                listItem.className = 'day-hours-item';
                listItem.textContent = `${specialDay}: ${alteredHours}`;
                dayHoursList.appendChild(listItem);

                specialDayInput.value = '';
                alteredHoursInput.value = '';
            } else {
                alert('Please fill both fields.');
            }
        });

        formContainer.specialDays = specialDays;
    }
};

const getUniqueFilename = (filename) => {
    const date = new Date().toISOString().replace(/[-:.]/g, '');
    return `${date}_${filename}`;
};

const uploadFilesToDreamHost = async (formData) => {
    try {
        const response = await fetch('https://douglas.365easyflow.com/easyflow-images/upload.php', {
            method: 'POST',
            body: formData,
        });

        const responseBody = await response.text();
        const result = JSON.parse(responseBody);

        if (result.length === 0) {
            throw new Error('Upload to DreamHost failed: empty result');
        }

        return result;
    } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('.tab-content');
    initializeEatForm(formContainer);
});