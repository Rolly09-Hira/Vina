// src/services/regionService.ts
import api from './api';

export interface Region {
  id: number;
  nom: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegionFormData {
  nom: string;
  description?: string;
}

class RegionService {
  private baseUrl = '/regions';

  async getAllRegions(): Promise<Region[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des régions:', error);
      throw error;
    }
  }

  async getRegionById(id: number): Promise<Region> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la région ${id}:`, error);
      throw error;
    }
  }

  async createRegion(regionData: RegionFormData): Promise<Region> {
    try {
      const response = await api.post(this.baseUrl, regionData);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de la région:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création';
      throw new Error(errorMessage);
    }
  }

  async updateRegion(id: number, regionData: RegionFormData): Promise<Region> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, regionData);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour de la région ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      throw new Error(errorMessage);
    }
  }

  async deleteRegion(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression de la région ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      throw new Error(errorMessage);
    }
  }

  async searchRegions(query: string): Promise<Region[]> {
    try {
      const response = await api.get(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de régions:', error);
      throw error;
    }
  }
}

export default new RegionService();