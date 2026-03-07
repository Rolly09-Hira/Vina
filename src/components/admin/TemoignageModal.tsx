// src/components/admin/TemoignageModal.tsx
import { useState, useEffect } from 'react';
import { type Temoignage } from '../../services/temoignageService';
import { 
  FaQuoteLeft, 
  FaCalendarAlt, 
  FaSortNumericDown,
  FaToggleOn,
  FaCamera,
  FaVideo,
  FaEye,
  FaTimes,
  FaSpinner,
  FaCheck,
  FaTrash,
  FaUpload,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';

interface TemoignageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  temoignage: Temoignage | null;
}

const TYPE_OPTIONS = [
  { value: 'PHOTO', label: 'Photo', icon: FaCamera, color: 'sky' },
  { value: 'VIDEO', label: 'Vidéo', icon: FaVideo, color: 'sun' },
  { value: 'PHOTO_VIDEO', label: 'Photo & Vidéo', icon: FaEye, color: 'olive' },
];

// Mapping des couleurs VINA pour chaque type
const typeColors = {
  PHOTO: { 
    bg: 'bg-sky-soft/20', 
    text: 'text-water-blue', 
    border: 'border-sky-soft/30', 
    button: 'bg-gradient-to-r from-water-blue to-sky-soft hover:from-sky-soft hover:to-water-blue',
    icon: 'text-water-blue'
  },
  VIDEO: { 
    bg: 'bg-sun-gold/20', 
    text: 'text-sun-gold', 
    border: 'border-sun-gold/30', 
    button: 'bg-gradient-to-r from-sun-gold to-soft-sun hover:from-soft-sun hover:to-sun-gold',
    icon: 'text-sun-gold'
  },
  PHOTO_VIDEO: { 
    bg: 'bg-olive-nature/20', 
    text: 'text-olive-nature', 
    border: 'border-olive-nature/30', 
    button: 'bg-gradient-to-r from-olive-nature to-forest-deep hover:from-forest-deep hover:to-premium-dark',
    icon: 'text-olive-nature'
  },
};

