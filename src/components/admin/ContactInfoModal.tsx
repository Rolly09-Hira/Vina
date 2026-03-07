// src/components/admin/ContactInfoModal.tsx
import { useState, useEffect } from 'react';
import { type ContactInfo } from '../../services/contactInfoService';
import { 
  FaTimes, 
  FaSpinner, 
  FaCheck,
  FaToggleOn,
  FaSortNumericDown,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaEye
} from 'react-icons/fa';

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contactData: any) => Promise<void>;
  contactInfo: ContactInfo | null;
}

// Types de contact avec leurs couleurs VINA
const TYPE_OPTIONS = [
  { value: 'telephone', label: 'Téléphone', icon: FaPhone, color: 'water' },
  { value: 'email', label: 'Email', icon: FaEnvelope, color: 'olive' },
  { value: 'adresse', label: 'Adresse', icon: FaMapMarkerAlt, color: 'earth' },
  { value: 'reseau_social', label: 'Réseau social', icon: FaGlobe, color: 'sun' },
];

const typeColors = {
  water: { 
    bg: 'bg-water-blue/10', 
    text: 'text-water-blue', 
    border: 'border-water-blue/30',
    light: 'bg-water-blue/5',
    button: 'from-water-blue to-sky-soft'
  },
  olive: { 
    bg: 'bg-olive-nature/10', 
    text: 'text-olive-nature', 
    border: 'border-olive-nature/30',
    light: 'bg-olive-nature/5',
    button: 'from-olive-nature to-forest-deep'
  },
  earth: { 
    bg: 'bg-earth-brown/10', 
    text: 'text-earth-brown', 
    border: 'border-earth-brown/30',
    light: 'bg-earth-brown/5',
    button: 'from-earth-brown to-forest-deep'
  },
  sun: { 
    bg: 'bg-sun-gold/10', 
    text: 'text-sun-gold', 
    border: 'border-sun-gold/30',
    light: 'bg-sun-gold/5',
    button: 'from-sun-gold to-soft-sun'
  },
};

