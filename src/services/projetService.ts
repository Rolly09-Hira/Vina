// src/services/projetService.ts
import api from './api';

// Types pour les projets
export interface Projet {
  id: number;
  titreFr: string;
  titreEn: string;
  descriptionFr: string;
  descriptionEn: string;
  objectifFr: string;
  objectifEn: string;
  dateDebut: string;
  dateFin?: string;
  statut: 'en_cours' | 'termine' | 'a_venir' | 'suspendu';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour créer/mettre à jour un projet
export interface ProjetFormData {
  titreFr: string;
  titreEn: string;
  descriptionFr: string;
  descriptionEn: string;
  objectifFr: string;
  objectifEn: string;
  dateDebut: string;
  dateFin?: string;
  statut: 'en_cours' | 'termine' | 'a_venir' | 'suspendu';
  imageFile?: File;
}

class ProjetService {
  async getAllProjets(): Promise<Projet[]> {
    try {
      const response = await api.get('/projets');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw error;
    }
  }

  async getProjetById(id: number): Promise<Projet> {
    try {
      const response = await api.get(`/projets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${id}:`, error);
      throw error;
    }
  }

  async createProjet(formData: FormData): Promise<Projet> {
    try {
      const response = await api.post('/projets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du projet:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création';
      throw new Error(errorMessage);
    }
  }

  async updateProjet(id: number, formData: FormData): Promise<Projet> {
    try {
      const response = await api.put(`/projets/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du projet ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      throw new Error(errorMessage);
    }
  }

  async deleteProjet(id: number): Promise<void> {
    try {
      await api.delete(`/projets/${id}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du projet ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      throw new Error(errorMessage);
    }
  }
}

export default new ProjetService();