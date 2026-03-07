// src/components/layout/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaGlobe } from 'react-icons/fa';

// Import du logo
import vinaLogo from '../../assets/VraiLogo.jpg';

// Contenu multilingue
const content = {
  fr: {
    home: 'Accueil',
    about: 'À propos',
    team: 'Notre équipe',
    projects: 'Nos projets',
    donate: 'Faire un don'
  },
  en: {
    home: 'Home',
    about: 'About',
    team: 'Our team',
    projects: 'Projects',
    donate: 'Donate'
  }
};

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
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

  // Ne pas afficher les liens de sections sur les pages autres que l'accueil
  const showSectionLinks = isHomePage;

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled
          ? 'bg-warm-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent backdrop-blur-sm'
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo à gauche */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 group focus:outline-none"
            >
              {/* Cercle du logo */}
              <div
                className={`
                  relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden transition-all duration-300
                  ${isScrolled
                    ? 'ring-2 ring-olive-nature shadow-lg'
                    : 'ring-2 ring-white/50 group-hover:ring-sun-gold'
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
                  ${isScrolled ? 'text-forest-deep' : 'text-warm-white'}
                `}
              >
                VINA
              </span>
            </Link>
          </div>

          {/* Navigation desktop - centrée */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <Link
              to="/"
              className={`
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled
                  ? 'text-text-secondary hover:text-olive-nature'
                  : 'text-warm-white/90 hover:text-warm-white border-b-2 border-transparent hover:border-sun-gold pb-1'
                }
              `}
            >
              {t.home}
            </Link>

            <Link
              to="/about"
              className={`
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled
                  ? 'text-text-secondary hover:text-olive-nature'
                  : 'text-warm-white/90 hover:text-warm-white border-b-2 border-transparent hover:border-sun-gold pb-1'
                }
              `}
            >
              {t.about}
            </Link>

            <Link
              to="/personnel"
              className={`
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled
                  ? 'text-text-secondary hover:text-olive-nature'
                  : 'text-warm-white/90 hover:text-warm-white border-b-2 border-transparent hover:border-sun-gold pb-1'
                }
              `}
            >
              {t.team}
            </Link>

            <Link
              to="/projets"
              className={`
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled
                  ? 'text-text-secondary hover:text-olive-nature'
                  : 'text-warm-white/90 hover:text-warm-white border-b-2 border-transparent hover:border-sun-gold pb-1'
                }
              `}
            >
              {t.projects}
            </Link>

            {/* Liens de sections uniquement sur l'accueil */}
            {showSectionLinks && (
              <>
                <button
                  onClick={() => scrollToSection('missions')}
                  className={`
                    font-medium transition-all duration-300 hover:scale-105
                    ${isScrolled
                      ? 'text-text-secondary hover:text-olive-nature'
                      : 'text-warm-white/90 hover:text-warm-white border-b-2 border-transparent hover:border-sun-gold pb-1'
                    }
                  `}
                >
                  Nos missions
                </button>

                <button
                  onClick={() => scrollToSection('contact')}
                  className={`
                    font-medium transition-all duration-300 hover:scale-105
                    ${isScrolled
                      ? 'text-text-secondary hover:text-olive-nature'
                      : 'text-warm-white/90 hover:text-warm-white border-b-2 border-transparent hover:border-sun-gold pb-1'
                    }
                  `}
                >
                  Contact
                </button>
              </>
            )}
          </div>

          {/* Partie droite : Bouton langue et don */}
          <div className="flex items-center gap-3">
            {/* Bouton langue professionnel */}
            <button
              onClick={toggleLanguage}
              className={`
                relative group flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300
                ${isScrolled
                  ? 'bg-ultra-light text-forest-deep hover:bg-olive-nature hover:text-warm-white border border-border-light'
                  : 'bg-warm-white/10 text-warm-white hover:bg-warm-white/20 backdrop-blur-sm border border-warm-white/30'
                }
              `}
              aria-label="Changer la langue"
            >
              <FaGlobe className={`w-4 h-4 ${isScrolled ? 'text-olive-nature group-hover:text-warm-white' : 'text-warm-white'} transition-colors`} />
              <span className="uppercase font-semibold">{language}</span>
              <span className="text-xs opacity-60 ml-1 hidden sm:inline">
                {language === 'fr' ? 'Français' : 'English'}
              </span>
            </button>

            {/* Bouton don */}
            <Link
              to="/faire-un-don"
              className={`
                hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105
                ${isScrolled
                  ? 'bg-gradient-to-r from-sun-gold to-soft-sun text-forest-deep hover:shadow-lg'
                  : 'bg-sun-gold/20 backdrop-blur-sm text-warm-white border border-warm-white/30 hover:bg-sun-gold/30'
                }
              `}
            >
              <span>{t.donate}</span>
              <span className="text-lg">❤️</span>
            </Link>

            {/* Bouton menu mobile */}
            <button
              className={`
                md:hidden p-2 rounded-lg transition-all duration-300
                ${isScrolled
                  ? 'text-forest-deep hover:bg-ultra-light'
                  : 'text-warm-white hover:bg-white/10'
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
                ? 'bg-warm-white/95 shadow-lg border border-border-light'
                : 'bg-premium-dark/80 border border-warm-white/20'
              }
            `}
          >
            <div className="flex flex-col space-y-2 px-4">
              <Link
                to="/"
                className={`
                  font-medium py-3 px-4 rounded-lg transition-all duration-300
                  ${isScrolled
                    ? 'text-text-secondary hover:bg-ultra-light hover:text-forest-deep'
                    : 'text-warm-white hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.home}
              </Link>

              <Link
                to="/about"
                className={`
                  font-medium py-3 px-4 rounded-lg transition-all duration-300
                  ${isScrolled
                    ? 'text-text-secondary hover:bg-ultra-light hover:text-forest-deep'
                    : 'text-warm-white hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.about}
              </Link>

              <Link
                to="/personnel"
                className={`
                  font-medium py-3 px-4 rounded-lg transition-all duration-300
                  ${isScrolled
                    ? 'text-text-secondary hover:bg-ultra-light hover:text-forest-deep'
                    : 'text-warm-white hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.team}
              </Link>

              <Link
                to="/projets"
                className={`
                  font-medium py-3 px-4 rounded-lg transition-all duration-300
                  ${isScrolled
                    ? 'text-text-secondary hover:bg-ultra-light hover:text-forest-deep'
                    : 'text-warm-white hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.projects}
              </Link>

              {/* Liens de sections sur mobile */}
              {showSectionLinks && (
                <>
                  <button
                    onClick={() => scrollToSection('missions')}
                    className={`
                      font-medium py-3 px-4 rounded-lg text-left transition-all duration-300
                      ${isScrolled
                        ? 'text-text-secondary hover:bg-ultra-light hover:text-forest-deep'
                        : 'text-warm-white hover:bg-white/10'
                      }
                    `}
                  >
                    Nos missions
                  </button>

                  <button
                    onClick={() => scrollToSection('contact')}
                    className={`
                      font-medium py-3 px-4 rounded-lg text-left transition-all duration-300
                      ${isScrolled
                        ? 'text-text-secondary hover:bg-ultra-light hover:text-forest-deep'
                        : 'text-warm-white hover:bg-white/10'
                      }
                    `}
                  >
                    Contact
                  </button>
                </>
              )}

              {/* Bouton don mobile */}
              <Link
                to="/faire-un-don"
                className={`
                  flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold mt-4 transition-all duration-300
                  ${isScrolled
                    ? 'bg-gradient-to-r from-sun-gold to-soft-sun text-forest-deep'
                    : 'bg-sun-gold/30 backdrop-blur-sm text-warm-white border border-warm-white/30'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{t.donate}</span>
                <span>❤️</span>
              </Link>

              {/* Bouton langue mobile */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className={`
                  flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium mt-2 transition-all duration-300
                  ${isScrolled
                    ? 'bg-ultra-light text-forest-deep border border-border-light'
                    : 'bg-warm-white/10 text-warm-white backdrop-blur-sm border border-warm-white/30'
                  }
                `}
              >
                <FaGlobe className="w-4 h-4" />
                <span>{language === 'fr' ? 'Passer en anglais' : 'Switch to French'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}