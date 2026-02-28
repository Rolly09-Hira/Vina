// src/components/layout/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext'; // 👈 AJOUT

// Import du logo (assurez-vous que le fichier est bien dans src/assets/)
import vinaLogo from '../../assets/VraiLogo.jpg';

// Contenu multilingue
const content = {
  fr: {
    home: 'Accueil',
    about: 'À propos',
    missions: 'Nos missions',
    projects: 'Nos projets',
    contact: 'Contact',
    testimonials: 'Témoignages',
    partners: 'Partenaires',
    actualites: 'Actualités'
  },
  en: {
    home: 'Home',
    about: 'About',
    missions: 'Our missions',
    projects: 'Projects',
    contact: 'Contact',
    testimonials: 'Testimonials',
    partners: 'Partners',
    actualites: 'News'
  }
};

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage(); // 👈 AJOUT
  const t = content[language];
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Palette de couleurs VINA (cohérente avec votre charte)

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled
          ? 'bg-[#F4F8F9]/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent backdrop-blur-sm'
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo avec image et texte */}
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-3 group focus:outline-none"
            >
              {/* Cercle du logo avec effet de survol */}
              <div
                className={`
                  relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden transition-all duration-300
                  ${isScrolled
                    ? 'ring-2 ring-[#6FBF4A] shadow-lg'
                    : 'ring-2 ring-white/50 group-hover:ring-[#F2D16B]'
                  }
                `}
              >
                <img
                  src={vinaLogo}
                  alt="VINA Association"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Texte VINA */}
              <span
                className={`
                  font-bold text-xl md:text-2xl tracking-tight transition-colors duration-300
                  ${isScrolled ? 'text-[#2F5D2F]' : 'text-white'}
                `}
              >
                VINA
              </span>
            </button>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { label: t.home, section: 'hero' },
              { label: t.about, to: '/about' },
              { label: t.missions, section: 'missions' },
              { label: t.projects, section: 'projects' },
              { label: t.contact, section: 'contact' },
            ].map((item) => {
              const commonClasses = `
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled
                  ? 'text-[#6E8FA3] hover:text-[#2C7FB8]'
                  : 'text-white/90 hover:text-white border-b-2 border-transparent hover:border-[#F2D16B] pb-1'
                }
              `;
              return item.to ? (
                <Link key={item.label} to={item.to} className={commonClasses}>
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.section!)}
                  className={commonClasses}
                >
                  {item.label}
                </button>
              );
            })}

            {/* 👇 BOUTON DE CHANGEMENT DE LANGUE - DESKTOP */}
            <button
              onClick={toggleLanguage}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full font-medium text-sm transition-all duration-300
                ${isScrolled
                  ? 'bg-[#6FBF4A] text-white hover:bg-[#4E8B3A] shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                }
              `}
              aria-label="Changer la langue"
            >
              {language === 'fr' ? (
                <>
                  <span className="text-base">🇫🇷</span>
                  <span>FR</span>
                </>
              ) : (
                <>
                  <span className="text-base">🇬🇧</span>
                  <span>EN</span>
                </>
              )}
            </button>
          </div>

          {/* Bouton menu mobile */}
          <div className="flex items-center gap-2">
            {/* 👇 BOUTON DE CHANGEMENT DE LANGUE - MOBILE */}
            <button
              onClick={toggleLanguage}
              className={`
                md:hidden p-2 rounded-full transition-all duration-300
                ${isScrolled
                  ? 'bg-[#6FBF4A] text-white'
                  : 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
                }
              `}
              aria-label="Changer la langue"
            >
              {language === 'fr' ? '🇫🇷' : '🇬🇧'}
            </button>

            <button
              className={`
                md:hidden p-2 rounded-lg transition-all duration-300
                ${isScrolled
                  ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20'
                  : 'text-white hover:bg-white/10'
                }
              `}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation mobile */}
        {isMenuOpen && (
          <div
            className={`
              md:hidden py-4 mt-4 rounded-xl backdrop-blur-md transition-all duration-300
              ${isScrolled
                ? 'bg-[#F4F8F9]/95 shadow-lg border border-[#87CFEA]/30'
                : 'bg-[#2F5D2F]/20 border border-white/20'
              }
            `}
          >
            <div className="flex flex-col space-y-2 px-4">
              {[
                { label: t.home, section: 'hero' },
                { label: t.about, to: '/about' },
                { label: t.missions, section: 'missions' },
                { label: t.projects, section: 'projects' },
                { label: t.testimonials, section: 'testimonials' },
                { label: t.partners, section: 'partners' },
                { label: t.actualites, section: 'actualites' },
                { label: t.contact, section: 'contact' },
              ].map((item) => {
                const baseClasses = `
                  font-medium py-3 px-4 rounded-lg transition-all duration-300
                  ${isScrolled
                    ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20 hover:text-[#2C7FB8]'
                    : 'text-white hover:bg-white/10'
                }
                `;
                return item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={baseClasses}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.section!)}
                    className={`${baseClasses} text-left`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* 👇 OPTION DE LANGUE DANS LE MENU MOBILE */}
              <div className="pt-4 mt-4 border-t border-white/20">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300
                    ${isScrolled
                      ? 'bg-[#6FBF4A] text-white hover:bg-[#4E8B3A]'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    }
                  `}
                >
                  {language === 'fr' ? (
                    <>
                      <span className="text-xl">🇬🇧</span>
                      <span>Switch to English</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🇫🇷</span>
                      <span>Passer en français</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}