// src/components/sections/ActualiteSection.tsx
import { useState } from 'react';
import { 
  FaNewspaper, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUser, 
  FaTag, 
  FaArrowRight,
  
} from 'react-icons/fa';

// Import des images projets pour les actualités
import proj1 from '../../assets/projet/proj1.jpg';
import proj2 from '../../assets/projet/proj2.jpg';
import proj3 from '../../assets/projet/proj3.jpg';
import proj4 from '../../assets/projet/proj4.jpg';

// Interface pour les actualités
interface Actualite {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  location: string;
  category: 'projet' | 'evenement' | 'communique' | 'rapport';
  tags: string[];
}

// Données des actualités - 4 uniquement
const actualites: Actualite[] = [
  {
    id: 1,
    title: 'Lancement du programme "Écoles Vertes" dans 5 nouvelles communes',
    description: 'Le programme d\'éducation environnementale s\'étend pour toucher plus de 1000 élèves dans la région Vakinankaratra.',
    image: proj1,
    date: '2024-03-15',
    author: 'Rakoto H.',
    location: 'Région Vakinankaratra',
    category: 'projet',
    tags: ['éducation', 'environnement', 'jeunes']
  },
  {
    id: 2,
    title: 'Atelier de formation en agroécologie - Inscriptions ouvertes',
    description: 'Rejoignez notre atelier de 3 jours sur les techniques agricoles durables et résilientes au climat.',
    image: proj2,
    date: '2024-03-20',
    author: 'Rasoa M.',
    location: 'Antsirabe',
    category: 'evenement',
    tags: ['formation', 'agriculture', 'agroécologie']
  },
  {
    id: 3,
    title: 'Rapport annuel 2024 : Notre impact en chiffres',
    description: 'Découvrez les résultats de nos actions cette année : 5000 bénéficiaires, 12 projets, 8 régions.',
    image: proj3,
    date: '2024-03-10',
    author: 'Andry R.',
    location: 'Antananarivo',
    category: 'rapport',
    tags: ['impact', 'rapport', 'chiffres']
  },
  {
    id: 4,
    title: 'Nouveau forage d\'eau potable pour le village d\'Ambohimanga',
    description: 'Un projet d\'adduction d\'eau qui change la vie de 500 familles dans la région Menabe.',
    image: proj4,
    date: '2024-02-20',
    author: 'Mme Rahanta',
    location: 'Région Menabe',
    category: 'projet',
    tags: ['eau', 'assainissement', 'impact']
  }
];

export default function ActualiteSection() {
  const [filter, setFilter] = useState<string>('all');

  const filteredActualites = actualites.filter(actu => {
    if (filter === 'all') return true;
    return actu.category === filter;
  });

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'projet': return 'bg-[#6FBF4A] text-white';
      case 'evenement': return 'bg-[#2C7FB8] text-white';
      case 'communique': return 'bg-[#6B4F3A] text-white';
      case 'rapport': return 'bg-[#F2D16B] text-[#2F5D2F]';
      default: return 'bg-[#8C857C] text-white';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'projet': return 'Projet';
      case 'evenement': return 'Événement';
      case 'communique': return 'Communiqué';
      case 'rapport': return 'Rapport';
      default: return category;
    }
  };

  return (
    <section className="py-6 bg-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#F4F8F9] to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6FBF4A]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#2C7FB8]/5 rounded-full blur-2xl"></div>
        
        {/* Motif journal */}
        <div className="absolute top-20 left-20 opacity-5">
          <FaNewspaper className="w-40 h-40 text-[#2F5D2F]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <div className="inline-flex items-center bg-gradient-to-r from-[#6FBF4A]/20 to-[#2C7FB8]/20 px-6 py-3 rounded-full border border-[#87CFEA]/30 mb-6 shadow-lg backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2 animate-pulse" />
              <span className="text-[#2F5D2F] text-sm font-bold tracking-wider">
                ACTUALITÉS
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2F5D2F] mb-6 leading-tight">
              Dernières{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] bg-clip-text text-transparent">
                  nouvelles
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#6FBF4A]/20 -z-0 blur-md"></span>
              </span>
            </h2>
            
            <p className="text-xl text-[#6E8FA3] max-w-2xl leading-relaxed">
              Suivez l'actualité de nos projets et découvrez nos dernières actions sur le terrain
            </p>
          </div>
        </div>

        {/* Filtres catégories */}
        <div className="flex flex-wrap justify-start gap-3 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`
              inline-flex items-center px-5 py-2.5 rounded-full font-medium transition-all duration-300
              ${filter === 'all' 
                ? 'bg-[#2F5D2F] text-white shadow-lg scale-105' 
                : 'bg-white text-[#6E8FA3] hover:bg-[#87CFEA]/20 border border-[#87CFEA]/30'
              }
            `}
          >
            Tous
          </button>
          {['projet', 'evenement', 'rapport'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`
                inline-flex items-center px-5 py-2.5 rounded-full font-medium transition-all duration-300
                ${filter === cat 
                  ? getCategoryColor(cat) + ' shadow-lg scale-105' 
                  : 'bg-white text-[#6E8FA3] hover:bg-[#87CFEA]/20 border border-[#87CFEA]/30'
                }
              `}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Grille des actualités - 4 cartes en ligne */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredActualites.map((actu) => (
            <article
              key={actu.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-[#87CFEA]/20 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={actu.image}
                  alt={actu.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badge catégorie */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${getCategoryColor(actu.category)}`}>
                    {getCategoryLabel(actu.category)}
                  </span>
                </div>

                {/* Date flottante */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-[#2F5D2F] shadow-lg flex items-center">
                    <FaCalendarAlt className="w-3 h-3 mr-2 text-[#6FBF4A]" />
                    {new Date(actu.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-5 flex-grow flex flex-col">
                {/* Auteur et localisation */}
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center text-xs text-[#6E8FA3]">
                    <FaUser className="w-3 h-3 mr-1" />
                    {actu.author}
                  </span>
                  <span className="flex items-center text-xs text-[#6E8FA3]">
                    <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                    {actu.location.split(' ')[0]}
                  </span>
                </div>

                {/* Titre */}
                <h3 className="text-base font-bold text-[#2F5D2F] mb-2 group-hover:text-[#6FBF4A] transition-colors line-clamp-2">
                  {actu.title}
                </h3>

                {/* Description */}
                <p className="text-[#6E8FA3] text-xs mb-4 leading-relaxed line-clamp-3 flex-grow">
                  {actu.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {actu.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-[#87CFEA]/10 rounded-full text-[10px] font-medium text-[#2C7FB8]"
                    >
                      <FaTag className="w-2 h-2 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Lien lire plus */}
                <div className="mt-2">
                  <button className="inline-flex items-center text-xs font-semibold text-[#2C7FB8] hover:text-[#6FBF4A] transition-colors group/link">
                    Lire la suite
                    <FaArrowRight className="w-3 h-3 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}