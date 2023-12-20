import axios from 'axios';

export const api = axios.create({
  // baseURL: 'https://hotel-booking-api-rho.vercel.app/api', 
  baseURL:"http://localhost:8800/",
  withCredentials: true

});