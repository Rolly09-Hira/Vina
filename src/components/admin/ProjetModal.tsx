// src/components/admin/ProjetModal.tsx
import { useState, useEffect } from 'react';
import type { Projet } from '../../services/projetService';
import RegionService, { type Region } from '../../services/regionService';
import { 
  FaTimes,
  FaEdit,
  FaPlus,
  FaClipboardList,
  FaBullseye,
  FaFileAlt,
  FaTag,
  FaMapMarkerAlt,
  FaUsers,
  FaImage,
  FaCalendarAlt,
  FaSpinner,
  FaCheck,
  FaTrash,
  FaUpload,
  FaLeaf,
  FaHeartbeat,
  FaChartLine,
  FaHandsHelping,
  FaGraduationCap,
  FaTractor,
  FaCity,
  FaChevronDown,
  FaExclamationCircle
} from 'react-icons/fa';

interface ProjetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  projet?: Projet | null;
}

// Liste des domaines disponibles avec icônes Font Awesome
const DOMAINES = [
  { fr: 'Environnement', en: 'Environment', icon: FaLeaf },
  { fr: 'Santé', en: 'Health', icon: FaHeartbeat },
  { fr: 'Économique', en: 'Economic', icon: FaChartLine },
  { fr: 'Social', en: 'Social', icon: FaHandsHelping },
  { fr: 'Éducation', en: 'Education', icon: FaGraduationCap },
  { fr: 'Agriculture', en: 'Agriculture', icon: FaTractor },
  { fr: 'Infrastructure', en: 'Infrastructure', icon: FaCity }
];

