// Mock API for demo purposes when backend is not available
export const mockApi = {
  // Auth
  login: async () => ({
    success: true,
    data: {
      user: {
        id: '1',
        email: 'demo@example.com',
        fullName: 'Demo User',
        role: 'ADMIN',
        position: 'System Administrator'
      },
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh-token'
    }
  }),

  // Dashboard stats
  getDashboardStats: async () => ({
    success: true,
    data: {
      totalLeads: 150,
      conversionRate: 25,
      activeLeads: 45,
      totalRevenue: 2500000,
      highInterest: 30,
      mediumInterest: 60,
      lowInterest: 60,
      conversionFunnel: [
        { name: 'Visitors', value: 1000, fill: '#3b82f6' },
        { name: 'Inquiries', value: 750, fill: '#10b981' },
        { name: 'Test Drives', value: 500, fill: '#f59e0b' },
        { name: 'Negotiations', value: 250, fill: '#ef4444' },
        { name: 'Closed', value: 100, fill: '#8b5cf6' },
      ],
      vehicleInquiries: [
        { model: 'ATTO 3', count: 45 },
        { model: 'DOLPHIN', count: 32 },
        { model: 'SEAL', count: 28 },
        { model: 'HAN', count: 15 },
      ],
      colorPreferences: [
        { color: 'Black', count: 35 },
        { color: 'White', count: 42 },
        { color: 'Silver', count: 28 },
        { color: 'Blue', count: 18 },
        { color: 'Red', count: 12 },
      ],
      leadsInterest: [
        { level: 'High', count: 45 },
        { level: 'Medium', count: 62 },
        { level: 'Low', count: 28 },
      ],
      leadsSources: [
        { name: 'Website', value: 45 },
        { name: 'Referral', value: 28 },
        { name: 'Social Media', value: 35 },
        { name: 'Walk-in', value: 22 },
        { name: 'Phone', value: 15 },
      ],
      bankPending: 12,
      bankApproved: 45,
      bankRejected: 8,
      bankApprovalRate: 85
    }
  })
};

export const isMockMode = !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL.includes('localhost');
