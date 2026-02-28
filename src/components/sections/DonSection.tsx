// src/components/sections/DonSection.tsx
import React, { useState } from 'react';
import { FaHeart, FaMobile, FaUniversity, FaMoneyBill, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import { MdEmail, MdPhone, MdPerson, MdMessage } from 'react-icons/md';
import { donService } from '../../services/donService';

const DonSection: React.FC = () => {
  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    telephone: '',
    telephoneRaw: '',
    montant: '',
    montantType: 'FIXE',
    modePaiementSouhaite: '',
    message: ''
  });

  const [montantPersonnalise, setMontantPersonnalise] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Montants suggérés en Ariary
  const montantsSuggeres = [10000, 25000, 50000, 100000, 250000];

  const modesPaiement = [
    { value: 'ORANGE_MONEY', label: 'Mobile Money', icon: FaMobile, color: 'bg-orange-500' },
    { value: 'VIREMENT', label: 'Virement bancaire', icon: FaUniversity, color: 'bg-green-600' },
    { value: 'CHEQUE', label: 'Chèque', icon: FaMoneyBill, color: 'bg-purple-500' },
    { value: 'ESPECES', label: 'Espèces', icon: FaMoneyBillWave, color: 'bg-yellow-500' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMontantSelect = (montant: number) => {
    setFormData(prev => ({ 
      ...prev, 
      montant: montant.toString(),
      montantType: 'FIXE'
    }));
    setMontantPersonnalise(false);
  };

  const handleMontantPersonnalise = () => {
    setMontantPersonnalise(true);
    setFormData(prev => ({ 
      ...prev, 
      montant: '',
      montantType: 'LIBRE'
    }));
  };

  // Formatage téléphone international
  const formatTelephone = (value: string): string => {
    // Garder uniquement les chiffres et le +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Si c'est un numéro malgache, on formatte joliment
    if (cleaned.startsWith('261') || cleaned.startsWith('+261')) {
      const numbers = cleaned.replace(/\D/g, '');
      if (numbers.length === 12) { // +261 34 12 345 67
        const indicatif = numbers.slice(0, 3);
        const operateur = numbers.slice(3, 5);
        const partie1 = numbers.slice(5, 8);
        const partie2 = numbers.slice(8, 10);
        const partie3 = numbers.slice(10, 12);
        return `+${indicatif} ${operateur} ${partie1} ${partie2} ${partie3}`;
      }
    }
    
    // Pour les autres formats, retourner la valeur nettoyée
    return cleaned;
  };

  const handleTelephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatTelephone(rawValue);
    const telephonePropre = rawValue.replace(/[^\d+]/g, '');
    
    setFormData(prev => ({ 
      ...prev, 
      telephone: formatted,
      telephoneRaw: telephonePropre
    }));
  };

  const formatAriary = (montant: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant).replace('MGA', 'Ar');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmData = {
        utmSource: urlParams.get('utm_source') || undefined,
        utmMedium: urlParams.get('utm_medium') || undefined,
        utmCampaign: urlParams.get('utm_campaign') || undefined
      };

      const donData = {
        nomComplet: formData.nomComplet,
        email: formData.email,
        telephone: formData.telephoneRaw || formData.telephone.replace(/\s/g, ''),
        montant: formData.montant ? parseFloat(formData.montant) : undefined,
        montantType: formData.montantType,
        modePaiementSouhaite: formData.modePaiementSouhaite || undefined,
        message: formData.message || undefined,
        ...utmData
      };

      await donService.createIntention(donData);
      setIsSuccess(true);
      
      setFormData({
        nomComplet: '',
        email: '',
        telephone: '',
        telephoneRaw: '',
        montant: '',
        montantType: 'FIXE',
        modePaiementSouhaite: '',
        message: ''
      });
      setMontantPersonnalise(false);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Erreur soumission don:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-vert-fonce mb-4">
              Misaotra indrindra ! 🙏
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Votre demande a bien été enregistrée. Un membre de notre équipe vous contactera dans les plus brefs délais pour finaliser votre don.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
              <p className="text-blue-800 font-medium mb-2">📞 À quoi vous attendre ?</p>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Un appel sous 24-48h pour confirmer votre don</li>
                <li>• Des conseils sur le mode de paiement le plus adapté</li>
                <li>• Un reçu officiel pour votre don</li>
              </ul>
            </div>
            <button
              onClick={() => setIsSuccess(false)}
              className="bg-vert-jeune text-white px-8 py-3 rounded-lg hover:bg-vert-mousse transition-colors"
            >
              Faire une autre demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-vert-jeune/10 px-4 py-2 rounded-full mb-4">
            <FaHeart className="text-vert-jeune mr-2" />
            <span className="text-vert-fonce font-medium">Soutenez nos actions</span>
          </div>
          <h1 className="text-4xl font-bold text-vert-fonce mb-4">
            Faire un don à VINA
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Votre générosité nous permet de continuer nos actions de développement durable 
            auprès des communautés rurales. Chaque don, quel que soit son montant, fait la différence.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="nomComplet"
                      value={formData.nomComplet}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vert-jeune focus:border-transparent"
                      placeholder="Jean Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vert-jeune focus:border-transparent"
                      placeholder="jean.dupont@email.com"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleTelephoneChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vert-jeune focus:border-transparent"
                      placeholder="+261 34 12 345 67 ou autre format"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Format international accepté : +261341234567, 0341234567, +33123456789
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Montant du don (Ariary)
                </label>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  {montantsSuggeres.map((montant) => (
                    <button
                      key={montant}
                      type="button"
                      onClick={() => handleMontantSelect(montant)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        formData.montant === montant.toString() && !montantPersonnalise
                          ? 'bg-vert-jeune text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formatAriary(montant)}
                    </button>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleMontantPersonnalise}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      montantPersonnalise
                        ? 'bg-vert-jeune text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Autre montant
                  </button>
                </div>

                {montantPersonnalise && (
                  <div className="relative">
                    <input
                      type="number"
                      name="montant"
                      value={formData.montant}
                      onChange={handleInputChange}
                      placeholder="Saisissez votre montant"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vert-jeune focus:border-transparent"
                      min="100"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Ar
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Mode de paiement souhaité
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {modesPaiement.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, modePaiementSouhaite: mode.value }))}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                          formData.modePaiementSouhaite === mode.value
                            ? 'border-vert-jeune bg-vert-jeune/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${mode.color} text-white p-1 rounded-full`} />
                        <span className="text-sm font-medium text-gray-700">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optionnel)
                </label>
                <div className="relative">
                  <MdMessage className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vert-jeune focus:border-transparent"
                    placeholder="Un message à nous transmettre ?"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-vert-jeune to-vert-fonce text-white py-4 rounded-lg font-bold text-lg hover:from-vert-mousse hover:to-vert-fonce transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner border-white"></div>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <FaHeart className="animate-pulse" />
                    Envoyer ma demande de don
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe. 
              Vos informations sont confidentielles et ne seront pas partagées avec des tiers.
            </p>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FaCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-vert-fonce mb-2">100% transparent</h3>
            <p className="text-sm text-gray-600">
              Nous vous fournissons un reçu officiel et un suivi de l'utilisation de votre don.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MdPhone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-vert-fonce mb-2">Accompagnement personnalisé</h3>
            <p className="text-sm text-gray-600">
              Notre équipe vous guide pour choisir le mode de paiement le plus adapté.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <FaHeart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-vert-fonce mb-2">Impact durable</h3>
            <p className="text-sm text-gray-600">
              Votre don contribue directement à nos projets de développement dans les communautés rurales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonSection;