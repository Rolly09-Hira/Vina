// src/components/admin/ActualiteModal.tsx
import { useState, useEffect } from 'react';
import type { Actualite } from '../../services/actualiteService';

interface ActualiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  actualite?: Actualite | null;
}

export default function ActualiteModal({ isOpen, onClose, onSave, actualite }: ActualiteModalProps) {
  const [formData, setFormData] = useState({
    titreFr: '',
    titreEn: '',
    contenuFr: '',
    contenuEn: '',
    type: 'nouvelle' as 'evenement' | 'nouvelle' | 'rapport',
    datePublication: '',
    dateEvenement: '',
    lieu: '',
    important: false,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (actualite) {
      setFormData({
        titreFr: actualite.titreFr || '',
        titreEn: actualite.titreEn || '',
        contenuFr: actualite.contenuFr || '',
        contenuEn: actualite.contenuEn || '',
        type: actualite.type || 'nouvelle',
        datePublication: actualite.datePublication ? new Date(actualite.datePublication).toISOString().split('T')[0] : '',
        dateEvenement: actualite.dateEvenement ? new Date(actualite.dateEvenement).toISOString().split('T')[0] : '',
        lieu: actualite.lieu || '',
        important: actualite.important || false,
      });
      
      if (actualite.imageUrl) {
        setImagePreview(`http://localhost:5005/${actualite.imageUrl}`);
      }
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        titreFr: '',
        titreEn: '',
        contenuFr: '',
        contenuEn: '',
        type: 'nouvelle',
        datePublication: today,
        dateEvenement: '',
        lieu: '',
        important: false,
      });
      setImageFile(null);
      setImagePreview('');
    }
    setErrors({});
  }, [actualite]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation de la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'L\'image ne doit pas dépasser 10MB' }));
        return;
      }

      // Validation du type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setErrors(prev => ({ ...prev, image: 'Format d\'image non supporté. Utilisez JPG, JPEG, PNG, GIF ou WEBP.' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));
      
      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titreFr.trim()) newErrors.titreFr = 'Le titre français est requis';
    if (!formData.titreEn.trim()) newErrors.titreEn = 'Le titre anglais est requis';
    if (!formData.contenuFr.trim()) newErrors.contenuFr = 'Le contenu français est requis';
    if (!formData.contenuEn.trim()) newErrors.contenuEn = 'Le contenu anglais est requis';
    if (!formData.datePublication) newErrors.datePublication = 'La date de publication est requise';
    
    if (formData.dateEvenement && new Date(formData.dateEvenement) < new Date(formData.datePublication)) {
      newErrors.dateEvenement = 'La date d\'événement doit être après la date de publication';
    }

    if (formData.type === 'evenement' && !formData.lieu.trim()) {
      newErrors.lieu = 'Le lieu est requis pour un événement';
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
      const formDataToSend = new FormData();
      
      // Ajouter les champs texte
      formDataToSend.append('titreFr', formData.titreFr);
      formDataToSend.append('titreEn', formData.titreEn);
      formDataToSend.append('contenuFr', formData.contenuFr);
      formDataToSend.append('contenuEn', formData.contenuEn);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('datePublication', formData.datePublication);
      
      if (formData.dateEvenement) {
        formDataToSend.append('dateEvenement', formData.dateEvenement);
      }
      
      if (formData.lieu) {
        formDataToSend.append('lieu', formData.lieu);
      }
      
      formDataToSend.append('important', formData.important.toString());
      
      // Ajouter l'image si elle existe
      if (imageFile) {
        formDataToSend.append('imageFile', imageFile);
      }

      await onSave(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert('Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* En-tête */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {actualite ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {actualite ? 'Modifiez les informations de l\'actualité' : 'Remplissez les informations de la nouvelle actualité'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Section Titres */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre français *
                  </label>
                  <input
                    type="text"
                    name="titreFr"
                    value={formData.titreFr}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.titreFr ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ex: Nouveau projet lancé"
                  />
                  {errors.titreFr && <p className="mt-1 text-sm text-red-600">{errors.titreFr}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre anglais *
                  </label>
                  <input
                    type="text"
                    name="titreEn"
                    value={formData.titreEn}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.titreEn ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ex: New project launched"
                  />
                  {errors.titreEn && <p className="mt-1 text-sm text-red-600">{errors.titreEn}</p>}
                </div>
              </div>

              {/* Section Type et Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="nouvelle">Nouvelle</option>
                    <option value="evenement">Événement</option>
                    <option value="rapport">Rapport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de publication *
                  </label>
                  <input
                    type="date"
                    name="datePublication"
                    value={formData.datePublication}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.datePublication ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.datePublication && <p className="mt-1 text-sm text-red-600">{errors.datePublication}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'événement
                  </label>
                  <input
                    type="date"
                    name="dateEvenement"
                    value={formData.dateEvenement}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.dateEvenement ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.dateEvenement && <p className="mt-1 text-sm text-red-600">{errors.dateEvenement}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Optionnel - Pour les événements
                  </p>
                </div>
              </div>

              {/* Lieu (conditionnel pour événements) */}
              {formData.type === 'evenement' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de l'événement *
                  </label>
                  <input
                    type="text"
                    name="lieu"
                    value={formData.lieu}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.lieu ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ex: Antananarivo, Madagascar"
                  />
                  {errors.lieu && <p className="mt-1 text-sm text-red-600">{errors.lieu}</p>}
                </div>
              )}

              {/* Section Contenus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu français *
                  </label>
                  <textarea
                    name="contenuFr"
                    value={formData.contenuFr}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-3 py-2 border ${errors.contenuFr ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Contenu en français..."
                  />
                  {errors.contenuFr && <p className="mt-1 text-sm text-red-600">{errors.contenuFr}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu anglais *
                  </label>
                  <textarea
                    name="contenuEn"
                    value={formData.contenuEn}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-3 py-2 border ${errors.contenuEn ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Content in English..."
                  />
                  {errors.contenuEn && <p className="mt-1 text-sm text-red-600">{errors.contenuEn}</p>}
                </div>
              </div>

              {/* Section Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de l'actualité
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-64 border-2 ${errors.image ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="max-h-48 mx-auto object-contain rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageFile(null);
                                setImagePreview('');
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF, WEBP (Max. 10MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                  <p className="text-xs text-gray-500">
                    L'image sera affichée avec l'actualité. Taille recommandée: 1920x1080px
                  </p>
                </div>
              </div>

              {/* Section Important */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="important"
                  name="important"
                  checked={formData.important}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="important" className="ml-2 text-sm font-medium text-gray-700">
                  Marquer comme important
                </label>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Sera mis en avant
                </span>
              </div>
            </div>

            {/* Pied de page */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                * Champs obligatoires
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {actualite ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {actualite ? 'Modifier l\'actualité' : 'Créer l\'actualité'}
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