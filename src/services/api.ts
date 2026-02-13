// src/services/api.ts
import axios from 'axios';

// Configuration axios
const api = axios.create({
  baseURL: 'http://localhost:5005/api',
  withCredentials: true,
});

// Pas besoin d'ajouter Content-Type pour FormData, axios le fait automatiquement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Non authentifié (401)');
      // Redirection gérée par le ProtectedRoute
    }
    return Promise.reject(error);
  }
);

export default api;