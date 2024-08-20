import { eatForm, initializeEatForm, initializeMenuSelection } from './forms/eatForm.js';
import { stayForm, initializeStayForm } from './forms/stayForm.js';
import { playForm, initializePlayForm } from './forms/playForm.js';
import { shopForm, initializeShopForm } from './forms/shopForm.js';
import ListBusinesses from './listBusinesses.js';

class BusinessesTab {
    constructor(store, router, apiService) {
        this.store = store;
        this.router = router;
        this.apiService = apiService;
        console.log('apiService methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(apiService)));
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.addRoute('businesses/list', () => this.showListBusinesses());
        this.router.addRoute('businesses/add', () => this.showAddBusiness());
        this.router.addRoute('businesses/edit/:id', id => this.showEditBusiness(id));
    }

    showListBusinesses() {
        const contentArea = document.querySelector('.tab-content');
        if (!contentArea) {
            console.error("Content area element not found");
            return;
        }
        contentArea.innerHTML = '';
        const listBusinesses = new ListBusinesses(this.router, this.store, this.apiService);
        const renderedListBusinesses = listBusinesses.render();
        contentArea.appendChild(renderedListBusinesses);
        this.setActiveTab('businesses/list');
    }

    showAddBusiness() {
        this.displayBusinessTypeSelection();
        this.setActiveTab('businesses/add');
    }

    displayBusinessTypeSelection() {
        const contentArea = document.querySelector('.tab-content');

        if (!contentArea) {
            console.error('Content area element not found');
            return;
        }

        contentArea.innerHTML = '';

        const selectionHtml = `
            <div>
                <h3>Select The Type Of Business To Add</h3>
                <select id="business-type-select">
                    <option value="eat">Eat</option>
                    <option value="stay">Stay</option>
                    <option value="play">Play</option>
                    <option value="shop">Shop</option>
                </select>
                <button id="select-business-type-button">Select</button>
            </div>
        `;

        contentArea.innerHTML = selectionHtml;

        document.getElementById('select-business-type-button').addEventListener('click', () => {
            const selectedType = document.getElementById('business-type-select').value;
            this.loadBusinessForm(selectedType);
        });
    }

    loadBusinessForm(type) {
        const contentArea = document.querySelector('.tab-content');
        contentArea.innerHTML = ''; // Clear existing content

        let formHtml, initializeForm;
        switch (type) {
            case 'eat':
                formHtml = eatForm();
                initializeForm = initializeEatForm;
                break;
            case 'stay':
                formHtml = stayForm();
                initializeForm = initializeStayForm;
                break;
            case 'play':
                formHtml = playForm();
                initializeForm = initializePlayForm;
                break;
            case 'shop':
                formHtml = shopForm();
                initializeForm = initializeShopForm;
                break;
            default:
                console.error("Invalid business type selected");
                return;
        }

        contentArea.innerHTML = formHtml;

        // Ensure the DOM is updated before initializing TinyMCE
        setTimeout(() => {
            this.initializeForm(contentArea, type, initializeForm);
        }, 100); // Adjust delay if needed
    }

    async initializeForm(formContainer, type, initializeForm, businessData = null) {
        initializeForm(formContainer, businessData);
    
        const combinedForm = formContainer.querySelector('#combined-form');
        const submitButton = formContainer.querySelector('#submitButton');
    
        // Attach the event listener to handle form submission
        submitButton.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log('Submit button clicked and default prevented');
    
            // Save TinyMCE content back to the textarea
            tinymce.triggerSave();
    
            const formData = new FormData(combinedForm);
    
            // If editing, append the business ID to the form data
            if (businessData) {
                formData.append('businessId', businessData.id);
            }
    
            // Collect and append the uploaded URLs from formContainer
            const logoUrl = formContainer.logoUrl || '';
            const imageUrls = formContainer.imageUrls || [];
            formData.append('logoUrl', logoUrl);
            formData.append('imageUrls', JSON.stringify(imageUrls));
    
            // Include selected menu types and special days if available
            const menuTypes = formContainer.menuTypes || [];
            formData.append('menuTypes', JSON.stringify(menuTypes.map(mt => mt.id)));
            const specialDays = formContainer.specialDays || [];
            formData.append('specialDays', JSON.stringify(specialDays));
    
            console.log('Form Data:', Array.from(formData.entries()));
    
            try {
                // First submission for initial business data
                const initialFormData = new URLSearchParams();
                initialFormData.append('active', formData.get('active') ? 'true' : 'false');
                initialFormData.append('businessName', formData.get('businessName'));
                initialFormData.append('streetAddress', formData.get('streetAddress'));
                initialFormData.append('mailingAddress', formData.get('mailingAddress'));
                initialFormData.append('city', formData.get('city'));
                initialFormData.append('state', formData.get('state'));
                initialFormData.append('zipCode', formData.get('zipCode'));
                initialFormData.append('latitude', formData.get('latitude') || '');
                initialFormData.append('longitude', formData.get('longitude') || '');
                initialFormData.append('phone', formData.get('phone'));
                initialFormData.append('email', formData.get('email'));
                initialFormData.append('website', formData.get('website'));
    
                const socialMediaArray = formContainer.socialMediaPairs || [];
                initialFormData.append('socialMedia', JSON.stringify(socialMediaArray));
                initialFormData.append('logoUrl', logoUrl);
                initialFormData.append('imageUrls', JSON.stringify(imageUrls));
                initialFormData.append('description', formData.get('description'));
                initialFormData.append('menuTypes', formData.get('menuTypes'));
                initialFormData.append('specialDays', formData.get('specialDays'));
    
                const businessResponse = businessData
                    ? await this.apiService.updateBusiness(businessData.id, initialFormData)
                    : await this.apiService.createBusiness(initialFormData);
    
                if (businessResponse && businessResponse.id) {
                    console.log('Form data submitted successfully');
                    const businessId = businessResponse.id;
    
                    if (!businessData) {
                        const businessIdField = document.createElement('input');
                        businessIdField.type = 'hidden';
                        businessIdField.id = 'businessId';
                        businessIdField.name = 'businessId';
                        businessIdField.value = businessId;
                        combinedForm.appendChild(businessIdField);
                    }
    
                    const detailsFormData = new URLSearchParams();
                    detailsFormData.append('businessId', businessId);
    
                    if (type === 'eat') {
                        detailsFormData.append('menuTypes', formData.get('menuTypes'));
                        detailsFormData.append('averageCost', formData.get('averageCost'));
                        detailsFormData.append('special_days', formData.get('specialDays'));
    
                        try {
                            const eatResponse = await this.apiService.submitEatForm(detailsFormData);
                            console.log('Eat form data submitted', eatResponse);
                        } catch (error) {
                            console.error('Error submitting eat form:', error);
                        }
                    }

                    if (type === 'play') {
                        detailsFormData.append('menuTypes', formData.get('menuTypes'));
                        detailsFormData.append('special_days', formData.get('specialDays'));
                        const operationalHours = this.collectOperationalHours(formContainer);
                        detailsFormData.append('hours', JSON.stringify(operationalHours));
        
                        try {
                            const playResponse = await this.apiService.submitPlayForm(detailsFormData);
                            console.log('Play form data submitted', playResponse);
                        } catch (error) {
                            console.error('Error submitting play form:', error);
                        }
                      }

                    if (type === 'shop') {
                        detailsFormData.append('menuTypes', formData.get('menuTypes'));
                        detailsFormData.append('special_days', formData.get('specialDays'));
                        const operationalHours = this.collectOperationalHours(formContainer);
                        detailsFormData.append('hours', JSON.stringify(operationalHours));
    
                        try {
                            const shopResponse = await this.apiService.submitShopForm(detailsFormData);
                            console.log('Shop form data submitted', shopResponse);
                        } catch (error) {
                            console.error('Error submitting shop form:', error);
                        }
                      }
  
                      if (type === 'stay') {
                        detailsFormData.append('menuTypes', formData.get('menuTypes'));
                        detailsFormData.append('averageCost', formData.get('averageCost'));
    
                        try {
                            const stayResponse = await this.apiService.submitStayForm(detailsFormData);
                            console.log('Play form data submitted', stayResponse);
                        } catch (error) {
                            console.error('Error submitting play form:', error);
                        }
                      }
    
                    // Handle other types similarly...
    
                    console.log('Redirecting to list view');
                    setTimeout(() => {
                        this.router.navigate('businesses/list');
                    }, 1000);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        });
    
        if (businessData) {
            this.populateFormFields(formContainer, businessData);
        }
    }
    
    
    populateFormFields(formContainer, businessData) {
        formContainer.querySelector('#businessName').value = businessData.name || '';
        formContainer.querySelector('#streetAddress').value = businessData.street_address || '';
        formContainer.querySelector('#mailingAddress').value = businessData.mailing_address || '';
        formContainer.querySelector('#city').value = businessData.city || '';
        formContainer.querySelector('#state').value = businessData.state || '';
        formContainer.querySelector('#zipCode').value = businessData.zip || '';
        formContainer.querySelector('#latitude').value = businessData.lat || '';
        formContainer.querySelector('#longitude').value = businessData.long || '';
        formContainer.querySelector('#phone').value = businessData.phone || '';
        formContainer.querySelector('#email').value = businessData.email || '';
        formContainer.querySelector('#website').value = businessData.web || '';
        
        const checkTinyMCE = setInterval(() => {
            const editor = tinymce.get('#description');
            if (editor) {
                editor.setContent(businessData.description || '');
                clearInterval(checkTinyMCE);
            }
        }, 100);
    
        console.log('Menu Types from businessData:', businessData.menu_types);
    
        initializeMenuSelection(formContainer, businessData.menu_types || []);
    
        if (Array.isArray(businessData.socialMedia)) {
            businessData.socialMedia.forEach(pair => {
                const listItem = document.createElement('li');
                listItem.textContent = `${pair.platform}: ${pair.address}`;
                listItem.dataset.platform = pair.platform;
                listItem.dataset.address = pair.address;
                formContainer.querySelector('#social-media-list').appendChild(listItem);
            });
        }
    
        formContainer.logoUrl = businessData.logoUrl || '';
        const logoPreviewContainer = formContainer.querySelector('#logo-preview');
        if (businessData.logoUrl) {
            const img = document.createElement('img');
            img.src = businessData.logoUrl;
            img.className = 'thumbnail';
            logoPreviewContainer.appendChild(img);
        }
    
        formContainer.imageUrls = businessData.imageUrls || [];
        const imageThumbnailsContainer = formContainer.querySelector('#image-thumbnails');
        if (Array.isArray(businessData.imageUrls)) {
            businessData.imageUrls.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.className = 'thumbnail';
                imageThumbnailsContainer.appendChild(img);
            });
        }
    
