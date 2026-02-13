import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import type { User } from '../../types/api';

export default function Profile() {
  const { user: authUser, checkAuth } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // États pour le formulaire de profil
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    nouveauMotDePasse: '',
    confirmMotDePasse: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // États pour les messages
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les données de l'utilisateur
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      try {
        const userData = await userService.getCurrentUser();
        console.log('Profile user data:', userData);
        
        if (userData) {
          setUser(userData);
          setFormData({
            nom: userData.nom || '',
            email: userData.email || '',
          });
          
          if (userData.photoUrl) {
            const photoUrl = userData.photoUrl.startsWith('http') 
              ? userData.photoUrl 
              : `http://localhost:5005/${userData.photoUrl}`;
            setPhotoPreview(photoUrl);
          }
        }
      } catch (err: any) {
        console.error('Erreur chargement profil:', err);
        setError(err.message || 'Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [authUser]);

  // Gérer le changement des champs du profil
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gérer le changement de photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'La photo ne doit pas dépasser 5MB' }));
        return;
      }
      
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Le fichier doit être une image' }));
        return;
      }

      setPhotoFile(file);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.photo;
        return newErrors;
      });

      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Supprimer la photo
  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(user?.photoUrl ? `http://localhost:5005/${user.photoUrl}` : null);
  };

  // Gérer le changement du mot de passe
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Valider le formulaire de profil
  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom?.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    if (!formData.email?.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (photoFile && !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(photoFile.type)) {
      newErrors.photo = 'Format d\'image non supporté (JPG, PNG, GIF, WEBP)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Valider le formulaire de mot de passe
  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.nouveauMotDePasse) {
      newErrors.nouveauMotDePasse = 'Le nouveau mot de passe est obligatoire';
    } else if (passwordData.nouveauMotDePasse.length < 6) {
      newErrors.nouveauMotDePasse = 'Le mot de passe doit avoir au moins 6 caractères';
    }

    if (!passwordData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'La confirmation est obligatoire';
    } else if (passwordData.nouveauMotDePasse !== passwordData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre la mise à jour du profil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom.trim());
      formDataToSend.append('email', formData.email.trim().toLowerCase());
      
      if (photoFile) {
        formDataToSend.append('photoFile', photoFile);
      }

      const updatedUser = await userService.updateProfile(formDataToSend);
      console.log('Profile updated:', updatedUser);
      
      setSuccess('Profil mis à jour avec succès');
      setIsEditing(false);
      setPhotoFile(null);
      
      // Mettre à jour l'utilisateur local
      setUser(updatedUser);
      
      // Mettre à jour le contexte d'authentification
      await checkAuth();
      
    } catch (err: any) {
      console.error('Profile update error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erreur lors de la mise à jour du profil');
      }
    } finally {
      setLoading(false);
    }
  };

  // Soumettre le changement de mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await userService.changePassword(passwordData.nouveauMotDePasse);
      
      if (success) {
        setSuccess('Mot de passe changé avec succès');
        setIsChangingPassword(false);
        setPasswordData({
          nouveauMotDePasse: '',
          confirmMotDePasse: '',
        });
        setShowPassword(false);
      } else {
        setError('Erreur lors du changement de mot de passe');
      }
    } catch (err: any) {
      console.error('Password change error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erreur lors du changement de mot de passe');
      }
    } finally {
      setLoading(false);
    }
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setIsEditing(false);
    setPhotoFile(null);
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
      });
      if (user.photoUrl) {
        setPhotoPreview(`http://localhost:5005/${user.photoUrl}`);
      } else {
        setPhotoPreview(null);
      }
    }
    setErrors({});
  };

  // Annuler le changement de mot de passe
  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordData({
      nouveauMotDePasse: '',
      confirmMotDePasse: '',
    });
    setShowPassword(false);
    setErrors({});
  };

  // Formater la date
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

  // Obtenir les initiales
  const getInitials = (nom: string) => {
    return nom?.charAt(0)?.toUpperCase() || 'U';
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Chargement du profil...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages de succès */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
            <button 
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-500 hover:text-green-700"
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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gérez vos informations personnelles et votre mot de passe
          </p>
        </div>
        {!isEditing && !isChangingPassword && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier le profil
          </button>
        )}
      </div>

      {/* Cartes du profil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Photo et informations principales */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 px-6 py-8">
              <div className="flex flex-col items-center">
                {photoPreview && !isEditing ? (
                  <img
                    src={photoPreview}
                    alt={user?.nom}
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.fallback-avatar');
                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-lg fallback-avatar">
                    <span className="text-3xl font-bold text-green-600">
                      {user ? getInitials(user.nom) : 'U'}
                    </span>
                  </div>
                )}
                <h2 className="mt-4 text-xl font-bold text-white">{user?.nom}</h2>
                <p className="text-sm text-green-100">
                  {user?.role === 'ADMIN' ? 'Administrateur' : 'Éditeur'}
                </p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium break-all">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Membre depuis</p>
                  <p className="text-sm font-medium">{user ? formatDate(user.createdAt) : ''}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Dernière mise à jour</p>
                  <p className="text-sm font-medium">{user ? formatDate(user.updatedAt) : ''}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Statut du compte</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de droite - Formulaires */}
        <div className="lg:col-span-2 space-y-6">
          {/* Formulaire de modification du profil */}
          {isEditing && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Modifier mes informations</h3>
              </div>
              
              <form onSubmit={handleProfileSubmit} className="p-6">
                {/* Photo de profil */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {photoPreview ? (
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Prévisualisation"
                            className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/64?text=Erreur';
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center">
                          <span className="text-white font-medium text-xl">
                            {formData.nom ? formData.nom.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <label className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <span>Changer la photo</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handlePhotoChange}
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG, GIF ou WEBP (max. 5MB)
                      </p>
                      {errors.photo && (
                        <p className="mt-1 text-xs text-red-600">{errors.photo}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nom */}
                <div className="mb-4">
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleProfileChange}
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.nom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.nom && (
                    <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg hover:from-green-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors flex items-center"
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Formulaire de changement de mot de passe */}
          {!isEditing && !isChangingPassword && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mot de passe</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Changez votre mot de passe régulièrement pour sécuriser votre compte
                    </p>
                  </div>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Changer le mot de passe
                  </button>
                </div>
              </div>
            </div>
          )}

          {isChangingPassword && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Changer mon mot de passe</h3>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="p-6">
                {/* Nouveau mot de passe */}
                <div className="mb-4">
                  <label htmlFor="nouveauMotDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="nouveauMotDePasse"
                      name="nouveauMotDePasse"
                      value={passwordData.nouveauMotDePasse}
                      onChange={handlePasswordChange}
                      className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.nouveauMotDePasse ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.nouveauMotDePasse && (
                    <p className="mt-1 text-xs text-red-600">{errors.nouveauMotDePasse}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 6 caractères
                  </p>
                </div>

                {/* Confirmation */}
                <div className="mb-6">
                  <label htmlFor="confirmMotDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    id="confirmMotDePasse"
                    name="confirmMotDePasse"
                    value={passwordData.confirmMotDePasse}
                    onChange={handlePasswordChange}
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.confirmMotDePasse ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmMotDePasse && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmMotDePasse}</p>
                  )}
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelPassword}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg hover:from-green-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors flex items-center"
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    Changer le mot de passe
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Activité récente</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="p-2 bg-blue-100 rounded-full">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Dernière mise à jour : {user ? formatDate(user.updatedAt) : ''}</span>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Conseil de sécurité</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Pour protéger votre compte, utilisez un mot de passe fort et ne le partagez jamais avec personne.
                      Changez votre mot de passe tous les 3 mois pour une sécurité optimale.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}