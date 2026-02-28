// src/components/admin/TemoignageModal.tsx
import { useState, useEffect } from 'react';
import { type Temoignage } from '../../services/temoignageService';

interface TemoignageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  temoignage: Temoignage | null;
}

const TYPE_OPTIONS = [
  { value: 'PHOTO', label: 'Photo seulement' },
  { value: 'VIDEO', label: 'Vidéo seulement' },
  { value: 'PHOTO_VIDEO', label: 'Photo et vidéo' },
];

export default function TemoignageModal({ isOpen, onClose, onSave, temoignage }: TemoignageModalProps) {
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
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
        setPhotoPreview(`http://localhost:5005/${temoignage.photoUrl}`);
      }
      if (temoignage.videoUrl) {
        setVideoPreview(`http://localhost:5005/${temoignage.videoUrl}`);
      }
    } else {
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
    }
  }, [temoignage, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 1 : value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as 'PHOTO' | 'VIDEO' | 'PHOTO_VIDEO';
    setFormData(prev => ({
      ...prev,
      typeTemoignage: type,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'photo') {
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setVideoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('auteurFr', formData.auteurFr);
    data.append('auteurEn', formData.auteurEn);
    data.append('fonctionFr', formData.fonctionFr);
    data.append('fonctionEn', formData.fonctionEn);
    data.append('contenuFr', formData.contenuFr);
    data.append('contenuEn', formData.contenuEn);
    data.append('typeTemoignage', formData.typeTemoignage);
    data.append('datePublication', formData.datePublication);
    data.append('actif', formData.actif.toString());
    data.append('ordreAffichage', formData.ordreAffichage.toString());
    
    if (photoFile) {
      data.append('photoFile', photoFile);
    }
    if (videoFile) {
      data.append('videoFile', videoFile);
    }

    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowPhotoField = () => {
    return formData.typeTemoignage === 'PHOTO' || formData.typeTemoignage === 'PHOTO_VIDEO';
  };

  const shouldShowVideoField = () => {
    return formData.typeTemoignage === 'VIDEO' || formData.typeTemoignage === 'PHOTO_VIDEO';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {temoignage ? 'Modifier le témoignage' : 'Nouveau témoignage'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Auteur FR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auteur (Français) *
                </label>
                <input
                  type="text"
                  name="auteurFr"
                  value={formData.auteurFr}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Jean Dupont"
                />
              </div>

              {/* Auteur EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auteur (English) *
                </label>
                <input
                  type="text"
                  name="auteurEn"
                  value={formData.auteurEn}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: John Doe"
                />
              </div>

              {/* Fonction FR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonction (Français) *
                </label>
                <input
                  type="text"
                  name="fonctionFr"
                  value={formData.fonctionFr}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Bénéficiaire du projet"
                />
              </div>

              {/* Fonction EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonction (English) *
                </label>
                <input
                  type="text"
                  name="fonctionEn"
                  value={formData.fonctionEn}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Project beneficiary"
                />
              </div>

              {/* Type de témoignage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de témoignage *
                </label>
                <select
                  name="typeTemoignage"
                  value={formData.typeTemoignage}
                  onChange={handleTypeChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date de publication */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de publication *
                </label>
                <input
                  type="date"
                  name="datePublication"
                  value={formData.datePublication}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Ordre d'affichage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  name="ordreAffichage"
                  value={formData.ordreAffichage}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Statut */}
              <div className="flex items-center justify-end">
                <input
                  type="checkbox"
                  name="actif"
                  id="actif"
                  checked={formData.actif}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="actif" className="ml-2 text-sm font-medium text-gray-700">
                  Témoignage actif
                </label>
              </div>

              {/* Photo */}
              {shouldShowPhotoField() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo *
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Photo preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs mt-1">Aucune photo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'photo')}
                        required={shouldShowPhotoField() && !photoPreview}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formats: JPG, JPEG, PNG, GIF, BMP, WEBP
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Vidéo */}
              {shouldShowVideoField() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vidéo {formData.typeTemoignage === 'VIDEO' ? '*' : ''}
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      {videoPreview ? (
                        <div className="relative w-full h-full">
                          <video
                            src={videoPreview}
                            className="w-full h-full object-cover rounded-lg"
                            controls
                          />
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs mt-1">Aucune vidéo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, 'video')}
                        required={formData.typeTemoignage === 'VIDEO' && !videoPreview}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formats: MP4, AVI, MOV, WMV, FLV, MKV, WEBM
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenu FR */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu (Français) *
                </label>
                <textarea
                  name="contenuFr"
                  value={formData.contenuFr}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Témoignage en français..."
                />
              </div>

              {/* Contenu EN */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu (English) *
                </label>
                <textarea
                  name="contenuEn"
                  value={formData.contenuEn}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Testimony in English..."
                />
              </div>

              {/* Prévisualisation */}
              <div className="col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Aperçu du témoignage</h3>
                <div className="flex items-start space-x-4">
                  {shouldShowPhotoField() && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Photo prévisualisation"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Photo</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {formData.auteurFr || 'Auteur'} - {formData.fonctionFr || 'Fonction'}
                    </div>
                    <div className="text-sm text-gray-600 italic">
                      {formData.auteurEn || 'Author'} - {formData.fonctionEn || 'Function'}
                    </div>
                    <div className="mt-2 text-sm text-gray-500 line-clamp-3">
                      {formData.contenuFr || 'Contenu du témoignage...'}
                    </div>
                    {shouldShowVideoField() && (
                      <div className="mt-2 text-xs text-blue-600">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Vidéo disponible
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {temoignage ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}