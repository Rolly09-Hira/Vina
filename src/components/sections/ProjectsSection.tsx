// src/components/sections/ProjectsSection.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTree, 
  FaTint,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaLeaf,
  FaUserFriends,
  FaChartLine,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaPlayCircle,
  FaPauseCircle,
  FaHourglassHalf,
  FaSpinner,
  FaGavel,
  FaSolarPanel,
  FaShoppingBasket,
  FaHandshake,
  FaHeartbeat,
  FaTractor,
  FaCity,
  FaGraduationCap
} from 'react-icons/fa';
import projetService, { type Projet } from '../../services/projetService';
import { useLanguage } from '../../contexts/LanguageContext';

// Définir les types de catégories possibles
type CategoryType = 
  | 'environnement' 
  | 'social' 
  | 'economique' 
  | 'education' 
  | 'agriculture' 
  | 'eau' 
  | 'sante'
  | 'infrastructure'
  | 'gouvernance'
  | 'default';

// Interface pour les couleurs de catégorie
interface CategoryColor {
  bg: string;
  text: string;
  light: string;
  icon: string;
  border: string;
  gradient: string;
}

// Mapping des icônes par catégorie
const getIconForProjet = (domaineFr: string, domaineEn: string) => {
  const text = (domaineFr + ' ' + domaineEn).toLowerCase();
  if (text.includes('environnement') || text.includes('environment') || text.includes('forêt') || text.includes('forest')) return <FaTree className="w-6 h-6" />;
  if (text.includes('agriculture') || text.includes('farming') || text.includes('agro') || text.includes('tractor')) return <FaTractor className="w-6 h-6" />;
  if (text.includes('social') || text.includes('communaut') || text.includes('community')) return <FaUserFriends className="w-6 h-6" />;
  if (text.includes('économique') || text.includes('economic') || text.includes('revenu') || text.includes('income')) return <FaChartLine className="w-6 h-6" />;
  if (text.includes('éducation') || text.includes('education') || text.includes('formation') || text.includes('training')) return <FaGraduationCap className="w-6 h-6" />;
  if (text.includes('eau') || text.includes('water') || text.includes('assainissement') || text.includes('sanitation')) return <FaTint className="w-6 h-6" />;
  if (text.includes('santé') || text.includes('sante') || text.includes('health')) return <FaHeartbeat className="w-6 h-6" />;
  if (text.includes('infrastructure') || text.includes('city') || text.includes('construction')) return <FaCity className="w-6 h-6" />;
  if (text.includes('gouvernance') || text.includes('governance')) return <FaGavel className="w-6 h-6" />;
  if (text.includes('climat') || text.includes('climate') || text.includes('résilience')) return <FaSolarPanel className="w-6 h-6" />;
  if (text.includes('sécurité alimentaire') || text.includes('food security')) return <FaShoppingBasket className="w-6 h-6" />;
  if (text.includes('partenariat') || text.includes('partnership')) return <FaHandshake className="w-6 h-6" />;
  return <FaLeaf className="w-6 h-6" />;
};

