// src/components/sections/ContactSection.tsx
import { useState, useEffect } from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaHeart,
  FaArrowRight,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaTelegram
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import contactInfoService, { type ContactInfo } from '../../services/contactInfoService';

// Interface pour le contenu multilingue
interface Content {
  fr: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    info: {
      title: string;
      followUs: string;
      hours: string;
      weekdays: string;
      saturday: string;
      sunday: string;
      closed: string;
    };
    donate: {
      button: string;
      subtitle: string;
    };
  };
  en: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    info: {
      title: string;
      followUs: string;
      hours: string;
      weekdays: string;
      saturday: string;
      sunday: string;
      closed: string;
    };
    donate: {
      button: string;
      subtitle: string;
    };
  };
}

// Texte multilingue
const content: Content = {
  fr: {
    badge: 'CONTACT',
    title: 'Restons en',
    titleHighlight: 'contact',
    subtitle: 'Retrouvez toutes nos coordonnées pour nous joindre. Notre équipe reste à votre écoute.',
    info: {
      title: 'Coordonnées',
      followUs: 'Suivez-nous',
      hours: 'Horaires d\'ouverture',
      weekdays: 'Lundi - Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
      closed: 'Fermé'
    },
    donate: {
      button: 'Faire un don',
      subtitle: 'Soutenez nos actions'
    }
  },
  en: {
    badge: 'CONTACT',
    title: 'Stay in',
    titleHighlight: 'touch',
    subtitle: 'Find all our contact information to reach us. Our team remains at your disposal.',
    info: {
      title: 'Contact info',
      followUs: 'Follow us',
      hours: 'Opening hours',
      weekdays: 'Monday - Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      closed: 'Closed'
    },
    donate: {
      button: 'Make a donation',
      subtitle: 'Support our actions'
    }
  }
};

// Mapping des icônes Font Awesome pour les réseaux sociaux
const socialIconMap: Record<string, any> = {
  'fa-facebook': FaFacebook,
  'fa-twitter': FaTwitter,
  'fa-instagram': FaInstagram,
  'fa-linkedin': FaLinkedin,
  'fa-youtube': FaYoutube,
  'fa-whatsapp': FaWhatsapp,
  'fa-telegram': FaTelegram,
  'default': FaFacebook
};

// Mapping des icônes pour les contacts
const contactIconMap: Record<string, any> = {
  'telephone': FaPhone,
  'email': FaEnvelope,
  'adresse': FaMapMarkerAlt,
  'default': FaMapMarkerAlt
};

