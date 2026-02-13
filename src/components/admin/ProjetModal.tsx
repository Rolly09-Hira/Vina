// src/components/admin/ProjetModal.tsx
import { useState, useEffect } from 'react';
import type { Projet } from '../../services/projetService';

interface ProjetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  projet?: Projet | null;
}

export default function ProjetModal({ isOpen, onClose, onSave, projet }: ProjetModalProps) {
  const [formData, setFormData] = useState({
    titreFr: '',
    titreEn: '',
    descriptionFr: '',
    descriptionEn: '',
    objectifFr: '',
    objectifEn: '',
    dateDebut: '',
    dateFin: '',
    statut: 'en_cours' as 'en_cours' | 'termine' | 'a_venir' | 'suspendu',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (projet) {
      setFormData({
        titreFr: projet.titreFr || '',
        titreEn: projet.titreEn || '',
        descriptionFr: projet.descriptionFr || '',
        descriptionEn: projet.descriptionEn || '',
        objectifFr: projet.objectifFr || '',
        objectifEn: projet.objectifEn || '',
        dateDebut: projet.dateDebut ? new Date(projet.dateDebut).toISOString().split('T')[0] : '',
        dateFin: projet.dateFin ? new Date(projet.dateFin).toISOString().split('T')[0] : '',
        statut: projet.statut || 'en_cours',
      });
      
      if (projet.imageUrl) {
        setImagePreview(`http://localhost:5005/${projet.imageUrl}`);
      }
    } else {
      setFormData({
        titreFr: '',
        titreEn: '',
        descriptionFr: '',
        descriptionEn: '',
        objectifFr: '',
        objectifEn: '',
        dateDebut: '',
        dateFin: '',
        statut: 'en_cours',
      });
      setImageFile(null);
      setImagePreview('');
    }
    setErrors({});
  }, [projet]);

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titreFr.trim()) newErrors.titreFr = 'Le titre français est requis';
    if (!formData.titreEn.trim()) newErrors.titreEn = 'Le titre anglais est requis';
    if (!formData.descriptionFr.trim()) newErrors.descriptionFr = 'La description française est requise';
    if (!formData.descriptionEn.trim()) newErrors.descriptionEn = 'La description anglaise est requise';
    if (!formData.objectifFr.trim()) newErrors.objectifFr = 'L\'objectif français est requis';
    if (!formData.objectifEn.trim()) newErrors.objectifEn = 'L\'objectif anglais est requis';
    if (!formData.dateDebut) newErrors.dateDebut = 'La date de début est requise';
    
    if (formData.dateFin && new Date(formData.dateFin) < new Date(formData.dateDebut)) {
      newErrors.dateFin = 'La date de fin doit être après la date de début';
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
      formDataToSend.append('descriptionFr', formData.descriptionFr);
      formDataToSend.append('descriptionEn', formData.descriptionEn);
      formDataToSend.append('objectifFr', formData.objectifFr);
      formDataToSend.append('objectifEn', formData.objectifEn);
      formDataToSend.append('dateDebut', formData.dateDebut);
      if (formData.dateFin) {
        formDataToSend.append('dateFin', formData.dateFin);
      }
      formDataToSend.append('statut', formData.statut);
      
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
                  {projet ? 'Modifier le projet' : 'Nouveau projet'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {projet ? 'Modifiez les informations du projet' : 'Remplissez les informations du nouveau projet'}
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
                    placeholder="Ex: Potagers communautaires"
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
                    placeholder="Ex: Community gardens"
                  />
                  {errors.titreEn && <p className="mt-1 text-sm text-red-600">{errors.titreEn}</p>}
                </div>
              </div>

              {/* Section Objectifs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objectif français *
                  </label>
                  <input
                    type="text"
                    name="objectifFr"
                    value={formData.objectifFr}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.objectifFr ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ex: Créer des potagers communautaires"
                  />
                  {errors.objectifFr && <p className="mt-1 text-sm text-red-600">{errors.objectifFr}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objectif anglais *
                  </label>
                  <input
                    type="text"
                    name="objectifEn"
                    value={formData.objectifEn}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.objectifEn ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ex: Create community gardens"
                  />
                  {errors.objectifEn && <p className="mt-1 text-sm text-red-600">{errors.objectifEn}</p>}
                </div>
              </div>

              {/* Section Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description française *
                  </label>
                  <textarea
                    name="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border ${errors.descriptionFr ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Décrivez le projet en français..."
                  />
                  {errors.descriptionFr && <p className="mt-1 text-sm text-red-600">{errors.descriptionFr}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description anglaise *
                  </label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border ${errors.descriptionEn ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Describe the project in English..."
                  />
                  {errors.descriptionEn && <p className="mt-1 text-sm text-red-600">{errors.descriptionEn}</p>}
                </div>
              </div>

              {/* Section Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.dateDebut ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.dateDebut && <p className="mt-1 text-sm text-red-600">{errors.dateDebut}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    name="dateFin"
                    value={formData.dateFin}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.dateFin ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.dateFin && <p className="mt-1 text-sm text-red-600">{errors.dateFin}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Optionnel - Laissez vide si le projet est en cours
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut *
                  </label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="a_venir">À venir</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </div>
              </div>

              {/* Section Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image du projet
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
                    L'image sera affichée sur la page des projets. Taille recommandée: 1920x1080px
                  </p>
                </div>
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
                      {projet ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {projet ? 'Modifier le projet' : 'Créer le projet'}
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