// src/pages/public/ProjetDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaHeart,
  FaQuoteLeft,
  FaSpinner,
  FaLeaf,
  FaUserFriends,
  FaChartLine,
  FaTint,
  FaTree,
  FaGraduationCap,
  FaTractor,
  FaCity,
  FaGavel,
  FaHeartbeat
} from 'react-icons/fa';
import projetService, { type Projet } from '../../services/projetService';
import temoignageService, { type Temoignage } from '../../services/temoignageService';
import { useLanguage } from '../../contexts/LanguageContext';

// Mapping des icônes par catégorie
const getIconForDomaine = (domaine: string) => {
  const text = domaine.toLowerCase();
  if (text.includes('environnement')) return <FaTree className="w-5 h-5" />;
  if (text.includes('social')) return <FaUserFriends className="w-5 h-5" />;
  if (text.includes('économique')) return <FaChartLine className="w-5 h-5" />;
  if (text.includes('éducation')) return <FaGraduationCap className="w-5 h-5" />;
  if (text.includes('agriculture')) return <FaTractor className="w-5 h-5" />;
  if (text.includes('eau')) return <FaTint className="w-5 h-5" />;
  if (text.includes('santé')) return <FaHeartbeat className="w-5 h-5" />;
  if (text.includes('infrastructure')) return <FaCity className="w-5 h-5" />;
  if (text.includes('gouvernance')) return <FaGavel className="w-5 h-5" />;
  return <FaLeaf className="w-5 h-5" />;
};

// Interface pour le contenu multilingue
interface Content {
  fr: {
    backToProjects: string;
    objectives: string;
    beneficiaries: string;
    location: string;
    duration: string;
    startDate: string;
    endDate: string;
    ongoing: string;
    share: string;
    downloadReport: string;
    testimonies: string;
    noTestimonies: string;
    support: string;
    supportText: string;
    donate: string;
    statistics: string;
    keyFigures: string;
    status: {
      en_cours: string;
      termine: string;
      a_venir: string;
      suspendu: string;
    };
  };
  en: {
    backToProjects: string;
    objectives: string;
    beneficiaries: string;
    location: string;
    duration: string;
    startDate: string;
    endDate: string;
    ongoing: string;
    share: string;
    downloadReport: string;
    testimonies: string;
    noTestimonies: string;
    support: string;
    supportText: string;
    donate: string;
    statistics: string;
    keyFigures: string;
    status: {
      en_cours: string;
      termine: string;
      a_venir: string;
      suspendu: string;
    };
  };
}

const content: Content = {
  fr: {
    backToProjects: 'Retour aux projets',
    objectives: 'Objectifs',
    beneficiaries: 'Bénéficiaires',
    location: 'Localisation',
    duration: 'Durée',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    ongoing: 'En cours',
    share: 'Partager',
    downloadReport: 'Télécharger le rapport',
    testimonies: 'Témoignages',
    noTestimonies: 'Aucun témoignage pour ce projet',
    support: 'Soutenir ce projet',
    supportText: 'Votre générosité nous permet de continuer nos actions et d\'étendre notre impact.',
    donate: 'Faire un don',
    statistics: 'Statistiques clés',
    keyFigures: 'Chiffres clés',
    status: {
      en_cours: 'En cours',
      termine: 'Terminé',
      a_venir: 'À venir',
      suspendu: 'Suspendu'
    }
  },
  en: {
    backToProjects: 'Back to projects',
    objectives: 'Objectives',
    beneficiaries: 'Beneficiaries',
    location: 'Location',
    duration: 'Duration',
    startDate: 'Start date',
    endDate: 'End date',
    ongoing: 'Ongoing',
    share: 'Share',
    downloadReport: 'Download report',
    testimonies: 'Testimonials',
    noTestimonies: 'No testimonials for this project',
    support: 'Support this project',
    supportText: 'Your generosity allows us to continue our actions and expand our impact.',
    donate: 'Make a donation',
    statistics: 'Key statistics',
    keyFigures: 'Key figures',
    status: {
      en_cours: 'In progress',
      termine: 'Completed',
      a_venir: 'Upcoming',
      suspendu: 'Suspended'
    }
  }
};

