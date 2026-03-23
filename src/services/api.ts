// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backvina.onrender.com/api',  // URL de render
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Non authentifié (401)');
      // Tu peux rediriger vers login si nécessaire
    }
    if (error.code === 'ERR_NETWORK') {
      console.log('Problème de connexion au backend');
    }
    return Promise.reject(error);
  }
);

export default api;