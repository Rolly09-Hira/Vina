// src/components/admin/UserModal.tsx
import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import authService from '../../services/authService'; // 👈 AJOUTER CET IMPORT
import type { User } from '../../types/api';
import { 
  FaTimes, 
  FaSpinner, 
  FaCheck,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaToggleOn,
  FaUserTag,
  FaCamera,
  FaTrash,
  FaExclamationTriangle // 👈 AJOUTER CET ICÔNE
} from 'react-icons/fa';

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
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  // 👈 ÉTAT POUR GÉRER LA DÉCONNEXION
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
            : `ttps://web-production-03b53.up.railway.app/${user.photoUrl}`;
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
      setTouchedFields(new Set());
      setShowLogoutWarning(false); // 👈 Réinitialiser
      setEmailChanged(false); // 👈 Réinitialiser
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    setTouchedFields(prev => new Set(prev).add(name));
    
    // 👈 DÉTECTER SI L'EMAIL CHANGE
    if (name === 'email' && user && user.email !== value) {
      setEmailChanged(true);
    }
    
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
      newErrors.motDePasse = 'Minimum 6 caractères';
    }

    if (photoFile && !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(photoFile.type)) {
      newErrors.photo = 'Format non supporté';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 👈 FONCTION POUR GÉRER LA DÉCONNEXION
  const handleLogoutAndRedirect = async () => {
    try {
      await authService.logout();
      window.location.href = '/login?session=expired&reason=email_changed';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      window.location.href = '/login';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // 👈 SI L'UTILISATEUR MODIFIE SON PROPRE EMAIL, AFFICHER UN AVERTISSEMENT
    if (isEditing && isCurrentUser && emailChanged && !showLogoutWarning) {
      setShowLogoutWarning(true);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage(null);
    
    try {
      if (user) {
        // Mode modification
        if (photoFile) {
          const formDataToSend = new FormData();
          formDataToSend.append('nom', formData.nom.trim());
          formDataToSend.append('email', formData.email.trim().toLowerCase());
          formDataToSend.append('role', formData.role);
          formDataToSend.append('actif', isActif ? 'true' : 'false');
          formDataToSend.append('photoFile', photoFile);

          await userService.updateUserWithPhoto(user.id, formDataToSend);
        } else {
          await userService.updateUser(user.id, {
            nom: formData.nom.trim(),
            email: formData.email.trim().toLowerCase(),
            role: formData.role,
            actif: isActif,
          });
        }
        
        setSuccessMessage('Utilisateur mis à jour');
        
      } else {
        // Mode création
        const formDataToSend = new FormData();
        formDataToSend.append('nom', formData.nom.trim());
        formDataToSend.append('email', formData.email.trim().toLowerCase());
        formDataToSend.append('motDePasse', formData.motDePasse);
        formDataToSend.append('role', formData.role);
        
        if (photoFile) {
          formDataToSend.append('photoFile', photoFile);
        }

        await userService.createUserWithFormData(formDataToSend);
        setSuccessMessage('Utilisateur créé');
      }
      
      if (onUserUpdated) {
        await onUserUpdated();
      }
      
      // 👈 SI C'EST SON PROPRE COMPTE ET QUE L'EMAIL A CHANGÉ, DÉCONNECTER
      if (isEditing && isCurrentUser && emailChanged) {
        setTimeout(() => {
          handleLogoutAndRedirect();
        }, 1000);
      } else {
        setTimeout(() => {
          onClose(true);
        }, 500);
      }
      
    } catch (error: any) {
      console.error('Submit error:', error);
      
      let errorMessage = 'Erreur serveur';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
      setShowLogoutWarning(false); // 👈 CACHER L'AVERTISSEMENT EN CAS D'ERREUR
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
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm"
          onClick={() => onClose()}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête compact */}
          <div className={`px-4 py-3 ${isEditing ? 'bg-gradient-to-r from-water-blue to-sky-soft' : 'bg-gradient-to-r from-olive-nature to-forest-deep'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-warm-white bg-opacity-20 rounded-lg">
                  <FaUser className="w-4 h-4 text-warm-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-warm-white">
                    {isEditing ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}
                  </h3>
                  <p className="text-[10px] text-warm-white text-opacity-90">
                    {isEditing ? "Modifiez les informations" : "Remplissez les informations"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onClose()}
                className="p-1 text-warm-white hover:bg-warm-white hover:bg-opacity-20 rounded-lg transition-all"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-3 space-y-3 max-h-[60vh] overflow-y-auto">
              {/* Message de succès */}
              {successMessage && (
                <div className="p-2 bg-olive-nature/20 border border-olive-nature/30 rounded-lg">
                  <p className="text-xs text-olive-nature flex items-center">
                    <FaCheck className="w-3 h-3 mr-1" />
                    {successMessage}
                    {isEditing && isCurrentUser && emailChanged && " - Déconnexion imminente..."}
                  </p>
                </div>
              )}

              {/* 👈 AVERTISSEMENT DE DÉCONNEXION */}
              {showLogoutWarning && (
                <div className="p-3 bg-sun-gold/20 border border-sun-gold/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="w-4 h-4 text-sun-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-sun-gold mb-1">
                        Attention - Modification de votre email
                      </p>
                      <p className="text-[10px] text-text-secondary mb-2">
                        En modifiant votre adresse email, vous serez automatiquement déconnecté et devrez vous reconnecter avec votre nouvelle adresse.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowLogoutWarning(false);
                            handleSubmit(new Event('submit') as any);
                          }}
                          className="px-2 py-1 text-[10px] font-medium text-warm-white bg-gradient-to-r from-sun-gold to-soft-sun rounded-lg hover:opacity-90"
                        >
                          Continuer
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLogoutWarning(false)}
                          className="px-2 py-1 text-[10px] font-medium text-text-secondary bg-warm-white border border-border-light rounded-lg hover:bg-ultra-light"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Photo de profil */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <label className="block text-xs font-medium text-forest-deep mb-2 flex items-center">
                  <FaCamera className="w-3 h-3 mr-1 text-sun-gold" />
                  Photo de profil
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Prévisualisation"
                          className="h-14 w-14 rounded-full object-cover border-2 border-olive-nature"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-1 -right-1 bg-earth-brown text-warm-white rounded-full p-0.5 hover:bg-forest-deep shadow-sm"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gradient-to-r from-olive-nature to-forest-deep flex items-center justify-center">
                        <span className="text-warm-white font-medium text-lg">
                          {formData.nom ? formData.nom.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="relative cursor-pointer bg-warm-white py-1.5 px-3 border border-border-light rounded-lg text-xs font-medium text-forest-deep hover:bg-ultra-light transition-colors inline-block">
                      <span>Choisir</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                    <p className="mt-1 text-[10px] text-text-secondary">
                      JPG, PNG (max. 5MB)
                    </p>
                    {errors.photo && (
                      <p className="mt-1 text-[10px] text-red-600">{errors.photo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nom */}
              <div>
                <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                  <FaUser className="w-3 h-3 mr-1 text-water-blue" />
                  Nom complet <span className="text-sun-gold ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  onBlur={() => setTouchedFields(prev => new Set(prev).add('nom'))}
                  className={`w-full px-3 py-1.5 text-sm border ${
                    touchedFields.has('nom') && errors.nom 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border-light'
                  } rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white`}
                  placeholder="Jean Dupont"
                />
                {touchedFields.has('nom') && errors.nom && (
                  <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                  <FaEnvelope className="w-3 h-3 mr-1 text-olive-nature" />
                  Email <span className="text-sun-gold ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => setTouchedFields(prev => new Set(prev).add('email'))}
                  className={`w-full px-3 py-1.5 text-sm border ${
                    touchedFields.has('email') && errors.email 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border-light'
                  } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white ${
                    isEditing && isCurrentUser ? 'border-sun-gold/50' : ''
                  }`}
                  placeholder="jean.dupont@exemple.com"
                />
                {touchedFields.has('email') && errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
                {isEditing && isCurrentUser && (
                  <p className="mt-1 text-[10px] text-sun-gold">
                    ⚠️ Modifier votre email vous déconnectera
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              {!isEditing && (
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaLock className="w-3 h-3 mr-1 text-sun-gold" />
                    Mot de passe <span className="text-sun-gold ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="motDePasse"
                      value={formData.motDePasse}
                      onChange={handleChange}
                      onBlur={() => setTouchedFields(prev => new Set(prev).add('motDePasse'))}
                      className={`w-full px-3 py-1.5 text-sm border ${
                        touchedFields.has('motDePasse') && errors.motDePasse 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-border-light'
                      } rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all bg-warm-white pr-8`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-text-secondary hover:text-forest-deep"
                    >
                      {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touchedFields.has('motDePasse') && errors.motDePasse && (
                    <p className="mt-1 text-xs text-red-600">{errors.motDePasse}</p>
                  )}
                  <p className="mt-1 text-[10px] text-text-secondary">
                    Minimum 6 caractères
                  </p>
                </div>
              )}

              {/* Rôle */}
              <div>
                <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                  <FaUserTag className="w-3 h-3 mr-1 text-water-blue" />
                  Rôle <span className="text-sun-gold ml-1">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isEditing && isCurrentUser}
                  className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white"
                >
                  <option value="EDITEUR">Éditeur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
                {isEditing && isCurrentUser && (
                  <p className="mt-1 text-[10px] text-text-secondary">
                    Vous ne pouvez pas modifier votre rôle
                  </p>
                )}
              </div>

              {/* Statut (uniquement en modification) */}
              {isEditing && (
                <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-forest-deep flex items-center">
                      <FaToggleOn className="w-3 h-3 mr-1 text-olive-nature" />
                      Statut
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => !(isEditing && isCurrentUser) && setIsActif(!isActif)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          isActif ? 'bg-olive-nature' : 'bg-border-light'
                        } ${isCurrentUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={isCurrentUser}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-warm-white transition-transform ${
                          isActif ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                      <span className={`text-xs font-medium ${isActif ? 'text-olive-nature' : 'text-text-secondary'}`}>
                        {isActif ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  {isCurrentUser && (
                    <p className="mt-1 text-[10px] text-text-secondary">
                      Vous ne pouvez pas modifier votre statut
                    </p>
                  )}
                </div>
              )}

              {/* Erreur de soumission */}
              {errors.submit && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{errors.submit}</p>
                </div>
              )}
            </div>

            {/* Pied de page */}
            <div className="px-4 py-2 bg-ultra-light border-t border-border-light flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-3 py-1.5 text-xs font-medium text-text-secondary bg-warm-white border border-border-light rounded-lg hover:bg-ultra-light transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || showLogoutWarning}
                className={`px-3 py-1.5 text-xs font-medium text-warm-white bg-gradient-to-r ${
                  isEditing 
                    ? 'from-water-blue to-sky-soft' 
                    : 'from-olive-nature to-forest-deep'
                } rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center shadow-sm`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                    {isEditing ? 'Modif...' : 'Créat...'}
                  </>
                ) : (
                  <>
                    <FaCheck className="w-3 h-3 mr-1" />
                    {isEditing ? 'Mettre à jour' : 'Créer'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}