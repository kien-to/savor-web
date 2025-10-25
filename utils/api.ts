import axios from 'axios';
import { SurpriseBag, User, Reservation, HomePageData } from '../types';
import { config } from '../config/environment';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHomePageData = async (
  latitude: number,
  longitude: number
): Promise<HomePageData> => {
  console.log('[API] 🚀 getHomePageData called with params:', { latitude, longitude });
  console.log('[API] 🌐 Base URL:', config.apiUrl);
  console.log('[API] 🔗 Full URL will be:', `${config.apiUrl}/api/home?latitude=${latitude}&longitude=${longitude}`);
  
  try {
    const response = await api.get('/api/home', {
      params: { latitude, longitude }
    });
    console.log('[API] ✅ getHomePageData response status:', response.status);
    console.log('[API] 📦 getHomePageData response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] ❌ getHomePageData error:', error);
    if (axios.isAxiosError(error)) {
      console.error('[API] 🔍 Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params,
        baseURL: error.config?.baseURL
      });
    }
    throw error;
  }
};

export const getSurpriseBags = async (): Promise<SurpriseBag[]> => {
  const response = await api.get('/api/bags');
  return response.data;
};

export const getUser = async (userId: string): Promise<User> => {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
};

export const createReservation = async (
  bagId: string,
  userId: string,
  quantity: number
): Promise<Reservation> => {
  const response = await api.post('/api/reservations', {
    bagId,
    userId,
    quantity,
  });
  return response.data;
};

export const getUserReservations = async (userId: string): Promise<Reservation[]> => {
  const response = await api.get(`/api/reservations`);
  const data = response.data;
  
  // Handle new format with currentReservations and pastReservations
  if (data.currentReservations && data.pastReservations) {
    // Combine current and past reservations, current first
    return [...data.currentReservations, ...data.pastReservations];
  }
  
  // If data is already an array, return it (backward compatibility)
  if (Array.isArray(data)) {
    return data;
  }
  
  // If data has a reservations property that's an array, return it (backward compatibility)
  if (data.reservations && Array.isArray(data.reservations)) {
    return data.reservations;
  }
  
  // If we get here, return empty array as fallback
  return [];
}; 