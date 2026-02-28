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

  // Créer un nouvel utilisateur (méthode originale avec objet)
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

  // NOUVELLE MÉTHODE: Créer un utilisateur avec FormData pré-construit
  async createUserWithFormData(formData: FormData): Promise<User> {
    try {
      // Debug - voir ce qui est envoyé
      console.log('Sending to backend (create):');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1] instanceof File ? pair[1].name : pair[1]);
      }

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
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'erreur
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        console.error('Error data:', error.response.data);
        console.error('Error data (stringified):', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error('No response received:', error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Error message:', error.message);
      }
      throw error;
    }
  }

  // Mettre à jour un utilisateur (sans photo)
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

  // Mettre à jour un utilisateur avec photo
  async updateUserWithPhoto(id: number, data: FormData): Promise<User> {
    try {
      // Debug - voir ce qui est envoyé
      console.log('Sending to backend (update with photo):');
      for (let pair of data.entries()) {
        console.log(pair[0] + ':', pair[1] instanceof File ? pair[1].name : pair[1]);
      }

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
      
      // AFFICHAGE DÉTAILLÉ DE L'ERREUR
      if (error.response) {
        console.log('===== DÉTAILS DE L\'ERREUR 400 =====');
        console.log('Status:', error.response.status);
        console.log('Headers:', error.response.headers);
        console.log('Data:', error.response.data);
        
        // Essayer de parser si c'est une chaîne JSON
        if (typeof error.response.data === 'string') {
          try {
            const parsed = JSON.parse(error.response.data);
            console.log('Parsed error data:', parsed);
          } catch (e) {
            console.log('Raw error string:', error.response.data);
          }
        }
        
        // Afficher les champs spécifiques
        if (error.response.data?.message) {
          console.log('Error message:', error.response.data.message);
        }
        if (error.response.data?.error) {
          console.log('Error:', error.response.data.error);
        }
        if (error.response.data?.errors) {
          console.log('Validation errors:', error.response.data.errors);
        }
        console.log('=====================================');
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
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