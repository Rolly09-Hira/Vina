// src/components/admin/MissionModal.tsx
import { useState, useEffect } from 'react';
import { type Mission } from '../../services/missionService';
import { 
  FaTimes, 
  FaSpinner, 
  FaCheck,
  FaUpload,
  FaTrash,
  FaToggleOn,
  FaSortNumericDown,
  FaBullseye,
  FaHeart,
  FaQuoteLeft,
  FaImage,
  FaTag,
  FaGlobe
} from 'react-icons/fa';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  mission: Mission | null;
}

export default function MissionModal({ isOpen, onClose, onSave, mission }: MissionModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    titreFr: '',
    titreEn: '',
    sloganFr: '',
    sloganEn: '',
    descriptionFr: '',
    descriptionEn: '',
    objectifsFr: '',
    objectifsEn: '',
    valeursFr: '',
    valeursEn: '',
    ordreAffichage: 1,
    actif: true,
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (mission) {
        setFormData({
          titreFr: mission.titreFr || '',
          titreEn: mission.titreEn || '',
          sloganFr: mission.sloganFr || '',
          sloganEn: mission.sloganEn || '',
          descriptionFr: mission.descriptionFr || '',
          descriptionEn: mission.descriptionEn || '',
          objectifsFr: mission.objectifsFr || '',
          objectifsEn: mission.objectifsEn || '',
          valeursFr: mission.valeursFr || '',
          valeursEn: mission.valeursEn || '',
          ordreAffichage: mission.ordreAffichage || 1,
          actif: mission.actif,
        });
        if (mission.iconUrl) {
          setIconPreview(`${mission.iconUrl}`);
        }
        if (mission.imageUrl) {
          setImagePreview(`${mission.imageUrl}`);
        }
      } else {
        resetForm();
      }
      setErrors({});
      setTouchedFields(new Set());
    }
  }, [isOpen, mission]);

  const resetForm = () => {
    setFormData({
      titreFr: '',
      titreEn: '',
      sloganFr: '',
      sloganEn: '',
      descriptionFr: '',
      descriptionEn: '',
      objectifsFr: '',
      objectifsEn: '',
      valeursFr: '',
      valeursEn: '',
      ordreAffichage: 1,
      actif: true,
    });
    setIconFile(null);
    setIconPreview('');
    setImageFile(null);
    setImagePreview('');
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Définir les limites
    const maxSize = type === 'icon' ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB pour icône, 5MB pour image
    const maxSizeMB = type === 'icon' ? '2 Mo' : '5 Mo';
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);

    // Vérifier la taille
    if (file.size > maxSize) {
      setErrors(prev => ({ 
        ...prev, 
        [type]: `❌ L'image dépasse ${maxSizeMB} (${fileSizeMB} Mo). Veuillez réduire la taille du fichier.` 
      }));
      e.target.value = '';
      return;
    }

    // Vérifier le type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrors(prev => ({ 
        ...prev, 
        [type]: `❌ Format non supporté (${file.type}). Types acceptés: JPG, PNG, GIF, WEBP, SVG` 
      }));
      e.target.value = '';
      return;
    }

    // Tout est valide, on efface l'erreur
    setErrors(prev => ({ ...prev, [type]: '' }));

    if (type === 'icon') {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type: 'icon' | 'image') => {
    if (type === 'icon') {
      setIconFile(null);
      setIconPreview('');
    } else {
      setImageFile(null);
      setImagePreview('');
    }
    setErrors(prev => ({ ...prev, [type]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titreFr.trim()) newErrors.titreFr = 'Requis';
    if (!formData.titreEn.trim()) newErrors.titreEn = 'Required';
    if (!formData.descriptionFr.trim()) newErrors.descriptionFr = 'Requis';
    if (!formData.descriptionEn.trim()) newErrors.descriptionEn = 'Required';

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

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        data.append(key, value.toString());
      }
    });
    
    if (iconFile) data.append('iconFile', iconFile);
    if (imageFile) data.append('imageFile', imageFile);

    try {
      await onSave(data);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors(prev => ({ ...prev, submit: '❌ Erreur lors de la sauvegarde. Veuillez réessayer.' }));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal - Taille réduite */}
        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête compact */}
          <div className={`px-5 py-3 ${mission ? 'bg-gradient-to-r from-water-blue to-sky-soft' : 'bg-gradient-to-r from-olive-nature to-forest-deep'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-warm-white bg-opacity-20 rounded-lg">
                  {mission ? <FaGlobe className="w-4 h-4 text-warm-white" /> : <FaBullseye className="w-4 h-4 text-warm-white" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-warm-white">
                    {mission ? 'Modifier la mission' : 'Nouvelle mission'}
                  </h3>
                  <p className="text-[10px] text-warm-white text-opacity-90">
                    {mission ? 'Modifiez les informations' : 'Remplissez les informations'}
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
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="px-5 py-3 space-y-3 max-h-[60vh] overflow-y-auto">
              {/* Message d'erreur global */}
              {errors.submit && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                  {errors.submit}
                </div>
              )}

              {/* Section Titres */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <h4 className="text-xs font-semibold text-forest-deep mb-2 flex items-center">
                  <FaTag className="w-3 h-3 mr-1 text-sun-gold" />
                  Titres
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-forest-deep mb-1">
                      Titre (FR) <span className="text-sun-gold">*</span>
                    </label>
                    <input
                      type="text"
                      name="titreFr"
                      value={formData.titreFr}
                      onChange={handleChange}
                      onBlur={() => setTouchedFields(prev => new Set(prev).add('titreFr'))}
                      className={`w-full px-2 py-1 text-xs border ${
                        touchedFields.has('titreFr') && errors.titreFr 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-border-light'
                      } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                      placeholder="Mission"
                    />
                    {errors.titreFr && <p className="mt-0.5 text-[10px] text-red-600">{errors.titreFr}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-forest-deep mb-1">
                      Titre (EN) <span className="text-sun-gold">*</span>
                    </label>
                    <input
                      type="text"
                      name="titreEn"
                      value={formData.titreEn}
                      onChange={handleChange}
                      onBlur={() => setTouchedFields(prev => new Set(prev).add('titreEn'))}
                      className={`w-full px-2 py-1 text-xs border ${
                        touchedFields.has('titreEn') && errors.titreEn 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-border-light'
                      } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white`}
                      placeholder="Mission"
                    />
                    {errors.titreEn && <p className="mt-0.5 text-[10px] text-red-600">{errors.titreEn}</p>}
                  </div>
                </div>
              </div>

              {/* Section Slogan */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <h4 className="text-xs font-semibold text-forest-deep mb-2 flex items-center">
                  <FaQuoteLeft className="w-3 h-3 mr-1 text-water-blue" />
                  Slogan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="sloganFr"
                    value={formData.sloganFr}
                    onChange={handleChange}
                    className="w-full px-2 py-1 text-xs border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white"
                    placeholder="Slogan en français"
                  />
                  <input
                    type="text"
                    name="sloganEn"
                    value={formData.sloganEn}
                    onChange={handleChange}
                    className="w-full px-2 py-1 text-xs border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all bg-warm-white"
                    placeholder="Slogan in English"
                  />
                </div>
              </div>

              {/* Section Médias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Icône */}
                <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                  <label className="block text-xs font-medium text-forest-deep mb-2 flex items-center">
                    <FaImage className="w-3 h-3 mr-1 text-water-blue" />
                    Icône
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 border-2 border-dashed border-border-light rounded-lg flex items-center justify-center bg-warm-white flex-shrink-0">
                      {iconPreview ? (
                        <div className="relative w-full h-full">
                          <img src={iconPreview} alt="" className="w-full h-full object-contain p-1" />
                          <button
                            type="button"
                            onClick={() => removeFile('icon')}
                            className="absolute -top-1 -right-1 bg-earth-brown text-warm-white p-0.5 rounded-full hover:bg-forest-deep"
                          >
                            <FaTrash className="w-2 h-2" />
                          </button>
                        </div>
                      ) : (
                        <FaUpload className="w-4 h-4 text-text-secondary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'icon')}
                        className="w-full text-xs border border-border-light rounded-lg p-1 bg-warm-white"
                      />
                      <p className="text-[8px] text-text-secondary mt-1">Max 2 Mo • Carré (64x64)</p>
                    </div>
                  </div>
                  {errors.icon && (
                    <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                      <FaTimes className="w-2 h-2" />
                      {errors.icon}
                    </p>
                  )}
                </div>

                {/* Image principale */}
                <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                  <label className="block text-xs font-medium text-forest-deep mb-2 flex items-center">
                    <FaImage className="w-3 h-3 mr-1 text-sun-gold" />
                    Image
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-12 border-2 border-dashed border-border-light rounded-lg flex items-center justify-center bg-warm-white flex-shrink-0">
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img src={imagePreview} alt="" className="w-full h-full object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeFile('image')}
                            className="absolute -top-1 -right-1 bg-earth-brown text-warm-white p-0.5 rounded-full hover:bg-forest-deep"
                          >
                            <FaTrash className="w-2 h-2" />
                          </button>
                        </div>
                      ) : (
                        <FaUpload className="w-4 h-4 text-text-secondary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'image')}
                        className="w-full text-xs border border-border-light rounded-lg p-1 bg-warm-white"
                      />
                      <p className="text-[8px] text-text-secondary mt-1">Max 5 Mo • 16:9</p>
                    </div>
                  </div>
                  {errors.image && (
                    <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                      <FaTimes className="w-2 h-2" />
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* Section Description */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <h4 className="text-xs font-semibold text-forest-deep mb-2 flex items-center">
                  <FaBullseye className="w-3 h-3 mr-1 text-olive-nature" />
                  Description
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-medium text-forest-deep mb-1">
                      FR <span className="text-sun-gold">*</span>
                    </label>
                    <textarea
                      name="descriptionFr"
                      value={formData.descriptionFr}
                      onChange={handleChange}
                      rows={2}
                      className={`w-full px-2 py-1 text-xs border ${
                        errors.descriptionFr ? 'border-red-500' : 'border-border-light'
                      } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all resize-none bg-warm-white`}
                      placeholder="Description en français..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-forest-deep mb-1">
                      EN <span className="text-sun-gold">*</span>
                    </label>
                    <textarea
                      name="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={handleChange}
                      rows={2}
                      className={`w-full px-2 py-1 text-xs border ${
                        errors.descriptionEn ? 'border-red-500' : 'border-border-light'
                      } rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all resize-none bg-warm-white`}
                      placeholder="Description in English..."
                    />
                  </div>
                </div>
              </div>

              {/* Section Objectifs */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <h4 className="text-xs font-semibold text-forest-deep mb-2 flex items-center">
                  <FaBullseye className="w-3 h-3 mr-1 text-water-blue" />
                  Objectifs
                </h4>
                <div className="space-y-2">
                  <textarea
                    name="objectifsFr"
                    value={formData.objectifsFr}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-2 py-1 text-xs border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all resize-none bg-warm-white"
                    placeholder="Objectifs en français..."
                  />
                  <textarea
                    name="objectifsEn"
                    value={formData.objectifsEn}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-2 py-1 text-xs border border-border-light rounded-lg focus:ring-2 focus:ring-water-blue focus:border-water-blue transition-all resize-none bg-warm-white"
                    placeholder="Objectives in English..."
                  />
                </div>
              </div>

              {/* Section Valeurs */}
              <div className="bg-ultra-light p-3 rounded-xl border border-border-light">
                <h4 className="text-xs font-semibold text-forest-deep mb-2 flex items-center">
                  <FaHeart className="w-3 h-3 mr-1 text-sun-gold" />
                  Valeurs
                </h4>
                <div className="space-y-2">
                  <textarea
                    name="valeursFr"
                    value={formData.valeursFr}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-2 py-1 text-xs border border-border-light rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all resize-none bg-warm-white"
                    placeholder="Valeurs en français..."
                  />
                  <textarea
                    name="valeursEn"
                    value={formData.valeursEn}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-2 py-1 text-xs border border-border-light rounded-lg focus:ring-2 focus:ring-sun-gold focus:border-sun-gold transition-all resize-none bg-warm-white"
                    placeholder="Values in English..."
                  />
                </div>
              </div>

              {/* Section Paramètres */}
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
                  className="px-3 py-1.5 text-xs font-medium text-warm-white bg-gradient-to-r from-olive-nature to-forest-deep rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center shadow-sm"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                      {mission ? 'Modif...' : 'Créat...'}
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-3 h-3 mr-1" />
                      {mission ? 'Modifier' : 'Créer'}
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