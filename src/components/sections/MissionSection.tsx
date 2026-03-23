// src/components/sections/DonSection.tsx
import React, { useState } from 'react';
import { 
  FaHeart, 
  FaMobile, 
  FaUniversity, 
  FaMoneyBill, 
  FaCheckCircle, 
  FaMoneyBillWave,
  FaArrowLeft,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaComment,
  FaWhatsapp,
  FaBuilding,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { donService } from '../../services/donService';
import { useLanguage } from '../../contexts/LanguageContext';

// Interface pour le contenu multilingue
interface Content {
  fr: {
    badge: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      namePlaceholder: string;
      nameHint: string;
      email: string;
      emailValid: string;
      emailInvalid: string;
      phone: string;
      phoneFormat: string;
      amount: string;
      otherAmount: string;
      paymentMethod: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      required: string;
      privacy: string;
    };
    success: {
      title: string;
      message: string;
      steps: {
        title: string;
        items: {
          call: string;
          advice: string;
          receipt: string;
        };
      };
      buttons: {
        home: string;
        new: string;
      };
      confirmation: string;
      social: string;
    };
    paymentMethods: {
      orange: string;
      transfer: string;
      check: string;
      cash: string;
    };
    cards: {
      transparent: {
        title: string;
        description: string;
      };
      support: {
        title: string;
        description: string;
      };
      impact: {
        title: string;
        description: string;
      };
    };
  };
  en: {
    badge: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      namePlaceholder: string;
      nameHint: string;
      email: string;
      emailValid: string;
      emailInvalid: string;
      phone: string;
      phoneFormat: string;
      amount: string;
      otherAmount: string;
      paymentMethod: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      required: string;
      privacy: string;
    };
    success: {
      title: string;
      message: string;
      steps: {
        title: string;
        items: {
          call: string;
          advice: string;
          receipt: string;
        };
      };
      buttons: {
        home: string;
        new: string;
      };
      confirmation: string;
      social: string;
    };
    paymentMethods: {
      orange: string;
      transfer: string;
      check: string;
      cash: string;
    };
    cards: {
      transparent: {
        title: string;
        description: string;
      };
      support: {
        title: string;
        description: string;
      };
      impact: {
        title: string;
        description: string;
      };
    };
  };
}

