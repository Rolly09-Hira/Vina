// src/components/admin/PersonnelModal.tsx
import { useState, useEffect } from 'react';
import personnelService from '../../services/personnelService';
import type { Personnel } from '../../types/api';
import { 
  FaTimes, 
  FaSpinner, 
  FaCheck,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaSortNumericDown,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaQuoteLeft
} from 'react-icons/fa';

interface PersonnelModalProps {
  isOpen: boolean;
  onClose: (reload?: boolean) => void;
  personnel: Personnel | null;
  onPersonnelUpdated?: () => Promise<void>;
}

export default function PersonnelModal({ 
  isOpen, 
  onClose, 
  personnel, 
  onPersonnelUpdated 
}: PersonnelModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    departement: '',
    dateEmbauche: '',
    biographieFr: '',
    biographieEn: '',
    specialites: '',
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    ordreAffichage: 0,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Liste des départements pour le dropdown
  const departements = [
    'Direction',
    'Administration',
    'Programmes',
    'Finance',
    'Communication',
    'Ressources Humaines',
    'Suivi Évaluation',
    'Logistique',
    'Terrain'
  ];

  useEffect(() => {
    if (isOpen) {
      if (personnel) {
        setFormData({
          nom: personnel.nom || '',
          prenom: personnel.prenom || '',
          email: personnel.email || '',
          telephone: personnel.telephone || '',
          poste: personnel.poste || '',
          departement: personnel.departement || '',
          dateEmbauche: personnel.dateEmbauche || '',
          biographieFr: personnel.biographieFr || '',
          biographieEn: personnel.biographieEn || '',
          specialites: personnel.specialites || '',
          linkedinUrl: personnel.linkedinUrl || '',
          twitterUrl: personnel.twitterUrl || '',
          facebookUrl: personnel.facebookUrl || '',
          ordreAffichage: personnel.ordreAffichage || 0,
        });
        
        if (personnel.photoUrl) {
          const photoUrl = personnel.photoUrl.startsWith('http') 
            ? personnel.photoUrl 
            : `${personnel.photoUrl}`;
          setPhotoPreview(photoUrl);
        } else {
          setPhotoPreview(null);
        }
      } else {
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          poste: '',
          departement: '',
          dateEmbauche: '',
          biographieFr: '',
          biographieEn: '',
          specialites: '',
          linkedinUrl: '',
          twitterUrl: '',
          facebookUrl: '',
          ordreAffichage: 0,
        });
        setPhotoPreview(null);
      }
      setPhotoFile(null);
      setErrors({});
      setSuccessMessage(null);
      setTouchedFields(new Set());
    }
  }, [personnel, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouchedFields(prev => new Set(prev).add(name));
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

    if (!formData.prenom?.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
    }

    if (!formData.email?.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.poste?.trim()) {
      newErrors.poste = 'Le poste est obligatoire';
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
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage(null);
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('nom', formData.nom.trim());
      formDataToSend.append('prenom', formData.prenom.trim());
      formDataToSend.append('email', formData.email.trim().toLowerCase());
      if (formData.telephone) formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('poste', formData.poste.trim());
      if (formData.departement) formDataToSend.append('departement', formData.departement);
      if (formData.dateEmbauche) formDataToSend.append('dateEmbauche', formData.dateEmbauche);
      if (formData.biographieFr) formDataToSend.append('biographieFr', formData.biographieFr);
      if (formData.biographieEn) formDataToSend.append('biographieEn', formData.biographieEn);
      if (formData.specialites) formDataToSend.append('specialites', formData.specialites);
      if (formData.linkedinUrl) formDataToSend.append('linkedinUrl', formData.linkedinUrl);
      if (formData.twitterUrl) formDataToSend.append('twitterUrl', formData.twitterUrl);
      if (formData.facebookUrl) formDataToSend.append('facebookUrl', formData.facebookUrl);
      formDataToSend.append('ordreAffichage', formData.ordreAffichage.toString());
      
      if (photoFile) {
        formDataToSend.append('photoFile', photoFile);
      }

      if (personnel) {
        await personnelService.updatePersonnel(personnel.id, formDataToSend);
        setSuccessMessage('Membre mis à jour avec succès');
      } else {
        await personnelService.createPersonnel(formDataToSend);
        setSuccessMessage('Membre créé avec succès');
      }
      
      if (onPersonnelUpdated) {
        await onPersonnelUpdated();
      }
      
      setTimeout(() => {
        onClose(true);
      }, 1500);
      
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
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!personnel;
  const fullName = personnel ? `${personnel.prenom} ${personnel.nom}` : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm"
          onClick={() => onClose()}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête compact */}
          <div className={`px-5 py-3 ${isEditing ? 'bg-gradient-to-r from-water-blue to-sky-soft' : 'bg-gradient-to-r from-olive-nature to-forest-deep'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-warm-white bg-opacity-20 rounded-lg">
                  <FaUser className="w-4 h-4 text-warm-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-warm-white">
                    {isEditing ? `Modifier: ${fullName}` : 'Ajouter un membre'}
                  </h3>
                  <p className="text-[10px] text-warm-white text-opacity-90">
                    {isEditing ? 'Modifiez les informations' : 'Remplissez les informations'}
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
            <div className="px-5 py-3 space-y-3 max-h-[60vh] overflow-y-auto">
              {/* Message de succès */}
              {successMessage && (
                <div className="p-2 bg-olive-nature/20 border border-olive-nature/30 rounded-lg">
                  <p className="text-xs text-olive-nature flex items-center">
                    <FaCheck className="w-3 h-3 mr-1" />
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Photo */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <label className="block text-xs font-medium text-forest-deep mb-2 flex items-center">
                  <FaUser className="w-3 h-3 mr-1 text-sun-gold" />
                  Photo de profil
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Prévisualisation"
                          className="h-16 w-16 rounded-full object-cover border-2 border-olive-nature"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-1 -right-1 bg-earth-brown text-warm-white rounded-full p-0.5 hover:bg-forest-deep shadow-sm"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-olive-nature to-forest-deep flex items-center justify-center">
                        <span className="text-warm-white font-medium text-lg">
                          {formData.prenom ? formData.prenom.charAt(0).toUpperCase() : '?'}
                          {formData.nom ? formData.nom.charAt(0).toUpperCase() : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="relative cursor-pointer bg-warm-white py-1.5 px-3 border border-border-light rounded-lg text-xs font-medium text-forest-deep hover:bg-ultra-light transition-colors inline-block">
                      <span>Choisir une photo</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                    <p className="mt-1 text-[10px] text-text-secondary">
                      JPG, PNG, GIF, WEBP (max. 5MB)
                    </p>
                    {errors.photo && (
                      <p className="mt-1 text-[10px] text-red-600">{errors.photo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1">
                    Prénom <span className="text-sun-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('prenom'))}
                    className={`w-full px-3 py-1.5 text-sm border ${
                      touchedFields.has('prenom') && errors.prenom 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-border-light'
                    } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                    placeholder="Jean"
                  />
                  {errors.prenom && <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1">
                    Nom <span className="text-sun-gold">*</span>
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
                    } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                    placeholder="Dupont"
                  />
                  {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaEnvelope className="w-3 h-3 mr-1 text-water-blue" />
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
                    } rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white`}
                    placeholder="jean.dupont@exemple.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaPhone className="w-3 h-3 mr-1 text-olive-nature" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white"
                    placeholder="+261 34 12 345 67"
                  />
                </div>
              </div>

              {/* Poste et département */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaBriefcase className="w-3 h-3 mr-1 text-sun-gold" />
                    Poste <span className="text-sun-gold ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="poste"
                    value={formData.poste}
                    onChange={handleChange}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('poste'))}
                    className={`w-full px-3 py-1.5 text-sm border ${
                      touchedFields.has('poste') && errors.poste 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-border-light'
                    } rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all bg-warm-white`}
                    placeholder="Directeur Exécutif"
                  />
                  {errors.poste && <p className="mt-1 text-xs text-red-600">{errors.poste}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaBuilding className="w-3 h-3 mr-1 text-water-blue" />
                    Département
                  </label>
                  <select
                    name="departement"
                    value={formData.departement}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white"
                  >
                    <option value="">Sélectionner</option>
                    {departements.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date et ordre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaCalendarAlt className="w-3 h-3 mr-1 text-sun-gold" />
                    Date d'embauche
                  </label>
                  <input
                    type="date"
                    name="dateEmbauche"
                    value={formData.dateEmbauche}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all bg-warm-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaSortNumericDown className="w-3 h-3 mr-1 text-water-blue" />
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    name="ordreAffichage"
                    value={formData.ordreAffichage}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white"
                  />
                </div>
              </div>

              {/* Spécialités */}
              <div>
                <label className="block text-xs font-medium text-forest-deep mb-1">
                  Spécialités / Compétences
                </label>
                <input
                  type="text"
                  name="specialites"
                  value={formData.specialites}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white"
                  placeholder="Gestion de projet, Agroécologie, Formation..."
                />
              </div>

              {/* Biographies */}
              <div>
                <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                  <FaQuoteLeft className="w-3 h-3 mr-1 text-sun-gold" />
                  Biographie (Français)
                </label>
                <textarea
                  name="biographieFr"
                  rows={2}
                  value={formData.biographieFr}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all resize-none bg-warm-white"
                  placeholder="Présentation en français..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                  <FaQuoteLeft className="w-3 h-3 mr-1 text-water-blue" />
                  Biographie (Anglais)
                </label>
                <textarea
                  name="biographieEn"
                  rows={2}
                  value={formData.biographieEn}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all resize-none bg-warm-white"
                  placeholder="Presentation in English..."
                />
              </div>

              {/* Réseaux sociaux */}
              <div>
                <h4 className="text-xs font-medium text-forest-deep mb-2">Réseaux sociaux</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaLinkedin className="w-4 h-4 text-water-blue mr-2 flex-shrink-0" />
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      className="flex-1 px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white"
                      placeholder="https://www.linkedin.com/in/..."
                    />
                  </div>
                  <div className="flex items-center">
                    <FaTwitter className="w-4 h-4 text-sun-gold mr-2 flex-shrink-0" />
                    <input
                      type="url"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleChange}
                      className="flex-1 px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all bg-warm-white"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="flex items-center">
                    <FaFacebook className="w-4 h-4 text-olive-nature mr-2 flex-shrink-0" />
                    <input
                      type="url"
                      name="facebookUrl"
                      value={formData.facebookUrl}
                      onChange={handleChange}
                      className="flex-1 px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white"
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Erreur de soumission */}
              {errors.submit && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{errors.submit}</p>
                </div>
              )}
            </div>

            {/* Pied de page */}
            <div className="px-5 py-2 bg-ultra-light border-t border-border-light flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-3 py-1.5 text-xs font-medium text-text-secondary bg-warm-white border border-border-light rounded-lg hover:bg-ultra-light transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-3 py-1.5 text-xs font-medium text-warm-white bg-gradient-to-r ${
                  isEditing 
                    ? 'from-water-blue to-sky-soft' 
                    : 'from-olive-nature to-forest-deep'
                } rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center shadow-sm`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                    {isEditing ? 'Mise à jour...' : 'Ajout...'}
                  </>
                ) : (
                  <>
                    <FaCheck className="w-3 h-3 mr-1" />
                    {isEditing ? 'Mettre à jour' : 'Ajouter'}
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