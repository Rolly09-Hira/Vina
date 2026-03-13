// src/components/sections/PartenaireSection.tsx
import { useState, useEffect } from 'react';
import { 
  FaHandshake, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaSpinner,
  FaBuilding,
  FaUserTie,
  FaUsers,
  FaUniversity
} from 'react-icons/fa';
import partenaireService, { type Partenaire } from '../../services/partenaireService';
import { useLanguage } from '../../contexts/LanguageContext';

// Interface pour le contenu multilingue
interface Content {
  fr: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    filters: {
      all: string;
      entreprise: string;
      individu: string;
      association: string;
      institution: string;
    };
    since: string;
    website: string;
    active: string;
    inactive: string;
    stats: {
      partners: string;
      categories: string;
      since: string;
    };
    cta: {
      title: string;
      subtitle: string;
    };
    noPartners: string;
    loading: string;
  };
  en: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    filters: {
      all: string;
      entreprise: string;
      individu: string;
      association: string;
      institution: string;
    };
    since: string;
    website: string;
    active: string;
    inactive: string;
    stats: {
      partners: string;
      categories: string;
      since: string;
    };
    cta: {
      title: string;
      subtitle: string;
    };
    noPartners: string;
    loading: string;
  };
}

// Texte multilingue
const content: Content = {
  fr: {
    badge: 'ILS NOUS FONT CONFIANCE',
    title: 'Nos',
    titleHighlight: 'Partenaires',
    subtitle: 'Ensemble, construisons un avenir durable à Madagascar grâce à des collaborations solides et des engagements partagés.',
    filters: {
      all: 'Tous',
      entreprise: 'Entreprises',
      individu: 'Individus',
      association: 'Associations',
      institution: 'Institutions'
    },
    since: 'Depuis',
    website: 'Site web',
    active: 'Actif',
    inactive: 'Inactif',
    stats: {
      partners: 'Partenaires actifs',
      categories: 'Catégories',
      since: 'Premier partenariat'
    },
    cta: {
      title: 'Devenir partenaire ?',
      subtitle: 'Rejoignez-nous pour construire un avenir durable ensemble'
    },
    noPartners: 'Aucun partenaire dans cette catégorie',
    loading: 'Chargement des partenaires...'
  },
  en: {
    badge: 'THEY TRUST US',
    title: 'Our',
    titleHighlight: 'Partners',
    subtitle: 'Together, let\'s build a sustainable future in Madagascar through strong collaborations and shared commitments.',
    filters: {
      all: 'All',
      entreprise: 'Companies',
      individu: 'Individuals',
      association: 'Associations',
      institution: 'Institutions'
    },
    since: 'Since',
    website: 'Website',
    active: 'Active',
    inactive: 'Inactive',
    stats: {
      partners: 'Active partners',
      categories: 'Categories',
      since: 'First partnership'
    },
    cta: {
      title: 'Become a partner?',
      subtitle: 'Join us to build a sustainable future together'
    },
    noPartners: 'No partners in this category',
    loading: 'Loading partners...'
  }
};

// Mapping des icônes par type
const typeIcons = {
  entreprise: FaBuilding,
  individu: FaUserTie,
  association: FaUsers,
  institution: FaUniversity
};

// Mapping des couleurs par type adapté à la charte VINA
const typeColors = {
  entreprise: { 
    bg: 'bg-olive-nature', 
    light: 'bg-olive-nature/10', 
    text: 'text-olive-nature', 
    border: 'border-olive-nature/30', 
    badge: 'bg-olive-nature' 
  },
  individu: { 
    bg: 'bg-water-blue', 
    light: 'bg-water-blue/10', 
    text: 'text-water-blue', 
    border: 'border-water-blue/30', 
    badge: 'bg-water-blue' 
  },
  association: { 
    bg: 'bg-sun-gold', 
    light: 'bg-sun-gold/10', 
    text: 'text-sun-gold', 
    border: 'border-sun-gold/30', 
    badge: 'bg-sun-gold' 
  },
  institution: { 
    bg: 'bg-earth-brown', 
    light: 'bg-earth-brown/10', 
    text: 'text-earth-brown', 
    border: 'border-earth-brown/30', 
    badge: 'bg-earth-brown' 
  }
};

