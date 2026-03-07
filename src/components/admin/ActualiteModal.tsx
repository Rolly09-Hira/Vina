// src/components/admin/ActualiteModal.tsx
import { useState, useEffect } from 'react';
import type { Actualite } from '../../services/actualiteService';
import { 
  FaTimes, 
  FaNewspaper, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaImage,
  FaUpload,
  FaTrash,
  FaSpinner,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaExclamationCircle
} from 'react-icons/fa';

interface ActualiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  actualite?: Actualite | null;
}

// Mapping des couleurs
const getTypeColors = (type: string) => {
  const colors = {
    olive: { bg: 'bg-olive-nature', light: 'bg-olive-nature/10', text: 'text-olive-nature', border: 'border-olive-nature/30' },
    water: { bg: 'bg-water-blue', light: 'bg-water-blue/10', text: 'text-water-blue', border: 'border-water-blue/30' },
    earth: { bg: 'bg-earth-brown', light: 'bg-earth-brown/10', text: 'text-earth-brown', border: 'border-earth-brown/30' }
  };
  return colors[type as keyof typeof colors] || colors.olive;
};

export default function ActualiteModal({ isOpen, onClose, onSave, actualite }: ActualiteModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

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
        setImagePreview(`https://web-production-03b53.up.railway.app/${actualite.imageUrl}`);
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
      setCurrentStep(1);
    }
    setErrors({});
    setTouchedFields(new Set());
  }, [actualite, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Max 10MB' }));
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setErrors(prev => ({ ...prev, image: 'Format non supporté' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));
      
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    setTouchedFields(prev => new Set(prev).add(name));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.titreFr.trim()) newErrors.titreFr = 'Requis';
      if (!formData.titreEn.trim()) newErrors.titreEn = 'Required';
    }

    if (step === 2) {
      if (!formData.contenuFr.trim()) newErrors.contenuFr = 'Requis';
      if (!formData.contenuEn.trim()) newErrors.contenuEn = 'Required';
    }

    if (step === 3) {
      if (!formData.datePublication) newErrors.datePublication = 'Requis';
      if (formData.type === 'evenement' && !formData.lieu.trim()) {
        newErrors.lieu = 'Lieu requis';
      }
      if (formData.dateEvenement && new Date(formData.dateEvenement) < new Date(formData.datePublication)) {
        newErrors.dateEvenement = 'Date invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => validateStep(currentStep) && setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Important : empêche la soumission automatique
    
    if (!validateStep(3) || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value.toString());
      });
      if (imageFile) formDataToSend.append('imageFile', imageFile);

      await onSave(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const typeColors = getTypeColors(
    formData.type === 'evenement' ? 'water' : 
    formData.type === 'rapport' ? 'earth' : 'olive'
  );

  const steps = [
    { number: 1, title: 'Titres', icon: FaNewspaper },
    { number: 2, title: 'Contenu', icon: FaNewspaper },
    { number: 3, title: 'Détails', icon: FaCalendarAlt }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm" onClick={onClose} />

        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête avec gradient */}
          <div className={`px-6 py-4 bg-gradient-to-r ${typeColors.bg} bg-opacity-90`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warm-white/20 rounded-xl">
                  {actualite ? <FaNewspaper className="w-5 h-5 text-warm-white" /> : <FaNewspaper className="w-5 h-5 text-warm-white" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-warm-white">
                    {actualite ? 'Modifier' : 'Nouvelle actualité'}
                  </h3>
                  <p className="text-xs text-warm-white/90">
                    {actualite ? 'Modifiez les informations' : 'Remplissez les informations'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose} 
                className="p-1 text-warm-white hover:bg-warm-white/20 rounded-lg"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      currentStep === step.number
                        ? 'bg-warm-white text-forest-deep scale-110 shadow-md'
                        : currentStep > step.number
                        ? 'bg-sun-gold text-forest-deep'
                        : 'bg-warm-white/30 text-warm-white'
                    }`}>
                      {currentStep > step.number ? <FaCheck className="w-3 h-3" /> : step.number}
                    </div>
                    <span className="text-[10px] text-warm-white mt-1">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-1 rounded-full ${
                      currentStep > step.number ? 'bg-sun-gold' : 'bg-warm-white/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Étape {currentStep}/3</span>
                  <span className="font-semibold text-olive-nature">{Math.round((currentStep / 3) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-border-light rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-olive-nature to-sun-gold rounded-full transition-all"
                       style={{ width: `${(currentStep / 3) * 100}%` }} />
                </div>
              </div>

              {/* Étape 1: Titres */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-sm font-semibold text-forest-deep mb-3">Titres</h4>
                    <div className="space-y-4">
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
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-olive-nature ${
                            errors.titreFr && touchedFields.has('titreFr') ? 'border-red-500' : 'border-border-light'
                          }`}
                          placeholder="Ex: Nouveau projet lancé"
                        />
                        {errors.titreFr && touchedFields.has('titreFr') && (
                          <p className="mt-1 text-xs text-red-600">{errors.titreFr}</p>
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
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-olive-nature ${
                            errors.titreEn && touchedFields.has('titreEn') ? 'border-red-500' : 'border-border-light'
                          }`}
                          placeholder="Ex: New project launched"
                        />
                        {errors.titreEn && touchedFields.has('titreEn') && (
                          <p className="mt-1 text-xs text-red-600">{errors.titreEn}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Contenu */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-sm font-semibold text-forest-deep mb-3">Contenu</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Contenu français <span className="text-sun-gold">*</span>
                        </label>
                        <textarea
                          name="contenuFr"
                          value={formData.contenuFr}
                          onChange={handleChange}
                          rows={5}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-olive-nature resize-none ${
                            errors.contenuFr && touchedFields.has('contenuFr') ? 'border-red-500' : 'border-border-light'
                          }`}
                          placeholder="Contenu en français..."
                        />
                        {errors.contenuFr && touchedFields.has('contenuFr') && (
                          <p className="mt-1 text-xs text-red-600">{errors.contenuFr}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-forest-deep mb-1">
                          Contenu anglais <span className="text-sun-gold">*</span>
                        </label>
                        <textarea
                          name="contenuEn"
                          value={formData.contenuEn}
                          onChange={handleChange}
                          rows={5}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-olive-nature resize-none ${
                            errors.contenuEn && touchedFields.has('contenuEn') ? 'border-red-500' : 'border-border-light'
                          }`}
                          placeholder="Content in English..."
                        />
                        {errors.contenuEn && touchedFields.has('contenuEn') && (
                          <p className="mt-1 text-xs text-red-600">{errors.contenuEn}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 3: Détails */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  {/* Type et dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-xs font-semibold text-forest-deep mb-2">Type</h4>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature bg-white"
                      >
                        <option value="nouvelle">Nouvelle</option>
                        <option value="evenement">Événement</option>
                        <option value="rapport">Rapport</option>
                      </select>
                    </div>

                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-xs font-semibold text-forest-deep mb-2">Important</h4>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="important"
                          name="important"
                          checked={formData.important}
                          onChange={handleChange}
                          className="w-4 h-4 text-sun-gold border-border-light rounded focus:ring-sun-gold"
                        />
                        <label htmlFor="important" className="text-sm text-text-secondary">
                          À la une
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-xs font-semibold text-forest-deep mb-2">Publication *</h4>
                      <input
                        type="date"
                        name="datePublication"
                        value={formData.datePublication}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-olive-nature ${
                          errors.datePublication ? 'border-red-500' : 'border-border-light'
                        }`}
                      />
                      {errors.datePublication && (
                        <p className="mt-1 text-xs text-red-600">{errors.datePublication}</p>
                      )}
                    </div>

                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-xs font-semibold text-forest-deep mb-2">Événement</h4>
                      <input
                        type="date"
                        name="dateEvenement"
                        value={formData.dateEvenement}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-olive-nature ${
                          errors.dateEvenement ? 'border-red-500' : 'border-border-light'
                        }`}
                      />
                      {errors.dateEvenement && (
                        <p className="mt-1 text-xs text-red-600">{errors.dateEvenement}</p>
                      )}
                    </div>
                  </div>

                  {/* Lieu (conditionnel) */}
                  {formData.type === 'evenement' && (
                    <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                      <h4 className="text-xs font-semibold text-forest-deep mb-2">Lieu *</h4>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-water-blue w-4 h-4" />
                        <input
                          type="text"
                          name="lieu"
                          value={formData.lieu}
                          onChange={handleChange}
                          className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-olive-nature ${
                            errors.lieu ? 'border-red-500' : 'border-border-light'
                          }`}
                          placeholder="Antananarivo"
                        />
                      </div>
                      {errors.lieu && <p className="mt-1 text-xs text-red-600">{errors.lieu}</p>}
                    </div>
                  )}

                  {/* Image */}
                  <div className="bg-ultra-light p-4 rounded-xl border border-border-light">
                    <h4 className="text-xs font-semibold text-forest-deep mb-2 flex items-center gap-1">
                      <FaImage className="text-sun-gold" /> Image
                    </h4>
                    <div className="flex items-center justify-center w-full">
                      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                        errors.image ? 'border-red-500' : 'border-sun-gold/30'
                      } border-dashed rounded-xl cursor-pointer bg-white hover:bg-ultra-light transition-all`}>
                        <div className="flex flex-col items-center justify-center relative w-full h-full">
                          {imagePreview ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img src={imagePreview} alt="Preview" className="max-h-24 max-w-full object-contain" />
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(''); }}
                                className="absolute top-1 right-1 bg-earth-brown text-warm-white p-1 rounded-full hover:bg-forest-deep"
                              >
                                <FaTrash className="w-2 h-2" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <FaUpload className="w-5 h-5 text-sun-gold mb-1" />
                              <p className="text-xs text-text-secondary">Uploader une image</p>
                              <p className="text-[10px] text-text-secondary">PNG, JPG (10MB max)</p>
                            </>
                          )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Pied de page */}
            <div className="px-6 py-3 bg-ultra-light border-t border-border-light flex justify-between items-center">
              <div className="text-xs text-text-secondary">
                <FaExclamationCircle className="inline w-3 h-3 mr-1" />
                <span className="text-sun-gold">*</span> requis
              </div>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-4 py-2 text-xs font-medium border border-border-light rounded-lg hover:bg-white"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    onClick={prevStep} 
                    className="px-4 py-2 text-xs font-medium border border-border-light rounded-lg hover:bg-white flex items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <FaArrowLeft className="w-3 h-3" /> Préc
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep} 
                    className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-olive-nature to-forest-deep rounded-lg hover:from-forest-deep flex items-center gap-1"
                    disabled={isSubmitting}
                  >
                    Suiv <FaArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-olive-nature to-forest-deep rounded-lg hover:from-forest-deep disabled:opacity-50 flex items-center gap-1"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin w-3 h-3" />
                        En cours...
                      </>
                    ) : (
                      <>
                        <FaCheck className="w-3 h-3" />
                        {actualite ? 'Modifier' : 'Créer'}
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