// src/components/sections/MissionSection.tsx
import { useState, useEffect } from 'react';
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
  FaUserFriends,
  FaSpinner
} from 'react-icons/fa';
import missionService from '../../services/missionService';
import type { Mission } from '../../services/missionService';
import { useLanguage } from '../../contexts/LanguageContext';

// Mapping des icônes par mot-clé dans le titre
const getIconForMission = (titleFr: string, titleEn: string) => {
  const text = (titleFr + ' ' + titleEn).toLowerCase();
  if (text.includes('agriculture') || text.includes('agro') || text.includes('farming')) return <FaSeedling className="w-6 h-6" />;
  if (text.includes('eau') || text.includes('assainissement') || text.includes('water') || text.includes('sanitation')) return <FaTint className="w-6 h-6" />;
  if (text.includes('ressource') || text.includes('forêt') || text.includes('forest') || text.includes('resource')) return <FaTree className="w-6 h-6" />;
  if (text.includes('éducation') || text.includes('formation') || text.includes('education') || text.includes('training')) return <FaGraduationCap className="w-6 h-6" />;
  if (text.includes('santé') || text.includes('sante') || text.includes('health')) return <FaHeartbeat className="w-6 h-6" />;
  if (text.includes('gouvernance') || text.includes('participation') || text.includes('governance')) return <FaHandsHelping className="w-6 h-6" />;
  if (text.includes('revenu') || text.includes('entrepreneuriat') || text.includes('income') || text.includes('entrepreneurship')) return <FaChartLine className="w-6 h-6" />;
  if (text.includes('jeune') || text.includes('femme') || text.includes('youth') || text.includes('woman')) return <FaUsers className="w-6 h-6" />;
  if (text.includes('élevage') || text.includes('elevage') || text.includes('livestock')) return <FaLeaf className="w-6 h-6" />;
  if (text.includes('climatique') || text.includes('résilience') || text.includes('climate') || text.includes('resilience')) return <FaSolarPanel className="w-6 h-6" />;
  if (text.includes('sécurité alimentaire') || text.includes('securite') || text.includes('food security')) return <FaShoppingBasket className="w-6 h-6" />;
  if (text.includes('partenariat') || text.includes('partnership')) return <FaHandshake className="w-6 h-6" />;
  return <FaGlobe className="w-6 h-6" />; // Icône par défaut
};

// Déterminer la catégorie basée sur le titre
const getCategoryForMission = (titleFr: string, titleEn: string): 'environnement' | 'social' | 'economique' | 'gouvernance' => {
  const text = (titleFr + ' ' + titleEn).toLowerCase();
  if (text.includes('environnement') || text.includes('environment') || 
      text.includes('climat') || text.includes('climate') || 
      text.includes('ressource') || text.includes('resource') || 
      text.includes('agriculture') || text.includes('farming') || 
      text.includes('élevage') || text.includes('livestock') ||
      text.includes('forêt') || text.includes('forest')) {
    return 'environnement';
  }
  if (text.includes('social') || text.includes('santé') || text.includes('health') || 
      text.includes('éducation') || text.includes('education') || 
      text.includes('eau') || text.includes('water')) {
    return 'social';
  }
  if (text.includes('revenu') || text.includes('income') || 
      text.includes('entrepreneuriat') || text.includes('entrepreneurship') || 
      text.includes('économique') || text.includes('economic') || 
      text.includes('agr')) {
    return 'economique';
  }
  if (text.includes('gouvernance') || text.includes('governance') || 
      text.includes('partenariat') || text.includes('partnership')) {
    return 'gouvernance';
  }
  return 'social';
};

// Couleurs par catégorie
const categoryColors = {
  environnement: {
    bg: 'bg-[#2F5D2F]',
    light: 'bg-[#4E8B3A]/20',
    text: 'text-[#2F5D2F]',
    gradient: 'from-[#2F5D2F] to-[#4E8B3A]',
    icon: 'bg-[#2F5D2F]'
  },
  social: {
    bg: 'bg-[#2C7FB8]',
    light: 'bg-[#87CFEA]/20',
    text: 'text-[#2C7FB8]',
    gradient: 'from-[#2C7FB8] to-[#87CFEA]',
    icon: 'bg-[#2C7FB8]'
  },
  economique: {
    bg: 'bg-[#F2D16B]',
    light: 'bg-[#F2D16B]/20',
    text: 'text-[#6B4F3A]',
    gradient: 'from-[#F2D16B] to-[#6FBF4A]',
    icon: 'bg-[#F2D16B]'
  },
  gouvernance: {
    bg: 'bg-[#6B4F3A]',
    light: 'bg-[#8C857C]/20',
    text: 'text-[#6B4F3A]',
    gradient: 'from-[#6B4F3A] to-[#8C857C]',
    icon: 'bg-[#6B4F3A]'
  }
};

