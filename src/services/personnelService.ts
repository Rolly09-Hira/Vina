import api from './api';
import type { Personnel } from '../types/api';

class PersonnelService {
  // Récupérer tout le personnel
  async getAllPersonnel(): Promise<Personnel[]> {
    try {
      const response = await api.get('/personnel');
      console.log('Get all personnel response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.personnel)) {
        return response.data.personnel;
      }
      
      return [];
    } catch (error: any) {
      console.error('Get all personnel error:', error);
      throw error;
    }
  }

  // Récupérer un membre par ID
  async getPersonnelById(id: number): Promise<Personnel | null> {
    try {
      const response = await api.get(`/personnel/${id}`);
      console.log('Get personnel by id response:', response.data);
      
      if (response.data.success && response.data.personnel) {
        return response.data.personnel;
      }
      return null;
    } catch (error: any) {
      console.error('Get personnel by id error:', error);
      throw error;
    }
  }

  // Récupérer par département
  async getPersonnelByDepartement(departement: string): Promise<Personnel[]> {
    try {
      const response = await api.get(`/personnel/departement/${departement}`);
      console.log('Get personnel by departement response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.personnel)) {
        return response.data.personnel;
      }
      
      return [];
    } catch (error: any) {
      console.error('Get personnel by departement error:', error);
      throw error;
    }
  }

  // Compter le nombre total
  async countPersonnel(): Promise<number> {
    try {
      const response = await api.get('/personnel/count');
      console.log('Count personnel response:', response.data);
      
      if (response.data.success) {
        return response.data.count || 0;
      }
      return 0;
    } catch (error: any) {
      console.error('Count personnel error:', error);
      return 0;
    }
  }

  // Créer un nouveau membre
  async createPersonnel(formData: FormData): Promise<Personnel> {
    try {
      console.log('Sending to backend (create personnel):');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1] instanceof File ? pair[1].name : pair[1]);
      }

      const response = await api.post('/personnel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Create personnel response:', response.data);
      
      if (response.data.success && response.data.personnel) {
        return response.data.personnel;
      }
      throw new Error(response.data.message || 'Erreur lors de la création');
    } catch (error: any) {
      console.error('Create personnel error:', error);
      
      if (error.response) {
        console.log('===== DÉTAILS DE L\'ERREUR =====');
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
      
      throw error;
    }
  }

  // Mettre à jour un membre
  async updatePersonnel(id: number, formData: FormData): Promise<Personnel> {
    try {
      console.log('Sending to backend (update personnel):');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1] instanceof File ? pair[1].name : pair[1]);
      }

      const response = await api.put(`/personnel/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Update personnel response:', response.data);
      
      if (response.data.success && response.data.personnel) {
        return response.data.personnel;
      }
      throw new Error(response.data.message || 'Erreur lors de la mise à jour');
    } catch (error: any) {
      console.error('Update personnel error:', error);
      
      if (error.response) {
        console.log('===== DÉTAILS DE L\'ERREUR =====');
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
      
      throw error;
    }
  }

  // Supprimer un membre
  async deletePersonnel(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/personnel/${id}`);
      console.log('Delete personnel response:', response.data);
      return response.data.success === true;
    } catch (error: any) {
      console.error('Delete personnel error:', error);
      throw error;
    }
  }
}

export default new PersonnelService();