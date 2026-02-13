// src/services/temoignageService.ts
import api from './api';

export interface Temoignage {
  id: number;
  auteurFr: string;
  auteurEn: string;
  fonctionFr: string;
  fonctionEn: string;
  contenuFr: string;
  contenuEn: string;
  photoUrl?: string;
  videoUrl?: string;
  typeTemoignage: 'PHOTO' | 'VIDEO' | 'PHOTO_VIDEO';
  datePublication: string;
  actif: boolean;
  ordreAffichage?: number;
  createdAt: string;
  updatedAt: string;
}

class TemoignageService {
  async getAllTemoignages(): Promise<Temoignage[]> {
    try {
      const response = await api.get('/temoignages');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des témoignages:', error);
      throw error;
    }
  }

  async getTemoignagesActifs(): Promise<Temoignage[]> {
    try {
      const response = await api.get('/temoignages/actifs');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des témoignages actifs:', error);
      throw error;
    }
  }

  async getTemoignagesByType(type: string): Promise<Temoignage[]> {
    try {
      const response = await api.get(`/temoignages/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des témoignages de type ${type}:`, error);
      throw error;
    }
  }

  async getTemoignageById(id: number): Promise<Temoignage> {
    try {
      const response = await api.get(`/temoignages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du témoignage ${id}:`, error);
      throw error;
    }
  }

  async createTemoignage(formData: FormData): Promise<Temoignage> {
    try {
      const response = await api.post('/temoignages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du témoignage:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création';
      throw new Error(errorMessage);
    }
  }

  async updateTemoignage(id: number, formData: FormData): Promise<Temoignage> {
    try {
      const response = await api.put(`/temoignages/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du témoignage ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      throw new Error(errorMessage);
    }
  }

  async deleteTemoignage(id: number): Promise<void> {
    try {
      await api.delete(`/temoignages/${id}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du témoignage ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      throw new Error(errorMessage);
    }
  }
}

export default new TemoignageService();