// src/components/sections/MissionSection.tsx
import  { useState } from 'react';
import { 
  FaSeedling,              // Agriculture durable
  FaTint,                  // Eau potable
  FaTree,                  // Environnement/Forêt
  FaGraduationCap,         // Éducation
  FaHeartbeat,             // Santé
  FaHandsHelping,          // Gouvernance/Participation
  FaChartLine,             // AGR/Entrepreneuriat
  FaUsers,                 // Jeunes/Femmes
  FaLeaf,                  // Reboisement
  FaSolarPanel,            // Climat/Résilience
  FaShoppingBasket,        // Sécurité alimentaire
  FaHandshake,             // Partenariat
  FaGlobe,
  FaGavel,
  FaListUl,
  FaUserFriends
  
} from 'react-icons/fa';

// Import des 12 images de mission
import miss1 from '../../assets/mission/miss1.jpg';
import miss2 from '../../assets/mission/miss2.jpg';
import miss3 from '../../assets/mission/miss3.jpg';
import miss4 from '../../assets/mission/miss4.jpg';
import miss5 from '../../assets/mission/miss5.jpg';
import miss6 from '../../assets/mission/miss6.jpg';
import miss7 from '../../assets/mission/miss7.jpg';
import miss8 from '../../assets/mission/miss8.jpg';
import miss9 from '../../assets/mission/miss9.jpg';
import miss10 from '../../assets/mission/miss10.jpg';
import miss11 from '../../assets/mission/miss11.jpg';
import miss12 from '../../assets/mission/miss12.jpg';

const missions = [
  {
    id: 1,
    title: 'Agriculture Durable',
    description: 'Promotion de pratiques agroécologiques résilientes au changement climatique',
    icon: <FaSeedling className="w-6 h-6" />,
    image: miss1,
    color: 'from-[#6FBF4A] to-[#4E8B3A]',
    category: 'environnement',
    iconBg: 'bg-[#6FBF4A]'
  },
  {
    id: 2,
    title: 'Sécurité Alimentaire',
    description: 'Amélioration de la disponibilité et qualité des denrées alimentaires',
    icon: <FaShoppingBasket className="w-6 h-6" />,
    image: miss2,
    color: 'from-[#F2D16B] to-[#6FBF4A]',
    category: 'economique',
    iconBg: 'bg-[#F2D16B]'
  },
  {
    id: 3,
    title: 'Gestion des Ressources Naturelles',
    description: 'Restauration des paysages et lutte contre la déforestation',
    icon: <FaTree className="w-6 h-6" />,
    image: miss3,
    color: 'from-[#2F5D2F] to-[#4E8B3A]',
    category: 'environnement',
    iconBg: 'bg-[#2F5D2F]'
  },
  {
    id: 4,
    title: 'Éducation & Formation',
    description: 'Accès équitable à l\'éducation et renforcement des capacités',
    icon: <FaGraduationCap className="w-6 h-6" />,
    image: miss4,
    color: 'from-[#2C7FB8] to-[#6E8FA3]',
    category: 'social',
    iconBg: 'bg-[#2C7FB8]'
  },
  {
    id: 5,
    title: 'Eau & Assainissement',
    description: 'Accès à l\'eau potable et à l\'assainissement de base',
    icon: <FaTint className="w-6 h-6" />,
    image: miss5,
    color: 'from-[#87CFEA] to-[#2C7FB8]',
    category: 'social',
    iconBg: 'bg-[#87CFEA]'
  },
  {
    id: 6,
    title: 'Santé Communautaire',
    description: 'Protection sociale et accès aux services de santé',
    icon: <FaHeartbeat className="w-6 h-6" />,
    image: miss6,
    color: 'from-[#F2D16B] to-[#6B4F3A]',
    category: 'social',
    iconBg: 'bg-[#F2D16B]'
  },
  {
    id: 7,
    title: 'Activités Génératrices de Revenus',
    description: 'Promotion de l\'entrepreneuriat local et chaînes de valeur',
    icon: <FaChartLine className="w-6 h-6" />,
    image: miss7,
    color: 'from-[#6FBF4A] to-[#2C7FB8]',
    category: 'economique',
    iconBg: 'bg-[#6FBF4A]'
  },
  {
    id: 8,
    title: 'Autonomisation Jeunes & Femmes',
    description: 'Formation technique et insertion sociale',
    icon: <FaUsers className="w-6 h-6" />,
    image: miss8,
    color: 'from-[#6E8FA3] to-[#2F5D2F]',
    category: 'economique',
    iconBg: 'bg-[#6E8FA3]'
  },
  {
    id: 9,
    title: 'Gouvernance Locale',
    description: 'Participation citoyenne et collaboration avec les collectivités',
    icon: <FaHandsHelping className="w-6 h-6" />,
    image: miss9,
    color: 'from-[#6B4F3A] to-[#8C857C]',
    category: 'gouvernance',
    iconBg: 'bg-[#6B4F3A]'
  },
  {
    id: 10,
    title: 'Élevage Durable',
    description: 'Systèmes d\'élevage résilients et respectueux de l\'environnement',
    icon: <FaLeaf className="w-6 h-6" />,
    image: miss10,
    color: 'from-[#4E8B3A] to-[#2F5D2F]',
    category: 'environnement',
    iconBg: 'bg-[#4E8B3A]'
  },
  {
    id: 11,
    title: 'Résilience Climatique',
    description: 'Adaptation des communautés face aux changements climatiques',
    icon: <FaSolarPanel className="w-6 h-6" />,
    image: miss11,
    color: 'from-[#87CFEA] to-[#6FBF4A]',
    category: 'environnement',
    iconBg: 'bg-[#87CFEA]'
  },
  {
    id: 12,
    title: 'Partenariats',
    description: 'Collaboration avec le secteur privé et partenaires techniques',
    icon: <FaHandshake className="w-6 h-6" />,
    image: miss12,
    color: 'from-[#2C7FB8] to-[#6B4F3A]',
    category: 'gouvernance',
    iconBg: 'bg-[#2C7FB8]'
  }
];