        if (Array.isArray(businessData.menuTypes)) {
            businessData.menuTypes.forEach(type => {
                const listItem = document.createElement('li');
                listItem.textContent = type.name;
                formContainer.querySelector('#menu-type-list').appendChild(listItem);
                formContainer.menuTypes.push({ id: type.id, name: type.name });
            });
        }
    
        if (Array.isArray(businessData.specialDays)) {
            businessData.specialDays.forEach(day => {
                const listItem = document.createElement('div');
                listItem.className = 'day-hours-item';
                listItem.textContent = `${day.day}: ${day.hours}`;
                formContainer.querySelector('#day-hours-list').appendChild(listItem);
                formContainer.specialDays.push(day);
            });
        }
    }    

    async handleFileUploads(formData) {
        const logoFile = formData.get('logoFile');
        const imageFiles = formData.getAll('imageFiles');

        let logoUrl = '';
        let imageUrls = [];

        if (logoFile) {
            const logoFormData = new FormData();
            const uniqueLogoFilename = getUniqueFilename(logoFile.name);
            logoFormData.append('file', logoFile, uniqueLogoFilename);
            const logoUploadResult = await uploadFilesToDreamHost(logoFormData);
            if (logoUploadResult && logoUploadResult[0]) {
                logoUrl = logoUploadResult[0].url;
            }
        }

        if (imageFiles.length > 0) {
            const imagesFormData = new FormData();
            imageFiles.forEach((file) => {
                const uniqueImageFilename = getUniqueFilename(file.name);
                imagesFormData.append('files[]', file, uniqueImageFilename);
            });
            const imagesUploadResult = await uploadFilesToDreamHost(imagesFormData);
            if (imagesUploadResult && imagesUploadResult.length > 0) {
                imageUrls = imagesUploadResult.map(img => img.url);
            }
        }

        return { logoUrl, imageUrls };
    }

    collectOperationalHours(formContainer) {
      const hoursTableRows = formContainer.querySelectorAll('.hours-table tbody tr');
      const operationalHours = {};
  
      hoursTableRows.forEach(row => {
          const day = row.cells[0].textContent.trim();
          const hours = row.cells[1].querySelector('input').value.trim();
          operationalHours[day] = hours;
      });
  
      return operationalHours;
    }

    setActiveTab(tabId) {
        const links = document.querySelectorAll('.tab-links a');
        links.forEach(link => {
            if (link.href.endsWith(`#${tabId}`) || link.href.includes('#businesses/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    showEditBusiness(id) {
        const contentArea = document.querySelector('.tab-content');
        if (!contentArea) {
            console.error("Content area element not found");
            return;
        }
    
        console.log('Combined data:', this.store.getState().data.combined);
        console.log(`Looking for business with ID: ${id}`);
    
        const businessId = String(id);
        const businessData = this.store.getState().data.combined.find(business => String(business.business_id) === businessId);
        
        if (!businessData) {
            console.error(`Business with ID ${id} not found in store`);
            return;
        }
    
        contentArea.innerHTML = eatForm();  // Assuming we're editing an "Eat" type business
        setTimeout(() => {
            this.initializeForm(contentArea, 'eat', initializeEatForm, businessData);
        }, 100);
    
        this.setActiveTab(`businesses/edit/${id}`);
    }    
}

export default BusinessesTab;
