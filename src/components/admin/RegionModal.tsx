// src/components/admin/RegionModal.tsx
import { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaEdit, 
  FaPlus, 
  FaMapMarkerAlt,
  FaSpinner,
  FaExclamationCircle,
  FaSave,
} from 'react-icons/fa';
import type { Region } from '../../services/regionService';

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { nom: string; description?: string }) => Promise<void>;
  region?: Region | null;
}

export default function RegionModal({ isOpen, onClose, onSave, region }: RegionModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Initialiser le formulaire
  useEffect(() => {
    if (isOpen) {
      if (region) {
        setFormData({
          nom: region.nom || '',
          description: region.description || ''
        });
      } else {
        setFormData({
          nom: '',
          description: ''
        });
      }
      setErrors({});
      setTouchedFields(new Set());
    }
  }, [region, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setTouchedFields(prev => new Set(prev).add(name));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom de la région est requis';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    } else if (formData.nom.length > 100) {
      newErrors.nom = 'Le nom ne doit pas dépasser 100 caractères';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La description ne doit pas dépasser 500 caractères';
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
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setErrors(prev => ({ ...prev, submit: 'Erreur lors de la sauvegarde' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête */}
          <div className={`px-5 py-3 ${region ? 'bg-gradient-to-r from-water-blue to-sky-soft' : 'bg-gradient-to-r from-olive-nature to-forest-deep'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-warm-white bg-opacity-20 rounded-lg">
                  {region ? (
                    <FaEdit className="w-4 h-4 text-warm-white" />
                  ) : (
                    <FaPlus className="w-4 h-4 text-warm-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-warm-white">
                    {region ? 'Modifier la région' : 'Nouvelle région'}
                  </h3>
                  <p className="text-[10px] text-warm-white text-opacity-90">
                    {region 
                      ? 'Modifiez les informations' 
                      : 'Ajoutez une nouvelle région'}
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
            <div className="px-5 py-4 space-y-4">
              {/* Message d'erreur global */}
              {errors.submit && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                  {errors.submit}
                </div>
              )}

              {/* Champ Nom */}
              <div>
                <label className="block text-xs font-medium text-forest-deep mb-1">
                  Nom de la région <span className="text-sun-gold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-4 w-4 text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('nom'))}
                    className={`w-full pl-10 pr-3 py-2 text-sm border ${
                      touchedFields.has('nom') && errors.nom 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-border-light'
                    } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                    placeholder="Ex: Analamanga, Atsinanana..."
                  />
                </div>
                {touchedFields.has('nom') && errors.nom && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <FaExclamationCircle className="w-3 h-3 mr-1" />
                    {errors.nom}
                  </p>
                )}
                <p className="mt-1.5 text-[10px] text-text-secondary">
                  2-100 caractères • Nom unique
                </p>
              </div>

              {/* Champ Description */}
              <div>
                <label className="block text-xs font-medium text-forest-deep mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={() => setTouchedFields(prev => new Set(prev).add('description'))}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm border ${
                    touchedFields.has('description') && errors.description 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border-light'
                  } rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all resize-none bg-warm-white`}
                  placeholder="Description de la région (optionnelle)..."
                />
                {touchedFields.has('description') && errors.description && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <FaExclamationCircle className="w-3 h-3 mr-1" />
                    {errors.description}
                  </p>
                )}
                <div className="mt-1 flex justify-end">
                  <span className={`text-[10px] ${
                    formData.description.length > 450 ? 'text-sun-gold' : 'text-text-secondary'
                  }`}>
                    {formData.description.length}/500
                  </span>
                </div>
              </div>

              {/* Information supplémentaire */}
              {region && (
                <div className="bg-sky-soft/10 p-3 rounded-xl border border-sky-soft/30">
                  <div className="flex items-start space-x-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-water-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-water-blue">
                        Informations système
                      </p>
                      <p className="text-[10px] text-text-secondary mt-1">
                        Créée le {new Date(region.createdAt || '').toLocaleDateString('fr-FR')}
                        {region.updatedAt !== region.createdAt && 
                          ` • Modifiée le ${new Date(region.updatedAt || '').toLocaleDateString('fr-FR')}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pied de page */}
            <div className="px-5 py-3 bg-ultra-light border-t border-border-light flex justify-between items-center">
              <div className="text-[10px] text-text-secondary flex items-center">
                <FaExclamationCircle className="w-3 h-3 mr-1" />
                <span>
                  <span className="text-sun-gold mr-0.5">*</span> requis
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-medium text-text-secondary bg-warm-white border border-border-light rounded-lg hover:bg-ultra-light transition-all"
                  disabled={isSubmitting}
                >
                  <FaTimes className="w-3 h-3 mr-1 inline-block" />
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-3 py-1.5 text-xs font-medium text-warm-white bg-gradient-to-r ${
                    region 
                      ? 'from-water-blue to-sky-soft' 
                      : 'from-olive-nature to-forest-deep'
                  } rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center shadow-sm`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                      {region ? 'Modif...' : 'Créat...'}
                    </>
                  ) : (
                    <>
                      <FaSave className="w-3 h-3 mr-1" />
                      {region ? 'Modifier' : 'Enregistrer'}
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