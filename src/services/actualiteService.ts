// src/services/actualiteService.ts
import api from './api';

export interface Actualite {
  id: number;
  titreFr: string;
  titreEn: string;
  contenuFr: string;
  contenuEn: string;
  type: 'evenement' | 'nouvelle' | 'rapport';
  datePublication: string;
  dateEvenement?: string;
  lieu?: string;
  imageUrl?: string;
  important: boolean;
  createdAt: string;
  updatedAt: string;
}

class ActualiteService {
  async getAllActualites(): Promise<Actualite[]> {
    try {
      const response = await api.get('/actualites');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error);
      throw error;
    }
  }

  async getActualiteById(id: number): Promise<Actualite> {
    try {
      const response = await api.get(`/actualites/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'actualité ${id}:`, error);
      throw error;
    }
  }

  async getActualitesImportantes(): Promise<Actualite[]> {
    try {
      const response = await api.get('/actualites/importantes');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités importantes:', error);
      throw error;
    }
  }

  async getActualitesByType(type: string): Promise<Actualite[]> {
    try {
      const response = await api.get(`/actualites/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des actualités par type ${type}:`, error);
      throw error;
    }
  }

  async createActualite(formData: FormData): Promise<Actualite> {
    try {
      const response = await api.post('/actualites', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'actualité:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création';
      throw new Error(errorMessage);
    }
  }

  async updateActualite(id: number, formData: FormData): Promise<Actualite> {
    try {
      const response = await api.put(`/actualites/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour de l'actualité ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      throw new Error(errorMessage);
    }
  }

  async deleteActualite(id: number): Promise<void> {
    try {
      await api.delete(`/actualites/${id}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression de l'actualité ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      throw new Error(errorMessage);
    }
  }
}

export default new ActualiteService();