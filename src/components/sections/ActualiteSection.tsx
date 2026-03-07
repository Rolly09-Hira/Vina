// src/components/sections/ActualiteSection.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaNewspaper, 
  FaCalendarAlt, 
  FaMapMarkerAlt,  
  FaArrowRight,
  FaStar,
  FaSpinner,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import actualiteService, { type Actualite } from '../../services/actualiteService';
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
      evenement: string;
      nouvelle: string;
      rapport: string;
    };
    readMore: string;
    showMore: string;
    showLess: string;
    noNews: string;
    loading: string;
    author: string;
    location: string;
    eventDate: string;
    important: string;
    prev: string;
    next: string;
  };
  en: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    filters: {
      all: string;
      evenement: string;
      nouvelle: string;
      rapport: string;
    };
    readMore: string;
    showMore: string;
    showLess: string;
    noNews: string;
    loading: string;
    author: string;
    location: string;
    eventDate: string;
    important: string;
    prev: string;
    next: string;
  };
}

// Texte multilingue
const content: Content = {
  fr: {
    badge: 'ACTUALITÉS',
    title: 'Dernières',
    titleHighlight: 'nouvelles',
    subtitle: 'Suivez l\'actualité de nos projets et découvrez nos dernières actions sur le terrain',
    filters: {
      all: 'Tous',
      evenement: 'Événements',
      nouvelle: 'Nouvelles',
      rapport: 'Rapports'
    },
    readMore: 'Lire la suite',
    showMore: 'Voir plus',
    showLess: 'Voir moins',
    noNews: 'Aucune actualité dans cette catégorie',
    loading: 'Chargement des actualités...',
    author: 'Par',
    location: 'Lieu',
    eventDate: 'Date événement',
    important: 'Important',
    prev: 'Précédent',
    next: 'Suivant'
  },
  en: {
    badge: 'NEWS',
    title: 'Latest',
    titleHighlight: 'news',
    subtitle: 'Follow our projects news and discover our latest actions on the field',
    filters: {
      all: 'All',
      evenement: 'Events',
      nouvelle: 'News',
      rapport: 'Reports'
    },
    readMore: 'Read more',
    showMore: 'Show more',
    showLess: 'Show less',
    noNews: 'No news in this category',
    loading: 'Loading news...',
    author: 'By',
    location: 'Location',
    eventDate: 'Event date',
    important: 'Important',
    prev: 'Previous',
    next: 'Next'
  }
};

// Mapping des couleurs par type adapté à la charte VINA
const typeColors = {
  evenement: { 
    bg: 'bg-water-blue', 
    light: 'bg-water-blue/10', 
    text: 'text-water-blue', 
    border: 'border-water-blue/30' 
  },
  nouvelle: { 
    bg: 'bg-olive-nature', 
    light: 'bg-olive-nature/10', 
    text: 'text-olive-nature', 
    border: 'border-olive-nature/30' 
  },
  rapport: { 
    bg: 'bg-earth-brown', 
    light: 'bg-earth-brown/10', 
    text: 'text-earth-brown', 
    border: 'border-earth-brown/30' 
  }
};

// Mapping des libellés par type
const typeLabels = {
  evenement: { fr: 'Événement', en: 'Event' },
  nouvelle: { fr: 'Nouvelle', en: 'News' },
  rapport: { fr: 'Rapport', en: 'Report' }
};

