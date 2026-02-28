// src/pages/admin/Profile.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import profileService from '../../services/profileService';
import PasswordChangeModal from '../../components/admin/PasswordChangeModal';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showReconnectMessage, setShowReconnectMessage] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
      });
      
      if (user.photoUrl) {
        const photoUrl = user.photoUrl.startsWith('http') 
          ? user.photoUrl 
          : `http://localhost:5005/${user.photoUrl}`;
        setPhotoPreview(photoUrl);
      } else {
        setPhotoPreview(null);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La photo ne doit pas dépasser 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Le fichier doit être une image');
        return;
      }

      setPhotoFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    if (user?.photoUrl) {
      setPhotoPreview(`http://localhost:5005/${user.photoUrl}`);
    } else {
      setPhotoPreview(null);
    }
  };

  const validateForm = () => {
    if (!formData.nom.trim()) {
      setError('Le nom est obligatoire');
      return false;
    }

    if (!formData.email.trim()) {
      setError("L'email est obligatoire");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email invalide');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setShowReconnectMessage(false);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom.trim());
      formDataToSend.append('email', formData.email.trim().toLowerCase());
      
      if (photoFile) {
        formDataToSend.append('photoFile', photoFile);
      }

      const response = await profileService.updateProfile(formDataToSend);
      
      if (response.success && response.user) {
        updateUser(response.user);
        
        if (response.emailChanged) {
          setSuccessMessage('Profil mis à jour avec succès. Votre email a été changé, mais vous restez connecté.');
        } else {
          setSuccessMessage(response.message || 'Profil mis à jour avec succès');
        }
        
        setPhotoFile(null);
      } else {
        setError(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (newPassword: string): Promise<boolean> => {
    try {
      const response = await profileService.changePassword(newPassword);
      
      if (response.success) {
        setSuccessMessage(response.message);
        
        if (response.requireRelogin) {
          setShowReconnectMessage(true);
          setTimeout(() => {
            logout();
          }, 3000);
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Password change error:', err);
      throw err;
    }
  };

  const getInitials = () => {
    if (formData.nom) {
      return formData.nom.charAt(0).toUpperCase();
    }
    return '?';
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#F2F2E9]">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-[#333333]">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-[#F2F2E9] min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#333333]">Mon Profil</h1>
        <p className="text-sm text-[#333333] mt-1">
          Gérez vos informations personnelles et votre mot de passe
        </p>
      </div>

      {/* Messages de succès (conservés en vert) */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
              {showReconnectMessage && (
                <p className="text-sm text-green-600 mt-1">
                  Vous allez être redirigé vers la page de connexion dans quelques instants...
                </p>
              )}
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Messages d'erreur (conservés en rouge) */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne de gauche - Photo de profil */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-[#333333] mb-4">Photo de profil</h2>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Photo de profil"
                      className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm transition-colors"
                      title="Supprimer la photo"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-full bg-[#6B7333] flex items-center justify-center border-4 border-gray-200">
                    <span className="text-white font-medium text-4xl">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <label className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-[#333333] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0B93B] block text-center transition-colors">
                  <span>Changer la photo</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  JPG, PNG, GIF ou WEBP (max. 5MB)
                </p>
              </div>
            </div>

            {/* Informations sur le rôle */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#333333]">Rôle</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'ADMIN' ? 'Administrateur' : 'Éditeur'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#333333]">Statut</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.actif
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de droite - Formulaire et sécurité */}
        <div className="md:col-span-2 space-y-6">
          {/* Formulaire d'édition */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-[#333333] mb-4">Informations personnelles</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-[#333333] mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E0B93B] focus:border-[#E0B93B]"
                  placeholder="Votre nom"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E0B93B] focus:border-[#E0B93B]"
                  placeholder="votre.email@exemple.com"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Attention : changer votre email vous permettra de rester connecté automatiquement
                </p>
              </div>

              {/* Bouton de mise à jour */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-6 py-2 bg-[#E0B93B] text-white font-medium rounded-lg hover:bg-[#4E5523] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0B93B] disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Mettre à jour le profil
                </button>
              </div>
            </form>
          </div>

          {/* Section sécurité */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-[#333333] mb-4">Sécurité</h2>
            
            <div className="space-y-4">
              {/* Changement de mot de passe */}
              <div>
                <h3 className="text-sm font-medium text-[#333333] mb-2">Mot de passe</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Changez régulièrement votre mot de passe pour sécuriser votre compte
                </p>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-[#333333] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0B93B] transition-colors"
                >
                  Changer le mot de passe
                </button>
                <p className="mt-2 text-xs text-yellow-600">
                  Note : Après un changement de mot de passe, vous serez déconnecté pour des raisons de sécurité
                </p>
              </div>

              {/* Dernière connexion (si disponible) */}
              {user.updatedAt && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Dernière mise à jour : {new Date(user.updatedAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Avertissement sur l'email */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong className="font-medium">Note importante :</strong> Si vous changez votre email, 
                  vous resterez automatiquement connecté avec votre nouvel email. Vous n'aurez pas besoin 
                  de vous reconnecter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de changement de mot de passe */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onChangePassword={handlePasswordChange}
      />
    </div>
  );
}