export default function ProjetDetailPage() {
  const { language } = useLanguage();
  const t = content[language];
  const { id } = useParams<{ id: string }>();
  
  const [projet, setProjet] = useState<Projet | null>(null);
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const projetData = await projetService.getProjetById(Number(id));
        setProjet(projetData);
        
        const allTemoignages = await temoignageService.getAllTemoignages();
        const projetTemoignages = allTemoignages.filter(t => 
          t.contenuFr.toLowerCase().includes(projetData.titreFr.toLowerCase()) ||
          t.contenuEn.toLowerCase().includes(projetData.titreEn.toLowerCase())
        ).slice(0, 3);
        setTemoignages(projetTemoignages);
        
      } catch (err) {
        console.error('Erreur chargement projet:', err);
        setError('Impossible de charger le projet');
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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBeneficiaires = (nb?: number) => {
    if (!nb) return '0';
    if (nb >= 1000000) return (nb / 1000000).toFixed(1) + 'M';
    if (nb >= 1000) return (nb / 1000).toFixed(1) + 'k';
    return nb.toString();
  };

  const getStatusColor = (statut: string) => {
    switch(statut) {
      case 'en_cours': return 'bg-green-100 text-green-800 border-green-300';
      case 'termine': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'a_venir': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'suspendu': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (statut: string) => {
    switch(statut) {
      case 'en_cours': return t.status.en_cours;
      case 'termine': return t.status.termine;
      case 'a_venir': return t.status.a_venir;
      case 'suspendu': return t.status.suspendu;
      default: return statut;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-olive-nature to-forest-deep flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-sun-gold animate-spin mx-auto mb-4" />
          <p className="text-warm-white">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error || !projet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-olive-nature to-forest-deep flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-text-dark text-xl font-medium mb-4">{error || 'Projet non trouvé'}</p>
          <Link
            to="/projets"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sun-gold text-forest-deep font-medium rounded-lg hover:bg-soft-sun transition-colors"
          >
            <FaArrowLeft />
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = getIconForDomaine(projet.domaineFr);

  return (
    <div className="min-h-screen bg-gradient-to-b from-olive-nature to-forest-deep pt-24 pb-20">
      {/* Overlay léger pour adoucir le fond */}
      <div className="absolute inset-0 bg-premium-dark/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Fil d'Ariane */}
        <div className="mb-8">
          <Link
            to="/projets"
            className="inline-flex items-center gap-2 text-warm-white/80 hover:text-warm-white transition-colors text-sm"
          >
            <FaArrowLeft className="w-3 h-3" />
            {t.backToProjects}
          </Link>
        </div>

        {/* Image principale et en-tête */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border-light mb-8">
          {/* Image principale */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            {projet.imageUrl ? (
              <img
                src={`https://web-production-03b53.up.railway.app/${projet.imageUrl}`}
                alt={language === 'fr' ? projet.titreFr : projet.titreEn}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-olive-nature to-forest-deep flex items-center justify-center">
                <div className="text-warm-white text-8xl opacity-30">{IconComponent}</div>
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            
            {/* Badge statut */}
            <div className="absolute top-6 right-6">
              <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(projet.statut)}`}>
                {getStatusText(projet.statut)}
              </span>
            </div>

            {/* Titre sur l'image */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sun-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {IconComponent}
                </div>
                <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {projet.domaineFr}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {language === 'fr' ? projet.titreFr : projet.titreEn}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale : Description et objectifs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-border-light">
              <h2 className="text-2xl font-bold text-forest-deep mb-4">
                {language === 'fr' ? 'Description du projet' : 'Project description'}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {language === 'fr' ? projet.descriptionFr : projet.descriptionEn}
              </p>
            </div>

            {/* Objectifs */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-border-light">
              <h2 className="text-2xl font-bold text-forest-deep mb-4">
                {t.objectives}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {language === 'fr' ? projet.objectifFr : projet.objectifEn}
              </p>
            </div>

            {/* Témoignages */}
            {temoignages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-border-light">
                <h2 className="text-2xl font-bold text-forest-deep mb-6">
                  {t.testimonies}
                </h2>
                <div className="space-y-6">
                  {temoignages.map((tem) => (
                    <div key={tem.id} className="relative bg-ultra-light rounded-xl p-6">
                      <FaQuoteLeft className="absolute top-4 left-4 text-sun-gold/20 w-8 h-8" />
                      <div className="pl-10">
                        <p className="text-text-secondary italic mb-4">
                          "{language === 'fr' ? tem.contenuFr : tem.contenuEn}"
                        </p>
                        <div className="flex items-center gap-3">
                          {tem.photoUrl ? (
                            <img
                              src={`https://web-production-03b53.up.railway.app/${tem.photoUrl}`}
                              alt={language === 'fr' ? tem.auteurFr : tem.auteurEn}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-olive-nature to-forest-deep rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {(language === 'fr' ? tem.auteurFr : tem.auteurEn).charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-forest-deep">
                              {language === 'fr' ? tem.auteurFr : tem.auteurEn}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {language === 'fr' ? tem.fonctionFr : tem.fonctionEn}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne latérale : Informations clés */}
          <div className="space-y-6">
            {/* Carte d'informations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-border-light">
              <h3 className="text-lg font-bold text-forest-deep mb-4 pb-2 border-b border-border-light">
                {t.keyFigures}
              </h3>
              
              <div className="space-y-4">
                {/* Localisation */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-olive-nature/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="w-4 h-4 text-olive-nature" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{t.location}</p>
                    <p className="font-medium text-forest-deep">
                      {projet.region?.nom || 'National'}
                    </p>
                  </div>
                </div>

                {/* Bénéficiaires */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-water-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUsers className="w-4 h-4 text-water-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{t.beneficiaries}</p>
                    <p className="font-medium text-forest-deep">
                      {formatBeneficiaires(projet.beneficiaires)} personnes
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-sun-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="w-4 h-4 text-sun-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{t.startDate}</p>
                    <p className="font-medium text-forest-deep">
                      {formatDate(projet.dateDebut)}
                    </p>
                  </div>
                </div>

                {projet.dateFin && (
                  <div className="flex items-start gap-3 pl-11">
                    <div>
                      <p className="text-xs text-text-secondary">{t.endDate}</p>
                      <p className="font-medium text-forest-deep">
                        {formatDate(projet.dateFin)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Carte d'impact */}
            <div className="bg-gradient-to-br from-olive-nature to-forest-deep rounded-2xl shadow-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <FaHeart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.support}</h3>
              <p className="text-white/90 text-sm mb-6">
                {t.supportText}
              </p>
              <Link
                to="/faire-un-don"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sun-gold text-forest-deep font-semibold rounded-lg hover:bg-soft-sun transition-all transform hover:scale-105 w-full justify-center"
              >
                {t.donate}
                <FaHeart className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal image (optionnel) */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Galerie"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}