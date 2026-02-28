// src/components/admin/MissionModal.tsx
import { useState, useEffect } from 'react';
import { type Mission } from '../../services/missionService';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  mission: Mission | null;
}

export default function MissionModal({ isOpen, onClose, onSave, mission }: MissionModalProps) {
  const [loading, setLoading] = useState(false);
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
        setIconPreview(`http://localhost:5005/${mission.iconUrl}`);
      }
      if (mission.imageUrl) {
        setImagePreview(`http://localhost:5005/${mission.imageUrl}`);
      }
    } else {
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
    }
  }, [mission, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 1 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'icon') {
        setIconFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setIconPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('titreFr', formData.titreFr);
    data.append('titreEn', formData.titreEn);
    data.append('sloganFr', formData.sloganFr || '');
    data.append('sloganEn', formData.sloganEn || '');
    data.append('descriptionFr', formData.descriptionFr);
    data.append('descriptionEn', formData.descriptionEn);
    data.append('objectifsFr', formData.objectifsFr || '');
    data.append('objectifsEn', formData.objectifsEn || '');
    data.append('valeursFr', formData.valeursFr || '');
    data.append('valeursEn', formData.valeursEn || '');
    data.append('ordreAffichage', formData.ordreAffichage.toString());
    data.append('actif', formData.actif.toString());
    
    if (iconFile) {
      data.append('iconFile', iconFile);
    }
    if (imageFile) {
      data.append('imageFile', imageFile);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {mission ? 'Modifier la mission' : 'Nouvelle mission'}
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
              {/* Titre FR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre (Français) *
                </label>
                <input
                  type="text"
                  name="titreFr"
                  value={formData.titreFr}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Titre EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre (English) *
                </label>
                <input
                  type="text"
                  name="titreEn"
                  value={formData.titreEn}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Slogan FR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slogan (Français)
                </label>
                <input
                  type="text"
                  name="sloganFr"
                  value={formData.sloganFr}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Slogan EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slogan (English)
                </label>
                <input
                  type="text"
                  name="sloganEn"
                  value={formData.sloganEn}
                  onChange={handleChange}
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
                  Mission active
                </label>
              </div>

              {/* Icône */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icône
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {iconPreview ? (
                      <img
                        src={iconPreview}
                        alt="Icône preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs mt-1">Aucune</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'icon')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Image carrée recommandée (64x64 à 128x128px)
                    </p>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Image preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs mt-1">Aucune</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Image rectangulaire recommandée (16:9)
                    </p>
                  </div>
                </div>
              </div>

              {/* Description FR */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Français) *
                </label>
                <textarea
                  name="descriptionFr"
                  value={formData.descriptionFr}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Description EN */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (English) *
                </label>
                <textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Objectifs FR */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectifs (Français)
                </label>
                <textarea
                  name="objectifsFr"
                  value={formData.objectifsFr}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Listez les objectifs principaux de cette mission..."
                />
              </div>

              {/* Objectifs EN */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectifs (English)
                </label>
                <textarea
                  name="objectifsEn"
                  value={formData.objectifsEn}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="List the main objectives of this mission..."
                />
              </div>

              {/* Valeurs FR */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valeurs (Français)
                </label>
                <textarea
                  name="valeursFr"
                  value={formData.valeursFr}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Listez les valeurs portées par cette mission..."
                />
              </div>

              {/* Valeurs EN */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valeurs (English)
                </label>
                <textarea
                  name="valeursEn"
                  value={formData.valeursEn}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="List the values carried by this mission..."
                />
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
                {mission ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}