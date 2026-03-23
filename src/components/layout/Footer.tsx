// src/components/layout/Footer.tsx
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaLeaf, 
  FaHandsHelping, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaGlobe,
  FaWhatsapp,
  FaTelegram,
  FaHome,
  FaBuilding,
  FaAt,
  FaMobileAlt,
  FaArrowUp,
  FaCode // Ajout de l'icône pour le développeur
} from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import contactInfoService, { type ContactInfo } from '../../services/contactInfoService';

// Import du logo (même que navbar)
import vinaLogo from '../../assets/VraiLogo.jpg';

// Interface pour le contenu multilingue
interface Content {
  fr: {
    description: string;
    navigation: string;
    contact: string;
    informations: string;
    admin: string;
    adminAccess: string;
    backToTop: string;
    rights: string;
    social: string;
    viewMap: string;
    quickLinks: {
      home: string;
      about: string;
      team: string;
      projects: string;
      missions: string;
      testimonials: string;
      partners: string;
      news: string;
      donate: string;
    };
    developer: {
      title: string;
      visit: string;
    };
  };
  en: {
    description: string;
    navigation: string;
    contact: string;
    informations: string;
    admin: string;
    adminAccess: string;
    backToTop: string;
    rights: string;
    social: string;
    viewMap: string;
    quickLinks: {
      home: string;
      about: string;
      team: string;
      projects: string;
      missions: string;
      testimonials: string;
      partners: string;
      news: string;
      donate: string;
    };
    developer: {
      title: string;
      visit: string;
    };
  };
}

// Texte multilingue
const content: Content = {
  fr: {
    description: "Œuvrer pour un développement local intégré, inclusif et durable à Madagascar, en plaçant les communautés au cœur de nos actions.",
    navigation: "Navigation",
    contact: "Contact",
    informations: "Informations",
    admin: "Espace Admin",
    adminAccess: "Accès réservé au personnel autorisé",
    backToTop: "Retour en haut",
    rights: "Tous droits réservés",
    social: "Réseaux sociaux",
    viewMap: "Voir sur Google Maps",
    quickLinks: {
      home: "Accueil",
      about: "À propos",
      team: "Notre équipe",
      projects: "Nos projets",
      missions: "Nos missions",
      testimonials: "Témoignages",
      partners: "Partenaires",
      news: "Actualités",
      donate: "Faire un don"
    },
    developer: {
      title: "Développeur",
      visit: "Voir le site du développeur"
    }
  },
  en: {
    description: "Working for integrated, inclusive and sustainable local development in Madagascar, placing communities at the heart of our actions.",
    navigation: "Navigation",
    contact: "Contact",
    informations: "Information",
    admin: "Admin Area",
    adminAccess: "Access restricted to authorized personnel",
    backToTop: "Back to top",
    rights: "All rights reserved",
    social: "Social networks",
    viewMap: "View on Google Maps",
    quickLinks: {
      home: "Home",
      about: "About",
      team: "Our team",
      projects: "Our projects",
      missions: "Our missions",
      testimonials: "Testimonials",
      partners: "Partners",
      news: "News",
      donate: "Donate"
    },
    developer: {
      title: "Developer",
      visit: "Visit developer's site"
    }
  }
};

// Mapping des icônes Font Awesome
const iconMap: Record<string, any> = {
  'fa-phone': FaPhone,
  'fa-mobile-alt': FaMobileAlt,
  'fa-whatsapp': FaWhatsapp,
  'fa-envelope': FaEnvelope,
  'fa-at': FaAt,
  'fa-map-marker-alt': FaMapMarkerAlt,
  'fa-home': FaHome,
  'fa-building': FaBuilding,
  'fa-facebook': FaFacebook,
  'fa-twitter': FaTwitter,
  'fa-instagram': FaInstagram,
  'fa-linkedin': FaLinkedin,
  'fa-youtube': FaYoutube,
  'fa-telegram': FaTelegram,
  'fa-globe': FaGlobe,
  'default': FaGlobe
};

