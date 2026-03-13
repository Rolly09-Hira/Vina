// src/components/admin/PartenaireModal.tsx
import { useState, useEffect } from 'react';
import type { Partenaire } from '../../services/partenaireService';
import { 
  FaTimes, 
  FaUpload, 
  FaTrash, 
  FaSpinner, 
  FaCheck,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaToggleOn,
  FaBuilding,
  FaUser,
  FaUsers,
  FaUniversity
} from 'react-icons/fa';

interface PartenaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  partenaire?: Partenaire | null;
}

// Types de partenaires avec leurs couleurs VINA
const TYPE_OPTIONS = [
  { value: 'entreprise', label: 'Entreprise', icon: FaBuilding, color: 'olive' },
  { value: 'individu', label: 'Individu', icon: FaUser, color: 'water' },
  { value: 'association', label: 'Association', icon: FaUsers, color: 'sun' },
  { value: 'institution', label: 'Institution', icon: FaUniversity, color: 'earth' },
];

const typeColors = {
  olive: { 
    bg: 'bg-olive-nature/10', 
    text: 'text-olive-nature', 
    border: 'border-olive-nature/30',
    light: 'bg-olive-nature/5',
    button: 'from-olive-nature to-forest-deep'
  },
  water: { 
    bg: 'bg-water-blue/10', 
    text: 'text-water-blue', 
    border: 'border-water-blue/30',
    light: 'bg-water-blue/5',
    button: 'from-water-blue to-sky-soft'
  },
  sun: { 
    bg: 'bg-sun-gold/10', 
    text: 'text-sun-gold', 
    border: 'border-sun-gold/30',
    light: 'bg-sun-gold/5',
    button: 'from-sun-gold to-soft-sun'
  },
  earth: { 
    bg: 'bg-earth-brown/10', 
    text: 'text-earth-brown', 
    border: 'border-earth-brown/30',
    light: 'bg-earth-brown/5',
    button: 'from-earth-brown to-forest-deep'
  },
};

