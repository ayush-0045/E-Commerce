// API Configuration
export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/api/users/register`,
  LOGIN: `${API_BASE_URL}/api/users/login`,
};

const config = {
  API_BASE_URL,
  API_ENDPOINTS,
};

export default config;