export default function Footer() {
  const { language } = useLanguage();
  const location = useLocation();
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

  const isHomePage = location.pathname === '/';

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

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Rendu d'une icône
  const renderIcon = (iconName?: string) => {
    const IconComponent = iconName && iconMap[iconName] ? iconMap[iconName] : iconMap['default'];
    return <IconComponent className="w-5 h-5" />;
  };

  // Rendu d'un contact téléphone
  const renderTelephone = (tel: ContactInfo) => (
    <li key={tel.id} className="flex items-center space-x-3 group">
      <div className="w-8 h-8 bg-olive-nature/10 rounded-full flex items-center justify-center group-hover:bg-olive-nature transition-colors">
        {renderIcon(tel.icone)}
      </div>
      <div className="flex-1">
        {tel.titre && <span className="text-xs text-sun-gold block">{tel.titre}</span>}
        <a href={`tel:${tel.valeur.replace(/\s/g, '')}`} className="text-warm-white/70 hover:text-warm-white text-sm transition-colors">
          {tel.valeur}
        </a>
      </div>
    </li>
  );

  // Rendu d'un email
  const renderEmail = (email: ContactInfo) => (
    <li key={email.id} className="flex items-center space-x-3 group">
      <div className="w-8 h-8 bg-water-blue/10 rounded-full flex items-center justify-center group-hover:bg-water-blue transition-colors">
        {renderIcon(email.icone)}
      </div>
      <div className="flex-1">
        {email.titre && <span className="text-xs text-sun-gold block">{email.titre}</span>}
        <a href={email.lien || `mailto:${email.valeur}`} className="text-warm-white/70 hover:text-warm-white text-sm transition-colors">
          {email.valeur}
        </a>
      </div>
    </li>
  );

  // Rendu d'une adresse
  const renderAdresse = (adresse: ContactInfo) => (
    <li key={adresse.id} className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-earth-brown/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-earth-brown transition-colors">
        {renderIcon(adresse.icone)}
      </div>
      <div className="flex-1">
        {adresse.titre && <span className="text-xs text-sun-gold block">{adresse.titre}</span>}
        <span className="text-warm-white/70 text-sm whitespace-pre-line">{adresse.valeur}</span>
      </div>
    </li>
  );

  // Coordonnées pour la carte
  const mapUrl = "https://www.openstreetmap.org/export/embed.html?bbox=47.507%2C-18.934%2C47.537%2C-18.904&layer=mapnik&marker=-18.919%2C47.522";

  return (
    <footer className="bg-forest-deep text-warm-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sun-gold via-olive-nature to-water-blue"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sun-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 opacity-5">
          <FaLeaf className="w-40 h-40" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-5">
          <FaHandsHelping className="w-40 h-40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        {/* Footer principal - 4 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Colonne 1 : Logo et description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {/* Logo image (même que navbar) */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-sun-gold/30 shadow-xl">
                <img 
                  src={vinaLogo} 
                  alt="VINA Association" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold text-warm-white">VINA Madagascar</span>
            </div>
            <p className="text-sun-gold text-sm leading-relaxed">
              Vision for Integrated and Nature-based Actions
            </p>
            <p className="text-warm-white/70 text-sm leading-relaxed">
              {t.description}
            </p>
            
            {/* Réseaux sociaux dynamiques */}
            {contacts.reseauxSociaux.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-warm-white mb-3">{t.social}</h4>
                <div className="flex flex-wrap gap-2">
                  {contacts.reseauxSociaux.map((social) => {
                    const IconComponent = iconMap[social.icone || ''] || iconMap['default'];
                    return (
                      <a 
                        key={social.id}
                        href={social.lien || social.valeur}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-warm-white/10 hover:bg-sun-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        title={social.titre}
                      >
                        <IconComponent className="w-5 h-5 text-warm-white group-hover:text-forest-deep transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="text-lg font-bold text-warm-white mb-6 relative inline-block">
              {t.navigation}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-sun-gold -mb-2"></span>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/"
                  className="text-warm-white/70 hover:text-warm-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-sun-gold rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  {t.quickLinks.home}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about"
                  className="text-warm-white/70 hover:text-warm-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-sun-gold rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  {t.quickLinks.about}
                </Link>
              </li>
              <li>
                <Link 
                  to="/personnel"
                  className="text-warm-white/70 hover:text-warm-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-sun-gold rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  {t.quickLinks.team}
                </Link>
              </li>
              <li>
                <Link 
                  to="/projets"
                  className="text-warm-white/70 hover:text-warm-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-sun-gold rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  {t.quickLinks.projects}
                </Link>
              </li>

              {/* Liens de sections (uniquement sur l'accueil) */}
              {isHomePage && (
                <>
                  <li>
                    <button 
                      onClick={() => scrollToSection('missions')}
                      className="text-warm-white/70 hover:text-warm-white transition-colors flex items-center group w-full text-left"
                    >
                      <span className="w-1.5 h-1.5 bg-sun-gold rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                      {t.quickLinks.missions}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('testimonials')}
                      className="text-warm-white/70 hover:text-warm-white transition-colors flex items-center group w-full text-left"
                    >
                      <span className="w-1.5 h-1.5 bg-sun-gold rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                      {t.quickLinks.testimonials}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('partners')}
                      className="text-warm-white/70 hover:text-warm-white transition-colors flex items-center group w-full text-left"
                    >
                      <span className="w-1.5 h-1.5 bg-sun-gold rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                      {t.quickLinks.partners}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('actualites')}
                      className="text-warm-white/70 hover:text-warm-white transition-colors flex items-center group w-full text-left"
                    >
                      <span className="w-1.5 h-1.5 bg-sun-gold rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                      {t.quickLinks.news}
                    </button>
                  </li>
                </>
              )}

              {/* Lien don (toujours présent) */}
              <li>
                <Link 
                  to="/faire-un-don"
                  className="text-warm-white/70 hover:text-warm-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-sun-gold rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  {t.quickLinks.donate}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Contact dynamique */}
          <div>
            <h3 className="text-lg font-bold text-warm-white mb-6 relative inline-block">
              {t.contact}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-sun-gold -mb-2"></span>
            </h3>
            
            {contacts.adresses.length > 0 && (
              <div className="mb-6">
                {contacts.adresses.map(renderAdresse)}
              </div>
            )}

            {contacts.telephones.length > 0 && (
              <ul className="space-y-4 mb-4">
                {contacts.telephones.map(renderTelephone)}
              </ul>
            )}

            {contacts.emails.length > 0 && (
              <ul className="space-y-4">
                {contacts.emails.map(renderEmail)}
              </ul>
            )}
          </div>

          {/* Colonne 4 : Carte de localisation */}
          <div>
            <h3 className="text-lg font-bold text-warm-white mb-6 relative inline-block">
              {t.informations}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-sun-gold -mb-2"></span>
            </h3>
            
            {/* Carte miniature */}
            <div className="bg-warm-white/5 rounded-xl overflow-hidden border border-warm-white/10 hover:border-sun-gold/30 transition-all duration-300 group">
              <div className="relative h-40 w-full overflow-hidden">
                <iframe
                  src={mapUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation VINA"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <a
                    href="https://www.openstreetmap.org/?mlat=-18.919&mlon=47.522#map=15/-18.919/47.522"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-sun-gold text-forest-deep px-3 py-1.5 rounded-full hover:bg-soft-sun transition-colors flex items-center gap-1"
                  >
                    <FaMapMarkerAlt className="w-3 h-3" />
                    {t.viewMap}
                  </a>
                </div>
              </div>
              
              {/* Mini info sous la carte */}
              <div className="p-3 text-center border-t border-warm-white/10">
                <p className="text-xs text-warm-white/60">
                  Lot II E 33 I BIS Ambohidahy
                  <br />
                  Ankadindramamy, Antananarivo
                </p>
              </div>
            </div>

            {/* Espace Admin */}
            <div className="mt-6">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full space-x-2 bg-gradient-to-r from-olive-nature to-forest-deep hover:from-forest-deep hover:to-premium-dark text-warm-white font-semibold px-5 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 group border border-sun-gold/30"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                <span>{t.admin}</span>
              </Link>
              <p className="text-xs text-warm-white/40 text-center mt-3">
                {t.adminAccess}
              </p>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-warm-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Petit logo dans le footer */}
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-sun-gold/50">
                <img 
                  src={vinaLogo} 
                  alt="VINA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-warm-white/60 text-sm">
                &copy; {new Date().getFullYear()} VINA Association. {t.rights}.
              </p>
            </div>
            
            {/* Bouton retour haut de page */}
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-2 text-warm-white/60 hover:text-warm-white text-sm transition-colors group mt-4 md:mt-0"
            >
              <span>{t.backToTop}</span>
              <FaArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Nouvelle ligne pour le développeur - centrée et discrète */}
          <div className="mt-6 pt-4 border-t border-warm-white/5">
            <div className="flex justify-center">
              <a
                href="https://rollyandriamahery-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-warm-white/5 hover:bg-warm-white/10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg border border-warm-white/10 hover:border-sun-gold/30"
                title={t.developer.title}
              >
                {/* Icône de code */}
                <FaCode className="w-4 h-4 text-sun-gold/70 group-hover:text-sun-gold transition-colors" />
                
                {/* Texte multilingue */}
                <span className="text-xs text-warm-white/50 group-hover:text-warm-white/80 transition-colors">
                  {t.developer.visit}
                </span>
                
                {/* Petit indicateur externe */}
                <svg 
                  className="w-3 h-3 text-warm-white/30 group-hover:text-warm-white/50 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </a>
            </div>
            
            {/* Petit texte de crédit optionnel (très discret) */}
            <p className="text-center text-warm-white/20 text-[10px] mt-2">
              {language === 'fr' ? 'Développé par Rolly Andriamahery' : 'Developed by Rolly Andriamahery'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}