// Texte multilingue pour l'interface
const content = {
  fr: {
    badge: 'NOS MISSIONS',
    title: 'Ce que nous faisons',
    subtitle: 'Une approche multisectorielle pour un développement intégré et durable',
    filters: {
      all: 'Toutes',
      environnement: 'Environnement',
      social: 'Social',
      economique: 'Économique',
      gouvernance: 'Gouvernance'
    },
    clickToExpand: 'Cliquez pour en savoir plus',
    clickToCollapse: '👆 Cliquez pour réduire',
    loading: 'Chargement des missions...',
    noMissions: 'Aucune mission dans cette catégorie',
    viewMore: 'Voir plus de missions',
    stats: {
      missions: 'Missions actives',
      regions: "Régions d'intervention",
      beneficiaries: 'Bénéficiaires',
      partners: 'Partenaires'
    }
  },
  en: {
    badge: 'OUR MISSIONS',
    title: 'What we do',
    subtitle: 'A multisectoral approach for integrated and sustainable development',
    filters: {
      all: 'All',
      environnement: 'Environment',
      social: 'Social',
      economique: 'Economic',
      gouvernance: 'Governance'
    },
    clickToExpand: 'Click to learn more',
    clickToCollapse: '👆 Click to collapse',
    loading: 'Loading missions...',
    noMissions: 'No missions in this category',
    viewMore: 'View more missions',
    stats: {
      missions: 'Active missions',
      regions: 'Intervention regions',
      beneficiaries: 'Beneficiaries',
      partners: 'Partners'
    }
  }
};