// Mapping des couleurs par catégorie avec vos nouvelles couleurs
const categoryColors: Record<CategoryType, CategoryColor> = {
  environnement: {
    bg: 'bg-olive-nature',
    text: 'text-olive-nature',
    light: 'bg-olive-nature/10',
    icon: 'bg-olive-nature',
    border: 'border-olive-nature/30',
    gradient: 'from-olive-nature to-forest-deep'
  },
  social: {
    bg: 'bg-water-blue',
    text: 'text-water-blue',
    light: 'bg-water-blue/10',
    icon: 'bg-water-blue',
    border: 'border-water-blue/30',
    gradient: 'from-water-blue to-sky-soft'
  },
  economique: {
    bg: 'bg-sun-gold',
    text: 'text-sun-gold',
    light: 'bg-sun-gold/10',
    icon: 'bg-sun-gold',
    border: 'border-sun-gold/30',
    gradient: 'from-sun-gold to-soft-sun'
  },
  education: {
    bg: 'bg-purple-600',
    text: 'text-purple-600',
    light: 'bg-purple-50',
    icon: 'bg-purple-600',
    border: 'border-purple-200',
    gradient: 'from-purple-600 to-indigo-500'
  },
  agriculture: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    light: 'bg-emerald-50',
    icon: 'bg-emerald-600',
    border: 'border-emerald-200',
    gradient: 'from-emerald-600 to-teal-500'
  },
  eau: {
    bg: 'bg-cyan-600',
    text: 'text-cyan-600',
    light: 'bg-cyan-50',
    icon: 'bg-cyan-600',
    border: 'border-cyan-200',
    gradient: 'from-cyan-600 to-sky-500'
  },
  sante: {
    bg: 'bg-red-600',
    text: 'text-red-600',
    light: 'bg-red-50',
    icon: 'bg-red-600',
    border: 'border-red-200',
    gradient: 'from-red-600 to-pink-500'
  },
  infrastructure: {
    bg: 'bg-gray-600',
    text: 'text-gray-600',
    light: 'bg-gray-50',
    icon: 'bg-gray-600',
    border: 'border-gray-200',
    gradient: 'from-gray-600 to-slate-500'
  },
  gouvernance: {
    bg: 'bg-amber-600',
    text: 'text-amber-600',
    light: 'bg-amber-50',
    icon: 'bg-amber-600',
    border: 'border-amber-200',
    gradient: 'from-amber-600 to-orange-500'
  },
  default: {
    bg: 'bg-gray-600',
    text: 'text-gray-600',
    light: 'bg-gray-50',
    icon: 'bg-gray-600',
    border: 'border-gray-200',
    gradient: 'from-gray-600 to-slate-500'
  }
};

// Mapping direct des domaines pour une détection fiable
const domaineToCategory: Record<string, CategoryType> = {
  'environnement': 'environnement',
  'environment': 'environnement',
  'social': 'social',
  'économique': 'economique',
  'economique': 'economique',
  'economic': 'economique',
  'éducation': 'education',
  'education': 'education',
  'agriculture': 'agriculture',
  'eau': 'eau',
  'assainissement': 'eau',
  'water': 'eau',
  'santé': 'sante',
  'sante': 'sante',
  'health': 'sante',
  'infrastructure': 'infrastructure',
  'gouvernance': 'gouvernance',
  'governance': 'gouvernance'
};

// Fonction de détection améliorée
const getCategoryForProjet = (domaineFr: string, domaineEn: string): CategoryType => {
  const fr = domaineFr?.toLowerCase().trim() || '';
  const en = domaineEn?.toLowerCase().trim() || '';
  
  if (fr === 'agriculture' || en === 'agriculture') {
    return 'agriculture';
  }
  
  if (fr in domaineToCategory) {
    return domaineToCategory[fr];
  }
  
  if (en in domaineToCategory) {
    return domaineToCategory[en];
  }
  
  const text = fr + ' ' + en;
  
  if (text.includes('agriculture') || text.includes('farming') || text.includes('paysan') || text.includes('farmer') || text.includes('élevage') || text.includes('livestock')) {
    return 'agriculture';
  }
  
  if (text.includes('environnement') || text.includes('environment') || text.includes('forêt') || text.includes('forest') || text.includes('climat') || text.includes('climate')) {
    return 'environnement';
  }
  
  if (text.includes('social') || text.includes('communaut') || text.includes('community') || text.includes('solidarité')) {
    return 'social';
  }
  
  if (text.includes('économique') || text.includes('economic') || text.includes('revenu') || text.includes('income') || text.includes('agr')) {
    return 'economique';
  }
  
  if (text.includes('éducation') || text.includes('education') || text.includes('formation') || text.includes('training') || text.includes('école') || text.includes('school')) {
    return 'education';
  }
  
  if (text.includes('eau') || text.includes('water') || text.includes('assainissement') || text.includes('sanitation')) {
    return 'eau';
  }
  
  if (text.includes('santé') || text.includes('sante') || text.includes('health')) {
    return 'sante';
  }
  
  if (text.includes('infrastructure') || text.includes('construction') || text.includes('bâtiment')) {
    return 'infrastructure';
  }
  
  if (text.includes('gouvernance') || text.includes('governance')) {
    return 'gouvernance';
  }
  
  return 'default';
};

