// src/services/api.ts
import axios from 'axios';

const BACKUP_URL = 'https://backvina-1.onrender.com/api';
const PRIMARY_URL = 'https://hood-matrix-tucson-kingdom.trycloudflare.com/api';

let useBackup = false;

const api = axios.create({
  baseURL: PRIMARY_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 502 || error.response?.status === 504) {
      if (!useBackup) {
        useBackup = true;
        console.log('Backend VPS indisponible, bascule vers Render');
        api.defaults.baseURL = BACKUP_URL;
        return api.request(error.config);
      }
    }
    if (error.response?.status === 401) console.log('Non authentifié');
    return Promise.reject(error);
  }
);

export default api;