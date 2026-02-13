// src/services/contactInfoService.ts
import api from './api';

export interface ContactInfo {
  id: number;
  titre: string;
  valeur: string;
  icone?: string;
  typeContact: 'telephone' | 'email' | 'adresse' | 'reseau_social';
  lien?: string;
  ordreAffichage?: number;
  actif: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  type?: string;
}

export interface ContactInfoRequest {
  titre: string;
  valeur: string;
  icone?: string;
  typeContact: 'telephone' | 'email' | 'adresse' | 'reseau_social';
  lien?: string;
  ordreAffichage?: number;
  actif?: boolean;
}

class ContactInfoService {
  async getAllContactInfos(): Promise<ContactInfo[]> {
    try {
      const response = await api.get<ApiResponse<ContactInfo[]>>('/contact-infos');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
      throw error;
    }
  }

  async getAllContactsWithDetails(): Promise<ContactInfo[]> {
    try {
      const response = await api.get<ApiResponse<ContactInfo[]>>('/contact-infos');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
      throw error;
    }
  }

  async getContactInfoById(id: number): Promise<ContactInfo> {
    try {
      const response = await api.get<ApiResponse<ContactInfo>>(`/contact-infos/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contact ${id}:`, error);
      throw error;
    }
  }

  async getContactsByType(type: string): Promise<ContactInfo[]> {
    try {
      const response = await api.get<ApiResponse<ContactInfo[]>>(`/contact-infos/type/${type}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des contacts de type ${type}:`, error);
      throw error;
    }
  }

  async getTelephones(): Promise<ContactInfo[]> {
    try {
      const response = await api.get<ApiResponse<ContactInfo[]>>('/contact-infos/telephones');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des téléphones:', error);
      throw error;
    }
  }

  async getEmails(): Promise<ContactInfo[]> {
    try {
      const response = await api.get<ApiResponse<ContactInfo[]>>('/contact-infos/emails');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des emails:', error);
      throw error;
    }
  }

  async getReseauxSociaux(): Promise<ContactInfo[]> {
    try {
      const response = await api.get<ApiResponse<ContactInfo[]>>('/contact-infos/reseaux-sociaux');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des réseaux sociaux:', error);
      throw error;
    }
  }

  async getAdresses(): Promise<ContactInfo[]> {
    try {
      const response = await api.get<ApiResponse<ContactInfo[]>>('/contact-infos/adresses');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des adresses:', error);
      throw error;
    }
  }

  async createContactInfo(contactData: ContactInfoRequest): Promise<ContactInfo> {
    try {
      const response = await api.post<ApiResponse<ContactInfo>>('/contact-infos', contactData);
      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du contact:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création';
      throw new Error(errorMessage);
    }
  }

  async updateContactInfo(id: number, contactData: ContactInfoRequest): Promise<ContactInfo> {
    try {
      const response = await api.put<ApiResponse<ContactInfo>>(`/contact-infos/${id}`, contactData);
      return response.data.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du contact ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      throw new Error(errorMessage);
    }
  }

  async deleteContactInfo(id: number): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>(`/contact-infos/${id}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du contact ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      throw new Error(errorMessage);
    }
  }

  async toggleActif(id: number): Promise<ContactInfo> {
    try {
      const response = await api.patch<ApiResponse<ContactInfo>>(`/contact-infos/${id}/toggle-actif`);
      return response.data.data;
    } catch (error: any) {
      console.error(`Erreur lors du changement de statut du contact ${id}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du changement de statut';
      throw new Error(errorMessage);
    }
  }
}

export default new ContactInfoService();