// Interface pour la configuration des statuts
interface StatusConfig {
  label: string;
  icon: any;
  color: string;
}

// Mapping des statuts avec textes multilingues
const getStatusConfig = (language: string): Record<string, StatusConfig> => ({
  'en_cours': { 
    label: language === 'fr' ? 'En cours' : 'In progress', 
    icon: FaPlayCircle, 
    color: 'text-green-600 bg-green-100' 
  },
  'termine': { 
    label: language === 'fr' ? 'Terminé' : 'Completed', 
    icon: FaCheckCircle, 
    color: 'text-blue-600 bg-blue-100' 
  },
  'a_venir': { 
    label: language === 'fr' ? 'À venir' : 'Upcoming', 
    icon: FaHourglassHalf, 
    color: 'text-yellow-600 bg-yellow-100' 
  },
  'suspendu': { 
    label: language === 'fr' ? 'Suspendu' : 'Suspended', 
    icon: FaPauseCircle, 
    color: 'text-red-600 bg-red-100' 
  }
});

// Interface pour le contenu multilingue
interface Content {
  fr: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    projectDetails: string;
    beneficiaries: string;
    national: string;
    ongoing: string;
    viewAll: string;
    loading: string;
    noProjects: string;
    globalImpact: string;
    activeProjects: string;
    coveredRegions: string;
    totalBeneficiaries: string;
    globalProgress: string;
  };
  en: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    projectDetails: string;
    beneficiaries: string;
    national: string;
    ongoing: string;
    viewAll: string;
    loading: string;
    noProjects: string;
    globalImpact: string;
    activeProjects: string;
    coveredRegions: string;
    totalBeneficiaries: string;
    globalProgress: string;
  };
}

// Texte multilingue pour l'interface
const content: Content = {
  fr: {
    badge: 'NOS PROJETS',
    title: 'Des actions concrètes',
    titleHighlight: 'pour un impact durable',
    subtitle: 'Découvrez nos projets qui transforment les communautés et préservent l\'environnement',
    projectDetails: 'En savoir plus',
    beneficiaries: 'bénéf.',
    national: 'National',
    ongoing: 'En cours',
    viewAll: 'Voir tous nos projets',
    loading: 'Chargement des projets...',
    noProjects: 'Aucun projet disponible pour le moment',
    globalImpact: 'Impact global',
    activeProjects: 'Projets actifs',
    coveredRegions: 'Régions couvertes',
    totalBeneficiaries: 'Bénéficiaires',
    globalProgress: 'Progression globale'
  },
  en: {
    badge: 'OUR PROJECTS',
    title: 'Concrete actions',
    titleHighlight: 'for sustainable impact',
    subtitle: 'Discover our projects that transform communities and preserve the environment',
    projectDetails: 'Learn more',
    beneficiaries: 'benef.',
    national: 'National',
    ongoing: 'Ongoing',
    viewAll: 'View all projects',
    loading: 'Loading projects...',
    noProjects: 'No projects available at the moment',
    globalImpact: 'Global impact',
    activeProjects: 'Active projects',
    coveredRegions: 'Covered regions',
    totalBeneficiaries: 'Beneficiaries',
    globalProgress: 'Global progress'
  }
};

