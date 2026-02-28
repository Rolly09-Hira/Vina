import api from './api';
import type { DonIntentionStats, DonIntentionFilters } from '../types/api';

export const donService = {
  /**
   * CRÉER UNE INTENTION DE DON (PUBLIC)
   * Utilisé par DonSection.tsx pour soumettre le formulaire
   */
  createIntention: async (donData: any) => {
    try {
      const response = await api.post('/dons/intention', donData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'intention de don:', error);
      throw error;
    }
  },

  /**
   * RÉCUPÉRER UNE INTENTION POUR CONFIRMATION (PUBLIC)
   * Utilisé pour la page de confirmation après soumission
   */
  getIntentionForConfirmation: async (id: number) => {
    try {
      const response = await api.get(`/dons/confirmation/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'intention:', error);
      throw error;
    }
  },

  /**
   * RÉCUPÉRER TOUTES LES INTENTIONS (ADMIN)
   * Avec pagination et tri
   */
  getAllIntentions: async (
    page = 0, 
    size = 10, 
    sortBy = 'dateSoumission', 
    sortDirection = 'DESC'
  ) => {
    try {
      const response = await api.get('/admin/dons/intentions', {
        params: { page, size, sortBy, sortDirection }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des intentions:', error);
      throw error;
    }
  },

  /**
   * RÉCUPÉRER UNE INTENTION PAR ID (ADMIN)
   * Pour afficher les détails dans le modal
   */
  getIntentionById: async (id: number) => {
    try {
      const response = await api.get(`/admin/dons/intentions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'intention ${id}:`, error);
      throw error;
    }
  },

  /**
   * METTRE À JOUR LE STATUT D'UNE INTENTION (ADMIN)
   * Utilisé dans DonIntentionModal.tsx
   */
  updateStatut: async (id: number, statut: string, notes?: string) => {
    try {
      const response = await api.put(`/admin/dons/intentions/${id}/statut`, {
        statut,
        notes
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de l'intention ${id}:`, error);
      throw error;
    }
  },

  /**
   * AJOUTER DES NOTES INTERNES (ADMIN)
   * Utilisé dans DonIntentionModal.tsx
   */
  addNotes: async (id: number, notes: string) => {
    try {
      const response = await api.post(`/admin/dons/intentions/${id}/notes`, { notes });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout de notes à l'intention ${id}:`, error);
      throw error;
    }
  },

  /**
   * OBTENIR LES STATISTIQUES POUR LE DASHBOARD (ADMIN)
   * Utilisé dans DonsAdmin.tsx et StatsContext.tsx
   */
  getStatistiques: async () => {
    try {
      const response = await api.get('/admin/dons/intentions/stats');
      return response.data as DonIntentionStats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  /**
   * RECHERCHE AVANCÉE AVEC FILTRES (ADMIN)
   * Utilisé dans DonsAdmin.tsx pour filtrer les intentions
   */
  rechercherIntentions: async (
    filters: DonIntentionFilters, 
    page = 0, 
    size = 10
  ) => {
    try {
      // Nettoyer les filtres vides
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      );
      
      const response = await api.get('/admin/dons/intentions/recherche', {
        params: { ...cleanFilters, page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'intentions:', error);
      throw error;
    }
  },

  /**
   * EXPORTER LES INTENTIONS EN CSV (ADMIN)
   * Pour télécharger les données
   */
  exporterIntentions: async (filters?: DonIntentionFilters) => {
    try {
      const response = await api.get('/admin/dons/intentions/export', {
        params: filters,
        responseType: 'blob' // Important pour les fichiers
      });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dons_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'export des intentions:', error);
      throw error;
    }
  },

  /**
   * SUPPRIMER UNE INTENTION (ADMIN - OPTIONNEL)
   * À utiliser avec précaution
   */
  deleteIntention: async (id: number) => {
    try {
      const response = await api.delete(`/admin/dons/intentions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'intention ${id}:`, error);
      throw error;
    }
  }
};