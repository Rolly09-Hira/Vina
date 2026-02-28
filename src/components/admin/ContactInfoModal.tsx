// src/components/admin/ContactInfoModal.tsx
import { useState, useEffect } from 'react';
import { type ContactInfo } from '../../services/contactInfoService';

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contactData: any) => Promise<void>;
  contactInfo: ContactInfo | null;
}

const TYPE_OPTIONS = [
  { value: 'telephone', label: 'Téléphone' },
  { value: 'email', label: 'Email' },
  { value: 'adresse', label: 'Adresse' },
  { value: 'reseau_social', label: 'Réseau social' },
];

const ICONE_OPTIONS = {
  telephone: [
    { value: 'fa-phone', label: 'Phone', icon: '📞' },
    { value: 'fa-mobile-alt', label: 'Mobile', icon: '📱' },
    { value: 'fa-whatsapp', label: 'WhatsApp', icon: '💬' },
  ],
  email: [
    { value: 'fa-envelope', label: 'Envelope', icon: '✉️' },
    { value: 'fa-at', label: 'At', icon: '@' },
  ],
  adresse: [
    { value: 'fa-map-marker-alt', label: 'Map Marker', icon: '📍' },
    { value: 'fa-home', label: 'Home', icon: '🏠' },
    { value: 'fa-building', label: 'Building', icon: '🏢' },
  ],
  reseau_social: [
    { value: 'fa-facebook', label: 'Facebook', icon: '📘' },
    { value: 'fa-twitter', label: 'Twitter', icon: '🐦' },
    { value: 'fa-instagram', label: 'Instagram', icon: '📷' },
    { value: 'fa-linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'fa-youtube', label: 'YouTube', icon: '🎬' },
    { value: 'fa-telegram', label: 'Telegram', icon: '✈️' },
  ],
};

export default function ContactInfoModal({ isOpen, onClose, onSave, contactInfo }: ContactInfoModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    valeur: '',
    icone: '',
    typeContact: 'telephone' as 'telephone' | 'email' | 'adresse' | 'reseau_social',
    lien: '',
    ordreAffichage: 1,
    actif: true,
  });

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        titre: contactInfo.titre || '',
        valeur: contactInfo.valeur || '',
        icone: contactInfo.icone || '',
        typeContact: contactInfo.typeContact || 'telephone',
        lien: contactInfo.lien || '',
        ordreAffichage: contactInfo.ordreAffichage || 1,
        actif: contactInfo.actif,
      });
    } else {
      setFormData({
        titre: '',
        valeur: '',
        icone: '',
        typeContact: 'telephone',
        lien: '',
        ordreAffichage: 1,
        actif: true,
      });
    }
  }, [contactInfo, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 1 : value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as 'telephone' | 'email' | 'adresse' | 'reseau_social';
    setFormData(prev => ({
      ...prev,
      typeContact: type,
      icone: '', // Réinitialiser l'icône quand on change le type
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentIconOptions = () => {
    return ICONE_OPTIONS[formData.typeContact] || [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {contactInfo ? 'Modifier le contact' : 'Nouveau contact'}
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
              {/* Titre */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Téléphone principal, Email contact, Adresse siège..."
                />
              </div>

              {/* Type de contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de contact *
                </label>
                <select
                  name="typeContact"
                  value={formData.typeContact}
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

              {/* Icône */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icône
                </label>
                <select
                  name="icone"
                  value={formData.icone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner une icône...</option>
                  {getCurrentIconOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
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
                  Contact actif
                </label>
              </div>

              {/* Valeur */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valeur *
                </label>
                {formData.typeContact === 'adresse' ? (
                  <textarea
                    name="valeur"
                    value={formData.valeur}
                    onChange={handleChange}
                    rows={3}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: 123 Rue de Paris, 75001 Paris, France"
                  />
                ) : (
                  <input
                    type={formData.typeContact === 'email' ? 'email' : 'text'}
                    name="valeur"
                    value={formData.valeur}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={
                      formData.typeContact === 'telephone' ? 'Ex: +33 1 23 45 67 89' :
                      formData.typeContact === 'email' ? 'Ex: contact@example.com' :
                      formData.typeContact === 'reseau_social' ? 'Ex: @nom_utilisateur' :
                      'Valeur du contact'
                    }
                  />
                )}
              </div>

              {/* Lien (pour réseaux sociaux et emails) */}
              {(formData.typeContact === 'reseau_social' || formData.typeContact === 'email') && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien {formData.typeContact === 'email' ? '(mailto:)' : '(URL)'}
                  </label>
                  <input
                    type="url"
                    name="lien"
                    value={formData.lien}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={
                      formData.typeContact === 'email' ? 'mailto:contact@example.com' :
                      'https://facebook.com/profil'
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.typeContact === 'email' 
                      ? 'Laissez vide pour générer automatiquement mailto:' 
                      : 'URL complète vers le profil'}
                  </p>
                </div>
              )}

              {/* Prévisualisation */}
              <div className="col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Aperçu du contact</h3>
                <div className="flex items-start space-x-3">
                  {formData.icone ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">
                        {getCurrentIconOptions().find(opt => opt.value === formData.icone)?.icon || '📱'}
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">?</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{formData.titre || 'Titre du contact'}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formData.valeur || 'Valeur du contact'}
                    </div>
                    {formData.typeContact === 'telephone' && formData.valeur && (
                      <a 
                        href={`tel:${formData.valeur.replace(/\s/g, '')}`}
                        className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        📞 Appeler
                      </a>
                    )}
                    {formData.typeContact === 'email' && formData.valeur && (
                      <a 
                        href={`mailto:${formData.valeur}`}
                        className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        ✉️ Envoyer un email
                      </a>
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
                {contactInfo ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}