import api from './api';
import type { 
  User, 
  UserCreateData, 
  UserUpdateData 
} from '../types/api';

class UserService {
  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get('/auth/users');
      console.log('Get all users response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.users)) {
        return response.data.users;
      }
      
      return [];
    } catch (error: any) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  // Créer un nouvel utilisateur
  async createUser(data: UserCreateData): Promise<User> {
    const formData = new FormData();
    formData.append('nom', data.nom);
    formData.append('email', data.email);
    formData.append('motDePasse', data.motDePasse);
    formData.append('role', data.role);
    if (data.photoFile) {
      formData.append('photoFile', data.photoFile);
    }

    try {
      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Create user response:', response.data);
      
      if (response.data.success && response.data.user) {
        return response.data.user;
      }
      throw new Error(response.data.message || 'Erreur lors de la création');
    } catch (error: any) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(id: number, data: UserUpdateData): Promise<User> {
    try {
      const response = await api.put(`/auth/users/${id}`, data);
      console.log('Update user response:', response.data);
      
      if (response.data.success && response.data.user) {
        return response.data.user;
      }
      throw new Error(response.data.message || 'Erreur lors de la mise à jour');
    } catch (error: any) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Activer un utilisateur
  async activateUser(id: number): Promise<boolean> {
    try {
      const response = await api.post(`/auth/users/${id}/activate`);
      console.log('Activate user response:', response.data);
      return response.data.success === true;
    } catch (error: any) {
      console.error('Activate user error:', error);
      throw error;
    }
  }

  // Désactiver un utilisateur
  async desactivateUser(id: number): Promise<boolean> {
    try {
      const response = await api.post(`/auth/users/${id}/desactivate`);
      console.log('Desactivate user response:', response.data);
      return response.data.success === true;
    } catch (error: any) {
      console.error('Desactivate user error:', error);
      throw error;
    }
  }

  // Récupérer l'utilisateur courant
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get('/auth/me');
      console.log('Get current user response:', response.data);
      
      if (response.data.success && response.data.user) {
        return response.data.user;
      }
      return null;
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Mettre à jour le profil
  async updateProfile(data: FormData): Promise<User> {
    try {
      const response = await api.put('/auth/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Update profile response:', response.data);
      
      if (response.data.success && response.data.user) {
        return response.data.user;
      }
      throw new Error(response.data.message || 'Erreur lors de la mise à jour du profil');
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur avec photo
  async updateUserWithPhoto(id: number, data: FormData): Promise<User> {
    try {
      const response = await api.put(`/auth/users/${id}/with-photo`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Update user with photo response:', response.data);
      
      if (response.data.success && response.data.user) {
        return response.data.user;
      }
      throw new Error(response.data.message || 'Erreur lors de la mise à jour');
    } catch (error: any) {
      console.error('Update user with photo error:', error);
      throw error;
    }
  }

  // Changer le mot de passe
  async changePassword(nouveauMotDePasse: string): Promise<boolean> {
    try {
      const response = await api.post('/auth/change-password', { nouveauMotDePasse });
      console.log('Change password response:', response.data);
      return response.data.success === true;
    } catch (error: any) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}

export default new UserService();