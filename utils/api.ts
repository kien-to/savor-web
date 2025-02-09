import axios from 'axios';
import { SurpriseBag, User, Reservation, HomePageData } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHomePageData = async (
  latitude: number,
  longitude: number
): Promise<HomePageData> => {
  const response = await api.get('/api/home', {
    params: { latitude, longitude }
  });
  return response.data;
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
  const response = await api.get(`/api/users/${userId}/reservations`);
  console.log(response.data);
  return response.data;
}; 