export default function ProjetModal({ isOpen, onClose, onSave, projet }: ProjetModalProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  
  const [formData, setFormData] = useState({
    titreFr: '',
    titreEn: '',
    descriptionFr: '',
    descriptionEn: '',
    objectifFr: '',
    objectifEn: '',
    domaineFr: '',
    domaineEn: '',
    dateDebut: '',
    dateFin: '',
    statut: 'en_cours' as 'en_cours' | 'termine' | 'a_venir' | 'suspendu',
    regionId: '',
    beneficiaires: '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les régions
  useEffect(() => {
    if (isOpen) {
      fetchRegions();
    }
  }, [isOpen]);

  const fetchRegions = async () => {
    setLoadingRegions(true);
    try {
      const data = await RegionService.getAllRegions();
      setRegions(data);
    } catch (error) {
      console.error('Erreur lors du chargement des régions:', error);
    } finally {
      setLoadingRegions(false);
    }
  };

  // Initialiser le formulaire
  useEffect(() => {
    if (projet) {
      setFormData({
        titreFr: projet.titreFr || '',
        titreEn: projet.titreEn || '',
        descriptionFr: projet.descriptionFr || '',
        descriptionEn: projet.descriptionEn || '',
        objectifFr: projet.objectifFr || '',
        objectifEn: projet.objectifEn || '',
        domaineFr: projet.domaineFr || '',
        domaineEn: projet.domaineEn || '',
        dateDebut: projet.dateDebut ? new Date(projet.dateDebut).toISOString().split('T')[0] : '',
        dateFin: projet.dateFin ? new Date(projet.dateFin).toISOString().split('T')[0] : '',
        statut: projet.statut || 'en_cours',
        regionId: projet.region?.id?.toString() || '',
        beneficiaires: projet.beneficiaires?.toString() || '',
      });
      
      if (projet.imageUrl) {
        setImagePreview(`http://localhost:5005/${projet.imageUrl}`);
      }
    } else {
      // Réinitialiser pour un nouveau projet
      setFormData({
        titreFr: '',
        titreEn: '',
        descriptionFr: '',
        descriptionEn: '',
        objectifFr: '',
        objectifEn: '',
        domaineFr: '',
        domaineEn: '',
        dateDebut: '',
        dateFin: '',
        statut: 'en_cours',
        regionId: '',
        beneficiaires: '',
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

  const handleDomaineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const domaineFr = e.target.value;
    const domaine = DOMAINES.find(d => d.fr === domaineFr);
    setFormData(prev => ({
      ...prev,
      domaineFr: domaineFr,
      domaineEn: domaine?.en || ''
    }));
    if (errors.domaineFr) {
      setErrors(prev => ({ ...prev, domaineFr: '' }));
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
    if (!formData.domaineFr) newErrors.domaineFr = 'Le domaine est requis';
    if (!formData.dateDebut) newErrors.dateDebut = 'La date de début est requise';
    
    if (formData.dateFin && new Date(formData.dateFin) < new Date(formData.dateDebut)) {
      newErrors.dateFin = 'La date de fin doit être après la date de début';
    }

    if (formData.beneficiaires && parseInt(formData.beneficiaires) < 0) {
      newErrors.beneficiaires = 'Le nombre de bénéficiaires doit être positif';
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
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'regionId' && key !== 'beneficiaires') {
          formDataToSend.append(key, value);
        }
      });
      
      // Ajouter regionId si présent
      if (formData.regionId) {
        formDataToSend.append('regionId', formData.regionId);
      }
      
      // Ajouter beneficiaires si présent
      if (formData.beneficiaires) {
        formDataToSend.append('beneficiaires', formData.beneficiaires);
      }
      
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

  // Trouver l'icône du domaine sélectionné
  const SelectedDomaineIcon = DOMAINES.find(d => d.fr === formData.domaineFr)?.icon || FaTag;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay avec backdrop blur */}
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

        {/* Modal avec animation */}
        <div className="inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-2xl">
          {/* En-tête avec gradient */}
          <div className="px-8 py-6 bg-gradient-to-r from-green-600 to-green-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                  {projet ? (
                    <FaEdit className="w-6 h-6 text-white" />
                  ) : (
                    <FaPlus className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {projet ? 'Modifier le projet' : 'Nouveau projet'}
                  </h3>
                  <p className="text-sm text-green-100 mt-1">
                    {projet 
                      ? 'Modifiez les informations du projet existant' 
                      : 'Remplissez les informations pour créer un nouveau projet'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-green-500 rounded-xl transition-colors"
                title="Fermer"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Section 1: Informations de base */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3">
                    <FaClipboardList className="w-4 h-4" />
                  </div>
                  Informations générales
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre français <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="titreFr"
                      value={formData.titreFr}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.titreFr ? 'border-red-500 ring-red-100' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      placeholder="Ex: Potagers communautaires"
                    />
                    {errors.titreFr && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.titreFr}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre anglais <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="titreEn"
                      value={formData.titreEn}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.titreEn ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      placeholder="Ex: Community gardens"
                    />
                    {errors.titreEn && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.titreEn}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Objectifs */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <FaBullseye className="w-4 h-4" />
                  </div>
                  Objectifs
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectif français <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="objectifFr"
                      value={formData.objectifFr}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.objectifFr ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      placeholder="Ex: Créer des potagers communautaires"
                    />
                    {errors.objectifFr && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.objectifFr}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectif anglais <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="objectifEn"
                      value={formData.objectifEn}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.objectifEn ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      placeholder="Ex: Create community gardens"
                    />
                    {errors.objectifEn && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.objectifEn}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Descriptions */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <FaFileAlt className="w-4 h-4" />
                  </div>
                  Descriptions détaillées
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description française <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="descriptionFr"
                      value={formData.descriptionFr}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-2.5 border ${errors.descriptionFr ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none`}
                      placeholder="Décrivez le projet en français..."
                    />
                    {errors.descriptionFr && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.descriptionFr}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description anglaise <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-2.5 border ${errors.descriptionEn ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none`}
                      placeholder="Describe the project in English..."
                    />
                    {errors.descriptionEn && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.descriptionEn}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Classification et localisation */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mr-3">
                    <FaTag className="w-4 h-4" />
                  </div>
                  Classification et localisation
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domaine <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="domaineFr"
                        value={formData.domaineFr}
                        onChange={handleDomaineChange}
                        className={`w-full px-4 py-2.5 border ${errors.domaineFr ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none bg-white pr-10`}
                      >
                        <option value="">Sélectionnez un domaine</option>
                        {DOMAINES.map(domaine => {
                          return (
                            <option key={domaine.fr} value={domaine.fr}>
                              {domaine.fr}
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        {formData.domaineFr ? (
                          <SelectedDomaineIcon className="w-4 h-4 text-gray-400" />
                        ) : (
                          <FaChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {errors.domaineFr && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.domaineFr}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Région
                    </label>
                    <div className="relative">
                      <select
                        name="regionId"
                        value={formData.regionId}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none bg-white pr-10"
                        disabled={loadingRegions}
                      >
                        <option value="">
                          {loadingRegions ? 'Chargement...' : 'Sélectionnez une région'}
                        </option>
                        {regions.map(region => (
                          <option key={region.id} value={region.id}>
                            {region.nom}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Optionnel - Laissez vide si non applicable
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bénéficiaires
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="beneficiaires"
                        value={formData.beneficiaires}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-4 py-2.5 border ${errors.beneficiaires ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all pl-10`}
                        placeholder="Ex: 1000"
                      />
                      <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.beneficiaires && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.beneficiaires}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 5: Dates et statut */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <FaCalendarAlt className="w-4 h-4" />
                  </div>
                  Planning et statut
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateDebut"
                        value={formData.dateDebut}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.dateDebut ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      />
                    </div>
                    {errors.dateDebut && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.dateDebut}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateFin"
                        value={formData.dateFin}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.dateFin ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      />
                    </div>
                    {errors.dateFin && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.dateFin}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Optionnel - Laissez vide si le projet est en cours
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="statut"
                      value={formData.statut}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value="en_cours">En cours</option>
                      <option value="termine">Terminé</option>
                      <option value="a_venir">À venir</option>
                      <option value="suspendu">Suspendu</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 6: Image */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <FaImage className="w-4 h-4" />
                  </div>
                  Image du projet
                </h4>
                
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className={`flex flex-col items-center justify-center w-full h-64 border-2 ${errors.image ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors group`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 relative w-full h-full">
                          {imagePreview ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-h-48 max-w-full object-contain rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageFile(null);
                                  setImagePreview('');
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors mb-3">
                                <FaUpload className="w-6 h-6 text-gray-500" />
                              </div>
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold text-green-600">Cliquez pour uploader</span> ou glissez-déposez
                              </p>
                              <p className="text-xs text-gray-400">
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
                    {errors.image && (
                      <p className="text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="w-3 h-3 mr-1" />
                        {errors.image}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 flex items-center">
                      <FaImage className="w-3 h-3 mr-1 text-gray-400" />
                      L'image sera affichée sur la page des projets. Taille recommandée: 1920x1080px
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div className="px-8 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500 flex items-center">
                <FaExclamationCircle className="w-4 h-4 mr-1 text-gray-400" />
                Les champs marqués d'un <span className="text-red-500 mx-1">*</span> sont obligatoires
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center"
                  disabled={isSubmitting}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-green-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                      {projet ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4 mr-2" />
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