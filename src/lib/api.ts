// API configuration for unified deployment
export const API_BASE_URL = '';

// Helper function to construct API URLs
export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;