// Contenu multilingue
const content: Content = {
  fr: {
    badge: 'Soutenez nos actions',
    title: 'Faire un don à VINA',
    subtitle: 'Votre générosité nous permet de continuer nos actions de développement durable auprès des communautés rurales. Chaque don, quel que soit son montant, fait la différence.',
    form: {
      name: 'Nom complet / Raison sociale',
      namePlaceholder: 'Votre nom ou celui de votre entreprise/organisation',
      nameHint: 'Indiquez votre nom, le nom de votre entreprise ou organisation',
      email: 'Email',
      emailValid: 'Email valide',
      emailInvalid: 'Email invalide',
      phone: 'Téléphone',
      phoneFormat: 'Format international accepté : +261341234567, 0341234567',
      amount: 'Montant du don (Ariary)',
      otherAmount: 'Autre montant',
      paymentMethod: 'Mode de paiement souhaité',
      message: 'Message (optionnel)',
      messagePlaceholder: 'Un message à nous transmettre ?',
      submit: 'Envoyer ma demande de don',
      submitting: 'Traitement en cours...',
      required: 'Champs obligatoires',
      privacy: 'En soumettant ce formulaire, vous acceptez d\'être contacté par notre équipe. Vos informations sont confidentielles et ne seront pas partagées avec des tiers.'
    },
    success: {
      title: 'Misaotra indrindra ! 🙏',
      message: 'Votre demande a bien été enregistrée. Un membre de notre équipe vous contactera dans les plus brefs délais pour finaliser votre don.',
      steps: {
        title: 'Prochaines étapes',
        items: {
          call: 'Un appel pour confirmer votre don',
          advice: 'Le mode de paiement le plus adapté',
          receipt: 'Pour votre déclaration'
        }
      },
      buttons: {
        home: 'Accueil',
        new: 'Nouvelle demande'
      },
      confirmation: 'Un email de confirmation vous a été envoyé.',
      social: 'Suivez-nous sur les réseaux sociaux pour ne rien manquer de nos actions !'
    },
    paymentMethods: {
      orange: 'Mobile Money',
      transfer: 'Virement bancaire',
      check: 'Chèque',
      cash: 'Espèces'
    },
    cards: {
      transparent: {
        title: '100% transparent',
        description: 'Nous vous fournissons un reçu officiel et un suivi de l\'utilisation de votre don.'
      },
      support: {
        title: 'Accompagnement personnalisé',
        description: 'Notre équipe vous guide pour choisir le mode de paiement le plus adapté.'
      },
      impact: {
        title: 'Impact durable',
        description: 'Votre don contribue directement à nos projets de développement dans les communautés rurales.'
      }
    }
  },
  en: {
    badge: 'Support our actions',
    title: 'Make a donation to VINA',
    subtitle: 'Your generosity allows us to continue our sustainable development actions with rural communities. Every donation, regardless of amount, makes a difference.',
    form: {
      name: 'Full name / Company name',
      namePlaceholder: 'Your name or your company/organization name',
      nameHint: 'Enter your name, your company or organization name',
      email: 'Email',
      emailValid: 'Valid email',
      emailInvalid: 'Invalid email',
      phone: 'Phone',
      phoneFormat: 'International format accepted: +261341234567, 0341234567',
      amount: 'Donation amount (Ariary)',
      otherAmount: 'Other amount',
      paymentMethod: 'Preferred payment method',
      message: 'Message (optional)',
      messagePlaceholder: 'A message for us?',
      submit: 'Send my donation request',
      submitting: 'Processing...',
      required: 'Required fields',
      privacy: 'By submitting this form, you agree to be contacted by our team. Your information is confidential and will not be shared with third parties.'
    },
    success: {
      title: 'Thank you very much! 🙏',
      message: 'Your request has been registered. A member of our team will contact you as soon as possible to finalize your donation.',
      steps: {
        title: 'Next steps',
        items: {
          call: 'A call to confirm your donation',
          advice: 'The most suitable payment method',
          receipt: 'For your tax declaration'
        }
      },
      buttons: {
        home: 'Home',
        new: 'New request'
      },
      confirmation: 'A confirmation email has been sent to you.',
      social: 'Follow us on social media to not miss any of our actions!'
    },
    paymentMethods: {
      orange: 'Mobile Money',
      transfer: 'Bank transfer',
      check: 'Check',
      cash: 'Cash'
    },
    cards: {
      transparent: {
        title: '100% transparent',
        description: 'We provide you with an official receipt and follow-up on the use of your donation.'
      },
      support: {
        title: 'Personalized support',
        description: 'Our team guides you to choose the most suitable payment method.'
      },
      impact: {
        title: 'Sustainable impact',
        description: 'Your donation directly contributes to our development projects in rural communities.'
      }
    }
  }
};

