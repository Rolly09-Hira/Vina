// src/components/sections/HeroSection.tsx
import { useState, useEffect } from 'react';
import { FaClipboardList, FaLeaf, FaMapMarkedAlt, FaHandsHelping, FaHeart, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import projetService from '../../services/projetService';
import partenaireService from '../../services/partenaireService';
import regionService from '../../services/regionService';
import { useLanguage } from '../../contexts/LanguageContext';

// Import des images
import back1 from '../../assets/background/back1.jpg';
import back2 from '../../assets/background/back2.jpg';
import back3 from '../../assets/background/back3.jpg';

// Interface pour le contenu multilingue
interface Content {
  fr: {
    title: string;
    titleHighlight: string;
    description: string;
    stats: {
      projets: string;
      beneficiaires: string;
      regions: string;
      partenaires: string;
    };
    donate: string;
    footer: string;
  };
  en: {
    title: string;
    titleHighlight: string;
    description: string;
    stats: {
      projets: string;
      beneficiaires: string;
      regions: string;
      partenaires: string;
    };
    donate: string;
    footer: string;
  };
}

// Texte multilingue
const content: Content = {
  fr: {
    title: 'Ensemble, pas à pas vers le',
    titleHighlight: 'développement durable',
    description: 'VINA œuvre pour un développement local intégré, inclusif et durable en plaçant les communautés locales au cœur de ses actions.',
    stats: {
      projets: 'Projets actifs',
      beneficiaires: 'Bénéficiaires',
      regions: 'Régions',
      partenaires: 'Partenaires'
    },
    donate: 'Faire un don',
    footer: 'Chaque geste compte pour construire un avenir meilleur'
  },
  en: {
    title: 'Together, step by step towards',
    titleHighlight: 'sustainable development',
    description: 'VINA works for integrated, inclusive and sustainable local development by placing local communities at the heart of its actions.',
    stats: {
      projets: 'Active projects',
      beneficiaires: 'Beneficiaries',
      regions: 'Regions',
      partenaires: 'Partners'
    },
    donate: 'Make a donation',
    footer: 'Every gesture counts to build a better future'
  }
};

export default function HeroSection() {
  const { language } = useLanguage();
  const t = content[language];
  
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [back1, back2, back3];
  
  const [stats, setStats] = useState({
    projets: '0',
    beneficiaires: '0',
    regions: '0',
    partenaires: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projets, partenaires, regions] = await Promise.all([
          projetService.getAllProjets(),
          partenaireService.getAllPartenaires(),
          regionService.getAllRegions()
        ]);

        const totalBeneficiaires = projets.reduce((acc, projet) => 
          acc + (projet.beneficiaires || 0), 0
        );

        setStats({
          projets: projets.length.toString() ,
          beneficiaires: totalBeneficiaires > 0 ? totalBeneficiaires.toLocaleString() : '0',
          regions: regions.length.toString(),
          partenaires: partenaires.length.toString() 
        });
      } catch (error) {
        console.error('Erreur chargement statistiques:', error);
        setStats({
          projets: '10+',
          beneficiaires: '5000+',
          regions: '8',
          partenaires: '15+'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    { value: stats.projets, label: t.stats.projets, icon: <FaClipboardList className="w-6 h-6" /> },
    { value: stats.beneficiaires, label: t.stats.beneficiaires, icon: <FaLeaf className="w-6 h-6" /> },
    { value: stats.regions, label: t.stats.regions, icon: <FaMapMarkedAlt className="w-6 h-6" /> },
    { value: stats.partenaires, label: t.stats.partenaires, icon: <FaHandsHelping className="w-6 h-6" /> }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images avec overlay plus foncé pour meilleure lisibilité */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: currentBg === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        >
          {/* Overlay plus prononcé pour améliorer le contraste */}
          <div className="absolute inset-0 bg-gradient-to-br from-premium-dark/70 via-premium-dark/50 to-olive-nature/40" />
        </div>
      ))}

      {/* Contenu - Layout gauche/droite */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* PARTIE GAUCHE - Texte et stats */}
          <div className="space-y-8">
            {/* Titre avec ombre renforcée */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white leading-tight drop-shadow-2xl">
              {t.title}{' '}
              <span className="relative inline-block">
                <span 
                  className="relative z-10 bg-clip-text text-transparent font-extrabold"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #E0B93B, #F3D77A)'
                  }}
                >
                  {t.titleHighlight}
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-premium-dark/40 blur-md -z-0" />
              </span>
            </h1>

            {/* Description avec fond semi-transparent et ombre */}
            <div className="max-w-xl">
              <p className="text-lg md:text-xl text-warm-white font-medium leading-relaxed drop-shadow-lg bg-premium-dark/40 backdrop-blur-sm p-5 rounded-xl border-l-4 border-sun-gold shadow-xl">
                {t.description}
              </p>
            </div>

            {/* Statistiques - Design moderne en cartes avec meilleure visibilité */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {statItems.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-premium-dark/60 backdrop-blur-md rounded-xl p-4 border-2 border-sun-gold/30 hover:border-sun-gold transition-all duration-300 group shadow-xl"
                >
                  <div className="text-sun-gold mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-warm-white drop-shadow-lg">
                    {loading ? (
                      <span className="inline-block w-8 h-6 bg-sun-gold/30 animate-pulse rounded"></span>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-xs font-medium text-warm-white/90 mt-1 drop-shadow">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PARTIE DROITE - Bouton don centré avec meilleure visibilité */}
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className="relative flex justify-center">
              {/* Cercle décoratif plus visible */}
              <div className="absolute -inset-8 bg-gradient-to-r from-sun-gold/40 to-olive-nature/40 rounded-full blur-3xl animate-pulse"></div>
              
              <Link
                to="/faire-un-don"
                className="group relative inline-flex items-center gap-4 px-12 py-6 backdrop-blur-xl bg-gradient-to-r from-sun-gold/20 to-olive-nature/20 border-4 border-sun-gold text-warm-white font-bold text-2xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                {/* Overlay de survol avec dégradé or/vert */}
                <span className="absolute inset-0 bg-gradient-to-r from-sun-gold/50 to-olive-nature/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icône cœur avec dégradé et animation */}
                <FaHeart className="w-10 h-10 text-sun-gold animate-pulse group-hover:scale-110 transition-transform drop-shadow-2xl" 
                  style={{ filter: 'drop-shadow(0 0 12px rgba(224, 185, 59, 0.8))' }}
                />
                
                <span className="relative bg-gradient-to-r from-sun-gold to-soft-sun bg-clip-text text-transparent font-extrabold text-2xl drop-shadow-2xl">
                  {t.donate}
                </span>
                
                <FaArrowRight className="w-6 h-6 text-sun-gold group-hover:translate-x-2 transition-transform group-hover:text-olive-nature drop-shadow-lg" />
                
                {/* Badges décoratifs plus visibles */}
                <span className="absolute -top-3 -right-3 w-6 h-6 bg-sun-gold rounded-full animate-ping opacity-75"></span>
                <span className="absolute -top-3 -right-3 w-6 h-6 bg-olive-nature rounded-full"></span>
              </Link>
            </div>

            {/* Texte d'accompagnement avec meilleure visibilité */}
            <div className="backdrop-blur-md bg-premium-dark/70 px-8 py-4 rounded-full border-2 border-sun-gold/40 shadow-2xl">
              <p className="text-warm-white text-base font-medium drop-shadow-lg">
                {t.footer}
              </p>
            </div>
          </div>
        </div>

        {/* Indicateurs de slide plus visibles */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBg(index)}
              className={`h-3 rounded-full transition-all duration-500 shadow-lg ${
                currentBg === index 
                  ? 'w-12 bg-sun-gold shadow-sun-gold/50' 
                  : 'w-3 bg-warm-white/80 hover:bg-warm-white shadow-black/30'
              }`}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}