export default function TemoignageModal({ isOpen, onClose, onSave, temoignage }: TemoignageModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    auteurFr: '',
    auteurEn: '',
    fonctionFr: '',
    fonctionEn: '',
    contenuFr: '',
    contenuEn: '',
    typeTemoignage: 'PHOTO' as 'PHOTO' | 'VIDEO' | 'PHOTO_VIDEO',
    datePublication: new Date().toISOString().split('T')[0],
    actif: true,
    ordreAffichage: 1,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Réinitialiser quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSubmitting(false);
      setLoading(false);
      
      if (temoignage) {
        setFormData({
          auteurFr: temoignage.auteurFr || '',
          auteurEn: temoignage.auteurEn || '',
          fonctionFr: temoignage.fonctionFr || '',
          fonctionEn: temoignage.fonctionEn || '',
          contenuFr: temoignage.contenuFr || '',
          contenuEn: temoignage.contenuEn || '',
          typeTemoignage: temoignage.typeTemoignage || 'PHOTO',
          datePublication: temoignage.datePublication.split('T')[0],
          actif: temoignage.actif,
          ordreAffichage: temoignage.ordreAffichage || 1,
        });
        if (temoignage.photoUrl) {
          setPhotoPreview(`https://web-production-03b53.up.railway.app/${temoignage.photoUrl}`);
        }
        if (temoignage.videoUrl) {
          setVideoPreview(`https://web-production-03b53.up.railway.app/${temoignage.videoUrl}`);
        }
      } else {
        resetForm();
      }
    }
  }, [isOpen, temoignage]);

  const resetForm = () => {
    setFormData({
      auteurFr: '',
      auteurEn: '',
      fonctionFr: '',
      fonctionEn: '',
      contenuFr: '',
      contenuEn: '',
      typeTemoignage: 'PHOTO',
      datePublication: new Date().toISOString().split('T')[0],
      actif: true,
      ordreAffichage: 1,
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setVideoFile(null);
    setVideoPreview('');
    setErrors({});
    setCurrentStep(1);
    setIsSubmitting(false);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 1 : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (type: 'PHOTO' | 'VIDEO' | 'PHOTO_VIDEO') => {
    setFormData(prev => ({
      ...prev,
      typeTemoignage: type,
    }));
    if (type !== 'PHOTO' && type !== 'PHOTO_VIDEO') {
      setPhotoFile(null);
      setPhotoPreview('');
    }
    if (type !== 'VIDEO' && type !== 'PHOTO_VIDEO') {
      setVideoFile(null);
      setVideoPreview('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limites différentes pour photo et vidéo
    const maxSize = type === 'photo' ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB pour photo, 50MB pour vidéo
    
    if (file.size > maxSize) {
      setErrors(prev => ({ 
        ...prev, 
        [type]: type === 'photo' ? 'Max 10MB' : 'Max 50MB' 
      }));
      return;
    }

    if (type === 'photo') {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setVideoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    setErrors(prev => ({ ...prev, [type]: '' }));
  };

  const removeFile = (type: 'photo' | 'video') => {
    if (type === 'photo') {
      setPhotoFile(null);
      setPhotoPreview('');
    } else {
      setVideoFile(null);
      setVideoPreview('');
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.auteurFr.trim()) newErrors.auteurFr = 'Requis';
      if (!formData.auteurEn.trim()) newErrors.auteurEn = 'Required';
      if (!formData.fonctionFr.trim()) newErrors.fonctionFr = 'Requis';
      if (!formData.fonctionEn.trim()) newErrors.fonctionEn = 'Required';
    }

    if (step === 2) {
      if (!formData.contenuFr.trim()) newErrors.contenuFr = 'Requis';
      if (!formData.contenuEn.trim()) newErrors.contenuEn = 'Required';
    }

    if (step === 3) {
      if (formData.typeTemoignage === 'PHOTO' && !photoPreview) {
        newErrors.photo = 'Photo requise';
      }
      if (formData.typeTemoignage === 'VIDEO' && !videoPreview) {
        newErrors.video = 'Vidéo requise';
      }
      if (formData.typeTemoignage === 'PHOTO_VIDEO') {
        if (!photoPreview) newErrors.photo = 'Photo requise';
        if (!videoPreview) newErrors.video = 'Vidéo requise';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Important : empêche la soumission automatique du formulaire
    
    if (!validateStep(3) || isSubmitting || loading) return;

    setIsSubmitting(true);
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, value.toString());
      }
    });
    if (photoFile) data.append('photoFile', photoFile);
    if (videoFile) data.append('videoFile', videoFile);

    try {
      await onSave(data);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      setErrors(prev => ({ ...prev, submit: 'Erreur lors de la sauvegarde' }));
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const colors = typeColors[formData.typeTemoignage];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm" onClick={onClose} />

        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête compact */}
          <div className={`px-6 py-4 ${temoignage ? 'bg-gradient-to-r from-water-blue to-sky-soft' : 'bg-gradient-to-r from-olive-nature to-forest-deep'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warm-white bg-opacity-20 rounded-xl">
                  {temoignage ? <FaEye className="w-5 h-5 text-warm-white" /> : <FaQuoteLeft className="w-5 h-5 text-warm-white" />}
                </div>
                <h3 className="text-lg font-bold text-warm-white">
                  {temoignage ? 'Modifier le témoignage' : 'Nouveau témoignage'}
                </h3>
              </div>
              <button onClick={onClose} className="p-1.5 text-warm-white hover:bg-warm-white hover:bg-opacity-20 rounded-lg transition-all">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper compact */}
            <div className="flex items-center justify-center mt-3 space-x-1">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    currentStep === step
                      ? 'bg-warm-white text-olive-nature scale-110 shadow-md'
                      : currentStep > step
                      ? 'bg-sun-gold text-forest-deep'
                      : 'bg-warm-white bg-opacity-30 text-warm-white'
                  }`}>
                    {currentStep > step ? <FaCheck className="w-3 h-3" /> : step}
                  </div>
                  {step < 3 && <div className={`w-10 h-1 mx-1 rounded-full ${
                    currentStep > step ? 'bg-sun-gold' : 'bg-warm-white bg-opacity-30'
                  }`} />}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              {/* Barre de progression compacte */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Étape {currentStep}/3</span>
                  <span className="font-medium text-olive-nature">{Math.round((currentStep / 3) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-border-light rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-olive-nature to-sun-gold rounded-full transition-all duration-500"
                       style={{ width: `${(currentStep / 3) * 100}%` }} />
                </div>
              </div>

              {/* Étape 1: Identité */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-base font-semibold text-forest-deep mb-3 flex items-center">
                      <div className="w-6 h-6 bg-olive-nature text-warm-white rounded-lg flex items-center justify-center mr-2">
                        <FaQuoteLeft className="w-3 h-3" />
                      </div>
                      Identité du témoin
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Auteur (FR) <span className="text-sun-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="auteurFr"
                          value={formData.auteurFr}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 text-sm border ${
                            errors.auteurFr ? 'border-red-500 bg-red-50' : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                          placeholder="Jean Dupont"
                        />
                        {errors.auteurFr && <p className="mt-1 text-xs text-red-600">{errors.auteurFr}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Auteur (EN) <span className="text-sun-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="auteurEn"
                          value={formData.auteurEn}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 text-sm border ${
                            errors.auteurEn ? 'border-red-500 bg-red-50' : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                          placeholder="John Doe"
                        />
                        {errors.auteurEn && <p className="mt-1 text-xs text-red-600">{errors.auteurEn}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Fonction (FR) <span className="text-sun-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="fonctionFr"
                          value={formData.fonctionFr}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 text-sm border ${
                            errors.fonctionFr ? 'border-red-500 bg-red-50' : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                          placeholder="Bénéficiaire"
                        />
                        {errors.fonctionFr && <p className="mt-1 text-xs text-red-600">{errors.fonctionFr}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Fonction (EN) <span className="text-sun-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="fonctionEn"
                          value={formData.fonctionEn}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 text-sm border ${
                            errors.fonctionEn ? 'border-red-500 bg-red-50' : 'border-border-light'
                          } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                          placeholder="Beneficiary"
                        />
                        {errors.fonctionEn && <p className="mt-1 text-xs text-red-600">{errors.fonctionEn}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Contenu */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-base font-semibold text-forest-deep mb-3 flex items-center">
                      <div className="w-6 h-6 bg-water-blue text-warm-white rounded-lg flex items-center justify-center mr-2">
                        <FaQuoteLeft className="w-3 h-3" />
                      </div>
                      Contenu du témoignage
                    </h4>
                    <div>
                      <label className="block text-xs font-medium text-forest-deep mb-1">
                        Contenu (FR) <span className="text-sun-gold">*</span>
                      </label>
                      <textarea
                        name="contenuFr"
                        value={formData.contenuFr}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-3 py-2 text-sm border ${
                          errors.contenuFr ? 'border-red-500 bg-red-50' : 'border-border-light'
                        } rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all resize-none bg-warm-white`}
                        placeholder="Témoignage en français..."
                      />
                      {errors.contenuFr && <p className="mt-1 text-xs text-red-600">{errors.contenuFr}</p>}
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-forest-deep mb-1">
                        Contenu (EN) <span className="text-sun-gold">*</span>
                      </label>
                      <textarea
                        name="contenuEn"
                        value={formData.contenuEn}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-3 py-2 text-sm border ${
                          errors.contenuEn ? 'border-red-500 bg-red-50' : 'border-border-light'
                        } rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all resize-none bg-warm-white`}
                        placeholder="Testimony in English..."
                      />
                      {errors.contenuEn && <p className="mt-1 text-xs text-red-600">{errors.contenuEn}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 3: Médias et paramètres */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Type de témoignage */}
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-sm font-semibold text-forest-deep mb-3">Type de témoignage</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {TYPE_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = formData.typeTemoignage === option.value;
                        const optionColors = typeColors[option.value as keyof typeof typeColors];
                        
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleTypeChange(option.value as any)}
                            className={`p-3 rounded-lg border transition-all ${
                              isSelected
                                ? `${optionColors.bg} ${optionColors.border} shadow-md`
                                : 'border-border-light hover:border-text-secondary bg-warm-white'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? optionColors.icon : 'text-text-secondary'}`} />
                            <span className={`text-xs font-medium ${isSelected ? optionColors.text : 'text-text-secondary'}`}>
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Uploads */}
                  <div className="grid grid-cols-2 gap-4">
                    {(formData.typeTemoignage === 'PHOTO' || formData.typeTemoignage === 'PHOTO_VIDEO') && (
                      <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                        <label className="block text-xs font-medium text-forest-deep mb-2 flex items-center">
                          <FaCamera className="w-3 h-3 mr-1 text-water-blue" />
                          Photo {formData.typeTemoignage === 'PHOTO' && <span className="text-sun-gold ml-1">*</span>}
                        </label>
                        {photoPreview ? (
                          <div className="relative group">
                            <img src={photoPreview} alt="" className="w-full h-24 object-cover rounded-lg border border-border-light" />
                            <button type="button" onClick={() => removeFile('photo')}
                                    className="absolute top-1 right-1 p-1.5 bg-earth-brown text-warm-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-forest-deep transition-all shadow-md">
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border-light rounded-xl cursor-pointer hover:border-water-blue transition-colors bg-warm-white">
                            <FaUpload className="w-4 h-4 text-text-secondary mb-1" />
                            <span className="text-xs text-text-secondary">Upload</span>
                            <p className="text-[10px] text-border-light">Max 10MB</p>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'photo')} />
                          </label>
                        )}
                        {errors.photo && <p className="mt-1 text-xs text-red-600">{errors.photo}</p>}
                      </div>
                    )}

                    {(formData.typeTemoignage === 'VIDEO' || formData.typeTemoignage === 'PHOTO_VIDEO') && (
                      <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                        <label className="block text-xs font-medium text-forest-deep mb-2 flex items-center">
                          <FaVideo className="w-3 h-3 mr-1 text-sun-gold" />
                          Vidéo {formData.typeTemoignage === 'VIDEO' && <span className="text-sun-gold ml-1">*</span>}
                        </label>
                        {videoPreview ? (
                          <div className="relative group">
                            <video src={videoPreview} className="w-full h-24 object-cover rounded-lg border border-border-light" controls />
                            <button type="button" onClick={() => removeFile('video')}
                                    className="absolute top-1 right-1 p-1.5 bg-earth-brown text-warm-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-forest-deep transition-all shadow-md">
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border-light rounded-xl cursor-pointer hover:border-sun-gold transition-colors bg-warm-white">
                            <FaUpload className="w-4 h-4 text-text-secondary mb-1" />
                            <span className="text-xs text-text-secondary">Upload</span>
                            <p className="text-[10px] text-border-light">Max 50MB</p>
                            <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'video')} />
                          </label>
                        )}
                        {errors.video && <p className="mt-1 text-xs text-red-600">{errors.video}</p>}
                      </div>
                    )}
                  </div>

                  {/* Paramètres */}
                  <div className="grid grid-cols-3 gap-2">
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
                          className="w-4 h-4 text-olive-nature border-border-light rounded focus:ring-olive-nature" 
                        />
                      </label>
                    </div>
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
                          <FaCalendarAlt className="w-3 h-3 mr-1 text-sun-gold" />
                          Date
                        </span>
                        <input 
                          type="date" 
                          name="datePublication" 
                          value={formData.datePublication} 
                          onChange={handleChange}
                          className="w-28 px-1 py-0.5 text-xs border border-border-light rounded bg-warm-white focus:ring-2 focus:ring-olive-nature" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pied de page compact */}
            <div className="px-6 py-3 bg-ultra-light border-t border-border-light flex justify-between items-center">
              <div className="text-xs text-text-secondary">
                <span className="text-sun-gold">*</span> requis
              </div>
              <div className="flex space-x-2">
                <button type="button" onClick={onClose}
                        className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border-light rounded-lg hover:bg-warm-white transition-all"
                        disabled={loading}>
                  Annuler
                </button>
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep}
                          className="px-3 py-1.5 text-xs font-medium text-forest-deep bg-warm-white border border-border-light rounded-lg hover:bg-ultra-light transition-all flex items-center"
                          disabled={loading}>
                    <FaArrowLeft className="w-3 h-3 mr-1" />
                    Préc
                  </button>
                )}
                {currentStep < 3 ? (
                  <button type="button" onClick={nextStep}
                          className="px-3 py-1.5 text-xs font-medium text-warm-white bg-gradient-to-r from-olive-nature to-forest-deep rounded-lg hover:from-forest-deep hover:to-premium-dark transition-all flex items-center shadow-md"
                          disabled={loading}>
                    Suiv
                    <FaArrowRight className="w-3 h-3 ml-1" />
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || isSubmitting}
                    className={`px-3 py-1.5 text-xs font-medium text-warm-white ${colors?.button || 'bg-gradient-to-r from-olive-nature to-forest-deep'} rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center shadow-md`}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                        ...
                      </>
                    ) : (
                      <>
                        <FaCheck className="w-3 h-3 mr-1" />
                        {temoignage ? 'Modifier' : 'Créer'}
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