const DonSection: React.FC = () => {
  const { language } = useLanguage();
  const t = content[language];
  
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

  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isDirty: false,
    message: ''
  });

  const [errors, setErrors] = useState<{
    nomComplet?: string;
    email?: string;
    telephone?: string;
    montant?: string;
    modePaiementSouhaite?: string;
  }>({});

  const [montantPersonnalise, setMontantPersonnalise] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Montants suggérés en Ariary
  const montantsSuggeres = [10000, 25000, 50000, 100000, 250000];

  const modesPaiement = [
    { value: 'MOBILE_MONEY', label: t.paymentMethods.orange, icon: FaMobile, color: 'bg-orange-500' },
    { value: 'VIREMENT', label: t.paymentMethods.transfer, icon: FaUniversity, color: 'bg-water-blue' },
    { value: 'CHEQUE', label: t.paymentMethods.check, icon: FaMoneyBill, color: 'bg-earth-brown' },
    { value: 'ESPECES', label: t.paymentMethods.cash, icon: FaMoneyBillWave, color: 'bg-sun-gold' }
  ];

  // Fonction de validation d'email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fonction de validation complète du formulaire
  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.nomComplet.trim()) {
      newErrors.nomComplet = 'Le nom complet est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    } else {
      const cleaned = formData.telephone.replace(/[^\d+]/g, '');
      if (cleaned.length < 9) {
        newErrors.telephone = 'Numéro invalide (minimum 9 chiffres)';
      }
    }
    
    if (!montantPersonnalise && !formData.montant && formData.montantType === 'FIXE') {
      newErrors.montant = 'Veuillez sélectionner un montant';
    } else if (montantPersonnalise && (!formData.montant || parseFloat(formData.montant) < 100)) {
      newErrors.montant = 'Le montant minimum est de 100 Ar';
    }
    
    if (!formData.modePaiementSouhaite) {
      newErrors.modePaiementSouhaite = 'Veuillez choisir un mode de paiement';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    setErrors(prev => ({ ...prev, email: undefined }));
    
    if (email) {
      const isValid = validateEmail(email);
      setEmailValidation({
        isValid,
        isDirty: true,
        message: isValid ? t.form.emailValid : t.form.emailInvalid
      });
    } else {
      setEmailValidation({
        isValid: false,
        isDirty: false,
        message: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleMontantSelect = (montant: number) => {
    setFormData(prev => ({ 
      ...prev, 
      montant: montant.toString(),
      montantType: 'FIXE'
    }));
    setMontantPersonnalise(false);
    setErrors(prev => ({ ...prev, montant: undefined }));
  };

  const handleMontantPersonnalise = () => {
    setMontantPersonnalise(true);
    setFormData(prev => ({ 
      ...prev, 
      montant: '',
      montantType: 'LIBRE'
    }));
    setErrors(prev => ({ ...prev, montant: undefined }));
  };

  const formatTelephone = (value: string): string => {
    const cleaned = value.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('261') || cleaned.startsWith('+261')) {
      const numbers = cleaned.replace(/\D/g, '');
      if (numbers.length === 12) {
        const indicatif = numbers.slice(0, 3);
        const operateur = numbers.slice(3, 5);
        const partie1 = numbers.slice(5, 8);
        const partie2 = numbers.slice(8, 10);
        const partie3 = numbers.slice(10, 12);
        return `+${indicatif} ${operateur} ${partie1} ${partie2} ${partie3}`;
      }
    }
    
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
    setErrors(prev => ({ ...prev, telephone: undefined }));
  };

  const handleModePaiementSelect = (value: string) => {
    setFormData(prev => ({ ...prev, modePaiementSouhaite: value }));
    setErrors(prev => ({ ...prev, modePaiementSouhaite: undefined }));
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
    
    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

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
      setEmailValidation({
        isValid: false,
        isDirty: false,
        message: ''
      });
      setErrors({});

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
      setError(errorMsg);
      console.error('Erreur soumission don:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ultra-light to-warm-white py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border-light">
            <div className="h-2 bg-gradient-to-r from-sun-gold via-olive-nature to-water-blue"></div>
            
            <div className="p-8 md:p-12 text-center">
              <div className="relative mb-8">
                <div className="w-28 h-28 bg-soft-sun/20 rounded-full mx-auto animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-sun-gold to-soft-sun rounded-full flex items-center justify-center shadow-xl animate-bounce-slow">
                    <FaCheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-forest-deep mb-4">
                {t.success.title}
              </h2>
              
              <p className="text-text-secondary text-lg mb-8">
                {t.success.message}
              </p>

              <div className="bg-ultra-light border border-border-light rounded-xl p-6 mb-8 text-left">
                <h3 className="font-bold text-forest-deep mb-4 flex items-center gap-2">
                  <FaHeart className="text-sun-gold" />
                  {t.success.steps.title}
                </h3>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-sun-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-sun-gold rounded-full"></span>
                    </span>
                    <span><strong className="text-forest-deep">{t.success.steps.items.call.split(' ')[0]}</strong> {t.success.steps.items.call.substring(t.success.steps.items.call.indexOf(' ') + 1)}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-water-blue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-water-blue rounded-full"></span>
                    </span>
                    <span>{t.success.steps.items.advice}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-olive-nature/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-olive-nature rounded-full"></span>
                    </span>
                    <span>{t.success.steps.items.receipt}</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-semibold rounded-lg hover:from-forest-deep hover:to-premium-dark transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaHome />
                  {t.success.buttons.home}
                </Link>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-forest-deep font-semibold rounded-lg hover:bg-ultra-light transition-all border-2 border-border-light"
                >
                  <FaArrowLeft />
                  {t.success.buttons.new}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-text-secondary text-sm">
            <p>{t.success.confirmation}</p>
            <p className="mt-2">{t.success.social}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-olive-nature to-forest-deep py-12 px-4 relative">
      <div className="absolute inset-0 bg-premium-dark/30"></div>
      
      <div className="max-w-4xl mx-auto pt-8 md:pt-12 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-warm-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-warm-white/30 shadow-lg">
            <FaHeart className="text-sun-gold mr-2 animate-pulse" />
            <span className="text-warm-white font-medium">{t.badge}</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-warm-white mb-4 drop-shadow-lg">
            {t.title}
          </h1>
          <p className="text-warm-white/90 text-lg max-w-2xl mx-auto drop-shadow">
            {t.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border-light">
          <div className="h-2 bg-gradient-to-r from-sun-gold via-olive-nature to-water-blue"></div>
          
          <div className="p-8 md:p-12">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <FaTimes className="text-red-500" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Champ Nom complet / Entreprise */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-forest-deep mb-2">
                    {t.form.name} <span className="text-sun-gold">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <FaUser className="text-text-secondary group-focus-within:text-sun-gold transition-colors" />
                      <span className="text-text-secondary/30">|</span>
                      <FaBuilding className="text-text-secondary group-focus-within:text-sun-gold transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="nomComplet"
                      value={formData.nomComplet}
                      onChange={handleInputChange}
                      onBlur={validateForm}
                      required
                      className={`w-full pl-16 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sun-gold transition-all bg-ultra-light/30 ${
                        errors.nomComplet ? 'border-red-500 focus:ring-red-500' : 'border-border-light'
                      }`}
                      placeholder={t.form.namePlaceholder}
                    />
                  </div>
                  {errors.nomComplet && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <FaTimes className="w-3 h-3" />
                      {errors.nomComplet}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                    <FaCheck className="text-sun-gold w-3 h-3" />
                    {t.form.nameHint}
                  </p>
                </div>

                {/* Email avec validation */}
                <div>
                  <label className="block text-sm font-medium text-forest-deep mb-2">
                    {t.form.email} <span className="text-sun-gold">*</span>
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary group-focus-within:text-sun-gold transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleEmailChange}
                      onBlur={validateForm}
                      required
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sun-gold transition-all bg-ultra-light/30 ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : emailValidation.isDirty && emailValidation.isValid
                          ? 'border-green-500'
                          : 'border-border-light'
                      }`}
                      placeholder="contact@exemple.com"
                    />
                    {emailValidation.isDirty && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {emailValidation.isValid ? (
                          <FaCheck className="w-5 h-5 text-green-500" />
                        ) : (
                          <FaTimes className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.email ? (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  ) : emailValidation.isDirty && (
                    <p className={`text-xs mt-1 ${emailValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {emailValidation.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-deep mb-2">
                    {t.form.phone} <span className="text-sun-gold">*</span>
                  </label>
                  <div className="relative group">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary group-focus-within:text-sun-gold transition-colors" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleTelephoneChange}
                      onBlur={validateForm}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sun-gold transition-all bg-ultra-light/30 ${
                        errors.telephone ? 'border-red-500 focus:ring-red-500' : 'border-border-light'
                      }`}
                      placeholder="+261 34 12 345 67"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <FaTimes className="w-3 h-3" />
                      {errors.telephone}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary mt-2 flex items-center gap-2">
                    <FaWhatsapp className="text-water-blue" />
                    {t.form.phoneFormat}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-deep mb-4">
                  {t.form.amount} <span className="text-sun-gold">*</span>
                </label>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  {montantsSuggeres.map((montant) => (
                    <button
                      key={montant}
                      type="button"
                      onClick={() => handleMontantSelect(montant)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        formData.montant === montant.toString() && !montantPersonnalise
                          ? 'bg-gradient-to-r from-sun-gold to-soft-sun text-forest-deep shadow-lg scale-105'
                          : 'bg-ultra-light text-text-secondary hover:bg-light-moss/20 border border-border-light'
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
                        ? 'bg-gradient-to-r from-sun-gold to-soft-sun text-forest-deep shadow-lg scale-105'
                        : 'bg-ultra-light text-text-secondary hover:bg-light-moss/20 border border-border-light'
                    }`}
                  >
                    {t.form.otherAmount}
                  </button>
                </div>

                {montantPersonnalise && (
                  <div className="relative">
                    <input
                      type="number"
                      name="montant"
                      value={formData.montant}
                      onChange={handleInputChange}
                      onBlur={validateForm}
                      placeholder={t.form.otherAmount}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sun-gold transition-all bg-ultra-light/30 ${
                        errors.montant ? 'border-red-500 focus:ring-red-500' : 'border-border-light'
                      }`}
                      min="100"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-forest-deep font-medium">
                      Ar
                    </span>
                  </div>
                )}
                {errors.montant && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <FaTimes className="w-3 h-3" />
                    {errors.montant}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-deep mb-4">
                  {t.form.paymentMethod} <span className="text-sun-gold">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {modesPaiement.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => handleModePaiementSelect(mode.value)}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                          formData.modePaiementSouhaite === mode.value
                            ? 'border-sun-gold bg-sun-gold/5 ring-2 ring-sun-gold/50'
                            : errors.modePaiementSouhaite
                            ? 'border-red-500 bg-red-50'
                            : 'border-border-light hover:border-light-moss bg-ultra-light/30'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mb-2 ${mode.color} text-white p-1.5 rounded-full`} />
                        <span className="text-sm font-medium text-forest-deep">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.modePaiementSouhaite && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <FaTimes className="w-3 h-3" />
                    {errors.modePaiementSouhaite}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-deep mb-2">
                  {t.form.message}
                </label>
                <div className="relative group">
                  <FaComment className="absolute left-3 top-3 text-text-secondary group-focus-within:text-sun-gold transition-colors" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sun-gold focus:border-transparent transition-all bg-ultra-light/30 hover:bg-ultra-light/50"
                    placeholder={t.form.messagePlaceholder}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white py-4 rounded-lg font-bold text-lg hover:from-forest-deep hover:to-premium-dark transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-warm-white border-t-transparent rounded-full animate-spin"></div>
                    {t.form.submitting}
                  </>
                ) : (
                  <>
                    <FaHeart className="animate-pulse text-sun-gold" />
                    {t.form.submit}
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-text-secondary text-center mt-6">
              {t.form.privacy}
            </p>
          </div>
        </div>

        {/* Cartes d'information */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-sun-gold/10 rounded-full flex items-center justify-center mb-4">
              <FaCheckCircle className="w-6 h-6 text-sun-gold" />
            </div>
            <h3 className="font-bold text-forest-deep mb-2">{t.cards.transparent.title}</h3>
            <p className="text-sm text-text-secondary">{t.cards.transparent.description}</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-water-blue/10 rounded-full flex items-center justify-center mb-4">
              <FaPhone className="w-6 h-6 text-water-blue" />
            </div>
            <h3 className="font-bold text-forest-deep mb-2">{t.cards.support.title}</h3>
            <p className="text-sm text-text-secondary">{t.cards.support.description}</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-olive-nature/10 rounded-full flex items-center justify-center mb-4">
              <FaHeart className="w-6 h-6 text-olive-nature" />
            </div>
            <h3 className="font-bold text-forest-deep mb-2">{t.cards.impact.title}</h3>
            <p className="text-sm text-text-secondary">{t.cards.impact.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonSection;