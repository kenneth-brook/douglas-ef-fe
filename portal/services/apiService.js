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

  async updateBusiness(businessId, data) {
    return this.fetch(`form-submission/${businessId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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

  async updateEatForm(eatFormId, formData) {
    console.log('Menu Types before update:', formData.menuTypes);
    const response = await this.fetch(`eat-form-submission/${eatFormId}`, {
        method: 'PUT',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });
    return response;
}

  async submitPlayForm(formData) {
    const response = await this.fetch('play-form-submission', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    return response;
  }

  async submitShopForm(formData) {
    const response = await this.fetch('shop-form-submission', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    return response;
  }

  async submitStayForm(formData) {
    const response = await this.fetch('stay-form-submission', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    return response;
  }

  async fetchData() {
    const endpoints = {
      eat: `${this.baseURL}data/eat`,
      stay: `${this.baseURL}data/stay`,
      play: `${this.baseURL}data/play`,
      shop: `${this.baseURL}data/shop`,
      events: `${this.baseURL}get-events`
    };

    const fetchEndpointData = async (endpoint) => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    };

    try {
      const results = await Promise.all(Object.keys(endpoints).map(async (key) => {
        const result = await fetchEndpointData(endpoints[key]);
        if (key !== 'events') {
          return { key, data: result.map(item => ({ ...item, type: key, name: item.name.replace(/['"]/g, '') })) };
        } else {
          return { key, data: result.map(item => ({ ...item, type: 'events', name: item.name.replace(/['"]/g, ''), start_date: new Date(item.start_date) })) };
        }
      }));

      const dataMap = results.reduce((acc, { key, data }) => {
        if (key === 'events') {
          const today = new Date();
          acc[key] = data.filter(event => new Date(event.start_date) >= today).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        } else {
          acc[key] = data.sort((a, b) => a.name.localeCompare(b.name));
        }
        return acc;
      }, {});

      dataMap.combined = [...dataMap.eat, ...dataMap.stay, ...dataMap.play, ...dataMap.shop].sort((a, b) => a.name.localeCompare(b.name));

      return dataMap;
    } catch (error) {
      throw error;
    }
  }
}

export default ApiService;
