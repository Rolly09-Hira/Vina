// src/services/partenaireService.ts
import api from './api';

export interface Partenaire {
  id: number;
  nom: string;
  type: 'entreprise' | 'individu' | 'association' | 'institution';
  logoUrl?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  siteWeb?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  dateDebutPartenaire: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

class PartenaireService {
  async getAllPartenaires(): Promise<Partenaire[]> {
    try {
      const response = await api.get('/partenaires');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des partenaires:', error);
      throw error;
    }
  }

  async getPartenaireById(id: number): Promise<Partenaire> {
    try {
      const response = await api.get(`/partenaires/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du partenaire ${id}:`, error);
      throw error;
    }
  }

  async getPartenairesActifs(): Promise<Partenaire[]> {
    try {
      const response = await api.get('/partenaires/actifs');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des partenaires actifs:', error);
      throw error;
    }
  }

  async createPartenaire(formData: FormData): Promise<Partenaire> {
    try {
      const response = await api.post('/partenaires', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du partenaire:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création';
      throw new Error(errorMessage);
    }
  }

  async updatePartenaire(id: number, formData: FormData): Promise<Partenaire> {
    try {
      const response = await api.put(`/partenaires/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du partenaire ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      throw new Error(errorMessage);
    }
  }

  async deletePartenaire(id: number): Promise<void> {
    try {
      await api.delete(`/partenaires/${id}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du partenaire ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      throw new Error(errorMessage);
    }
  }
}

export default new PartenaireService();