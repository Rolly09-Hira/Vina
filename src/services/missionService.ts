// src/services/missionService.ts
import api from './api';

export interface Mission {
  id: number;
  titreFr: string;
  titreEn: string;
  sloganFr?: string;
  sloganEn?: string;
  descriptionFr: string;
  descriptionEn: string;
  objectifsFr?: string;
  objectifsEn?: string;
  valeursFr?: string;
  valeursEn?: string;
  iconUrl?: string;
  imageUrl?: string;
  ordreAffichage?: number;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

class MissionService {
  async getAllMissions(): Promise<Mission[]> {
    try {
      const response = await api.get('/missions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des missions:', error);
      throw error;
    }
  }

  async getMissionsActives(): Promise<Mission[]> {
    try {
      const response = await api.get('/missions/actives');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des missions actives:', error);
      throw error;
    }
  }

  async getMissionById(id: number): Promise<Mission> {
    try {
      const response = await api.get(`/missions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la mission ${id}:`, error);
      throw error;
    }
  }

  async createMission(formData: FormData): Promise<Mission> {
    try {
      const response = await api.post('/missions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de la mission:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création';
      throw new Error(errorMessage);
    }
  }

  async updateMission(id: number, formData: FormData): Promise<Mission> {
    try {
      const response = await api.put(`/missions/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour de la mission ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      throw new Error(errorMessage);
    }
  }

  async deleteMission(id: number): Promise<void> {
    try {
      await api.delete(`/missions/${id}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression de la mission ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      throw new Error(errorMessage);
    }
  }
}

export default new MissionService();