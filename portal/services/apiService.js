class ApiService {
  constructor() {
    this.baseURL = 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/';
  }

  async fetch(url, options = {}) {
    options.credentials = 'include';  // Ensure credentials are included in every request

    console.log(`Making request to: ${this.baseURL + url}`, options);

    try {
      const response = await fetch(this.baseURL + url, options);

      if (response.status === 401) {
        // Handle unauthorized response
        this.handleAuthError();
        throw new Error('Unauthorized');
      }

      const responseBody = await response.text();
      console.log('Response Body:', responseBody);

      try {
        return JSON.parse(responseBody);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', responseBody);
        throw jsonError;
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  handleAuthError() {
    // Clear any stored authentication data
    document.cookie = 'token=; Max-Age=0; path=/; domain=' + window.location.hostname;
    // Redirect to login page
    window.location.href = '../';
  }

  async createBusiness(data) {
    return this.fetch('form-submission', {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  async submitEatForm(formData) {
    const response = await this.fetch('eat-form-submission', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    return response;
  }
}

export default ApiService;