export default function ActualiteSection() {
  const { language } = useLanguage();
  const t = content[language];
  
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const itemsPerPage = 4;

  // Charger les actualités depuis le backend
  useEffect(() => {
    const fetchActualites = async () => {
      try {
        setLoading(true);
        const data = await actualiteService.getAllActualites();
        // Trier par date de publication (plus récent d'abord)
        const sorted = data.sort((a, b) => 
          new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime()
        );
        setActualites(sorted);
      } catch (error) {
        console.error('Erreur chargement actualités:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActualites();
  }, []);

  // Filtrer les actualités
  const filteredActualites = actualites.filter(actu => {
    if (filter === 'all') return true;
    return actu.type === filter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActualites.length / itemsPerPage);
  const paginatedActualites = filteredActualites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTypeColor = (type: string) => {
    return typeColors[type as keyof typeof typeColors] || typeColors.nouvelle;
  };

  const getTypeLabel = (type: string) => {
    const labels = typeLabels[type as keyof typeof typeLabels];
    return labels ? labels[language] : type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
    <section className="py-12 bg-gradient-to-b from-warm-white to-ultra-light relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-ultra-light to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-olive-nature/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-water-blue/5 rounded-full blur-2xl"></div>
        
        {/* Motif journal */}
        <div className="absolute top-20 left-20 opacity-5">
          <FaNewspaper className="w-40 h-40 text-forest-deep" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête centré */}
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
        </div>

        {/* Filtres catégories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentPage(1);
            }}
            className={`
              inline-flex items-center px-5 py-2.5 rounded-full font-medium transition-all duration-300
              ${filter === 'all' 
                ? 'bg-forest-deep text-warm-white shadow-lg scale-105' 
                : 'bg-white text-text-secondary hover:bg-sun-gold/10 border border-border-light'
              }
            `}
          >
            {t.filters.all}
          </button>
          {['evenement', 'nouvelle', 'rapport'].map((cat) => {
            const colors = getTypeColor(cat);
            return (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setCurrentPage(1);
                }}
                className={`
                  inline-flex items-center px-5 py-2.5 rounded-full font-medium transition-all duration-300
                  ${filter === cat 
                    ? `${colors.bg} text-white shadow-lg scale-105` 
                    : 'bg-white text-text-secondary hover:bg-sun-gold/10 border border-border-light'
                  }
                `}
              >
                {t.filters[cat as keyof typeof t.filters]}
              </button>
            );
          })}
        </div>

        {/* Message si aucune actualité */}
        {paginatedActualites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">{t.noNews}</p>
          </div>
        )}

        {/* Grille des actualités - Centrée avec 4 cartes en ligne */}
        <div className="flex flex-wrap justify-center gap-6">
          {paginatedActualites.map((actu) => {
            const colors = getTypeColor(actu.type);
            const typeLabel = getTypeLabel(actu.type);
            const isHovered = hoveredId === actu.id;
            const isExpanded = expandedId === actu.id;
            
            // Vérifier si le contenu est long (plus de 150 caractères)
            const contenu = language === 'fr' ? actu.contenuFr : actu.contenuEn;
            const hasLongContent = contenu.length > 150;
            
            // Description tronquée ou complète selon l'état
            const displayContenu = isExpanded 
              ? contenu 
              : contenu.substring(0, 100) + (hasLongContent ? '...' : '');
            
            return (
              <article
                key={actu.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-border-light flex flex-col relative w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-sm"
                onMouseEnter={() => setHoveredId(actu.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image avec hauteur fixe */}
                <div className="relative h-48 flex-shrink-0 overflow-hidden">
                  {actu.imageUrl ? (
                    <img
                      src={`https://web-production-03b53.up.railway.app/${actu.imageUrl}`}
                      alt={language === 'fr' ? actu.titreFr : actu.titreEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-ultra-light to-warm-white flex items-center justify-center">
                      <FaNewspaper className="w-16 h-16 text-text-secondary" />
                    </div>
                  )}
                  
                  {/* Badge catégorie */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${colors.bg} text-white`}>
                      {typeLabel}
                    </span>
                  </div>

                  {/* Badge important */}
                  {actu.important && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 bg-sun-gold text-forest-deep rounded-full text-xs font-bold shadow-lg flex items-center">
                        <FaStar className="w-3 h-3 mr-1" />
                        {t.important}
                      </span>
                    </div>
                  )}

                  {/* Date flottante */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-forest-deep shadow-lg flex items-center">
                      <FaCalendarAlt className="w-3 h-3 mr-2 text-sun-gold" />
                      {formatShortDate(actu.datePublication)}
                    </div>
                  </div>
                </div>

                {/* Contenu avec hauteur flexible mais cartes de même hauteur */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Titre avec hauteur fixe (2 lignes) */}
                  <h3 className="text-base font-bold text-forest-deep mb-3 group-hover:text-olive-nature transition-colors line-clamp-2 min-h-[3rem]">
                    {language === 'fr' ? actu.titreFr : actu.titreEn}
                  </h3>

                  {/* Description avec hauteur variable selon l'état */}
                  <div className="flex-1">
                    <p className={`text-text-secondary text-sm leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {displayContenu}
                    </p>
                  </div>

                  {/* Bouton Voir plus/Voir moins (conditionnel) */}
                  {hasLongContent && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpand(actu.id);
                      }}
                      className="inline-flex items-center text-xs text-water-blue hover:text-olive-nature font-medium mt-2 mb-2 transition-colors group/expand"
                    >
                      <span>{isExpanded ? t.showLess : t.showMore}</span>
                      {isExpanded ? (
                        <FaChevronUp className="w-3 h-3 ml-1 group-hover/expand:-translate-y-1 transition-transform" />
                      ) : (
                        <FaChevronDown className="w-3 h-3 ml-1 group-hover/expand:translate-y-1 transition-transform" />
                      )}
                    </button>
                  )}

                  {/* Lieu (si disponible) */}
                  {actu.lieu && (
                    <div className="flex items-center text-xs text-text-secondary mt-2">
                      <FaMapMarkerAlt className="w-3 h-3 mr-1 text-water-blue flex-shrink-0" />
                      <span className="truncate">{actu.lieu}</span>
                    </div>
                  )}

                  {/* Date d'événement (si disponible) */}
                  {actu.dateEvenement && (
                    <div className="flex items-center text-xs text-text-secondary mt-1">
                      <FaClock className="w-3 h-3 mr-1 text-sun-gold flex-shrink-0" />
                      <span className="truncate">{t.eventDate}: {formatDate(actu.dateEvenement)}</span>
                    </div>
                  )}

                  {/* Lien lire plus vers page dédiée - toujours visible */}
                  <div className="mt-3 pt-2 border-t border-border-light">
                    <Link
                      to={`/actualites/${actu.id}`}
                      className="inline-flex items-center text-xs font-semibold text-water-blue hover:text-olive-nature transition-colors group/link"
                    >
                      {t.readMore}
                      <FaArrowRight className="w-3 h-3 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Effet de brillance au hover */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shine" />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 border-2 border-border-light hover:border-olive-nature"
            >
              <FaChevronLeft className="w-5 h-5 text-forest-deep" />
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full font-medium transition-all hover:scale-110 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-olive-nature to-forest-deep text-white shadow-lg border-2 border-white'
                      : 'bg-white text-forest-deep hover:bg-sun-gold/10 border-2 border-border-light'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 border-2 border-border-light hover:border-olive-nature"
            >
              <FaChevronRight className="w-5 h-5 text-forest-deep" />
            </button>
          </div>
        )}
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes shine {
          to {
            transform: translateX(100%);
          }
        }
        .animate-shine {
          animation: shine 1.5s infinite;
        }
      `}</style>
    </section>
  );
}