// src/pages/public/ActualiteDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaNewspaper,
  FaStar,
  FaSpinner
} from 'react-icons/fa';
import actualiteService, { type Actualite } from '../../services/actualiteService';
import { useLanguage } from '../../contexts/LanguageContext';

// Interface pour le contenu multilingue
interface Content {
  fr: {
    backToNews: string;
    publishedOn: string;
    eventDate: string;
    location: string;
    share: string;
    download: string;
    print: string;
    email: string;
    relatedNews: string;
    noRelated: string;
    important: string;
    author: string;
  };
  en: {
    backToNews: string;
    publishedOn: string;
    eventDate: string;
    location: string;
    share: string;
    download: string;
    print: string;
    email: string;
    relatedNews: string;
    noRelated: string;
    important: string;
    author: string;
  };
}

const content: Content = {
  fr: {
    backToNews: 'Retour aux actualités',
    publishedOn: 'Publié le',
    eventDate: 'Date de l\'événement',
    location: 'Lieu',
    share: 'Partager',
    download: 'Télécharger',
    print: 'Imprimer',
    email: 'Email',
    relatedNews: 'Actualités similaires',
    noRelated: 'Aucune actualité similaire',
    important: 'Important',
    author: 'Auteur'
  },
  en: {
    backToNews: 'Back to news',
    publishedOn: 'Published on',
    eventDate: 'Event date',
    location: 'Location',
    share: 'Share',
    download: 'Download',
    print: 'Print',
    email: 'Email',
    relatedNews: 'Related news',
    noRelated: 'No related news',
    important: 'Important',
    author: 'Author'
  }
};

// Mapping des couleurs par type
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

export default function ActualiteDetailPage() {
  const { language } = useLanguage();
  const t = content[language];
  const { id } = useParams<{ id: string }>();
  
  const [actualite, setActualite] = useState<Actualite | null>(null);
  const [relatedActualites, setRelatedActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'actualité
        const data = await actualiteService.getActualiteById(Number(id));
        setActualite(data);
        
        // Récupérer les actualités similaires (même type)
        const allActualites = await actualiteService.getAllActualites();
        const related = allActualites
          .filter(a => a.id !== Number(id) && a.type === data.type)
          .slice(0, 3);
        setRelatedActualites(related);
        
      } catch (err) {
        console.error('Erreur chargement actualité:', err);
        setError('Impossible de charger l\'actualité');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    return typeColors[type as keyof typeof typeColors] || typeColors.nouvelle;
  };

  const getTypeLabel = (type: string) => {
    const labels = typeLabels[type as keyof typeof typeLabels];
    return labels ? labels[language] : type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-olive-nature to-forest-deep flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-sun-gold animate-spin mx-auto mb-4" />
          <p className="text-warm-white">Chargement de l'actualité...</p>
        </div>
      </div>
    );
  }

  if (error || !actualite) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-olive-nature to-forest-deep flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-text-dark text-xl font-medium mb-4">{error || 'Actualité non trouvée'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sun-gold text-forest-deep font-medium rounded-lg hover:bg-soft-sun transition-colors"
          >
            <FaArrowLeft />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const colors = getTypeColor(actualite.type);
  const typeLabel = getTypeLabel(actualite.type);

  return (
    <div className="min-h-screen bg-gradient-to-b from-olive-nature to-forest-deep pt-24 pb-20 relative">
      {/* Overlay léger pour adoucir le fond */}
      <div className="absolute inset-0 bg-premium-dark/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Fil d'Ariane */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-warm-white/80 hover:text-warm-white transition-colors text-sm"
          >
            <FaArrowLeft className="w-3 h-3" />
            {t.backToNews}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale - Article */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border-light">
              {/* Image principale */}
              <div className="relative h-96 overflow-hidden">
                {actualite.imageUrl ? (
                  <img
                    src={actualite.imageUrl}
                    alt={language === 'fr' ? actualite.titreFr : actualite.titreEn}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-ultra-light to-warm-white flex items-center justify-center">
                    <div className="text-text-secondary text-8xl opacity-30">
                      <FaNewspaper />
                    </div>
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                {/* Badge catégorie */}
                <div className="absolute top-6 left-6">
                  <span className={`px-5 py-2.5 rounded-full text-sm font-bold shadow-lg ${colors.bg} text-white`}>
                    {typeLabel}
                  </span>
                </div>

                {/* Badge important */}
                {actualite.important && (
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 bg-sun-gold text-forest-deep rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <FaStar className="w-4 h-4" />
                      {t.important}
                    </span>
                  </div>
                )}
              </div>

              {/* Contenu de l'article */}
              <div className="p-8 md:p-12">
                {/* Métadonnées */}
                <div className="flex flex-wrap gap-6 mb-8 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <FaCalendarAlt className="w-4 h-4 text-water-blue" />
                    <span>{t.publishedOn} {formatDate(actualite.datePublication)}</span>
                  </div>
                  
                  {actualite.lieu && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <FaMapMarkerAlt className="w-4 h-4 text-sun-gold" />
                      <span>{actualite.lieu}</span>
                    </div>
                  )}
                  
                  {actualite.dateEvenement && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <FaClock className="w-4 h-4 text-olive-nature" />
                      <span>{t.eventDate}: {formatDate(actualite.dateEvenement)}</span>
                    </div>
                  )}
                </div>

                {/* Titre */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-forest-deep mb-6">
                  {language === 'fr' ? actualite.titreFr : actualite.titreEn}
                </h1>

                {/* Contenu */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {language === 'fr' ? actualite.contenuFr : actualite.contenuEn}
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Colonne latérale - Actualités similaires */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-border-light sticky top-24">
              <h3 className="text-xl font-bold text-forest-deep mb-6 pb-2 border-b border-border-light">
                {t.relatedNews}
              </h3>
              
              {relatedActualites.length === 0 ? (
                <p className="text-text-secondary text-sm">{t.noRelated}</p>
              ) : (
                <div className="space-y-4">
                  {relatedActualites.map((rel) => {
                    const relColors = getTypeColor(rel.type);
                    return (
                      <Link
                        key={rel.id}
                        to={`/actualites/${rel.id}`}
                        className="block group"
                      >
                        <div className="flex gap-3 p-3 rounded-xl hover:bg-ultra-light transition-colors">
                          {/* Miniature */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {rel.imageUrl ? (
                              <img
                                src={rel.imageUrl}
                                alt={language === 'fr' ? rel.titreFr : rel.titreEn}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-ultra-light flex items-center justify-center">
                                <FaNewspaper className="w-6 h-6 text-text-secondary" />
                              </div>
                            )}
                          </div>
                          
                          {/* Infos */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${relColors.text}`}>
                                {getTypeLabel(rel.type)}
                              </span>
                              <span className="text-xs text-text-secondary">
                                {formatDate(rel.datePublication)}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-forest-deep group-hover:text-olive-nature transition-colors line-clamp-2">
                              {language === 'fr' ? rel.titreFr : rel.titreEn}
                            </h4>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}