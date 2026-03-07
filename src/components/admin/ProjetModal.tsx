// src/components/admin/ProjetModal.tsx
import { useState, useEffect, useMemo } from 'react';
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
  FaUserFriends,
  FaTint,
  FaGavel,
  FaGraduationCap,
  FaTractor,
  FaCity,
  FaChevronDown,
  FaExclamationCircle,
  FaPlayCircle,
  FaHourglassHalf,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

interface ProjetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  projet?: Projet | null;
}

// Liste des domaines complète avec couleurs VINA
const DOMAINES = [
  { id: 'environnement', fr: 'Environnement', en: 'Environment', icon: FaLeaf, color: 'olive' },
  { id: 'social', fr: 'Social', en: 'Social', icon: FaUserFriends, color: 'water' },
  { id: 'economique', fr: 'Économique', en: 'Economic', icon: FaChartLine, color: 'sun' },
  { id: 'education', fr: 'Éducation', en: 'Education', icon: FaGraduationCap, color: 'purple' },
  { id: 'agriculture', fr: 'Agriculture', en: 'Agriculture', icon: FaTractor, color: 'green' },
  { id: 'eau', fr: 'Eau & Assainissement', en: 'Water & Sanitation', icon: FaTint, color: 'cyan' },
  { id: 'sante', fr: 'Santé', en: 'Health', icon: FaHeartbeat, color: 'rose' },
  { id: 'infrastructure', fr: 'Infrastructure', en: 'Infrastructure', icon: FaCity, color: 'slate' },
  { id: 'gouvernance', fr: 'Gouvernance', en: 'Governance', icon: FaGavel, color: 'earth' }
];

// Configuration des couleurs VINA pour chaque domaine
const getDomainColors = (colorName: string) => {
  const colors: Record<string, { bg: string, light: string, text: string, border: string, gradient: string }> = {
    olive: { 
      bg: 'bg-olive-nature', 
      light: 'bg-olive-nature/10', 
      text: 'text-olive-nature', 
      border: 'border-olive-nature/30',
      gradient: 'from-olive-nature to-forest-deep'
    },
    water: { 
      bg: 'bg-water-blue', 
      light: 'bg-water-blue/10', 
      text: 'text-water-blue', 
      border: 'border-water-blue/30',
      gradient: 'from-water-blue to-sky-soft'
    },
    sun: { 
      bg: 'bg-sun-gold', 
      light: 'bg-sun-gold/10', 
      text: 'text-sun-gold', 
      border: 'border-sun-gold/30',
      gradient: 'from-sun-gold to-soft-sun'
    },
    earth: { 
      bg: 'bg-earth-brown', 
      light: 'bg-earth-brown/10', 
      text: 'text-earth-brown', 
      border: 'border-earth-brown/30',
      gradient: 'from-earth-brown to-forest-deep'
    },
    purple: { 
      bg: 'bg-purple-600', 
      light: 'bg-purple-50', 
      text: 'text-purple-700', 
      border: 'border-purple-200',
      gradient: 'from-purple-600 to-indigo-500'
    },
    green: { 
      bg: 'bg-green-600', 
      light: 'bg-green-50', 
      text: 'text-green-700', 
      border: 'border-green-200',
      gradient: 'from-green-600 to-emerald-500'
    },
    cyan: { 
      bg: 'bg-cyan-600', 
      light: 'bg-cyan-50', 
      text: 'text-cyan-700', 
      border: 'border-cyan-200',
      gradient: 'from-cyan-600 to-sky-500'
    },
    rose: { 
      bg: 'bg-rose-600', 
      light: 'bg-rose-50', 
      text: 'text-rose-700', 
      border: 'border-rose-200',
      gradient: 'from-rose-600 to-pink-500'
    },
    slate: { 
      bg: 'bg-slate-600', 
      light: 'bg-slate-50', 
      text: 'text-slate-700', 
      border: 'border-slate-200',
      gradient: 'from-slate-600 to-gray-500'
    }
  };
  return colors[colorName] || colors.olive;
};

