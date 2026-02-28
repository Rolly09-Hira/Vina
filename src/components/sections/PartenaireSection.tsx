// src/components/sections/PartenaireSection.tsx
import { useState } from 'react';
import { 
  FaHandshake, 
  FaGlobe, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';

// Import des logos partenaires
import part1 from '../../assets/partenaire/part1.jpg';
import part2 from '../../assets/partenaire/part2.jpg';
import part3 from '../../assets/partenaire/part3.jpg';
import part4 from '../../assets/partenaire/part4.jpg';
import part5 from '../../assets/partenaire/part5.jpg';
import part6 from '../../assets/partenaire/part6.jpg';

interface Partenaire {
  id: number;
  name: string;
  logo: string;
  type: string;
  country: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  partnershipSince: string;
  description: string;
  category: 'technique' | 'financier' | 'institutionnel' | 'prive' | 'associatif';
}

const partenaires: Partenaire[] = [
  {
    id: 1,
    name: 'Ministère de l\'Environnement',
    logo: part1,
    type: 'Institutionnel',
    country: 'Madagascar',
    website: 'www.environnement.mg',
    email: 'contact@environnement.mg',
    phone: '+261 34 00 000 01',
    location: 'Antananarivo, Madagascar',
    partnershipSince: '2022',
    description: 'Partenariat pour la mise en œuvre des projets de reboisement et restauration des paysages forestiers.',
    category: 'institutionnel'
  },
  {
    id: 2,
    name: 'Fonds Vert Climat',
    logo: part2,
    type: 'Financier',
    country: 'International',
    website: 'www.greenclimate.fund',
    email: 'partnerships@gcf.int',
    location: 'Séoul, Corée du Sud',
    partnershipSince: '2023',
    description: 'Soutien financier pour les projets de résilience climatique et d\'adaptation des communautés locales.',
    category: 'financier'
  },
  {
    id: 3,
    name: 'ONG Bel Avenir',
    logo: part3,
    type: 'Associatif',
    country: 'Madagascar',
    website: 'www.belavenir.mg',
    email: 'contact@belavenir.mg',
    phone: '+261 20 00 000 02',
    location: 'Antsirabe, Madagascar',
    partnershipSince: '2021',
    description: 'Collaboration sur les programmes d\'éducation environnementale et de soutien scolaire.',
    category: 'associatif'
  },
  {
    id: 4,
    name: 'Groupe Sahanala',
    logo: part4,
    type: 'Privé',
    country: 'Madagascar',
    website: 'www.sahanala.com',
    email: 'partenariat@sahanala.mg',
    phone: '+261 34 00 000 03',
    location: 'Antananarivo, Madagascar',
    partnershipSince: '2024',
    description: 'Appui technique et financier pour les activités génératrices de revenus et l\'entrepreneuriat local.',
    category: 'prive'
  },
  {
    id: 5,
    name: 'Union Européenne',
    logo: part5,
    type: 'Institutionnel',
    country: 'Europe',
    website: 'www.eeas.europa.eu',
    email: 'delegation-madagascar@eeas.europa.eu',
    location: 'Bruxelles, Belgique',
    partnershipSince: '2022',
    description: 'Co-financement des projets de développement durable et d\'accès aux services sociaux de base.',
    category: 'financier'
  },
  {
    id: 6,
    name: 'Université d\'Antananarivo',
    logo: part6,
    type: 'Académique',
    country: 'Madagascar',
    website: 'www.univ-antananarivo.mg',
    email: 'recherche@univ-antananarivo.mg',
    phone: '+261 20 00 000 04',
    location: 'Antananarivo, Madagascar',
    partnershipSince: '2023',
    description: 'Partenariat de recherche sur les pratiques agroécologiques et le développement local.',
    category: 'technique'
  }
];

export default function PartenaireSection() {
  const [activeHover, setActiveHover] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredPartenaires = partenaires.filter(p => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const categories = [
    { id: 'all', label: 'Tous', color: 'bg-[#6FBF4A]' },
    { id: 'institutionnel', label: 'Institutionnel', color: 'bg-[#2C7FB8]' },
    { id: 'financier', label: 'Financier', color: 'bg-[#F2D16B]' },
    { id: 'technique', label: 'Technique', color: 'bg-[#2F5D2F]' },
    { id: 'prive', label: 'Privé', color: 'bg-[#6B4F3A]' },
    { id: 'associatif', label: 'Associatif', color: 'bg-[#87CFEA]' }
  ];

  return (
    <section className="py-6 bg-gradient-to-b from-white to-[#F4F8F9] relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6FBF4A]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2C7FB8]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#F2D16B]/5 rounded-full blur-2xl"></div>
        
        {/* Motif poignée de main */}
        <div className="absolute bottom-20 right-20 opacity-5">
          <FaHandshake className="w-40 h-40 text-[#2F5D2F]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-[#6FBF4A]/20 to-[#2C7FB8]/20 px-6 py-3 rounded-full border border-[#87CFEA]/30 mb-6 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2 animate-pulse" />
            <span className="text-[#2F5D2F] text-sm font-bold tracking-wider">
              ILS NOUS FONT CONFIANCE
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2F5D2F] mb-6 leading-tight">
            Nos{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] bg-clip-text text-transparent">
                Partenaires
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-[#6FBF4A]/20 -z-0 blur-md"></span>
            </span>
          </h2>
          
          <p className="text-xl text-[#6E8FA3] max-w-3xl mx-auto leading-relaxed">
            Ensemble, construisons un avenir durable à Madagascar grâce à des collaborations solides 
            et des engagements partagés.
          </p>

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`
                  inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300
                  ${filter === cat.id 
                    ? `${cat.color} text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-[${cat.color}]` 
                    : 'bg-white text-[#6E8FA3] hover:bg-[#87CFEA]/20 border border-[#87CFEA]/30'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des partenaires */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {filteredPartenaires.map((partenaire) => (
            <div
              key={partenaire.id}
              className="relative"
              onMouseEnter={() => setActiveHover(partenaire.id)}
              onMouseLeave={() => setActiveHover(null)}
            >
              {/* Carte partenaire */}
              <div className={`
                relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                transition-all duration-500 p-6 flex flex-col items-center
                border border-[#87CFEA]/20 group
                ${activeHover === partenaire.id ? 'scale-105' : 'hover:-translate-y-2'}
              `}>
                {/* Logo arrondi 100% */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4 ring-4 ring-[#87CFEA]/20 group-hover:ring-[#6FBF4A]/40 transition-all duration-500">
                  <img
                    src={partenaire.logo}
                    alt={partenaire.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Nom du partenaire */}
                <h3 className="text-sm md:text-base font-bold text-[#2F5D2F] text-center line-clamp-2 mb-2">
                  {partenaire.name}
                </h3>

                {/* Type de partenaire (badge) */}
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  ${partenaire.category === 'institutionnel' ? 'bg-[#2C7FB8]/10 text-[#2C7FB8]' : ''}
                  ${partenaire.category === 'financier' ? 'bg-[#F2D16B]/10 text-[#6B4F3A]' : ''}
                  ${partenaire.category === 'technique' ? 'bg-[#2F5D2F]/10 text-[#2F5D2F]' : ''}
                  ${partenaire.category === 'prive' ? 'bg-[#6B4F3A]/10 text-[#6B4F3A]' : ''}
                  ${partenaire.category === 'associatif' ? 'bg-[#87CFEA]/10 text-[#2C7FB8]' : ''}
                `}>
                  {partenaire.type}
                </span>

                {/* Indicateur de hover */}
                <div className="absolute bottom-3 right-3 w-6 h-6 bg-[#6FBF4A]/10 rounded-full flex items-center justify-center group-hover:bg-[#6FBF4A] transition-colors duration-300">
                  <FaHandshake className="w-3 h-3 text-[#6FBF4A] group-hover:text-white transition-colors duration-300" />
                </div>
              </div>

              {/* Mini carte d'informations au hover */}
              {activeHover === partenaire.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-72 z-50 animate-fade-in-up">
                  {/* Flèche */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r border-b border-[#87CFEA]/30"></div>
                  
                  {/* Contenu de la mini carte */}
                  <div className="bg-white rounded-2xl shadow-2xl p-6 border border-[#87CFEA]/30 backdrop-blur-sm">
                    <div className="flex items-start space-x-4 mb-4">
                      {/* Petit logo */}
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#6FBF4A] flex-shrink-0">
                        <img
                          src={partenaire.logo}
                          alt={partenaire.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-[#2F5D2F] text-base mb-1">
                          {partenaire.name}
                        </h4>
                        <span className={`
                          inline-block px-2 py-0.5 rounded-full text-xs font-medium
                          ${partenaire.category === 'institutionnel' ? 'bg-[#2C7FB8]/10 text-[#2C7FB8]' : ''}
                          ${partenaire.category === 'financier' ? 'bg-[#F2D16B]/10 text-[#6B4F3A]' : ''}
                          ${partenaire.category === 'technique' ? 'bg-[#2F5D2F]/10 text-[#2F5D2F]' : ''}
                          ${partenaire.category === 'prive' ? 'bg-[#6B4F3A]/10 text-[#6B4F3A]' : ''}
                          ${partenaire.category === 'associatif' ? 'bg-[#87CFEA]/10 text-[#2C7FB8]' : ''}
                        `}>
                          {partenaire.type}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#6E8FA3] mb-4 leading-relaxed">
                      {partenaire.description}
                    </p>

                    {/* Informations de contact */}
                    <div className="space-y-2 mb-4">
                      {partenaire.country && (
                        <div className="flex items-center text-xs text-[#8C857C]">
                          <FaGlobe className="w-3 h-3 mr-2 text-[#2C7FB8]" />
                          <span>{partenaire.country}</span>
                        </div>
                      )}
                      {partenaire.location && (
                        <div className="flex items-center text-xs text-[#8C857C]">
                          <FaMapMarkerAlt className="w-3 h-3 mr-2 text-[#6FBF4A]" />
                          <span>{partenaire.location}</span>
                        </div>
                      )}
                      {partenaire.email && (
                        <div className="flex items-center text-xs text-[#8C857C]">
                          <FaEnvelope className="w-3 h-3 mr-2 text-[#2C7FB8]" />
                          <span className="truncate">{partenaire.email}</span>
                        </div>
                      )}
                      {partenaire.phone && (
                        <div className="flex items-center text-xs text-[#8C857C]">
                          <FaPhone className="w-3 h-3 mr-2 text-[#6FBF4A]" />
                          <span>{partenaire.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Année de partenariat et lien */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#87CFEA]/20">
                      <span className="text-xs font-medium text-[#2F5D2F]">
                        Depuis {partenaire.partnershipSince}
                      </span>
                      {partenaire.website && (
                        <a 
                          href={`https://${partenaire.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-xs text-[#2C7FB8] hover:text-[#6FBF4A] transition-colors group/link"
                        >
                          Site web
                          <FaExternalLinkAlt className="w-3 h-3 ml-1 group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Statistiques partenariats */}
        <div className="mt-24 bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-[#87CFEA]/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2F5D2F] mb-2">15+</div>
              <div className="text-sm text-[#6E8FA3]">Partenaires actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2F5D2F] mb-2">8</div>
              <div className="text-sm text-[#6E8FA3]">Pays partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2F5D2F] mb-2">5</div>
              <div className="text-sm text-[#6E8FA3]">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2F5D2F] mb-2">2021</div>
              <div className="text-sm text-[#6E8FA3]">Premier partenariat</div>
            </div>
          </div>
        </div>

        {/* Appel à partenariat */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-[#6FBF4A]/10 to-[#2C7FB8]/10 px-8 py-6 rounded-2xl border border-[#87CFEA]/30">
            <FaHandshake className="w-8 h-8 text-[#6FBF4A] mr-4" />
            <div className="text-left">
              <p className="text-[#2F5D2F] font-semibold">
                Devenir partenaire ?
              </p>
              <p className="text-sm text-[#6E8FA3]">
                Rejoignez-nous pour construire un avenir durable ensemble
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}