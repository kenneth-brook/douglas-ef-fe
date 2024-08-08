class ApiService {
  constructor() {
    this.baseURL = 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/';
  }

  async fetch(url, options = {}) {
    options.credentials = 'include';

    try {
      const response = await fetch(this.baseURL + url, options);

      if (response.status === 401) {
        this.handleAuthError();
        throw new Error('Unauthorized');
      }

      const responseBody = await response.text();
      console.log('Raw response:', responseBody); // Debugging statement

      try {
        return JSON.parse(responseBody);
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        throw new Error(`Response is not valid JSON: ${responseBody}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  handleAuthError() {
    document.cookie = 'token=; Max-Age=0; path=/; domain=' + window.location.hostname;
    window.location.href = '../';
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