export default function PartenaireSection() {
  const { language } = useLanguage();
  const t = content[language];
  
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHover, setActiveHover] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Charger les partenaires depuis le backend
  useEffect(() => {
    const fetchPartenaires = async () => {
      try {
        setLoading(true);
        const data = await partenaireService.getPartenairesActifs();
        setPartenaires(data);
      } catch (error) {
        console.error('Erreur chargement partenaires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartenaires();
  }, []);

  // Filtrer les partenaires
  const filteredPartenaires = partenaires.filter(p => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  // Calculer les statistiques
  const partenairesActifs = partenaires.length;
  const categoriesUniques = new Set(partenaires.map(p => p.type)).size;
  const premiereDate = partenaires.length > 0 
    ? Math.min(...partenaires.map(p => new Date(p.dateDebutPartenaire).getTime()))
    : new Date().getTime();
  const anneePremier = new Date(premiereDate).getFullYear();

  // Catégories pour les filtres avec les nouvelles couleurs
  const categories = [
    { id: 'all', label: t.filters.all, icon: FaHandshake, color: 'bg-forest-deep' },
    { id: 'entreprise', label: t.filters.entreprise, icon: FaBuilding, color: typeColors.entreprise.bg },
    { id: 'individu', label: t.filters.individu, icon: FaUserTie, color: typeColors.individu.bg },
    { id: 'association', label: t.filters.association, icon: FaUsers, color: typeColors.association.bg },
    { id: 'institution', label: t.filters.institution, icon: FaUniversity, color: typeColors.institution.bg }
  ];

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-warm-white to-ultra-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <FaSpinner className="w-12 h-12 text-sun-gold animate-spin mb-4" />
            <p className="text-text-secondary">{t.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-gradient-to-b from-warm-white to-ultra-light relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-olive-nature/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-water-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-sun-gold/5 rounded-full blur-2xl"></div>
        
        {/* Motif poignée de main */}
        <div className="absolute bottom-20 right-20 opacity-5">
          <FaHandshake className="w-40 h-40 text-forest-deep" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-olive-nature/20 to-water-blue/20 px-6 py-3 rounded-full border border-sun-gold/30 mb-6 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 bg-sun-gold rounded-full mr-2 animate-pulse" />
            <span className="text-forest-deep text-sm font-bold tracking-wider">
              {t.badge}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest-deep mb-6 leading-tight">
            {t.title}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-sun-gold to-olive-nature bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-sun-gold/20 -z-0 blur-md"></span>
            </span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`
                    inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300
                    ${isSelected 
                      ? `${cat.color} text-white shadow-lg scale-105` 
                      : 'bg-white text-text-secondary hover:bg-sun-gold/10 border border-border-light'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message si aucun partenaire */}
        {filteredPartenaires.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">{t.noPartners}</p>
          </div>
        )}

        {/* Grille des partenaires - Avec centrage et hauteurs uniformes */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {filteredPartenaires.map((partenaire) => {
            const Icon = typeIcons[partenaire.type] || FaBuilding;
            const colors = typeColors[partenaire.type] || { 
              bg: 'bg-gray-100', 
              light: 'bg-gray-50', 
              text: 'text-gray-700', 
              border: 'border-gray-300', 
              badge: 'bg-gray-500' 
            };
            
            return (
              <div
                key={partenaire.id}
                className="relative w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(16.666%-20px)] min-w-[150px]"
                onMouseEnter={() => setActiveHover(partenaire.id)}
                onMouseLeave={() => setActiveHover(null)}
              >
                {/* Carte partenaire avec hauteur fixe et gestion des débordements */}
                <div className={`
                  relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                  transition-all duration-500 p-6 flex flex-col items-center
                  border border-border-light group h-full
                  ${activeHover === partenaire.id ? 'scale-105 z-10' : 'hover:-translate-y-2'}
                `}>
                  {/* Logo arrondi 100% */}
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4 ring-4 ring-border-light group-hover:ring-sun-gold/40 transition-all duration-500 bg-ultra-light flex items-center justify-center flex-shrink-0">
                    {partenaire.logoUrl ? (
                      <img
                        src={partenaire.logoUrl}
                        alt={partenaire.nom}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                        }}
                      />
                    ) : (
                      <Icon className={`w-12 h-12 ${colors.text}`} />
                    )}
                  </div>

                  {/* Nom du partenaire avec gestion du texte long */}
                  <h3 className="text-sm md:text-base font-bold text-forest-deep text-center w-full mb-2 px-1 break-words line-clamp-2 min-h-[3rem]">
                    {partenaire.nom}
                  </h3>

                  {/* Type de partenaire (badge) */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.light} ${colors.text} border ${colors.border} max-w-full truncate`}>
                    {t.filters[partenaire.type as keyof typeof t.filters]}
                  </span>

                  {/* Indicateur de hover */}
                  <div className="absolute bottom-3 right-3 w-6 h-6 bg-sun-gold/10 rounded-full flex items-center justify-center group-hover:bg-sun-gold transition-colors duration-300">
                    <FaHandshake className="w-3 h-3 text-sun-gold group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Badge actif/inactif */}
                  {!partenaire.actif && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                        {t.inactive}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mini carte d'informations au hover */}
                {activeHover === partenaire.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-72 z-50 animate-fade-in-up">
                    {/* Flèche */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r border-b border-border-light"></div>
                    
                    {/* Contenu de la mini carte */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 border border-border-light backdrop-blur-sm">
                      <div className="flex items-start space-x-4 mb-4">
                        {/* Petit logo */}
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-sun-gold flex-shrink-0 bg-ultra-light flex items-center justify-center">
                          {partenaire.logoUrl ? (
                            <img
                              src={partenaire.logoUrl}
                              alt={partenaire.nom}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon className={`w-6 h-6 ${colors.text}`} />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-forest-deep text-base mb-1 break-words">
                            {partenaire.nom}
                          </h4>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}>
                            {t.filters[partenaire.type as keyof typeof t.filters]}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {partenaire.descriptionFr && (
                        <p className="text-xs text-text-secondary mb-4 leading-relaxed max-h-24 overflow-y-auto">
                          {language === 'fr' ? partenaire.descriptionFr : partenaire.descriptionEn}
                        </p>
                      )}

                      {/* Informations de contact */}
                      <div className="space-y-2 mb-4">
                        {partenaire.adresse && (
                          <div className="flex items-center text-xs text-text-secondary">
                            <FaMapMarkerAlt className="w-3 h-3 mr-2 text-olive-nature flex-shrink-0" />
                            <span className="truncate">{partenaire.adresse}</span>
                          </div>
                        )}
                        {partenaire.email && (
                          <div className="flex items-center text-xs text-text-secondary">
                            <FaEnvelope className="w-3 h-3 mr-2 text-water-blue flex-shrink-0" />
                            <a href={`mailto:${partenaire.email}`} className="truncate hover:text-water-blue transition-colors">
                              {partenaire.email}
                            </a>
                          </div>
                        )}
                        {partenaire.telephone && (
                          <div className="flex items-center text-xs text-text-secondary">
                            <FaPhone className="w-3 h-3 mr-2 text-sun-gold flex-shrink-0" />
                            <a href={`tel:${partenaire.telephone}`} className="hover:text-sun-gold transition-colors">
                              {partenaire.telephone}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Année de partenariat et lien */}
                      <div className="flex items-center justify-between pt-3 border-t border-border-light">
                        <span className="text-xs font-medium text-forest-deep">
                          {t.since} {new Date(partenaire.dateDebutPartenaire).getFullYear()}
                        </span>
                        {partenaire.siteWeb && (
                          <a 
                            href={partenaire.siteWeb.startsWith('http') ? partenaire.siteWeb : `https://${partenaire.siteWeb}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-water-blue hover:text-olive-nature transition-colors group/link"
                          >
                            {t.website}
                            <FaExternalLinkAlt className="w-3 h-3 ml-1 group-hover/link:translate-x-1 transition-transform" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Statistiques partenariats */}
        <div className="mt-24 bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-border-light">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-olive-nature mb-2">{partenairesActifs}</div>
              <div className="text-sm text-text-secondary">{t.stats.partners}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-water-blue mb-2">{categoriesUniques}</div>
              <div className="text-sm text-text-secondary">{t.stats.categories}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sun-gold mb-2">{partenaires.length}</div>
              <div className="text-sm text-text-secondary">{t.filters.all}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-earth-brown mb-2">{anneePremier}</div>
              <div className="text-sm text-text-secondary">{t.stats.since}</div>
            </div>
          </div>
        </div>

        {/* Appel à partenariat */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-olive-nature/10 to-water-blue/10 px-8 py-6 rounded-2xl border border-border-light">
            <FaHandshake className="w-8 h-8 text-sun-gold mr-4" />
            <div className="text-left">
              <p className="text-forest-deep font-semibold">
                {t.cta.title}
              </p>
              <p className="text-sm text-text-secondary">
                {t.cta.subtitle}
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