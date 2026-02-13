export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'ADMIN' | 'EDITEUR';
  photoUrl?: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  authenticated?: boolean;
  message?: string;
  data?: T;
  user?: T;
  users?: T[];
  count?: number;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface ProfileUpdateData {
  nom?: string;
  email?: string;
  photoFile?: File;
}

export interface UserCreateData {
  nom: string;
  email: string;
  motDePasse: string;
  role: 'ADMIN' | 'EDITEUR';
  photoFile?: File;
}

export interface UserUpdateData {
  nom?: string;
  email?: string;
  role?: 'ADMIN' | 'EDITEUR';
  actif?: boolean;
}

export interface AuthUser {
  id: number;
  nom: string;
  email: string;
  role: 'ADMIN' | 'EDITEUR';
  photoUrl?: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}