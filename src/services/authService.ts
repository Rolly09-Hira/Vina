import api from './api';
import type { 
  ApiResponse, 
  LoginCredentials,  
  User,
  ProfileUpdateData,
  UserCreateData,
  UserUpdateData 
} from '../types/api';

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
  try {
    console.log('Attempting login with:', credentials.email);
    
    // Utilisez une requête FormData comme le backend Spring Security l'attend
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('motDePasse', credentials.motDePasse);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Login response:', response.data);
    
    // Le backend Spring Security renvoie user dans un objet user
    if (response.data.success && response.data.user) {
      this.setAuthenticated(true);
      return {
        success: true,
        authenticated: true,
        user: response.data.user,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      authenticated: false,
      message: response.data.message || 'Échec de la connexion'
    };
  } catch (error: any) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Échec de la connexion';
    return {
      success: false,
      authenticated: false,
      message: errorMessage
    };
  }
}

  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/logout');
      this.setAuthenticated(false);
      return response.data;
    } catch (error: any) {
      console.error('Logout error:', error);
      this.setAuthenticated(false);
      throw error;
    }
  }

  async checkSession(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get('/auth/check-session');
      console.log('Session check response:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return { 
          success: false, 
          authenticated: false,
          message: 'Non authentifié' 
        };
      }
      console.error('Check session error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.checkSession();
  }

  async updateProfile(data: ProfileUpdateData): Promise<ApiResponse<User>> {
    const formData = new FormData();
    
    if (data.nom) formData.append('nom', data.nom);
    if (data.email) formData.append('email', data.email);
    if (data.photoFile) formData.append('photoFile', data.photoFile);

    try {
      const response = await api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(nouveauMotDePasse: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/change-password', { nouveauMotDePasse });
      return response.data;
    } catch (error: any) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await api.get('/auth/users');
      return response.data;
    } catch (error: any) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  async createUser(data: UserCreateData): Promise<ApiResponse<User>> {
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
      return response.data;
    } catch (error: any) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async updateUser(id: number, data: UserUpdateData): Promise<ApiResponse<User>> {
    try {
      const response = await api.put(`/auth/users/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async activateUser(id: number): Promise<ApiResponse> {
    try {
      const response = await api.post(`/auth/users/${id}/activate`);
      return response.data;
    } catch (error: any) {
      console.error('Activate user error:', error);
      throw error;
    }
  }

  async desactivateUser(id: number): Promise<ApiResponse> {
    try {
      const response = await api.post(`/auth/users/${id}/desactivate`);
      return response.data;
    } catch (error: any) {
      console.error('Desactivate user error:', error);
      throw error;
    }
  }

  async checkAuth(): Promise<ApiResponse> {
    try {
      const response = await api.get('/auth/check');
      return response.data;
    } catch (error) {
      console.error('Check auth error:', error);
      throw error;
    }
  }

  async testLogin(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    try {
      const response = await api.post('/auth/test-login', credentials);
      return response.data;
    } catch (error: any) {
      console.error('Test login error:', error);
      return {
        success: false,
        authenticated: false,
        message: error.response?.data?.message || error.message || 'Échec du test de connexion'
      };
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  setAuthenticated(value: boolean): void {
    if (value) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }
  }
}

export default new AuthService();