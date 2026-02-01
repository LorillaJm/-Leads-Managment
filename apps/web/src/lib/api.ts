const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api/v1${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...options.headers,
      },
      credentials: 'include', // Include cookies for refresh token
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    if (!params) {
      return this.request('/users');
    }
    
    // Filter out undefined/null/empty values
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredParams[key] = String(value);
      }
    });
    
    const queryString = Object.keys(filteredParams).length > 0
      ? '?' + new URLSearchParams(filteredParams).toString()
      : '';
    
    return this.request(`/users${queryString}`);
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(data: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async resetUserPassword(id: string, temporaryPassword: string) {
    return this.request(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ temporaryPassword }),
    });
  }

  async updateUserStatus(id: string, status: string) {
    return this.request(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getSalesConsultants() {
    return this.request('/users/sales-consultants');
  }

  // Lead endpoints
  async getLeads(params?: {
    page?: number | string;
    limit?: number | string;
    status?: string;
    source?: string;
    interestedModel?: string;
    assignedToId?: string;
    search?: string;
  }) {
    if (!params) {
      return this.request('/leads');
    }
    
    // Filter out undefined values
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredParams[key] = String(value);
      }
    });
    
    const queryString = Object.keys(filteredParams).length > 0
      ? '?' + new URLSearchParams(filteredParams).toString()
      : '';
    
    return this.request(`/leads${queryString}`);
  }

  async getLeadById(id: string) {
    return this.request(`/leads/${id}`);
  }

  async createLead(data: any) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLead(id: string, data: any) {
    return this.request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string) {
    return this.request(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  async getLeadStats() {
    return this.request('/leads/stats');
  }

  // Activity endpoints
  async getActivitiesByLeadId(leadId: string) {
    return this.request(`/activities/lead/${leadId}`);
  }

  async createActivity(data: any) {
    return this.request('/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getActivityStats() {
    return this.request('/activities/stats');
  }

  // Closed Deal endpoints
  async getClosedDeals(params?: {
    page?: number | string;
    limit?: number | string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    if (!params) {
      return this.request('/closed-deals');
    }
    
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredParams[key] = String(value);
      }
    });
    
    const queryString = Object.keys(filteredParams).length > 0
      ? '?' + new URLSearchParams(filteredParams).toString()
      : '';
    
    return this.request(`/closed-deals${queryString}`);
  }

  async exportClosedDeals() {
    const url = `${this.baseURL}/api/v1/closed-deals/export`;
    const config: RequestInit = {
      headers: {
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
      },
      credentials: 'include',
    };
    
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    return response.blob();
  }

  // Analytics endpoints
  async getDashboardStats(params?: { startDate?: string; endDate?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/analytics/dashboard${queryString}`);
  }

  async getConversionFunnel() {
    return this.request('/analytics/funnel');
  }

  async getPerformanceMetrics(period?: 'week' | 'month' | 'year') {
    const queryString = period ? `?period=${period}` : '';
    return this.request(`/analytics/performance${queryString}`);
  }

  async getSalesConsultantRankings(compare?: boolean) {
    const queryString = compare ? '?compare=true' : '';
    return this.request(`/analytics/rankings${queryString}`);
  }

  async getPerformanceTrends(period?: 'week' | 'month' | 'year') {
    const queryString = period ? `?period=${period}` : '';
    return this.request(`/analytics/trends${queryString}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Export convenience object for easier imports
export const api = {
  // Auth
  login: (email: string, password: string) => apiClient.login(email, password),
  register: (data: any) => apiClient.register(data),
  logout: () => apiClient.logout(),
  getProfile: () => apiClient.getProfile(),
  
  // Users
  getUsers: (params?: any) => apiClient.getUsers(params),
  getUserById: (id: string) => apiClient.getUserById(id),
  createUser: (data: any) => apiClient.createUser(data),
  updateUser: (id: string, data: any) => apiClient.updateUser(id, data),
  resetUserPassword: (id: string, temporaryPassword: string) => apiClient.resetUserPassword(id, temporaryPassword),
  updateUserStatus: (id: string, status: string) => apiClient.updateUserStatus(id, status),
  getSalesConsultants: () => apiClient.getSalesConsultants(),
  
  // Leads
  getLeads: (params?: any) => apiClient.getLeads(params),
  getLeadById: (id: string) => apiClient.getLeadById(id),
  createLead: (data: any) => apiClient.createLead(data),
  updateLead: (id: string, data: any) => apiClient.updateLead(id, data),
  deleteLead: (id: string) => apiClient.deleteLead(id),
  
  // Activities
  getActivitiesByLeadId: (leadId: string) => apiClient.getActivitiesByLeadId(leadId),
  createActivity: (data: any) => apiClient.createActivity(data),
  
  // Closed Deals
  getClosedDeals: (params?: any) => apiClient.getClosedDeals(params),
  exportClosedDeals: () => apiClient.exportClosedDeals(),
  
  // Analytics
  getDashboardStats: (params?: any) => apiClient.getDashboardStats(params),
  getPerformanceStats: (period?: 'week' | 'month' | 'year') => apiClient.getPerformanceMetrics(period),
  getPerformanceTrends: (period?: 'week' | 'month' | 'year') => apiClient.getPerformanceTrends(period),
  getConversionFunnel: () => apiClient.getConversionFunnel(),
  getSalesConsultantRankings: (compare?: boolean) => apiClient.getSalesConsultantRankings(compare),
};