const ICONE_OPTIONS = {
  telephone: [
    { value: 'fa-phone', label: 'Phone', icon: '📞' },
    { value: 'fa-mobile-alt', label: 'Mobile', icon: '📱' },
    { value: 'fa-whatsapp', label: 'WhatsApp', icon: '💬' },
  ],
  email: [
    { value: 'fa-envelope', label: 'Envelope', icon: '✉️' },
    { value: 'fa-at', label: 'At', icon: '@' },
  ],
  adresse: [
    { value: 'fa-map-marker-alt', label: 'Map Marker', icon: '📍' },
    { value: 'fa-home', label: 'Home', icon: '🏠' },
    { value: 'fa-building', label: 'Building', icon: '🏢' },
  ],
  reseau_social: [
    { value: 'fa-facebook', label: 'Facebook', icon: '📘' },
    { value: 'fa-twitter', label: 'Twitter', icon: '🐦' },
    { value: 'fa-instagram', label: 'Instagram', icon: '📷' },
    { value: 'fa-linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'fa-youtube', label: 'YouTube', icon: '🎬' },
    { value: 'fa-telegram', label: 'Telegram', icon: '✈️' },
  ],
};

export default function ContactInfoModal({ isOpen, onClose, onSave, contactInfo }: ContactInfoModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    titre: '',
    valeur: '',
    icone: '',
    typeContact: 'telephone' as 'telephone' | 'email' | 'adresse' | 'reseau_social',
    lien: '',
    ordreAffichage: 1,
    actif: true,
  });

  // Obtenir la couleur pour le type sélectionné
  const selectedType = TYPE_OPTIONS.find(t => t.value === formData.typeContact)?.color || 'water';
  const colors = typeColors[selectedType as keyof typeof typeColors];
  const TypeIcon = TYPE_OPTIONS.find(t => t.value === formData.typeContact)?.icon || FaPhone;

  useEffect(() => {
    if (isOpen) {
      if (contactInfo) {
        setFormData({
          titre: contactInfo.titre || '',
          valeur: contactInfo.valeur || '',
          icone: contactInfo.icone || '',
          typeContact: contactInfo.typeContact || 'telephone',
          lien: contactInfo.lien || '',
          ordreAffichage: contactInfo.ordreAffichage || 1,
          actif: contactInfo.actif,
        });
      } else {
        setFormData({
          titre: '',
          valeur: '',
          icone: '',
          typeContact: 'telephone',
          lien: '',
          ordreAffichage: 1,
          actif: true,
        });
      }
      setErrors({});
      setTouchedFields(new Set());
    }
  }, [isOpen, contactInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 1 : value,
    }));
    
    setTouchedFields(prev => new Set(prev).add(name));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as 'telephone' | 'email' | 'adresse' | 'reseau_social';
    setFormData(prev => ({
      ...prev,
      typeContact: type,
      icone: '', // Réinitialiser l'icône quand on change le type
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) newErrors.titre = 'Titre requis';
    if (!formData.valeur.trim()) newErrors.valeur = 'Valeur requise';

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

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors(prev => ({ ...prev, submit: 'Erreur lors de la sauvegarde' }));
    } finally {
      setLoading(false);
    }
  };

  const getCurrentIconOptions = () => {
    return ICONE_OPTIONS[formData.typeContact] || [];
  };

  const getSelectedIcon = () => {
    const icon = getCurrentIconOptions().find(opt => opt.value === formData.icone);
    return icon ? icon.icon : '📱';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal - Taille réduite */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête compact */}
          <div className={`px-5 py-3 ${contactInfo ? 'bg-gradient-to-r from-water-blue to-sky-soft' : 'bg-gradient-to-r from-olive-nature to-forest-deep'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-warm-white bg-opacity-20 rounded-lg">
                  <TypeIcon className="w-4 h-4 text-warm-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-warm-white">
                    {contactInfo ? 'Modifier le contact' : 'Nouveau contact'}
                  </h3>
                  <p className="text-[10px] text-warm-white text-opacity-90">
                    {contactInfo ? 'Modifiez les informations' : 'Remplissez les informations'}
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

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="px-5 py-3 space-y-3 max-h-[60vh] overflow-y-auto">
              {/* Message d'erreur global */}
              {errors.submit && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                  {errors.submit}
                </div>
              )}

              {/* Type et Titre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1">
                    Type de contact *
                  </label>
                  <div className="relative">
                    <select
                      name="typeContact"
                      value={formData.typeContact}
                      onChange={handleTypeChange}
                      className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all appearance-none bg-warm-white pr-8"
                      style={{ color: colors.text }}
                    >
                      {TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <TypeIcon className={`w-3 h-3 ${colors.text}`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-forest-deep mb-1">
                    Titre <span className="text-sun-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('titre'))}
                    className={`w-full px-3 py-1.5 text-sm border ${
                      touchedFields.has('titre') && errors.titre 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-border-light'
                    } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                    placeholder="Ex: Téléphone principal"
                  />
                  {errors.titre && <p className="mt-1 text-xs text-red-600">{errors.titre}</p>}
                </div>
              </div>

              {/* Ordre et Statut */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                  <label className="flex items-center justify-between text-xs">
                    <span className="flex items-center text-forest-deep">
                      <FaSortNumericDown className="w-3 h-3 mr-1 text-water-blue" />
                      Ordre
                    </span>
                    <input 
                      type="number" 
                      name="ordreAffichage" 
                      value={formData.ordreAffichage} 
                      onChange={handleChange}
                      min="1" 
                      className="w-14 px-1 py-0.5 text-xs border border-border-light rounded text-center bg-warm-white focus:ring-2 focus:ring-olive-nature" 
                    />
                  </label>
                </div>
                <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                  <label className="flex items-center justify-between text-xs">
                    <span className="flex items-center text-forest-deep">
                      <FaToggleOn className="w-3 h-3 mr-1 text-olive-nature" />
                      Actif
                    </span>
                    <input 
                      type="checkbox" 
                      name="actif" 
                      checked={formData.actif} 
                      onChange={handleChange}
                      className="w-3.5 h-3.5 text-olive-nature border-border-light rounded focus:ring-olive-nature" 
                    />
                  </label>
                </div>
              </div>

              {/* Icône */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <label className="block text-xs font-medium text-forest-deep mb-2 flex items-center">
                  <FaEye className="w-3 h-3 mr-1 text-sun-gold" />
                  Icône d'affichage
                </label>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center border ${colors.border}`}>
                    <span className={`text-lg ${colors.text}`}>
                      {formData.icone ? getSelectedIcon() : '?'}
                    </span>
                  </div>
                  <select
                    name="icone"
                    value={formData.icone}
                    onChange={handleChange}
                    className="flex-1 px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white"
                  >
                    <option value="">Sélectionner une icône...</option>
                    {getCurrentIconOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Valeur */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <label className="block text-xs font-medium text-forest-deep mb-2 flex items-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.bg} mr-1`}></span>
                  Valeur <span className="text-sun-gold ml-1">*</span>
                </label>
                {formData.typeContact === 'adresse' ? (
                  <textarea
                    name="valeur"
                    value={formData.valeur}
                    onChange={handleChange}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('valeur'))}
                    rows={2}
                    className={`w-full px-3 py-1.5 text-sm border ${
                      touchedFields.has('valeur') && errors.valeur 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-border-light'
                    } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all resize-none bg-warm-white`}
                    placeholder="123 Rue de Paris, 75001 Paris"
                  />
                ) : (
                  <input
                    type={formData.typeContact === 'email' ? 'email' : 'text'}
                    name="valeur"
                    value={formData.valeur}
                    onChange={handleChange}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('valeur'))}
                    className={`w-full px-3 py-1.5 text-sm border ${
                      touchedFields.has('valeur') && errors.valeur 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-border-light'
                    } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                    placeholder={
                      formData.typeContact === 'telephone' ? '+261 34 12 345 67' :
                      formData.typeContact === 'email' ? 'contact@vina.org' :
                      '@vina_org'
                    }
                  />
                )}
                {errors.valeur && <p className="mt-1 text-xs text-red-600">{errors.valeur}</p>}
              </div>

              {/* Lien (pour réseaux sociaux et emails) */}
              {(formData.typeContact === 'reseau_social' || formData.typeContact === 'email') && (
                <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                  <label className="block text-xs font-medium text-forest-deep mb-2 flex items-center">
                    <FaGlobe className="w-3 h-3 mr-1 text-water-blue" />
                    Lien {formData.typeContact === 'email' ? '(mailto:)' : '(URL)'}
                  </label>
                  <input
                    type="url"
                    name="lien"
                    value={formData.lien}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white"
                    placeholder={
                      formData.typeContact === 'email' 
                        ? 'mailto:contact@vina.org' 
                        : 'https://facebook.com/vina'
                    }
                  />
                  <p className="text-[10px] text-text-secondary mt-1">
                    {formData.typeContact === 'email' 
                      ? 'Laissez vide pour générer automatiquement' 
                      : 'URL complète vers le profil'}
                  </p>
                </div>
              )}

              {/* Prévisualisation compacte */}
              <div className={`p-3 ${colors.bg} rounded-xl border ${colors.border}`}>
                <h3 className="text-xs font-semibold text-forest-deep mb-2 flex items-center">
                  <FaEye className="w-3 h-3 mr-1 text-sun-gold" />
                  Aperçu
                </h3>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center border ${colors.border} flex-shrink-0`}>
                    <span className={`text-base ${colors.text}`}>
                      {formData.icone ? getSelectedIcon() : (TYPE_OPTIONS.find(t => t.value === formData.typeContact)?.icon ? '📞' : '?')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-premium-dark truncate">
                      {formData.titre || 'Titre du contact'}
                    </div>
                    <div className="text-xs text-text-secondary truncate mt-0.5">
                      {formData.valeur || 'Valeur du contact'}
                    </div>
                    {formData.typeContact === 'telephone' && formData.valeur && (
                      <span className="text-[10px] text-water-blue hover:text-forest-deep cursor-pointer">
                        📞 Appeler
                      </span>
                    )}
                    {formData.typeContact === 'email' && formData.valeur && (
                      <span className="text-[10px] text-olive-nature hover:text-forest-deep cursor-pointer">
                        ✉️ Envoyer
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div className="px-5 py-2 bg-ultra-light border-t border-border-light flex justify-between items-center">
              <div className="text-[10px] text-text-secondary">
                <span className="text-sun-gold">*</span> Champs obligatoires
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-medium text-text-secondary bg-warm-white border border-border-light rounded-lg hover:bg-ultra-light transition-all"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-3 py-1.5 text-xs font-medium text-warm-white bg-gradient-to-r ${colors.button} rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center shadow-sm`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                      {contactInfo ? 'Modif...' : 'Créat...'}
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-3 h-3 mr-1" />
                      {contactInfo ? 'Modifier' : 'Créer'}
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