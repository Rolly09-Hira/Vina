import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import type { User } from '../../types/api';

interface UserModalProps {
  isOpen: boolean;
  onClose: (reload?: boolean) => void;
  user: User | null;
  currentUserId?: number;
  onUserUpdated?: () => Promise<void>;
}

export default function UserModal({ 
  isOpen, 
  onClose, 
  user, 
  currentUserId,
  onUserUpdated 
}: UserModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'EDITEUR' as 'ADMIN' | 'EDITEUR',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isActif, setIsActif] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
        motDePasse: '',
        role: user.role || 'EDITEUR',
      });
      setIsActif(user.actif !== undefined ? user.actif : true);
      
      if (user.photoUrl) {
        const photoUrl = user.photoUrl.startsWith('http') 
          ? user.photoUrl 
          : `http://localhost:5005/${user.photoUrl}`;
        setPhotoPreview(photoUrl);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setFormData({
        nom: '',
        email: '',
        motDePasse: '',
        role: 'EDITEUR',
      });
      setIsActif(true);
      setPhotoPreview(null);
    }
    setPhotoFile(null);
    setErrors({});
    setSuccessMessage(null);
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'La photo ne doit pas dépasser 5MB' }));
        return;
      }
      
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom?.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    if (!formData.email?.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!user && !formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est obligatoire';
    } else if (formData.motDePasse && formData.motDePasse.length < 6) {
      newErrors.motDePasse = 'Le mot de passe doit avoir au moins 6 caractères';
    }

    if (photoFile && !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(photoFile.type)) {
      newErrors.photo = 'Format d\'image non supporté (JPG, PNG, GIF, WEBP)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage(null);
    
    try {
      if (user) {
        // Mode modification
        if (photoFile) {
          // AVEC PHOTO - Utiliser FormData
          const formDataToSend = new FormData();
          formDataToSend.append('nom', formData.nom.trim());
          formDataToSend.append('email', formData.email.trim().toLowerCase());
          formDataToSend.append('role', formData.role);
          formDataToSend.append('actif', String(isActif));
          formDataToSend.append('photoFile', photoFile);
          
          await userService.updateUserWithPhoto(user.id, formDataToSend);
        } else {
          // SANS PHOTO - Utiliser JSON
          await userService.updateUser(user.id, {
            nom: formData.nom.trim(),
            email: formData.email.trim().toLowerCase(),
            role: formData.role as 'ADMIN' | 'EDITEUR',
            actif: isActif,
          });
        }
        
        setSuccessMessage('Utilisateur mis à jour avec succès');
        
      } else {
        // Mode création
        await userService.createUser({
          nom: formData.nom.trim(),
          email: formData.email.trim().toLowerCase(),
          motDePasse: formData.motDePasse,
          role: formData.role as 'ADMIN' | 'EDITEUR',
          photoFile: photoFile || undefined,
        });
        
        setSuccessMessage('Utilisateur créé avec succès');
      }
      
      // Rafraîchir la liste
      if (onUserUpdated) {
        await onUserUpdated();
      }
      
      // Fermer le modal après un délai
      setTimeout(() => {
        onClose(true);
      }, 500);
      
    } catch (error: any) {
      console.error('Submit error:', error);
      
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else if (error.message) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'Une erreur est survenue' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!user;
  const isCurrentUser = user?.id === currentUserId;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={() => onClose()}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-gradient-to-r from-green-600 to-teal-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  {isEditing ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
                </h3>
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-5 bg-white">
              {/* Message de succès */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              )}

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
                          {formData.nom ? formData.nom.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <label className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <span>Choisir une photo</span>
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
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Jean Dupont"
                />
                {errors.nom && (
                  <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="jean.dupont@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Mot de passe */}
              {!isEditing && (
                <div className="mb-4">
                  <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="motDePasse"
                      name="motDePasse"
                      value={formData.motDePasse}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.motDePasse ? 'border-red-500' : 'border-gray-300'
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
                  {errors.motDePasse && (
                    <p className="mt-1 text-xs text-red-600">{errors.motDePasse}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 6 caractères
                  </p>
                </div>
              )}

              {/* Rôle */}
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isEditing && isCurrentUser}
                >
                  <option value="EDITEUR">Éditeur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
                {isEditing && isCurrentUser && (
                  <p className="mt-1 text-xs text-gray-500">
                    Vous ne pouvez pas modifier votre propre rôle
                  </p>
                )}
              </div>

              {/* Statut (uniquement en modification) */}
              {isEditing && (
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Statut du compte
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setIsActif(!isActif)}
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                          isActif ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                        disabled={isEditing && isCurrentUser}
                      >
                        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          isActif ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                      <span className="ml-3 text-sm text-gray-900">
                        {isActif ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  {isEditing && isCurrentUser && (
                    <p className="mt-1 text-xs text-gray-500">
                      Vous ne pouvez pas modifier le statut de votre propre compte
                    </p>
                  )}
                </div>
              )}

              {/* Erreur de soumission */}
              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => onClose()}
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
                {isEditing ? 'Mettre à jour' : 'Créer l\'utilisateur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}