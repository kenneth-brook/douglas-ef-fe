import ApiService from '../../../../services/apiService.js';
import { attachCoordinatesHandler } from './coordinatesHandler.js';
import { attachSocialMediaHandler } from './socialMediaHandler.js';
import { attachLogoUploadHandler } from './logoUploadHandler.js';
import { attachImageUploadHandler } from './imageUploadHandler.js';
import { initializeTinyMCE } from './tinyMCEInitializer.js';
import { handleAutofill } from './addressUtils.js';
import { selectOnlyThis } from './formUtils.js';

const apiService = new ApiService();

export const initializeEventForm = async (formContainer, apiService, event = null) => {
    attachCoordinatesHandler(formContainer);
    attachSocialMediaHandler(formContainer);
    attachLogoUploadHandler(formContainer);
    attachImageUploadHandler(formContainer);
    initializeTinyMCE('#description');

    // If event data is provided, populate the form with it
    if (event) {
        console.log("Populating form with event data:", event);
        
        formContainer.querySelector('#eventName').value = event.name || '';
        formContainer.querySelector('#streetAddress').value = event.street_address || '';
        formContainer.querySelector('#city').value = event.city || '';
        formContainer.querySelector('#state').value = event.state || '';
        formContainer.querySelector('#zipCode').value = event.zip || '';
        formContainer.querySelector('#latitude').value = event.lat || '';
        formContainer.querySelector('#longitude').value = event.long || '';
        formContainer.querySelector('#startDate').value = event.start_date ? new Date(event.start_date).toISOString().split('T')[0] : '';
        formContainer.querySelector('#endDate').value = event.end_date ? new Date(event.end_date).toISOString().split('T')[0] : '';
        formContainer.querySelector('#startTime').value = event.start_time || '';
        formContainer.querySelector('#endTime').value = event.end_time || '';
        formContainer.querySelector('#phone').value = event.phone || '';
        formContainer.querySelector('#email').value = event.email || '';
        formContainer.querySelector('#website').value = event.web || '';
        formContainer.querySelector('#description').value = event.description || '';
        // Populate other fields as necessary, like logo and social media
    } else {
        console.log("No event data provided to populate the form.");
    }

    // Additional handlers that need to be directly connected
    formContainer.querySelector('#autofill-button').addEventListener('click', handleAutofill);

    formContainer.querySelectorAll('input[name="groupName"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => selectOnlyThis(checkbox, 'groupName', someCallbackFunction));
    });

    const submitButton = formContainer.querySelector('#submitEventButton');
    const eventForm = formContainer.querySelector('#event-form');

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Submit button clicked and default prevented');
        
        tinymce.triggerSave(); // Ensure TinyMCE content is saved to the textarea

        const formData = new FormData(eventForm);

        const logoUrl = formContainer.logoUrl || '';
        const imageUrls = formContainer.imageUrls || [];

        formData.append('logoUrl', logoUrl);
        formData.append('imageUrls', JSON.stringify(imageUrls));

        const socialMediaPairs = formContainer.socialMediaPairs || [];
        formData.append('socialMedia', JSON.stringify(socialMediaPairs));

        if (event) {
            formData.append('id', event.id);  // Append ID for the update case
        }

        try {
            const response = event 
                ? await apiService.updateEvent(formData)  // Update existing event
                : await apiService.submitEventForm(formData);  // Create new event

            console.log('Event form submitted successfully', response);
            // Optionally navigate to the list view after successful submission
        } catch (error) {
            console.error('Error submitting event form:', error);
        }
    });
};
