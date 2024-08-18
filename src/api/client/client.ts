import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../../../config';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if(!token || !userId){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/auth/login';
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (userId) {
    // For GET requests, add userId to params
    if (config.method?.toLowerCase() === 'get' || config.method?.toLowerCase()==='delete') {
      config.params = { ...config.params, userId };
    } 
    // For other methods (POST, PUT, PATCH, DELETE), add userId to data
    else {
      if (config.headers['Content-Type'] === 'application/json') {
        config.data = JSON.stringify({
          ...(typeof config.data === 'object' ? config.data : {}),
          userId,
        });
      } else if (config.data instanceof FormData) {
        config.data.append('userId', userId);
      } else {
        config.data = { ...(config.data || {}), userId };
      }
    }
  }

  console.log('Request config:', config);  // For debugging

  return config;
});

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default client;