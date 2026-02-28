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

// Ajouter à la fin du fichier api.ts existant

export interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  poste: string;
  departement?: string;
  dateEmbauche?: string;
  biographieFr?: string;
  biographieEn?: string;
  specialites?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  ordreAffichage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonnelCreateData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  poste: string;
  departement?: string;
  dateEmbauche?: string;
  biographieFr?: string;
  biographieEn?: string;
  specialites?: string;
  photoFile?: File;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  ordreAffichage?: number;
}

export interface PersonnelUpdateData {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  poste?: string;
  departement?: string;
  dateEmbauche?: string;
  biographieFr?: string;
  biographieEn?: string;
  specialites?: string;
  photoFile?: File;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  ordreAffichage?: number;
}

// Ajoutez ces nouvelles interfaces pour les dons
// src/types/api.ts

export interface DonIntention {
  id: number;
  nomComplet: string;
  email: string;
  telephone: string;
  montant?: number;
  montantType?: 'FIXE' | 'LIBRE';
  modePaiementSouhaite?: 'WAVE' | 'ORANGE_MONEY' | 'FREE_MONEY' | 'VIREMENT' | 'CHEQUE' | 'ESPECES' | 'AUTRE';
  message?: string;
  statut: 'EN_ATTENTE' | 'CONTACTE' | 'CONVERTI' | 'PERDU' | 'REPORTE';
  dateSoumission: string;
  dateContact?: string;
  dateConversion?: string;
  notesInternes?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  ipAddress?: string;
  userAgent?: string;
  pays?: string;
  ville?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DonIntentionStats {
  totalIntentions: number;
  enAttente: number;
  contactes: number;
  convertis: number;
  perdus: number;
  montantTotalConverti: number;
  montantMoyenConverti: number;
  tauxConversion: number;
  intentionsParSource: Record<string, number>;
  intentionsParModePaiement: Record<string, number>;
  intentionsParMois: Record<string, number>;
}

export interface DonIntentionFilters {
  nom?: string;
  email?: string;
  statut?: string;
  dateDebut?: string;
  dateFin?: string;
  modePaiement?: string;
  utmSource?: string;
}

// Réponse paginée du backend
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}