import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import type { User } from '../../types/api';
import UserModal from '../../components/admin/UserModal';
import DeleteConfirmationModal from '../../components/admin/DeleteConfirmationModal';

export default function UtilisateursAdmin() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // États pour les modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'EDITEUR'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIF' | 'INACTIF'>('ALL');

  // Charger les utilisateurs
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await userService.getAllUsers();
      console.log('Users loaded:', usersData);
      
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.error('usersData is not an array:', usersData);
        setUsers([]);
        setError('Format de données incorrect');
      }
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    
    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIF' && user.actif) ||
      (statusFilter === 'INACTIF' && !user.actif);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDesactivateClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDesactivateUser = async () => {
    if (!userToDelete) return;
    
    try {
      const success = await userService.desactivateUser(userToDelete.id);
      if (success) {
        setSuccess(`L'utilisateur ${userToDelete.nom} a été désactivé avec succès`);
        await loadUsers();
      } else {
        setError('Erreur lors de la désactivation');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la désactivation');
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleActivateUser = async (user: User) => {
    try {
      const success = await userService.activateUser(user.id);
      if (success) {
        setSuccess(`L'utilisateur ${user.nom} a été activé avec succès`);
        await loadUsers();
      } else {
        setError('Erreur lors de l\'activation');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'activation');
    }
  };

  const handleModalClose = (reload = false) => {
    setIsModalOpen(false);
    setSelectedUser(null);
    if (reload) {
      loadUsers();
      setSuccess('Utilisateur enregistré avec succès');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const getAvatarUrl = (photoUrl?: string) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http')) {
      return photoUrl;
    }
    return `https://web-production-03b53.up.railway.app/${photoUrl}`;
  };

  const getInitials = (nom: string) => {
    return nom?.charAt(0)?.toUpperCase() || '?';
  };

  return (
    <div className="space-y-6">
      {/* Messages de succès */}
      {success && (
        <div className="bg-olive-nature/20 border-l-4 border-olive-nature p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-olive-nature" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-olive-nature">{success}</p>
            </div>
            <button 
              onClick={() => setSuccess(null)}
              className="ml-auto text-olive-nature hover:text-forest-deep"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-earth-brown/20 border-l-4 border-earth-brown p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-earth-brown" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-earth-brown">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-earth-brown hover:text-forest-deep"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-premium-dark">Gestion des utilisateurs</h1>
          <p className="text-sm text-text-secondary mt-1">
            Gérez les administrateurs et éditeurs de la plateforme
          </p>
        </div>
        <button
          onClick={handleCreateUser}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-medium rounded-lg hover:from-forest-deep hover:to-premium-dark transition-all shadow-md hover-lift"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Nouvel utilisateur
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-warm-white rounded-lg shadow-lg p-5 border border-border-light">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg bg-ultra-light text-text-dark focus:outline-none focus:ring-2 focus:ring-olive-nature focus:border-olive-nature"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="px-3 py-2 border border-border-light rounded-lg bg-ultra-light text-text-dark focus:outline-none focus:ring-2 focus:ring-olive-nature focus:border-olive-nature"
            >
              <option value="ALL">Tous les rôles</option>
              <option value="ADMIN">Administrateurs</option>
              <option value="EDITEUR">Éditeurs</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-3 py-2 border border-border-light rounded-lg bg-ultra-light text-text-dark focus:outline-none focus:ring-2 focus:ring-olive-nature focus:border-olive-nature"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIF">Actifs</option>
              <option value="INACTIF">Inactifs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-warm-white rounded-lg shadow-lg p-5 border border-border-light hover-lift">
          <div className="flex items-center">
            <div className="p-2 bg-olive-nature/20 rounded-lg border border-olive-nature/30">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.5 0c-.66 0-1.293-.14-1.872-.396a6 6 0 01-3.156-5.268 6 6 0 013.156-5.268A5.99 5.99 0 0121 4v1a6 6 0 01-6 6z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-secondary">Total utilisateurs</p>
              <p className="text-2xl font-bold text-premium-dark">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-warm-white rounded-lg shadow-lg p-5 border border-border-light hover-lift">
          <div className="flex items-center">
            <div className="p-2 bg-olive-nature/20 rounded-lg border border-olive-nature/30">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-secondary">Actifs</p>
              <p className="text-2xl font-bold text-olive-nature">{users.filter(u => u.actif).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-warm-white rounded-lg shadow-lg p-5 border border-border-light hover-lift">
          <div className="flex items-center">
            <div className="p-2 bg-sun-gold/20 rounded-lg border border-sun-gold/30">
              <svg className="w-6 h-6 text-sun-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-secondary">Administrateurs</p>
              <p className="text-2xl font-bold text-sun-gold">{users.filter(u => u.role === 'ADMIN').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-warm-white rounded-lg shadow-lg border border-border-light overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-olive-nature border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-text-secondary">Chargement des utilisateurs...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-light">
                <thead className="bg-ultra-light">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-warm-white divide-y divide-border-light">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-border-light mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.5 0c-.66 0-1.293-.14-1.872-.396a6 6 0 01-3.156-5.268 6 6 0 013.156-5.268A5.99 5.99 0 0121 4v1a6 6 0 01-6 6z" />
                          </svg>
                          <p className="text-forest-deep font-medium">Aucun utilisateur trouvé</p>
                          <p className="text-sm text-border-light mt-1">
                            Essayez de modifier vos filtres ou créez un nouvel utilisateur
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-ultra-light transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {getAvatarUrl(user.photoUrl) ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover border border-border-light"
                                  src={getAvatarUrl(user.photoUrl)!}
                                  alt={user.nom}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      const fallback = parent.querySelector('.fallback-avatar');
                                      if (fallback) fallback.classList.remove('hidden');
                                    }
                                  }}
                                />
                              ) : null}
                              <div className={`h-10 w-10 rounded-full bg-gradient-to-r from-olive-nature to-forest-deep flex items-center justify-center ${getAvatarUrl(user.photoUrl) ? 'hidden' : ''} fallback-avatar`}>
                                <span className="text-warm-white font-medium text-sm">
                                  {getInitials(user.nom)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-premium-dark">
                                {user.nom}
                                {user.id === currentUser?.id && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-olive-nature/20 text-olive-nature border border-olive-nature/30">
                                    Vous
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-text-secondary">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-premium-dark">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.role === 'ADMIN'
                              ? 'bg-sun-gold/20 text-sun-gold border-sun-gold/30'
                              : 'bg-water-blue/20 text-water-blue border-water-blue/30'
                          }`}>
                            {user.role === 'ADMIN' ? 'Administrateur' : 'Éditeur'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.actif
                              ? 'bg-olive-nature/20 text-olive-nature border-olive-nature/30'
                              : 'bg-earth-brown/20 text-earth-brown border-earth-brown/30'
                          }`}>
                            {user.actif ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-water-blue hover:text-forest-deep p-1 rounded-md hover:bg-sky-soft/10 transition-colors"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            
                            {user.actif ? (
                              <button
                                onClick={() => handleDesactivateClick(user)}
                                disabled={user.id === currentUser?.id}
                                className={`p-1 rounded-md transition-colors ${
                                  user.id === currentUser?.id
                                    ? 'text-border-light cursor-not-allowed'
                                    : 'text-sun-gold hover:text-earth-brown hover:bg-sun-gold/10'
                                }`}
                                title={user.id === currentUser?.id ? 'Vous ne pouvez pas désactiver votre propre compte' : 'Désactiver'}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(user)}
                                className="text-olive-nature hover:text-forest-deep p-1 rounded-md hover:bg-olive-nature/10 transition-colors"
                                title="Activer"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-ultra-light px-6 py-3 border-t border-border-light">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Affichage de <span className="font-medium text-premium-dark">{filteredUsers.length}</span> sur{' '}
                  <span className="font-medium text-premium-dark">{users.length}</span> utilisateurs
                </p>
                <div className="text-sm text-border-light">
                  Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de création/modification d'utilisateur */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
        currentUserId={currentUser?.id}
        onUserUpdated={loadUsers}
      />

      {/* Modal de confirmation de désactivation */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDesactivateUser}
        title="Désactiver l'utilisateur"
        message={`Êtes-vous sûr de vouloir désactiver l'utilisateur "${userToDelete?.nom}" ?`}
        confirmText="Désactiver"
        confirmButtonClass="bg-sun-gold hover:bg-earth-brown text-warm-white"
      />
    </div>
  );
}