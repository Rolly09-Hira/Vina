// src/components/sections/HeroSection.tsx
import { useState, useEffect } from 'react';
import { FaClipboardList, FaLeaf, FaMapMarkedAlt, FaHandsHelping } from 'react-icons/fa';
// Import des images
import back1 from '../../assets/background/back1.jpg';
import back2 from '../../assets/background/back2.jpg';
import back3 from '../../assets/background/back3.jpg';

export default function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [back1, back2, back3];

  // Changement d'image toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images avec transition */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentBg === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        >
          {/* Overlay gradient plus moderne */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-green-900/40" />
        </div>
      ))}

      {/* Pattern overlay subtil */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Contenu */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-32 text-center z-10">
        {/* Badge VINA */}
        <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8 animate-fade-in-down">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
          <span className="text-white/90 text-sm font-medium tracking-wider">
            VINA • MIRA • Développement Durable
          </span>
        </div>

        {/* Titre principal avec animation */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ensemble pour un{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              développement durable
            </span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-green-500/30 -z-0 blur-md" />
          </span>
          <br />
          et inclusif
        </h1>

        {/* Sous-titre */}
        <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
          VINA œuvre pour un développement local intégré, inclusif et durable 
          en plaçant les communautés locales au cœur de ses actions.
        </p>

        {/* Statistiques */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
            {[
                { value: '10+', label: 'Projets actifs', icon: <FaClipboardList className="w-8 h-8 mx-auto" /> },
                { value: '5000+', label: 'Bénéficiaires', icon: <FaLeaf className="w-8 h-8 mx-auto" /> },
                { value: '8', label: 'Régions', icon: <FaMapMarkedAlt className="w-8 h-8 mx-auto" /> },
                { value: '15+', label: 'Partenaires', icon: <FaHandsHelping className="w-8 h-8 mx-auto" /> }
            ].map((stat, index) => (
                <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-white mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                </div>
            ))}
        </div>

        {/* Indicateurs de slide */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBg(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentBg === index 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 hidden md:block animate-bounce">
          <div className="text-white/60 text-sm mb-2">Scroll</div>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}