export default function PartenaireModal({ isOpen, onClose, onSave, partenaire }: PartenaireModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    type: 'entreprise' as 'entreprise' | 'individu' | 'association' | 'institution',
    descriptionFr: '',
    descriptionEn: '',
    siteWeb: '',
    email: '',
    telephone: '',
    adresse: '',
    dateDebutPartenaire: '',
    actif: true,
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Obtenir les couleurs pour le type sélectionné
  const selectedType = TYPE_OPTIONS.find(t => t.value === formData.type)?.color || 'olive';
  const colors = typeColors[selectedType as keyof typeof typeColors];

  useEffect(() => {
    if (isOpen) {
      if (partenaire) {
        setFormData({
          nom: partenaire.nom || '',
          type: partenaire.type || 'entreprise',
          descriptionFr: partenaire.descriptionFr || '',
          descriptionEn: partenaire.descriptionEn || '',
          siteWeb: partenaire.siteWeb || '',
          email: partenaire.email || '',
          telephone: partenaire.telephone || '',
          adresse: partenaire.adresse || '',
          dateDebutPartenaire: partenaire.dateDebutPartenaire ? new Date(partenaire.dateDebutPartenaire).toISOString().split('T')[0] : '',
          actif: partenaire.actif !== undefined ? partenaire.actif : true,
        });
        
        if (partenaire.logoUrl) {
          setLogoPreview(`${partenaire.logoUrl}`);
        }
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          nom: '',
          type: 'entreprise',
          descriptionFr: '',
          descriptionEn: '',
          siteWeb: '',
          email: '',
          telephone: '',
          adresse: '',
          dateDebutPartenaire: today,
          actif: true,
        });
        setLogoFile(null);
        setLogoPreview('');
      }
      setErrors({});
      setTouchedFields(new Set());
    }
  }, [isOpen, partenaire]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Le logo ne doit pas dépasser 5MB' }));
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/jpg'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setErrors(prev => ({ ...prev, logo: 'Format non supporté. Utilisez JPG, PNG, GIF, SVG ou WEBP.' }));
        return;
      }

      setLogoFile(file);
      setErrors(prev => ({ ...prev, logo: '' }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setTouchedFields(prev => new Set(prev).add(name));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.dateDebutPartenaire) newErrors.dateDebutPartenaire = 'La date de début est requise';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (formData.siteWeb && !/^https?:\/\/.+/.test(formData.siteWeb)) {
      newErrors.siteWeb = 'L\'URL doit commencer par http:// ou https://';
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

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });
      
      if (logoFile) {
        formDataToSend.append('logoFile', logoFile);
      }

      await onSave(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setErrors(prev => ({ ...prev, submit: 'Erreur lors de la sauvegarde' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const TypeIcon = TYPE_OPTIONS.find(t => t.value === formData.type)?.icon || FaBuilding;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal - Taille réduite */}
        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête compact avec couleurs VINA */}
          <div className={`px-5 py-3 ${partenaire ? 'bg-gradient-to-r from-water-blue to-sky-soft' : 'bg-gradient-to-r from-olive-nature to-forest-deep'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-warm-white bg-opacity-20 rounded-lg">
                  <TypeIcon className="w-4 h-4 text-warm-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-warm-white">
                    {partenaire ? 'Modifier le partenaire' : 'Nouveau partenaire'}
                  </h3>
                  <p className="text-[10px] text-warm-white text-opacity-90">
                    {partenaire ? 'Modifiez les informations' : 'Remplissez les informations'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-warm-white hover:bg-warm-white hover:bg-opacity-20 rounded-lg transition-all"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Formulaire - Hauteur réduite */}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="px-5 py-3 space-y-3 max-h-[60vh] overflow-y-auto">
              {/* Message d'erreur global */}
              {errors.submit && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center">
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Section Nom et Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1">
                    Nom du partenaire <span className="text-sun-gold">*</span>
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
                    placeholder="Ex: Entreprise ABC"
                  />
                  {touchedFields.has('nom') && errors.nom && (
                    <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1">
                    Type de partenaire *
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all appearance-none bg-warm-white pr-8`}
                      style={{ color: colors.text }}
                    >
                      {TYPE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <TypeIcon className={`w-3 h-3 ${colors.text}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Logo compacte */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <label className="block text-xs font-medium text-forest-deep mb-2">
                  Logo du partenaire
                </label>
                <div className="flex items-center gap-3">
                  {/* Preview */}
                  <div className="w-16 h-16 border-2 border-dashed border-border-light rounded-lg flex items-center justify-center bg-warm-white flex-shrink-0">
                    {logoPreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={logoPreview} 
                          alt="Logo" 
                          className="w-full h-full object-contain p-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview('');
                          }}
                          className="absolute -top-1 -right-1 bg-earth-brown text-warm-white p-0.5 rounded-full hover:bg-forest-deep shadow-sm"
                        >
                          <FaTrash className="w-2 h-2" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FaUpload className="w-4 h-4 mx-auto text-text-secondary" />
                        <span className="text-[8px] text-text-secondary mt-0.5 block">Logo</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload button */}
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center h-16 border-2 border-dashed border-border-light rounded-lg cursor-pointer hover:border-olive-nature transition-colors bg-warm-white">
                      <div className="flex flex-col items-center justify-center">
                        <FaUpload className="w-3 h-3 text-text-secondary mb-0.5" />
                        <p className="text-[10px] text-text-secondary">Cliquez pour uploader</p>
                        <p className="text-[8px] text-border-light">PNG, JPG, SVG (Max 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                    </label>
                    {errors.logo && <p className="mt-1 text-[10px] text-red-600">{errors.logo}</p>}
                  </div>
                </div>
              </div>

              {/* Section Descriptions compactes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1">
                    Description FR
                  </label>
                  <textarea
                    name="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all resize-none bg-warm-white"
                    placeholder="Description en français..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1">
                    Description EN
                  </label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all resize-none bg-warm-white"
                    placeholder="Description in English..."
                  />
                </div>
              </div>

              {/* Section Coordonnées compactes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaGlobe className="w-3 h-3 mr-1 text-water-blue" />
                    Site web
                  </label>
                  <input
                    type="url"
                    name="siteWeb"
                    value={formData.siteWeb}
                    onChange={handleChange}
                    className={`w-full px-3 py-1.5 text-sm border ${
                      errors.siteWeb ? 'border-red-500' : 'border-border-light'
                    } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                    placeholder="https://..."
                  />
                  {errors.siteWeb && <p className="mt-1 text-xs text-red-600">{errors.siteWeb}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaEnvelope className="w-3 h-3 mr-1 text-sun-gold" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-1.5 text-sm border ${
                      errors.email ? 'border-red-500' : 'border-border-light'
                    } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                    placeholder="contact@exemple.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    placeholder="+261 XX XX XXX XX"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaMapMarkerAlt className="w-3 h-3 mr-1 text-earth-brown" />
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white"
                    placeholder="Adresse complète"
                  />
                </div>
              </div>

              {/* Section Date et Statut compactes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1 flex items-center">
                    <FaCalendarAlt className="w-3 h-3 mr-1 text-sun-gold" />
                    Date début <span className="text-sun-gold ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateDebutPartenaire"
                    value={formData.dateDebutPartenaire}
                    onChange={handleChange}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('dateDebutPartenaire'))}
                    className={`w-full px-3 py-1.5 text-sm border ${
                      touchedFields.has('dateDebutPartenaire') && errors.dateDebutPartenaire 
                        ? 'border-red-500' 
                        : 'border-border-light'
                    } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                  />
                  {touchedFields.has('dateDebutPartenaire') && errors.dateDebutPartenaire && (
                    <p className="mt-1 text-xs text-red-600">{errors.dateDebutPartenaire}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <div className="bg-ultra-light p-2 rounded-lg border border-border-light flex items-center gap-2">
                    <FaToggleOn className={`w-4 h-4 ${formData.actif ? 'text-olive-nature' : 'text-text-secondary'}`} />
                    <input
                      type="checkbox"
                      id="actif"
                      name="actif"
                      checked={formData.actif}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 text-olive-nature border-border-light rounded focus:ring-olive-nature"
                    />
                    <label htmlFor="actif" className="text-xs font-medium text-forest-deep">
                      Partenaire actif
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Pied de page compact */}
            <div className="px-5 py-2 bg-ultra-light border-t border-border-light flex justify-between items-center">
              <div className="text-[10px] text-text-secondary">
                <span className="text-sun-gold">*</span> Champs obligatoires
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-medium text-text-secondary bg-warm-white border border-border-light rounded-lg hover:bg-ultra-light transition-all"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-3 py-1.5 text-xs font-medium text-warm-white bg-gradient-to-r ${colors.button} rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center shadow-sm`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                      {partenaire ? 'Modif...' : 'Créat...'}
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-3 h-3 mr-1" />
                      {partenaire ? 'Modifier' : 'Créer'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}