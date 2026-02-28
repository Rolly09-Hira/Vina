// src/components/sections/HeroSection.tsx - OPTION 1
import { useState, useEffect } from 'react';
import { FaClipboardList, FaLeaf, FaMapMarkedAlt, FaHandsHelping, FaHeart, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import projetService from '../../services/projetService';
import partenaireService from '../../services/partenaireService';
import regionService from '../../services/regionService';
// Import des images
import back1 from '../../assets/background/back1.jpg';
import back2 from '../../assets/background/back2.jpg';
import back3 from '../../assets/background/back3.jpg';

export default function HeroSection() {
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
          projets: projets.length.toString() + '+',
          beneficiaires: totalBeneficiaires > 0 ? totalBeneficiaires.toLocaleString() + '+' : '0',
          regions: regions.length.toString(),
          partenaires: partenaires.length.toString() + '+'
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
    { value: stats.projets, label: 'Projets actifs', icon: <FaClipboardList className="w-6 h-6" /> },
    { value: stats.beneficiaires, label: 'Bénéficiaires', icon: <FaLeaf className="w-6 h-6" /> },
    { value: stats.regions, label: 'Régions', icon: <FaMapMarkedAlt className="w-6 h-6" /> },
    { value: stats.partenaires, label: 'Partenaires', icon: <FaHandsHelping className="w-6 h-6" /> }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images avec zoom réduit et plus claires */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover', // Changé de 'cover' à 'contain' pour moins de zoom
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: currentBg === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        >
          {/* Overlay très léger pour garder l'image claire */}
          <div className="absolute inset-0 bg-gradient-to-br from-premium-dark/20 via-transparent to-olive-nature/10" />
        </div>
      ))}

       {/* Contenu - Layout gauche/droite */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
         <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* PARTIE GAUCHE - Texte et stats */}
          <div className="space-y-8">
            {/* Titre */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white leading-tight">
              Ensemble, pas à pas vers le{' '}
              <span className="relative inline-block">
                <span 
                  className="relative z-10 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #60a82f, #E0B93B)'
                  }}
                >
                  développement durable
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-sun-gold/20 blur-md -z-0" />
              </span>
            </h1>

           <p className="text-lg md:text-xl text-warm-white font-semibold max-w-xl leading-relaxed drop-shadow-2xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] bg-gradient-to-r from-premium-dark/30 to-transparent p-4 rounded-lg">
            VINA œuvre pour un développement local intégré, inclusif et durable 
            en plaçant les communautés locales au cœur de ses actions.
          </p>

            {/* Statistiques - Design moderne en cartes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {statItems.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-premium-dark/20 backdrop-blur-sm rounded-xl p-4 border border-warm-white/10 hover:border-sun-gold/30 transition-all duration-300 group"
                >
                  <div className="text-sun-gold mb-2 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-warm-white">
                    {loading ? '...' : stat.value}
                  </div>
                  <div className="text-xs text-warm-white/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PARTIE DROITE - Bouton don centré */}
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className="relative flex justify-center">
              {/* Cercle décoratif avec teinte or/vert */}
              <div className="absolute -inset-4 bg-gradient-to-r from-sun-gold/30 to-olive-nature/30 rounded-full blur-3xl"></div>
              
              <Link
                to="/faire-un-don"
                className="group relative inline-flex items-center gap-4 px-12 py-6 backdrop-blur-xl bg-gradient-to-r from-sun-gold/10 to-olive-nature/10 border-2 border-sun-gold text-warm-white font-bold text-xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                {/* Overlay de survol avec dégradé or/vert */}
                <span className="absolute inset-0 bg-gradient-to-r from-sun-gold/30 to-olive-nature/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icône cœur avec dégradé */}
                <FaHeart className="w-8 h-8 text-sun-gold animate-pulse group-hover:scale-110 transition-transform drop-shadow-lg" 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(224, 185, 59, 0.5))' }}
                />
                
                <span className="relative bg-gradient-to-r from-sun-gold to-olive-nature bg-clip-text text-transparent font-bold">
                  Faire un don
                </span>
                
                <FaArrowRight className="w-5 h-5 text-olive-nature group-hover:translate-x-2 transition-transform group-hover:text-sun-gold" />
                
                {/* Petit badge décoratif */}
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-sun-gold rounded-full animate-ping opacity-75"></span>
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-olive-nature rounded-full"></span>
              </Link>
            </div>

            {/* Texte d'accompagnement */}
            <div className="backdrop-blur-sm bg-premium-dark/30 px-6 py-3 rounded-full border border-sun-gold/20 text-center">
              <p className="text-warm-white text-sm">
               Chaque geste compte pour construire un avenir meilleur
              </p>
            </div>
          </div>
        </div>

        {/* Indicateurs de slide */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBg(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentBg === index 
                  ? 'w-8 bg-sun-gold' 
                  : 'w-2 bg-warm-white/50 hover:bg-warm-white/80'
              }`}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}