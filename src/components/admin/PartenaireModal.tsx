// src/components/admin/PartenaireModal.tsx
import { useState, useEffect } from 'react';
import type { Partenaire } from '../../services/partenaireService';

interface PartenaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  partenaire?: Partenaire | null;
}

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

  useEffect(() => {
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
        setLogoPreview(`http://localhost:5005/${partenaire.logoUrl}`);
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
  }, [partenaire]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation de la taille (max 5MB pour les logos)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Le logo ne doit pas dépasser 5MB' }));
        return;
      }

      // Validation du type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/jpg'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setErrors(prev => ({ ...prev, logo: 'Format d\'image non supporté. Utilisez JPG, JPEG, PNG, GIF, SVG ou WEBP.' }));
        return;
      }

      setLogoFile(file);
      setErrors(prev => ({ ...prev, logo: '' }));
      
      // Créer une preview
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

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.dateDebutPartenaire) newErrors.dateDebutPartenaire = 'La date de début de partenariat est requise';
    
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
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les champs texte
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('type', formData.type);
      
      if (formData.descriptionFr) {
        formDataToSend.append('descriptionFr', formData.descriptionFr);
      }
      if (formData.descriptionEn) {
        formDataToSend.append('descriptionEn', formData.descriptionEn);
      }
      if (formData.siteWeb) {
        formDataToSend.append('siteWeb', formData.siteWeb);
      }
      if (formData.email) {
        formDataToSend.append('email', formData.email);
      }
      if (formData.telephone) {
        formDataToSend.append('telephone', formData.telephone);
      }
      if (formData.adresse) {
        formDataToSend.append('adresse', formData.adresse);
      }
      
      formDataToSend.append('dateDebutPartenaire', formData.dateDebutPartenaire);
      formDataToSend.append('actif', formData.actif.toString());
      
      // Ajouter le logo si il existe
      if (logoFile) {
        formDataToSend.append('logoFile', logoFile);
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
                  {partenaire ? 'Modifier le partenaire' : 'Nouveau partenaire'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {partenaire ? 'Modifiez les informations du partenaire' : 'Remplissez les informations du nouveau partenaire'}
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
              {/* Section Nom et Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du partenaire *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ex: Entreprise ABC"
                  />
                  {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de partenaire *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="entreprise">Entreprise</option>
                    <option value="individu">Individu</option>
                    <option value="association">Association</option>
                    <option value="institution">Institution</option>
                  </select>
                </div>
              </div>

              {/* Section Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo du partenaire
                </label>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        {logoPreview ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              className="w-full h-full object-contain p-4"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setLogoFile(null);
                                setLogoPreview('');
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs text-gray-500 mt-2">Aucun logo</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour uploader</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF, SVG, WEBP (Max. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </label>
                      {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Le logo sera affiché sur la page des partenaires. Taille recommandée: 400x400px
                  </p>
                </div>
              </div>

              {/* Section Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description française
                  </label>
                  <textarea
                    name="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Description en français..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description anglaise
                  </label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Description in English..."
                  />
                </div>
              </div>

              {/* Section Coordonnées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    name="siteWeb"
                    value={formData.siteWeb}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.siteWeb ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="https://www.exemple.com"
                  />
                  {errors.siteWeb && <p className="mt-1 text-sm text-red-600">{errors.siteWeb}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="contact@exemple.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="+261 XX XX XXX XX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Adresse complète"
                  />
                </div>
              </div>

              {/* Section Date et Statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début du partenariat *
                  </label>
                  <input
                    type="date"
                    name="dateDebutPartenaire"
                    value={formData.dateDebutPartenaire}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.dateDebutPartenaire ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.dateDebutPartenaire && <p className="mt-1 text-sm text-red-600">{errors.dateDebutPartenaire}</p>}
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="actif"
                      name="actif"
                      checked={formData.actif}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="actif" className="font-medium text-gray-700">
                      Partenaire actif
                    </label>
                    <p className="text-gray-500">
                      Le partenaire sera visible sur le site
                    </p>
                  </div>
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
                      {partenaire ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {partenaire ? 'Modifier le partenaire' : 'Créer le partenaire'}
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