export default function ContactSection() {
  const { language } = useLanguage();
  const t = content[language];
  
  const [contacts, setContacts] = useState<{
    telephones: ContactInfo[];
    emails: ContactInfo[];
    adresses: ContactInfo[];
    reseauxSociaux: ContactInfo[];
  }>({
    telephones: [],
    emails: [],
    adresses: [],
    reseauxSociaux: []
  });

  // Charger les contacts depuis le backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const [telephones, emails, adresses, reseaux] = await Promise.all([
          contactInfoService.getTelephones(),
          contactInfoService.getEmails(),
          contactInfoService.getAdresses(),
          contactInfoService.getReseauxSociaux()
        ]);

        setContacts({
          telephones: telephones.filter(c => c.actif).sort((a, b) => (a.ordreAffichage || 0) - (b.ordreAffichage || 0)),
          emails: emails.filter(c => c.actif).sort((a, b) => (a.ordreAffichage || 0) - (b.ordreAffichage || 0)),
          adresses: adresses.filter(c => c.actif).sort((a, b) => (a.ordreAffichage || 0) - (b.ordreAffichage || 0)),
          reseauxSociaux: reseaux.filter(c => c.actif).sort((a, b) => (a.ordreAffichage || 0) - (b.ordreAffichage || 0))
        });
      } catch (error) {
        console.error('Erreur chargement contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  // Rendu d'une icône de contact
  const renderContactIcon = (type: string, iconName?: string) => {
    if (type === 'reseau_social') {
      const Icon = iconName && socialIconMap[iconName] ? socialIconMap[iconName] : socialIconMap['default'];
      return <Icon className="w-5 h-5" />;
    }
    const Icon = contactIconMap[type] || contactIconMap['default'];
    return <Icon className="w-5 h-5" />;
  };

  return (
    <section className="py-12 bg-gradient-to-b from-warm-white to-ultra-light relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-warm-white to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sun-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 opacity-5">
          <FaEnvelope className="w-40 h-40 text-olive-nature" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-sun-gold/10 px-6 py-3 rounded-full border border-sun-gold/20 mb-6 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 bg-sun-gold rounded-full mr-2 animate-pulse"></span>
            <span className="text-forest-deep text-sm font-bold tracking-wider">
              {t.badge}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest-deep mb-6 leading-tight">
            {t.title}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-sun-gold to-olive-nature bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-sun-gold/20 -z-0 blur-md"></span>
            </span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* PARTIE GAUCHE - Coordonnées */}
          <div className="space-y-8">
            {/* Coordonnées principales */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-border-light hover:shadow-2xl transition-all duration-500">
              <h3 className="text-2xl font-bold text-forest-deep mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-sun-gold rounded-full"></span>
                {t.info.title}
              </h3>
              
              <div className="space-y-6">
                {/* Téléphones */}
                {contacts.telephones.length > 0 && (
                  <div className="space-y-3">
                    {contacts.telephones.map((tel) => (
                      <div key={tel.id} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-olive-nature/10 rounded-full flex items-center justify-center group-hover:bg-olive-nature transition-colors">
                          {renderContactIcon('telephone', tel.icone)}
                        </div>
                        <div className="flex-1">
                          {tel.titre && <span className="text-xs text-sun-gold block">{tel.titre}</span>}
                          <a href={`tel:${tel.valeur.replace(/\s/g, '')}`} className="text-text-secondary hover:text-olive-nature transition-colors">
                            {tel.valeur}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Emails */}
                {contacts.emails.length > 0 && (
                  <div className="space-y-3">
                    {contacts.emails.map((email) => (
                      <div key={email.id} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-water-blue/10 rounded-full flex items-center justify-center group-hover:bg-water-blue transition-colors">
                          {renderContactIcon('email', email.icone)}
                        </div>
                        <div className="flex-1">
                          {email.titre && <span className="text-xs text-sun-gold block">{email.titre}</span>}
                          <a href={`mailto:${email.valeur}`} className="text-text-secondary hover:text-water-blue transition-colors">
                            {email.valeur}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Adresses */}
                {contacts.adresses.length > 0 && (
                  <div className="space-y-3">
                    {contacts.adresses.map((adresse) => (
                      <div key={adresse.id} className="flex items-start gap-3 group">
                        <div className="w-10 h-10 bg-earth-brown/10 rounded-full flex items-center justify-center group-hover:bg-earth-brown transition-colors flex-shrink-0 mt-1">
                          {renderContactIcon('adresse', adresse.icone)}
                        </div>
                        <div className="flex-1">
                          {adresse.titre && <span className="text-xs text-sun-gold block">{adresse.titre}</span>}
                          <p className="text-text-secondary whitespace-pre-line">{adresse.valeur}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PARTIE DROITE - Réseaux sociaux et bouton don */}
          <div className="space-y-8">
            {/* Réseaux sociaux */}
            {contacts.reseauxSociaux.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-border-light hover:shadow-2xl transition-all duration-500">
                <h3 className="text-2xl font-bold text-forest-deep mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-sun-gold rounded-full"></span>
                  {t.info.followUs}
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {contacts.reseauxSociaux.map((social) => {
                    const Icon = social.icone && socialIconMap[social.icone] ? socialIconMap[social.icone] : socialIconMap['default'];
                    return (
                      <a
                        key={social.id}
                        href={social.lien || social.valeur}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-ultra-light rounded-xl hover:bg-sun-gold transition-all duration-300 group"
                        title={social.titre}
                      >
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-forest-deep group-hover:text-sun-gold transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-forest-deep group-hover:text-white transition-colors">
                          {social.titre || social.valeur.replace('https://', '').split('.')[0]}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bouton Don - Mis en évidence */}
            <div className="bg-gradient-to-br from-olive-nature to-forest-deep rounded-3xl shadow-2xl p-8 border border-sun-gold/30 relative overflow-hidden group">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-sun-gold/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-sun-gold/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-sun-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <FaHeart className="w-10 h-10 text-sun-gold animate-pulse" />
                </div>
                
                <h3 className="text-3xl font-bold text-warm-white mb-3">
                  {t.donate.subtitle}
                </h3>
                
                <p className="text-warm-white/90 mb-8 max-w-md mx-auto">
                  Chaque don, quel que soit son montant, contribue à nos actions de développement durable auprès des communautés rurales.
                </p>
                
                <Link
                  to="/faire-un-don"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-sun-gold text-forest-deep font-bold text-lg rounded-full hover:bg-soft-sun transition-all transform hover:scale-105 shadow-xl group/btn"
                >
                  <FaHeart className="group-hover/btn:scale-110 transition-transform" />
                  {t.donate.button}
                  <FaArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carte de localisation miniature (optionnelle) */}
        {contacts.adresses.length > 0 && (
          <div className="mt-12">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border-light hover:shadow-2xl transition-all duration-500">
              <div className="h-2 bg-gradient-to-r from-sun-gold via-olive-nature to-water-blue"></div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-earth-brown/10 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="w-6 h-6 text-earth-brown" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-forest-deep">Notre adresse</h4>
                      <p className="text-text-secondary text-sm">{contacts.adresses[0].valeur}</p>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contacts.adresses[0].valeur)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-sun-gold/10 text-forest-deep font-medium rounded-xl hover:bg-sun-gold hover:text-white transition-all group"
                  >
                    <span>Voir sur Google Maps</span>
                    <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}