export default function MissionSection() {
  const [filter, setFilter] = useState('all');
  const [visibleMissions, setVisibleMissions] = useState(8);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    return mission.category === filter;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-6 bg-[#F4F8F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#87CFEA]/20 px-4 py-2 rounded-full border border-[#87CFEA]/30 mb-6">
            <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2 animate-pulse" />
            <span className="text-[#2F5D2F] text-sm font-medium tracking-wider">
              NOS MISSIONS
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#2F5D2F] mb-6">
            Ce que nous faisons
          </h2>
          
          <p className="text-xl text-[#6E8FA3] max-w-3xl mx-auto">
            Une approche multisectorielle pour un développement intégré et durable
          </p>

          {/* Filtres avec FA icons */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              { id: 'all', label: 'Toutes', icon: <FaListUl className="w-4 h-4 mr-2" />, color: 'bg-[#6FBF4A]' },
              { id: 'environnement', label: 'Environnement', icon: <FaGlobe className="w-4 h-4 mr-2" />, color: 'bg-[#2F5D2F]' },
              { id: 'social', label: 'Social', icon: <FaUsers className="w-4 h-4 mr-2" />, color: 'bg-[#2C7FB8]' },
              { id: 'economique', label: 'Économique', icon: <FaChartLine className="w-4 h-4 mr-2" />, color: 'bg-[#F2D16B]' },
              { id: 'gouvernance', label: 'Gouvernance', icon: <FaGavel className="w-4 h-4 mr-2" />, color: 'bg-[#6B4F3A]' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`
                  inline-flex items-center px-6 py-2.5 rounded-full font-medium transition-all duration-300
                  ${filter === cat.id 
                    ? `${cat.color} text-white shadow-lg scale-105` 
                    : 'bg-white text-[#6E8FA3] hover:bg-[#87CFEA]/20 border border-[#87CFEA]/30'
                  }
                `}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des missions - Cards cliquables avec description intégrée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredMissions.slice(0, visibleMissions).map((mission) => {
            const isExpanded = expandedId === mission.id;
            
            return (
              <div
                key={mission.id}
                onClick={() => toggleExpand(mission.id)}
                className={`
                  group bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                  transition-all duration-500 cursor-pointer
                  flex flex-col overflow-hidden
                  ${isExpanded ? 'scale-105 shadow-2xl ring-2 ring-[#6FBF4A] ring-offset-2' : 'hover:-translate-y-2'}
                `}
              >
                {/* Image container - Format rond */}
                <div className="pt-8 px-8 flex justify-center">
                  <div className="relative">
                    <div className={`
                      w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl
                      transition-all duration-500
                      ${isExpanded ? 'scale-110' : ''}
                    `}>
                      <img
                        src={mission.image}
                        alt={mission.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Icône flottante */}
                    <div className={`
                      absolute -bottom-3 -right-3 w-12 h-12 rounded-full 
                      ${mission.iconBg} text-white
                      flex items-center justify-center shadow-lg
                      border-4 border-white
                      transition-all duration-500
                      ${isExpanded ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-6'}
                    `}>
                      {mission.icon}
                    </div>
                  </div>
                </div>

                {/* Contenu - Titre toujours visible */}
                <div className="p-6 pt-4 text-center flex-grow flex flex-col">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-3 py-1 bg-[#87CFEA]/20 rounded-full text-xs font-semibold text-[#2C7FB8]">
                    {mission.category === 'environnement' && <><FaLeaf className="w-3 h-3 mr-1" /> Environnement</>}
                    {mission.category === 'social' && <><FaUserFriends className="w-3 h-3 mr-1" /> Social</>}
                    {mission.category === 'economique' && <><FaChartLine className="w-3 h-3 mr-1" /> Économique</>}
                    {mission.category === 'gouvernance' && <><FaGavel className="w-3 h-3 mr-1" /> Gouvernance</>}
                    </span>
                  </div>
                  
                  <h3 className={`
                    text-xl font-bold text-[#2F5D2F] mb-3 
                    transition-all duration-300
                    ${isExpanded ? 'text-[#6FBF4A]' : 'group-hover:text-[#6FBF4A]'}
                  `}>
                    {mission.title}
                  </h3>
                  
                  {/* Description - Visible uniquement quand la carte est agrandie */}
                  <div className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${isExpanded ? 'max-h-40 opacity-100 mb-3' : 'max-h-0 opacity-0'}
                  `}>
                    <p className="text-[#6E8FA3] text-sm leading-relaxed">
                      {mission.description}
                    </p>
                    
                    {/* Indicateur de clic pour fermer */}
                    {isExpanded && (
                      <div className="mt-3 text-xs text-[#2C7FB8] font-medium">
                        👆 Cliquez pour réduire
                      </div>
                    )}
                  </div>
                  
                  {/* Indicateur visuel pour cliquer */}
                  {!isExpanded && (
                    <div className="mt-2 text-xs text-[#8C857C] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Cliquez pour en savoir plus</span>
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bouton Voir plus */}
        {visibleMissions < filteredMissions.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleMissions(visibleMissions + 4)}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Voir plus de missions</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#4E8B3A] to-[#2F5D2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>
          </div>
        )}

        {/* Statistiques des missions */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-[#87CFEA]/30">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2F5D2F]">12</div>
            <div className="text-sm text-[#6E8FA3] mt-2">Missions actives</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2F5D2F]">8</div>
            <div className="text-sm text-[#6E8FA3] mt-2">Régions d'intervention</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2F5D2F]">5000+</div>
            <div className="text-sm text-[#6E8FA3] mt-2">Bénéficiaires</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2F5D2F]">15+</div>
            <div className="text-sm text-[#6E8FA3] mt-2">Partenaires</div>
          </div>
        </div>
      </div>
    </section>
  );
}