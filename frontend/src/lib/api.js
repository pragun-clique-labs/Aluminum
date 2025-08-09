const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Service endpoints
  async getServices() {
    return this.request('/services');
  }

  async getService(serviceId) {
    return this.request(`/services/${serviceId}`);
  }

  async createService(serviceData) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(serviceId, updates) {
    return this.request(`/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteService(serviceId) {
    return this.request(`/services/${serviceId}`, {
      method: 'DELETE',
    });
  }

  async getServiceTemplates() {
    return this.request('/services/templates');
  }

  // Mock data for development (remove when backend is ready)
  getMockServiceMetrics(serviceType) {
    const metrics = {
      'mcp-server': {
        cpu: { current: 23, limit: 50 },
        memory: { current: 187, limit: 512 },
        responseTime: { avg: 142, data: [45, 67, 34, 89, 56, 72, 41, 85, 62, 93, 58, 76] },
        requests: { total: 1247, success: 1198, errors: 49 }
      },
      'ai-agent': {
        cpu: { current: 67, limit: 100 },
        memory: { current: 724, limit: 1024 },
        responseTime: { avg: 2340, data: [2100, 2340, 1980, 2450, 2200, 2380, 2150, 2290, 2420, 2180, 2350, 2500] },
        requests: { total: 456, success: 442, errors: 14 }
      },
      'bundle-mcp': {
        cpu: { current: 12, limit: 25 },
        memory: { current: 98, limit: 256 },
        responseTime: { avg: 67, data: [60, 72, 58, 75, 63, 69, 55, 71, 68, 64, 73, 59] },
        requests: { total: 2341, success: 2298, errors: 43 }
      },
      'secrets-manager': {
        cpu: { current: 8, limit: 25 },
        memory: { current: 145, limit: 256 },
        responseTime: { avg: 45, data: [42, 48, 41, 50, 44, 47, 38, 49, 46, 43, 51, 40] },
        requests: { total: 567, success: 563, errors: 4 }
      }
    };
    return metrics[serviceType] || metrics['mcp-server'];
  }
}

export const apiClient = new ApiClient();
export default apiClient;
