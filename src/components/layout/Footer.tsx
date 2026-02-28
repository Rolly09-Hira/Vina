// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';
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
  FaArrowRight
} from 'react-icons/fa';

// Import du logo
import logo from '../../assets/logo.jpg';

export default function Footer() {
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

  return (
    <footer className="bg-[#2F5D2F] text-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6FBF4A] via-[#2C7FB8] to-[#F2D16B]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6FBF4A]/10 rounded-full blur-3xl"></div>
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
              {/* Logo image */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-[#6FBF4A]/30 shadow-xl">
                <img 
                  src={logo} 
                  alt="VINA Association" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold text-white">VINA</span>
            </div>
            <p className="text-[#87CFEA] text-sm leading-relaxed">
              Mobilisation Intégrée pour la Résilience et l'Autonomie
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Œuvrer pour un développement local intégré, inclusif et durable à Madagascar, 
              en plaçant les communautés au cœur de nos actions.
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex space-x-3 pt-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#6FBF4A] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <FaFacebook className="w-5 h-5 text-white group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#6FBF4A] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <FaTwitter className="w-5 h-5 text-white group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#6FBF4A] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <FaInstagram className="w-5 h-5 text-white group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#6FBF4A] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <FaLinkedin className="w-5 h-5 text-white group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#6FBF4A] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <FaYoutube className="w-5 h-5 text-white group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation vers sections */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Navigation
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#6FBF4A] -mb-2"></span>
            </h3>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => scrollToSection('hero')}
                  className="text-gray-300 hover:text-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#6FBF4A] rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Accueil
                </button>
              </li>
              <li>
                <Link 
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#6FBF4A] rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  À propos
                </Link>
              </li>
              <li>
                <Link 
                  to="/personnel"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#6FBF4A] rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Notre équipe
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('missions')}
                  className="text-gray-300 hover:text-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#6FBF4A] rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Nos missions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="text-gray-300 hover:text-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#6FBF4A] rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Nos projets
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="text-gray-300 hover:text-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#6FBF4A] rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Témoignages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('partners')}
                  className="text-gray-300 hover:text-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#6FBF4A] rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Partenaires
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('actualites')}
                  className="text-gray-300 hover:text-white transition-colors flex items-center group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 bg-[#6FBF4A] rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Actualités
                </button>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Contact
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#6FBF4A] -mb-2"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-[#6FBF4A] flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Lot II E 33 I BIS Ambohidahy<br />
                  Ankadindramamy, Antananarivo<br />
                  Madagascar
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="w-5 h-5 text-[#6FBF4A] flex-shrink-0" />
                <span className="text-gray-300 text-sm">+261 34 00 000 00</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-[#6FBF4A] flex-shrink-0" />
                <span className="text-gray-300 text-sm">contact@vina.mg</span>
              </li>
            </ul>

            {/* Bouton Contact direct */}
            <div className="mt-6">
              <button 
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center text-[#87CFEA] hover:text-white transition-colors text-sm group"
              >
                Nous écrire
                <FaArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Colonne 4 : Horaires et lien admin */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Informations
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#6FBF4A] -mb-2"></span>
            </h3>
            
            <div className="bg-white/5 rounded-xl p-6 space-y-4">
              <h4 className="text-white font-semibold">Horaires d'ouverture</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Lundi - Vendredi</span>
                  <span>08h00 - 17h00</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Samedi</span>
                  <span>09h00 - 12h00</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </div>
            </div>

            {/* Espace Admin */}
            <div className="mt-8">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full space-x-2 bg-gradient-to-r from-[#6FBF4A] to-[#4E8B3A] hover:from-[#4E8B3A] hover:to-[#2F5D2F] text-white font-semibold px-5 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 group"
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
                <span>Espace Admin</span>
              </Link>
              <p className="text-xs text-gray-400 text-center mt-3">
                Accès réservé au personnel autorisé
              </p>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Petit logo dans le footer */}
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#6FBF4A]/50">
                <img 
                  src={logo} 
                  alt="VINA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} VINA Association. Tous droits réservés.
              </p>
            </div>
            
            {/* Bouton retour haut de page */}
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm transition-colors group mt-4 md:mt-0"
            >
              <span>Retour en haut</span>
              <svg 
                className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}