export default function MissionSection() {
  const { language } = useLanguage();
  const t = content[language];
  
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filter, setFilter] = useState('all');
  const [visibleMissions, setVisibleMissions] = useState(8);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    regions: 0,
    beneficiaires: '0+',
    partenaires: 0
  });

  // Charger les missions depuis l'API
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = await missionService.getMissionsActives();
        // Trier par ordre d'affichage
        const sortedData = data.sort((a, b) => (a.ordreAffichage || 0) - (b.ordreAffichage || 0));
        setMissions(sortedData);
        setStats(prev => ({ ...prev, total: sortedData.length }));
      } catch (error) {
        console.error('Erreur chargement missions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Filtrer les missions
  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    return getCategoryForMission(mission.titreFr, mission.titreEn) === filter;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Mapping des catégories pour les filtres
  const categories = [
    { id: 'all', label: t.filters.all, icon: <FaListUl className="w-4 h-4 mr-2" />, color: 'bg-[#6FBF4A]' },
    { id: 'environnement', label: t.filters.environnement, icon: <FaGlobe className="w-4 h-4 mr-2" />, color: categoryColors.environnement.bg },
    { id: 'social', label: t.filters.social, icon: <FaUsers className="w-4 h-4 mr-2" />, color: categoryColors.social.bg },
    { id: 'economique', label: t.filters.economique, icon: <FaChartLine className="w-4 h-4 mr-2" />, color: categoryColors.economique.bg },
    { id: 'gouvernance', label: t.filters.gouvernance, icon: <FaGavel className="w-4 h-4 mr-2" />, color: categoryColors.gouvernance.bg }
  ];

  if (loading) {
    return (
      <section className="py-20 bg-[#F4F8F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <FaSpinner className="w-12 h-12 text-[#6FBF4A] animate-spin mb-4" />
            <p className="text-[#6E8FA3]">{t.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#F4F8F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#87CFEA]/20 px-4 py-2 rounded-full border border-[#87CFEA]/30 mb-6">
            <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2 animate-pulse" />
            <span className="text-[#2F5D2F] text-sm font-medium tracking-wider">
              {t.badge}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#2F5D2F] mb-6">
            {t.title}
          </h2>
          
          <p className="text-xl text-[#6E8FA3] max-w-3xl mx-auto">
            {t.subtitle}
          </p>

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {categories.map((cat) => (
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

        {/* Grille des missions */}
        {filteredMissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6E8FA3] text-lg">{t.noMissions}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredMissions.slice(0, visibleMissions).map((mission) => {
              const category = getCategoryForMission(mission.titreFr, mission.titreEn);
              const colors = categoryColors[category];
              const icon = getIconForMission(mission.titreFr, mission.titreEn);
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
                 {/* Image container */}
<div className="pt-8 px-8 flex justify-center">
  <div className="relative">
    <div className={`
      w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl
      transition-all duration-500
      ${isExpanded ? 'scale-110' : ''}
    `}>
      {mission.imageUrl ? (
        <img
          src={`http://https://backvina-production.up.railway.app/${mission.imageUrl.startsWith('/') ? mission.imageUrl.slice(1) : mission.imageUrl}`}
          alt={language === 'fr' ? mission.titreFr : mission.titreEn}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Erreur chargement image:', mission.imageUrl);
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallbackDiv = document.createElement('div');
              fallbackDiv.className = 'w-full h-full bg-gradient-to-br from-[#6FBF4A] to-[#2F5D2F] flex items-center justify-center';
              fallbackDiv.innerHTML = `<span class="text-white text-3xl font-bold">${mission.titreFr.charAt(0)}</span>`;
              parent.appendChild(fallbackDiv);
            }
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#6FBF4A] to-[#2F5D2F] flex items-center justify-center">
          <span className="text-white text-3xl font-bold">
            {mission.titreFr.charAt(0)}
          </span>
        </div>
      )}
    </div>
    
    {/* Icône flottante - Version cercle comme l'image principale mais plus petit */}
    <div className={`
      absolute -bottom-3 -right-3 w-14 h-14 rounded-full overflow-hidden
      border-4 border-white shadow-xl
      ${colors.icon}  // Couleur de fond de secours
      transition-all duration-500
      ${isExpanded ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-6'}
    `}>
      {mission.iconUrl ? (
        <img 
          src={`http://localhost:5005/${mission.iconUrl.startsWith('/') ? mission.iconUrl.slice(1) : mission.iconUrl}`}
          alt="icône de mission"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Erreur chargement icône:', mission.iconUrl);
            // Fallback vers un cercle avec l'icône React
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.classList.add('flex', 'items-center', 'justify-center');
              // Injecter l'icône React
              const iconContainer = document.createElement('div');
              iconContainer.className = 'text-white text-2xl';
              // Récupérer l'icône React correspondante
              const iconElement = icon as React.ReactElement;
              if (iconElement && iconElement.props) {
                // Solution simple : utiliser un texte ou une icône par défaut
                iconContainer.innerHTML = '✨';
              }
              parent.appendChild(iconContainer);
            }
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-2xl bg-gradient-to-br from-[#6FBF4A] to-[#2F5D2F]">
          {icon}
        </div>
      )}
    </div>
  </div>
</div>

                  {/* Contenu (inchangé) */}
                  <div className="p-6 pt-4 text-center flex-grow flex flex-col">
                    <div className="mb-2">
                      <span className={`inline-flex items-center px-3 py-1 ${colors.light} rounded-full text-xs font-semibold ${colors.text}`}>
                        {category === 'environnement' && <><FaLeaf className="w-3 h-3 mr-1" /> {t.filters.environnement}</>}
                        {category === 'social' && <><FaUserFriends className="w-3 h-3 mr-1" /> {t.filters.social}</>}
                        {category === 'economique' && <><FaChartLine className="w-3 h-3 mr-1" /> {t.filters.economique}</>}
                        {category === 'gouvernance' && <><FaGavel className="w-3 h-3 mr-1" /> {t.filters.gouvernance}</>}
                      </span>
                    </div>
                    
                    <h3 className={`
                      text-xl font-bold text-[#2F5D2F] mb-3 
                      transition-all duration-300
                      ${isExpanded ? `text-[${colors.bg}]` : 'group-hover:text-[#6FBF4A]'}
                    `}>
                      {language === 'fr' ? mission.titreFr : mission.titreEn}
                    </h3>
                    
                    {/* Description */}
                    <div className={`
                      overflow-hidden transition-all duration-500 ease-in-out
                      ${isExpanded ? 'max-h-40 opacity-100 mb-3' : 'max-h-0 opacity-0'}
                    `}>
                      <p className="text-[#6E8FA3] text-sm leading-relaxed">
                        {language === 'fr' ? mission.descriptionFr : mission.descriptionEn}
                      </p>
                      
                      {isExpanded && (
                        <>
                          {language === 'fr' && mission.sloganFr && (
                            <p className="mt-2 text-xs italic text-[#2C7FB8]">
                              "{mission.sloganFr}"
                            </p>
                          )}
                          {language === 'en' && mission.sloganEn && (
                            <p className="mt-2 text-xs italic text-[#2C7FB8]">
                              "{mission.sloganEn}"
                            </p>
                          )}
                        </>
                      )}
                      
                      {isExpanded && (
                        <div className="mt-3 text-xs text-[#2C7FB8] font-medium">
                          {t.clickToCollapse}
                        </div>
                      )}
                    </div>
                    
                    {!isExpanded && (
                      <div className="mt-2 text-xs text-[#8C857C] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>{t.clickToExpand}</span>
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
        )}

        {/* Bouton Voir plus */}
        {visibleMissions < filteredMissions.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleMissions(visibleMissions + 4)}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>{t.viewMore}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#4E8B3A] to-[#2F5D2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>
          </div>
        )}

        {/* Statistiques */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-[#87CFEA]/30">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2F5D2F]">{stats.total}</div>
            <div className="text-sm text-[#6E8FA3] mt-2">{t.stats.missions}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2F5D2F]">{stats.regions}</div>
            <div className="text-sm text-[#6E8FA3] mt-2">{t.stats.regions}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2F5D2F]">{stats.beneficiaires}</div>
            <div className="text-sm text-[#6E8FA3] mt-2">{t.stats.beneficiaries}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2F5D2F]">{stats.partenaires}+</div>
            <div className="text-sm text-[#6E8FA3] mt-2">{t.stats.partners}</div>
          </div>
        </div>
      </div>
    </section>
  );
}