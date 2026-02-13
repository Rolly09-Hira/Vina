// src/components/layout/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import du logo
import logo from '../../assets/logo.jpg';

export default function Navbar() {
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

  // Fonction pour scroller vers une section
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
          {/* Logo - avec image */}
          <div className="flex items-center">
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-3 group"
            >
              {/* Image logo */}
              <div className={`
                relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden transition-all duration-300
                ${isScrolled 
                  ? 'ring-2 ring-[#6FBF4A] shadow-lg' 
                  : 'ring-2 ring-white/50 group-hover:ring-[#F2D16B]'
                }
              `}>
                <img 
                  src={logo} 
                  alt="VINA Association" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Texte du logo */}
              <span className={`
                font-bold text-xl md:text-2xl transition-colors duration-300
                ${isScrolled ? 'text-[#2F5D2F]' : 'text-white'}
              `}>
                VINA
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className={`
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-[#6E8FA3] hover:text-[#2C7FB8]'
                  : 'text-white/90 hover:text-white border-b-2 border-transparent hover:border-[#F2D16B] pb-1'
                }
              `}
            >
              Accueil
            </button>

            <Link
              to="/about"
              className={`
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-[#6E8FA3] hover:text-[#2C7FB8]' 
                  : 'text-white/90 hover:text-white border-b-2 border-transparent hover:border-[#F2D16B] pb-1'
                }
              `}
            >
              À propos
            </Link>

            <button
              onClick={() => scrollToSection('missions')}
              className={`
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-[#6E8FA3] hover:text-[#2C7FB8]'
                  : 'text-white/90 hover:text-white border-b-2 border-transparent hover:border-[#F2D16B] pb-1'
                }
              `}
            >
              Nos missions
            </button>

            <button
              onClick={() => scrollToSection('projects')}
              className={`
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-[#6E8FA3] hover:text-[#2C7FB8]'
                  : 'text-white/90 hover:text-white border-b-2 border-transparent hover:border-[#F2D16B] pb-1'
                }
              `}
            >
              Nos projets
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className={`
                font-medium transition-all duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-[#6E8FA3] hover:text-[#2C7FB8]'
                  : 'text-white/90 hover:text-white border-b-2 border-transparent hover:border-[#F2D16B] pb-1'
                }
              `}
            >
              Contact
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className={`
              md:hidden p-2 rounded-lg transition-all duration-300
              ${isScrolled 
                ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20'
                : 'text-white hover:bg-white/10'
              }
            `}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`
            md:hidden py-4 mt-4 rounded-xl backdrop-blur-md transition-all duration-300
            ${isScrolled 
              ? 'bg-[#F4F8F9]/95 shadow-lg border border-[#87CFEA]/30'
              : 'bg-[#2F5D2F]/20 border border-white/20'
            }
          `}>
            <div className="flex flex-col space-y-2 px-4">
              <button
                onClick={() => scrollToSection('hero')}
                className={`
                  font-medium py-3 px-4 rounded-lg text-left transition-all duration-300
                  ${isScrolled 
                    ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20 hover:text-[#2C7FB8]'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                Accueil
              </button>

              <Link
                to="/about"
                className={`
                  font-medium py-3 px-4 rounded-lg transition-all duration-300
                  ${isScrolled 
                    ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20 hover:text-[#2C7FB8]'
                    : 'text-white hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>

              <button
                onClick={() => scrollToSection('missions')}
                className={`
                  font-medium py-3 px-4 rounded-lg text-left transition-all duration-300
                  ${isScrolled 
                    ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20 hover:text-[#2C7FB8]'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                Nos missions
              </button>

              <button
                onClick={() => scrollToSection('projects')}
                className={`
                  font-medium py-3 px-4 rounded-lg text-left transition-all duration-300
                  ${isScrolled 
                    ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20 hover:text-[#2C7FB8]'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                Nos projets
              </button>

              <button
                onClick={() => scrollToSection('testimonials')}
                className={`
                  font-medium py-3 px-4 rounded-lg text-left transition-all duration-300
                  ${isScrolled 
                    ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20 hover:text-[#2C7FB8]'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                Témoignages
              </button>

              <button
                onClick={() => scrollToSection('partners')}
                className={`
                  font-medium py-3 px-4 rounded-lg text-left transition-all duration-300
                  ${isScrolled 
                    ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20 hover:text-[#2C7FB8]'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                Partenaires
              </button>

              <button
                onClick={() => scrollToSection('actualites')}
                className={`
                  font-medium py-3 px-4 rounded-lg text-left transition-all duration-300
                  ${isScrolled 
                    ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20 hover:text-[#2C7FB8]'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                Actualités
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className={`
                  font-medium py-3 px-4 rounded-lg text-left transition-all duration-300
                  ${isScrolled 
                    ? 'text-[#6B4F3A] hover:bg-[#87CFEA]/20 hover:text-[#2C7FB8]'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}