export default function ProjetModal({ isOpen, onClose, onSave, projet }: ProjetModalProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
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
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

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
        setImagePreview(`https://web-production-03b53.up.railway.app/${projet.imageUrl}`);
      }
    } else {
      // Réinitialiser pour un nouveau projet
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        titreFr: '',
        titreEn: '',
        descriptionFr: '',
        descriptionEn: '',
        objectifFr: '',
        objectifEn: '',
        domaineFr: '',
        domaineEn: '',
        dateDebut: today,
        dateFin: '',
        statut: 'a_venir',
        regionId: '',
        beneficiaires: '',
      });
      setImageFile(null);
      setImagePreview('');
      setCurrentStep(1);
    }
    setErrors({});
    setTouchedFields(new Set());
  }, [projet]);

  // Déterminer le statut suggéré basé sur les dates
  const getSuggestedStatut = useMemo(() => {
    if (!formData.dateDebut) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateDebut = new Date(formData.dateDebut);
    dateDebut.setHours(0, 0, 0, 0);
    
    if (formData.dateFin) {
      const dateFin = new Date(formData.dateFin);
      dateFin.setHours(0, 0, 0, 0);
      
      if (dateFin < today) {
        return { value: 'termine', label: 'Terminé', icon: FaCheckCircle, color: 'water' };
      }
    }
    
    if (dateDebut > today) {
      return { value: 'a_venir', label: 'À venir', icon: FaHourglassHalf, color: 'sun' };
    } else if (dateDebut <= today) {
      return { value: 'en_cours', label: 'En cours', icon: FaPlayCircle, color: 'olive' };
    }
    
    return null;
  }, [formData.dateDebut, formData.dateFin]);

  // Appliquer le statut suggéré
  const applySuggestedStatut = () => {
    if (getSuggestedStatut) {
      setFormData(prev => ({
        ...prev,
        statut: getSuggestedStatut!.value as any
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'L\'image ne doit pas dépasser 10MB' }));
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setErrors(prev => ({ ...prev, image: 'Format non supporté. Utilisez JPG, PNG, GIF ou WEBP.' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));
      
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
    
    setTouchedFields(prev => new Set(prev).add(name));
    
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
    setTouchedFields(prev => new Set(prev).add('domaineFr'));
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
    
    if (formData.dateFin && formData.dateDebut) {
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(formData.dateFin);
      if (dateFin < dateDebut) {
        newErrors.dateFin = 'La date de fin doit être après la date de début';
      }
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
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'regionId' && key !== 'beneficiaires') {
          formDataToSend.append(key, value);
        }
      });
      
      if (formData.regionId) formDataToSend.append('regionId', formData.regionId);
      if (formData.beneficiaires) formDataToSend.append('beneficiaires', formData.beneficiaires);
      if (imageFile) formDataToSend.append('imageFile', imageFile);

      await onSave(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert('Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  const SelectedDomaineIcon = DOMAINES.find(d => d.fr === formData.domaineFr)?.icon || FaTag;
  const domaineColors = getDomainColors(DOMAINES.find(d => d.fr === formData.domaineFr)?.color || 'olive');
  const suggestedStatut = getSuggestedStatut;

  // Configuration des étapes
  const steps = [
    { number: 1, title: 'Base', icon: FaClipboardList },
    { number: 2, title: 'Objectifs', icon: FaBullseye },
    { number: 3, title: 'Détails', icon: FaCalendarAlt }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay avec backdrop blur */}
        <div className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal avec taille réduite */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête compact avec couleurs VINA */}
          <div className={`px-6 py-4 ${projet ? 'bg-gradient-to-r from-water-blue to-sky-soft' : 'bg-gradient-to-r from-olive-nature to-forest-deep'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warm-white bg-opacity-20 rounded-xl">
                  {projet ? (
                    <FaEdit className="w-5 h-5 text-warm-white" />
                  ) : (
                    <FaPlus className="w-5 h-5 text-warm-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-warm-white">
                    {projet ? 'Modifier le projet' : 'Nouveau projet'}
                  </h3>
                  <p className="text-xs text-warm-white text-opacity-90">
                    {projet ? 'Modifiez les informations' : 'Remplissez les informations'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-warm-white hover:bg-warm-white hover:bg-opacity-20 rounded-lg transition-all"
                title="Fermer"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper compact avec couleurs VINA */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentStep === step.number
                          ? 'bg-warm-white text-olive-nature scale-110 shadow-md'
                          : currentStep > step.number
                          ? 'bg-sun-gold text-forest-deep'
                          : 'bg-warm-white bg-opacity-30 text-warm-white'
                      }`}
                    >
                      {currentStep > step.number ? <FaCheck className="w-4 h-4" /> : step.icon({ className: "w-4 h-4" })}
                    </div>
                    <span className="text-[10px] text-warm-white mt-1 font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-1 rounded-full transition-all duration-300 ${
                      currentStep > step.number ? 'bg-sun-gold' : 'bg-warm-white bg-opacity-30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire avec hauteur réduite */}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="px-6 py-4 space-y-4 max-h-[50vh] overflow-y-auto">
              {/* Barre de progression compacte */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Progression</span>
                  <span className="font-semibold text-olive-nature">{Math.round((currentStep / 3) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-border-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-olive-nature to-sun-gold rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Étape 1: Informations de base */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-base font-semibold text-forest-deep mb-3 flex items-center">
                      <div className="w-6 h-6 bg-olive-nature text-warm-white rounded-lg flex items-center justify-center mr-2">
                        <FaClipboardList className="w-3 h-3" />
                      </div>
                      Informations
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Titre français <span className="text-sun-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="titreFr"
                          value={formData.titreFr}
                          onChange={handleChange}
                          onBlur={() => setTouchedFields(prev => new Set(prev).add('titreFr'))}
                          className={`w-full px-3 py-2 text-sm border ${
                            touchedFields.has('titreFr') && errors.titreFr 
                              ? 'border-red-500 bg-red-50' 
                              : touchedFields.has('titreFr') && !errors.titreFr
                              ? 'border-olive-nature bg-olive-nature/5'
                              : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                          placeholder="Ex: Potagers communautaires"
                        />
                        {touchedFields.has('titreFr') && errors.titreFr && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <FaExclamationCircle className="w-3 h-3 mr-1" />
                            {errors.titreFr}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Titre anglais <span className="text-sun-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="titreEn"
                          value={formData.titreEn}
                          onChange={handleChange}
                          onBlur={() => setTouchedFields(prev => new Set(prev).add('titreEn'))}
                          className={`w-full px-3 py-2 text-sm border ${
                            touchedFields.has('titreEn') && errors.titreEn 
                              ? 'border-red-500 bg-red-50' 
                              : touchedFields.has('titreEn') && !errors.titreEn
                              ? 'border-olive-nature bg-olive-nature/5'
                              : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                          placeholder="Ex: Community gardens"
                        />
                        {touchedFields.has('titreEn') && errors.titreEn && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <FaExclamationCircle className="w-3 h-3 mr-1" />
                            {errors.titreEn}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Objectifs */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-base font-semibold text-forest-deep mb-3 flex items-center">
                      <div className="w-6 h-6 bg-water-blue text-warm-white rounded-lg flex items-center justify-center mr-2">
                        <FaBullseye className="w-3 h-3" />
                      </div>
                      Objectifs
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Objectif français <span className="text-sun-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="objectifFr"
                          value={formData.objectifFr}
                          onChange={handleChange}
                          onBlur={() => setTouchedFields(prev => new Set(prev).add('objectifFr'))}
                          className={`w-full px-3 py-2 text-sm border ${
                            touchedFields.has('objectifFr') && errors.objectifFr 
                              ? 'border-red-500 bg-red-50' 
                              : touchedFields.has('objectifFr') && !errors.objectifFr
                              ? 'border-water-blue bg-water-blue/5'
                              : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white`}
                          placeholder="Ex: Améliorer la sécurité alimentaire"
                        />
                        {touchedFields.has('objectifFr') && errors.objectifFr && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <FaExclamationCircle className="w-3 h-3 mr-1" />
                            {errors.objectifFr}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Objectif anglais <span className="text-sun-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="objectifEn"
                          value={formData.objectifEn}
                          onChange={handleChange}
                          onBlur={() => setTouchedFields(prev => new Set(prev).add('objectifEn'))}
                          className={`w-full px-3 py-2 text-sm border ${
                            touchedFields.has('objectifEn') && errors.objectifEn 
                              ? 'border-red-500 bg-red-50' 
                              : touchedFields.has('objectifEn') && !errors.objectifEn
                              ? 'border-water-blue bg-water-blue/5'
                              : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white`}
                          placeholder="Ex: Improve food security"
                        />
                        {touchedFields.has('objectifEn') && errors.objectifEn && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <FaExclamationCircle className="w-3 h-3 mr-1" />
                            {errors.objectifEn}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 3: Détails complets */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Descriptions */}
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-base font-semibold text-forest-deep mb-3 flex items-center">
                      <div className="w-6 h-6 bg-sun-gold text-forest-deep rounded-lg flex items-center justify-center mr-2">
                        <FaFileAlt className="w-3 h-3" />
                      </div>
                      Descriptions
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Description FR <span className="text-sun-gold">*</span>
                        </label>
                        <textarea
                          name="descriptionFr"
                          value={formData.descriptionFr}
                          onChange={handleChange}
                          onBlur={() => setTouchedFields(prev => new Set(prev).add('descriptionFr'))}
                          rows={3}
                          className={`w-full px-3 py-2 text-sm border ${
                            touchedFields.has('descriptionFr') && errors.descriptionFr 
                              ? 'border-red-500 bg-red-50' 
                              : touchedFields.has('descriptionFr') && !errors.descriptionFr
                              ? 'border-sun-gold bg-sun-gold/5'
                              : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all resize-none bg-warm-white`}
                          placeholder="Décrivez le projet..."
                        />
                        {touchedFields.has('descriptionFr') && errors.descriptionFr && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <FaExclamationCircle className="w-3 h-3 mr-1" />
                            {errors.descriptionFr}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Description EN <span className="text-sun-gold">*</span>
                        </label>
                        <textarea
                          name="descriptionEn"
                          value={formData.descriptionEn}
                          onChange={handleChange}
                          onBlur={() => setTouchedFields(prev => new Set(prev).add('descriptionEn'))}
                          rows={3}
                          className={`w-full px-3 py-2 text-sm border ${
                            touchedFields.has('descriptionEn') && errors.descriptionEn 
                              ? 'border-red-500 bg-red-50' 
                              : touchedFields.has('descriptionEn') && !errors.descriptionEn
                              ? 'border-sun-gold bg-sun-gold/5'
                              : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all resize-none bg-warm-white`}
                          placeholder="Describe the project..."
                        />
                        {touchedFields.has('descriptionEn') && errors.descriptionEn && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <FaExclamationCircle className="w-3 h-3 mr-1" />
                            {errors.descriptionEn}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Classification compacte */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-sm font-semibold text-forest-deep mb-3 flex items-center">
                        <FaTag className="w-4 h-4 mr-2 text-sun-gold" />
                        Domaine
                      </h4>
                      <div className="relative">
                        <select
                          name="domaineFr"
                          value={formData.domaineFr}
                          onChange={handleDomaineChange}
                          onBlur={() => setTouchedFields(prev => new Set(prev).add('domaineFr'))}
                          className={`w-full px-3 py-2 text-sm border ${
                            touchedFields.has('domaineFr') && errors.domaineFr 
                              ? 'border-red-500 bg-red-50' 
                              : formData.domaineFr
                              ? `${domaineColors.border} ${domaineColors.light}`
                              : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all appearance-none bg-warm-white pr-8`}
                        >
                          <option value="">Sélectionnez</option>
                          {DOMAINES.map(domaine => (
                            <option key={domaine.fr} value={domaine.fr}>{domaine.fr}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          {formData.domaineFr ? (
                            <SelectedDomaineIcon className={`w-3 h-3 ${domaineColors.text}`} />
                          ) : (
                            <FaChevronDown className="w-3 h-3 text-text-secondary" />
                          )}
                        </div>
                      </div>
                      {errors.domaineFr && (
                        <p className="mt-1 text-xs text-red-600">{errors.domaineFr}</p>
                      )}
                    </div>

                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-sm font-semibold text-forest-deep mb-3 flex items-center">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2 text-water-blue" />
                        Région
                      </h4>
                      <select
                        name="regionId"
                        value={formData.regionId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white"
                        disabled={loadingRegions}
                      >
                        <option value="">{loadingRegions ? 'Chargement...' : 'Sélectionnez'}</option>
                        {regions.map(region => (
                          <option key={region.id} value={region.id}>{region.nom}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-sm font-semibold text-forest-deep mb-3 flex items-center">
                        <FaUsers className="w-4 h-4 mr-2 text-sun-gold" />
                        Bénéficiaires
                      </h4>
                      <input
                        type="number"
                        name="beneficiaires"
                        value={formData.beneficiaires}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all bg-warm-white"
                        placeholder="Ex: 1000"
                      />
                    </div>
                  </div>

                  {/* Dates compactes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-sm font-semibold text-forest-deep mb-3 flex items-center">
                        <FaCalendarAlt className="w-4 h-4 mr-2 text-water-blue" />
                        Début <span className="text-sun-gold">*</span>
                      </h4>
                      <input
                        type="date"
                        name="dateDebut"
                        value={formData.dateDebut}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border ${
                          errors.dateDebut ? 'border-red-500' : 'border-border-light'
                        } rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white`}
                      />
                      {errors.dateDebut && (
                        <p className="mt-1 text-xs text-red-600">{errors.dateDebut}</p>
                      )}
                    </div>

                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-sm font-semibold text-forest-deep mb-3 flex items-center">
                        <FaCalendarAlt className="w-4 h-4 mr-2 text-water-blue" />
                        Fin
                      </h4>
                      <input
                        type="date"
                        name="dateFin"
                        value={formData.dateFin}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white"
                      />
                    </div>

                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-sm font-semibold text-forest-deep mb-3 flex items-center">
                        <FaClock className="w-4 h-4 mr-2 text-sun-gold" />
                        Statut
                      </h4>
                      <select
                        name="statut"
                        value={formData.statut}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all bg-warm-white"
                      >
                        <option value="en_cours">En cours</option>
                        <option value="termine">Terminé</option>
                        <option value="a_venir">À venir</option>
                        <option value="suspendu">Suspendu</option>
                      </select>
                      
                      {suggestedStatut && suggestedStatut.value !== formData.statut && (
                        <button
                          type="button" 
                          onClick={applySuggestedStatut}
                          className="mt-2 w-full text-xs px-2 py-1 bg-warm-white rounded-lg hover:bg-ultra-light border border-border-light flex items-center justify-center"
                        >
                          <suggestedStatut.icon className={`w-3 h-3 mr-1 ${
                            suggestedStatut.color === 'olive' ? 'text-olive-nature' :
                            suggestedStatut.color === 'sun' ? 'text-sun-gold' : 'text-water-blue'
                          }`} />
                          <span>Appliquer "{suggestedStatut.label}"</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Image compacte */}
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-sm font-semibold text-forest-deep mb-3 flex items-center">
                      <FaImage className="w-4 h-4 mr-2 text-sun-gold" />
                      Image
                    </h4>
                    <div className="flex items-center justify-center w-full">
                      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                        errors.image ? 'border-red-500' : 'border-sun-gold/30'
                      } border-dashed rounded-xl cursor-pointer bg-warm-white hover:bg-ultra-light transition-all group`}>
                        <div className="flex flex-col items-center justify-center relative w-full h-full">
                          {imagePreview ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-h-24 max-w-full object-contain rounded-lg"
                              />
                              <button
                                type="button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageFile(null);
                                  setImagePreview('');
                                }}
                                className="absolute top-1 right-1 bg-earth-brown text-warm-white p-1 rounded-full hover:bg-forest-deep transition-colors shadow-md"
                              >
                                <FaTrash className="w-2 h-2" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <FaUpload className="w-4 h-4 text-sun-gold mb-1" />
                              <p className="text-xs text-text-secondary">
                                <span className="font-semibold text-sun-gold">Uploader</span> une image
                              </p>
                              <p className="text-[10px] text-text-secondary">PNG, JPG (Max. 10MB)</p>
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
                      <p className="mt-1 text-xs text-red-600">{errors.image}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pied de page compact */}
            <div className="px-6 py-3 bg-ultra-light border-t border-border-light flex justify-between items-center">
              <div className="text-xs text-text-secondary flex items-center">
                <FaExclamationCircle className="w-3 h-3 mr-1 text-text-secondary" />
                <span><span className="text-sun-gold">*</span> Obligatoire</span>
              </div>
              
              <div className="flex space-x-2">
                {currentStep > 1 && (
                  <button
                    type="button"  
                    onClick={prevStep}
                    className="px-4 py-2 text-xs font-medium text-forest-deep bg-warm-white border border-border-light rounded-lg hover:bg-ultra-light transition-all flex items-center"
                  >
                    <FaArrowLeft className="w-3 h-3 mr-1" />
                    Préc
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 text-xs font-medium text-warm-white bg-gradient-to-r from-olive-nature to-forest-deep rounded-lg hover:from-forest-deep hover:to-premium-dark transition-all flex items-center shadow-md"
                  >
                    Suiv
                    <FaArrowRight className="w-3 h-3 ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-medium text-warm-white bg-gradient-to-r from-olive-nature to-forest-deep rounded-lg hover:from-forest-deep hover:to-premium-dark transition-all disabled:opacity-50 flex items-center shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                        {projet ? 'Modif...' : 'Créer...'}
                      </>
                    ) : (
                      <>
                        <FaCheck className="w-3 h-3 mr-1" />
                        {projet ? 'Modifier' : 'Créer'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}