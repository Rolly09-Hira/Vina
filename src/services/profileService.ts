// src/services/profileService.ts
import api from './api';
import type { User } from '../types/api';

class ProfileService {
  // Mettre à jour le profil
  async updateProfile(formData: FormData): Promise<{ success: boolean; user?: User; message: string; emailChanged?: boolean; requireRelogin?: boolean }> {
    try {
      console.log('Updating profile...');
      const response = await api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Update profile response:', response.data);
      
      return {
        success: response.data.success,
        user: response.data.user,
        message: response.data.message,
        emailChanged: response.data.emailChanged,
        requireRelogin: response.data.requireRelogin
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Changer le mot de passe
  async changePassword(nouveauMotDePasse: string): Promise<{ success: boolean; message: string; requireRelogin?: boolean }> {
    try {
      const response = await api.post('/auth/change-password', { nouveauMotDePasse });
      console.log('Change password response:', response.data);
      
      return {
        success: response.data.success,
        message: response.data.message,
        requireRelogin: response.data.requireRelogin
      };
    } catch (error: any) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}

export default new ProfileService();