export default function ProjectsSection() {
  const { language } = useLanguage();
  const t = content[language];
  const statusConfig = getStatusConfig(language);
  
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        setLoading(true);
        const data = await projetService.getAllProjets();
        // Trier par date de début (plus récent d'abord)
        const sorted = data.sort((a, b) => 
          new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime()
        );
        setProjets(sorted);
      } catch (err) {
        console.error('Erreur chargement projets:', err);
        setError('Impossible de charger les projets');
      } finally {
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  // Obtenir les projets mis en avant (les 2 premiers)
  const featuredProjets = projets.slice(0, 2);
  const regularProjets = projets.slice(2, 6); // 4 projets supplémentaires pour faire 6 au total

  // Calculer les statistiques
  const totalBeneficiaires = projets.reduce((acc, p) => acc + (p.beneficiaires || 0), 0);
  const projetsEnCours = projets.filter(p => p.statut === 'en_cours').length;
  const regionsUniques = new Set(projets.map(p => p.region?.nom).filter(Boolean)).size;

  const formatBeneficiaires = (nb?: number) => {
    if (!nb) return '0';
    if (nb >= 1000000) return (nb / 1000000).toFixed(1) + 'M';
    if (nb >= 1000) return (nb / 1000).toFixed(1) + 'k';
    return nb.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getCategoryColor = (domaineFr: string, domaineEn: string): CategoryColor => {
    const category = getCategoryForProjet(domaineFr, domaineEn);
    return categoryColors[category];
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

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-warm-white to-ultra-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-warm-white to-ultra-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-sun-gold/10 px-6 py-2 rounded-full border border-sun-gold/20 mb-6">
            <span className="w-2 h-2 bg-sun-gold rounded-full mr-2 animate-pulse" />
            <span className="text-forest-deep text-sm font-semibold tracking-wider">
              {t.badge}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-forest-deep mb-4">
            {t.title}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-sun-gold to-olive-nature bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-sun-gold/20 -z-0 blur-md"></span>
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Projets mis en avant (grand format) */}
        {featuredProjets.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {featuredProjets.map((projet) => {
              const colors = getCategoryColor(projet.domaineFr, projet.domaineEn);
              const icon = getIconForProjet(projet.domaineFr, projet.domaineEn);
              const status = statusConfig[projet.statut] || statusConfig.en_cours;
              const StatusIcon = status.icon;

              return (
                <div
                  key={projet.id}
                  className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  onMouseEnter={() => setHoveredId(projet.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative h-72 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10`} />
                    {projet.imageUrl ? (
                      <img
                        src={projet.imageUrl}
                        alt={language === 'fr' ? projet.titreFr : projet.titreEn}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ultra-light to-warm-white flex items-center justify-center">
                        <div className="text-text-secondary text-6xl">{icon}</div>
                      </div>
                    )}
                    
                    {/* Badge catégorie */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold ${colors.text} shadow-lg border ${colors.border}`}>
                        <span className="mr-2 text-lg">{icon}</span>
                        {language === 'fr' ? projet.domaineFr : projet.domaineEn}
                      </span>
                    </div>

                    {/* Badge statut */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold ${status.color} shadow-lg border border-white/30`}>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-forest-deep mb-3 group-hover:text-olive-nature transition-colors">
                      {language === 'fr' ? projet.titreFr : projet.titreEn}
                    </h3>
                    <p className="text-text-secondary mb-4 line-clamp-2">
                      {language === 'fr' ? projet.descriptionFr : projet.descriptionEn}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-text-secondary">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2 text-olive-nature" />
                        <span className="text-sm">{projet.region?.nom || t.national}</span>
                      </div>
                      <div className="flex items-center text-text-secondary">
                        <FaUsers className="w-4 h-4 mr-2 text-water-blue" />
                        <span className="text-sm">{formatBeneficiaires(projet.beneficiaires)} {t.beneficiaries}</span>
                      </div>
                      <div className="flex items-center text-text-secondary">
                        <FaCalendarAlt className="w-4 h-4 mr-2 text-sun-gold" />
                        <span className="text-sm">{formatDate(projet.dateDebut)}</span>
                      </div>
                      <div className="flex items-center text-text-secondary">
                        <FaClock className="w-4 h-4 mr-2 text-earth-brown" />
                        <span className="text-sm">
                          {projet.dateFin ? formatDate(projet.dateFin) : t.ongoing}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/projets/${projet.id}`}
                      className="inline-flex items-center text-sm text-water-blue font-medium hover:text-olive-nature transition-colors group/btn"
                    >
                      <span>{t.projectDetails}</span>
                      <FaArrowRight className="w-3 h-3 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {hoveredId === projet.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Grille des autres projets */}
        {regularProjets.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {regularProjets.map((projet) => {
              const colors = getCategoryColor(projet.domaineFr, projet.domaineEn);
              const icon = getIconForProjet(projet.domaineFr, projet.domaineEn);
              const status = statusConfig[projet.statut] || statusConfig.en_cours;
              const StatusIcon = status.icon;

              return (
                <div
                  key={projet.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border-light"
                  onMouseEnter={() => setHoveredId(projet.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative h-48 overflow-hidden">
                    {projet.imageUrl ? (
                      <img
                        src={projet.imageUrl}
                        alt={language === 'fr' ? projet.titreFr : projet.titreEn}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ultra-light to-warm-white flex items-center justify-center">
                        <div className="text-text-secondary text-4xl">{icon}</div>
                      </div>
                    )}
                    
                    {/* Badge catégorie */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`inline-flex items-center px-3 py-1 ${colors.light} rounded-full text-xs font-semibold ${colors.text} border ${colors.border}`}>
                        <span className="mr-1.5 text-sm">{icon}</span>
                        {language === 'fr' ? projet.domaineFr : projet.domaineEn}
                      </span>
                    </div>

                    {/* Badge statut */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color} border border-white/30 shadow-sm`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-forest-deep mb-2 group-hover:text-olive-nature transition-colors line-clamp-1">
                      {language === 'fr' ? projet.titreFr : projet.titreEn}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                      {language === 'fr' ? projet.descriptionFr : projet.descriptionEn}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-text-secondary">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1.5 text-olive-nature" />
                        <span className="truncate">{projet.region?.nom || t.national}</span>
                      </div>
                      <div className="flex items-center text-xs text-text-secondary">
                        <FaUsers className="w-3 h-3 mr-1.5 text-water-blue" />
                        <span>{formatBeneficiaires(projet.beneficiaires)} {t.beneficiaries}</span>
                      </div>
                    </div>

                    <Link
                      to={`/projets/${projet.id}`}
                      className="inline-flex items-center text-sm text-water-blue font-medium hover:text-olive-nature transition-colors group/btn"
                    >
                      <span>{t.projectDetails}</span>
                      <FaArrowRight className="w-3 h-3 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {hoveredId === projet.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bouton Voir tous les projets */}
        <div className="text-center">
          <Link
            to="/projets"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-semibold rounded-full hover:from-forest-deep hover:to-premium-dark transition-all transform hover:scale-105 shadow-xl"
          >
            <span>{t.viewAll}</span>
            <FaArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Barre de progression globale */}
        {projets.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-olive-nature/10 to-water-blue/10 rounded-3xl p-8 shadow-lg border border-border-light">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h4 className="text-2xl font-bold text-forest-deep mb-2">
                  {t.globalImpact} {new Date().getFullYear()}
                </h4>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-3xl font-bold text-olive-nature">{projets.length}</p>
                    <p className="text-sm text-text-secondary">{t.activeProjects}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-water-blue">{regionsUniques}</p>
                    <p className="text-sm text-text-secondary">{t.coveredRegions}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-sun-gold">
                      {formatBeneficiaires(totalBeneficiaires)}
                    </p>
                    <p className="text-sm text-text-secondary">{t.totalBeneficiaries}</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-forest-deep">{t.globalProgress}</span>
                  <span className="text-sm font-bold text-olive-nature">
                    {projets.length > 0 ? Math.round((projetsEnCours / projets.length) * 100) : 0}%
                  </span>
                </div>
                <div className="h-3 bg-border-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-olive-nature to-sun-gold rounded-full transition-all duration-1000"
                    style={{ width: `${projets.length > 0 ? (projetsEnCours / projets.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  {projetsEnCours} {language === 'fr' ? 'projet' : 'project'}{projetsEnCours > 1 ? 's' : ''} {language === 'fr' ? 'en cours sur' : 'in progress out of'} {projets.length}
                </p>
              </div>
            </div>
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