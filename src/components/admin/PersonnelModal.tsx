import { useState, useEffect } from 'react';
import personnelService from '../../services/personnelService';
import type { Personnel } from '../../types/api';

interface PersonnelModalProps {
  isOpen: boolean;
  onClose: (reload?: boolean) => void;
  personnel: Personnel | null;
  onPersonnelUpdated?: () => Promise<void>;
}

export default function PersonnelModal({ 
  isOpen, 
  onClose, 
  personnel, 
  onPersonnelUpdated 
}: PersonnelModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    departement: '',
    dateEmbauche: '',
    biographieFr: '',
    biographieEn: '',
    specialites: '',
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    ordreAffichage: 0,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Liste des départements pour le dropdown
  const departements = [
    'Direction',
    'Administration',
    'Programmes',
    'Finance',
    'Communication',
    'Ressources Humaines',
    'Suivi Évaluation',
    'Logistique',
    'Terrain'
  ];

  useEffect(() => {
    if (personnel) {
      setFormData({
        nom: personnel.nom || '',
        prenom: personnel.prenom || '',
        email: personnel.email || '',
        telephone: personnel.telephone || '',
        poste: personnel.poste || '',
        departement: personnel.departement || '',
        dateEmbauche: personnel.dateEmbauche || '',
        biographieFr: personnel.biographieFr || '',
        biographieEn: personnel.biographieEn || '',
        specialites: personnel.specialites || '',
        linkedinUrl: personnel.linkedinUrl || '',
        twitterUrl: personnel.twitterUrl || '',
        facebookUrl: personnel.facebookUrl || '',
        ordreAffichage: personnel.ordreAffichage || 0,
      });
      
      if (personnel.photoUrl) {
        const photoUrl = personnel.photoUrl.startsWith('http') 
          ? personnel.photoUrl 
          : `http://localhost:5005/${personnel.photoUrl}`;
        setPhotoPreview(photoUrl);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        poste: '',
        departement: '',
        dateEmbauche: '',
        biographieFr: '',
        biographieEn: '',
        specialites: '',
        linkedinUrl: '',
        twitterUrl: '',
        facebookUrl: '',
        ordreAffichage: 0,
      });
      setPhotoPreview(null);
    }
    setPhotoFile(null);
    setErrors({});
    setSuccessMessage(null);
  }, [personnel, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'La photo ne doit pas dépasser 5MB' }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Le fichier doit être une image' }));
        return;
      }

      setPhotoFile(file);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.photo;
        return newErrors;
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom?.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    if (!formData.prenom?.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
    }

    if (!formData.email?.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.poste?.trim()) {
      newErrors.poste = 'Le poste est obligatoire';
    }

    if (photoFile && !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(photoFile.type)) {
      newErrors.photo = 'Format d\'image non supporté (JPG, PNG, GIF, WEBP)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage(null);
    
    try {
      const formDataToSend = new FormData();
      
      // Ajouter tous les champs
      formDataToSend.append('nom', formData.nom.trim());
      formDataToSend.append('prenom', formData.prenom.trim());
      formDataToSend.append('email', formData.email.trim().toLowerCase());
      if (formData.telephone) formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('poste', formData.poste.trim());
      if (formData.departement) formDataToSend.append('departement', formData.departement);
      if (formData.dateEmbauche) formDataToSend.append('dateEmbauche', formData.dateEmbauche);
      if (formData.biographieFr) formDataToSend.append('biographieFr', formData.biographieFr);
      if (formData.biographieEn) formDataToSend.append('biographieEn', formData.biographieEn);
      if (formData.specialites) formDataToSend.append('specialites', formData.specialites);
      if (formData.linkedinUrl) formDataToSend.append('linkedinUrl', formData.linkedinUrl);
      if (formData.twitterUrl) formDataToSend.append('twitterUrl', formData.twitterUrl);
      if (formData.facebookUrl) formDataToSend.append('facebookUrl', formData.facebookUrl);
      formDataToSend.append('ordreAffichage', formData.ordreAffichage.toString());
      
      if (photoFile) {
        formDataToSend.append('photoFile', photoFile);
      }

      if (personnel) {
        // Mode modification
        await personnelService.updatePersonnel(personnel.id, formDataToSend);
        setSuccessMessage('Membre mis à jour avec succès');
      } else {
        // Mode création
        await personnelService.createPersonnel(formDataToSend);
        setSuccessMessage('Membre créé avec succès');
      }
      
      // Rafraîchir la liste
      if (onPersonnelUpdated) {
        await onPersonnelUpdated();
      }
      
      // Fermer le modal après un délai
      setTimeout(() => {
        onClose(true);
      }, 1500);
      
    } catch (error: any) {
      console.error('Submit error:', error);
      
      let errorMessage = 'Erreur serveur';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!personnel;
  const fullName = personnel ? `${personnel.prenom} ${personnel.nom}` : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={() => onClose()}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-gradient-to-r from-green-600 to-teal-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  {isEditing ? `Modifier: ${fullName}` : 'Ajouter un membre du personnel'}
                </h3>
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-5 bg-white max-h-[70vh] overflow-y-auto">
              {/* Message de succès */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              )}

              {/* Photo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de profil
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Prévisualisation"
                          className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center">
                        <span className="text-white font-medium text-2xl">
                          {formData.prenom ? formData.prenom.charAt(0).toUpperCase() : '?'}
                          {formData.nom ? formData.nom.charAt(0).toUpperCase() : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <label className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <span>Choisir une photo</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG, GIF ou WEBP (max. 5MB)
                    </p>
                    {errors.photo && (
                      <p className="mt-1 text-xs text-red-600">{errors.photo}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prénom */}
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.prenom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Jean"
                  />
                  {errors.prenom && <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>}
                </div>

                {/* Nom */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.nom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Dupont"
                  />
                  {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="jean.dupont@exemple.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+221 77 123 45 67"
                  />
                </div>

                {/* Poste */}
                <div>
                  <label htmlFor="poste" className="block text-sm font-medium text-gray-700 mb-1">
                    Poste *
                  </label>
                  <input
                    type="text"
                    id="poste"
                    name="poste"
                    value={formData.poste}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.poste ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Directeur Exécutif"
                  />
                  {errors.poste && <p className="mt-1 text-xs text-red-600">{errors.poste}</p>}
                </div>

                {/* Département */}
                <div>
                  <label htmlFor="departement" className="block text-sm font-medium text-gray-700 mb-1">
                    Département
                  </label>
                  <select
                    id="departement"
                    name="departement"
                    value={formData.departement}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionner un département</option>
                    {departements.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Date d'embauche */}
                <div>
                  <label htmlFor="dateEmbauche" className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'embauche
                  </label>
                  <input
                    type="date"
                    id="dateEmbauche"
                    name="dateEmbauche"
                    value={formData.dateEmbauche}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Ordre d'affichage */}
                <div>
                  <label htmlFor="ordreAffichage" className="block text-sm font-medium text-gray-700 mb-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    id="ordreAffichage"
                    name="ordreAffichage"
                    value={formData.ordreAffichage}
                    onChange={handleChange}
                    min="0"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Spécialités */}
                <div className="md:col-span-2">
                  <label htmlFor="specialites" className="block text-sm font-medium text-gray-700 mb-1">
                    Spécialités / Compétences
                  </label>
                  <input
                    type="text"
                    id="specialites"
                    name="specialites"
                    value={formData.specialites}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Gestion de projet, Agroécologie, Formation, etc."
                  />
                </div>

                {/* Biographie FR */}
                <div className="md:col-span-2">
                  <label htmlFor="biographieFr" className="block text-sm font-medium text-gray-700 mb-1">
                    Biographie (Français)
                  </label>
                  <textarea
                    id="biographieFr"
                    name="biographieFr"
                    rows={3}
                    value={formData.biographieFr}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Présentation du membre en français..."
                  />
                </div>

                {/* Biographie EN */}
                <div className="md:col-span-2">
                  <label htmlFor="biographieEn" className="block text-sm font-medium text-gray-700 mb-1">
                    Biographie (Anglais)
                  </label>
                  <textarea
                    id="biographieEn"
                    name="biographieEn"
                    rows={3}
                    value={formData.biographieEn}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Member presentation in English..."
                  />
                </div>

                {/* Section Réseaux sociaux */}
                <div className="md:col-span-2 mt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Réseaux sociaux</h4>
                </div>

                {/* LinkedIn */}
                <div className="md:col-span-2">
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    id="twitterUrl"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://twitter.com/..."
                  />
                </div>

                {/* Facebook */}
                <div>
                  <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="facebookUrl"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://www.facebook.com/..."
                  />
                </div>
              </div>

              {/* Erreur de soumission */}
              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg hover:from-green-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}