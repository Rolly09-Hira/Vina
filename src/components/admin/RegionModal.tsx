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

  // Initialiser le formulaire
  useEffect(() => {
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
  }, [region]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-2xl">
          {/* En-tête */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                  {region ? (
                    <FaEdit className="w-5 h-5 text-white" />
                  ) : (
                    <FaPlus className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {region ? 'Modifier la région' : 'Nouvelle région'}
                  </h3>
                  <p className="text-sm text-blue-100 mt-0.5">
                    {region 
                      ? 'Modifiez les informations de la région' 
                      : 'Ajoutez une nouvelle région'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-blue-500 rounded-xl transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-5">
              {/* Champ Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la région <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 border ${
                      errors.nom ? 'border-red-500 ring-red-100' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Ex: Analamanga, Atsinanana, etc."
                  />
                </div>
                {errors.nom && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="w-3.5 h-3.5 mr-1.5" />
                    {errors.nom}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-gray-500">
                  Le nom doit être unique et comporter entre 2 et 100 caractères
                </p>
              </div>

              {/* Champ Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2.5 border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none`}
                  placeholder="Description de la région (optionnelle)..."
                />
                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="w-3.5 h-3.5 mr-1.5" />
                    {errors.description}
                  </p>
                )}
                <div className="mt-1.5 flex justify-end">
                  <span className={`text-xs ${
                    formData.description.length > 450 ? 'text-orange-500' : 'text-gray-500'
                  }`}>
                    {formData.description.length}/500 caractères
                  </span>
                </div>
              </div>

              {/* Information supplémentaire */}
              {region && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Informations système
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
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
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500 flex items-center">
                <FaExclamationCircle className="w-4 h-4 mr-1.5 text-gray-400" />
                <span>
                  Les champs marqués d'un <span className="text-red-500 mx-0.5">*</span> sont obligatoires
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center"
                  disabled={isSubmitting}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 flex items-center shadow-lg shadow-blue-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                      {region ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4 mr-2" />
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