// src/pages/public/ProjetsPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaArrowRight,
  FaTree, 
  FaTint,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaLeaf,
  FaUserFriends,
  FaChartLine,
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
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaSearch
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

// Mapping des couleurs par catégorie avec vos couleurs
const categoryColors: Record<CategoryType, CategoryColor> = {
  environnement: {
    bg: 'from-olive-nature to-forest-deep',
    text: 'text-olive-nature',
    light: 'bg-olive-nature/10',
    icon: 'bg-olive-nature',
    border: 'border-olive-nature/30',
    gradient: 'from-olive-nature to-forest-deep'
  },
  social: {
    bg: 'from-water-blue to-sky-soft',
    text: 'text-water-blue',
    light: 'bg-water-blue/10',
    icon: 'bg-water-blue',
    border: 'border-water-blue/30',
    gradient: 'from-water-blue to-sky-soft'
  },
  economique: {
    bg: 'from-sun-gold to-soft-sun',
    text: 'text-sun-gold',
    light: 'bg-sun-gold/10',
    icon: 'bg-sun-gold',
    border: 'border-sun-gold/30',
    gradient: 'from-sun-gold to-soft-sun'
  },
  education: {
    bg: 'from-purple-600 to-purple-500',
    text: 'text-purple-600',
    light: 'bg-purple-50',
    icon: 'bg-purple-600',
    border: 'border-purple-200',
    gradient: 'from-purple-600 to-indigo-500'
  },
  agriculture: {
    bg: 'from-emerald-600 to-emerald-500',
    text: 'text-emerald-600',
    light: 'bg-emerald-50',
    icon: 'bg-emerald-600',
    border: 'border-emerald-200',
    gradient: 'from-emerald-600 to-teal-500'
  },
  eau: {
    bg: 'from-cyan-600 to-cyan-500',
    text: 'text-cyan-600',
    light: 'bg-cyan-50',
    icon: 'bg-cyan-600',
    border: 'border-cyan-200',
    gradient: 'from-cyan-600 to-sky-500'
  },
  sante: {
    bg: 'from-red-600 to-red-500',
    text: 'text-red-600',
    light: 'bg-red-50',
    icon: 'bg-red-600',
    border: 'border-red-200',
    gradient: 'from-red-600 to-pink-500'
  },
  infrastructure: {
    bg: 'from-gray-600 to-gray-500',
    text: 'text-gray-600',
    light: 'bg-gray-50',
    icon: 'bg-gray-600',
    border: 'border-gray-200',
    gradient: 'from-gray-600 to-slate-500'
  },
  gouvernance: {
    bg: 'from-amber-600 to-amber-500',
    text: 'text-amber-600',
    light: 'bg-amber-50',
    icon: 'bg-amber-600',
    border: 'border-amber-200',
    gradient: 'from-amber-600 to-orange-500'
  },
  default: {
    bg: 'from-gray-600 to-gray-500',
    text: 'text-gray-600',
    light: 'bg-gray-50',
    icon: 'bg-gray-600',
    border: 'border-gray-200',
    gradient: 'from-gray-600 to-slate-500'
  }
};

// Mapping direct des domaines
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

// Fonction de détection
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

// Mapping des statuts
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
    filters: {
      all: string;
      environnement: string;
      social: string;
      economique: string;
      education: string;
      agriculture: string;
      eau: string;
      sante: string;
      infrastructure: string;
      gouvernance: string;
    };
    projectDetails: string;
    beneficiaries: string;
    national: string;
    ongoing: string;
    globalImpact: string;
    activeProjects: string;
    coveredRegions: string;
    totalBeneficiaries: string;
    globalProgress: string;
    viewAll: string;
    backToHome: string;
    loading: string;
    noProjects: string;
    filterPlaceholder: string;
    searchPlaceholder: string;
    resetFilters: string;
    results: string;
  };
  en: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    filters: {
      all: string;
      environnement: string;
      social: string;
      economique: string;
      education: string;
      agriculture: string;
      eau: string;
      sante: string;
      infrastructure: string;
      gouvernance: string;
    };
    projectDetails: string;
    beneficiaries: string;
    national: string;
    ongoing: string;
    globalImpact: string;
    activeProjects: string;
    coveredRegions: string;
    totalBeneficiaries: string;
    globalProgress: string;
    viewAll: string;
    backToHome: string;
    loading: string;
    noProjects: string;
    filterPlaceholder: string;
    searchPlaceholder: string;
    resetFilters: string;
    results: string;
  };
}

// Texte multilingue
const content: Content = {
  fr: {
    badge: 'NOS PROJETS',
    title: 'Tous nos',
    titleHighlight: 'projets',
    subtitle: 'Découvrez l\'ensemble de nos projets qui transforment les communautés et préservent l\'environnement',
    filters: {
      all: 'Tous',
      environnement: 'Environnement',
      social: 'Social',
      economique: 'Économique',
      education: 'Éducation',
      agriculture: 'Agriculture',
      eau: 'Eau',
      sante: 'Santé',
      infrastructure: 'Infrastructure',
      gouvernance: 'Gouvernance'
    },
    projectDetails: 'En savoir plus',
    beneficiaries: 'bénéf.',
    national: 'National',
    ongoing: 'En cours',
    globalImpact: 'Impact global',
    activeProjects: 'Projets actifs',
    coveredRegions: 'Régions couvertes',
    totalBeneficiaries: 'Bénéficiaires',
    globalProgress: 'Progression globale',
    viewAll: 'Voir tous nos projets',
    backToHome: 'Retour à l\'accueil',
    loading: 'Chargement des projets...',
    noProjects: 'Aucun projet dans cette catégorie',
    filterPlaceholder: 'Filtrer par domaine',
    searchPlaceholder: 'Rechercher un projet...',
    resetFilters: 'Réinitialiser les filtres',
    results: 'résultats'
  },
  en: {
    badge: 'OUR PROJECTS',
    title: 'All our',
    titleHighlight: 'projects',
    subtitle: 'Discover all our projects that transform communities and preserve the environment',
    filters: {
      all: 'All',
      environnement: 'Environment',
      social: 'Social',
      economique: 'Economic',
      education: 'Education',
      agriculture: 'Agriculture',
      eau: 'Water',
      sante: 'Health',
      infrastructure: 'Infrastructure',
      gouvernance: 'Governance'
    },
    projectDetails: 'Learn more',
    beneficiaries: 'benef.',
    national: 'National',
    ongoing: 'Ongoing',
    globalImpact: 'Global impact',
    activeProjects: 'Active projects',
    coveredRegions: 'Covered regions',
    totalBeneficiaries: 'Beneficiaries',
    globalProgress: 'Global progress',
    viewAll: 'View all projects',
    backToHome: 'Back to home',
    loading: 'Loading projects...',
    noProjects: 'No projects in this category',
    filterPlaceholder: 'Filter by domain',
    searchPlaceholder: 'Search a project...',
    resetFilters: 'Reset filters',
    results: 'results'
  }
};

export default function ProjetsPage() {
  const { language } = useLanguage();
  const t = content[language];
  const statusConfig = getStatusConfig(language);
  
  const [projets, setProjets] = useState<Projet[]>([]);
  const [filteredProjets, setFilteredProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'beneficiaires'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 9;

  // Charger les projets
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        setLoading(true);
        const data = await projetService.getAllProjets();
        setProjets(data);
      } catch (err) {
        console.error('Erreur chargement projets:', err);
        setError('Impossible de charger les projets');
      } finally {
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  // Filtrer et trier les projets
  useEffect(() => {
    let filtered = [...projets];
    
    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => {
        const category = getCategoryForProjet(p.domaineFr, p.domaineEn);
        return category === selectedCategory;
      });
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.titreFr.toLowerCase().includes(term) ||
        p.titreEn.toLowerCase().includes(term) ||
        p.descriptionFr.toLowerCase().includes(term) ||
        p.domaineFr.toLowerCase().includes(term)
      );
    }
    
    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime();
      } else if (sortBy === 'title') {
        comparison = a.titreFr.localeCompare(b.titreFr);
      } else if (sortBy === 'beneficiaires') {
        comparison = (a.beneficiaires || 0) - (b.beneficiaires || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredProjets(filtered);
    setCurrentPage(1);
  }, [projets, selectedCategory, searchTerm, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProjets.length / itemsPerPage);
  const paginatedProjets = filteredProjets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const getCategoryColor = (domaineFr: string, domaineEn: string): CategoryColor => {
    const category = getCategoryForProjet(domaineFr, domaineEn);
    return categoryColors[category];
  };

  const domainesList = [
    { id: 'all', label: t.filters.all },
    { id: 'environnement' as CategoryType, label: t.filters.environnement },
    { id: 'social' as CategoryType, label: t.filters.social },
    { id: 'economique' as CategoryType, label: t.filters.economique },
    { id: 'education' as CategoryType, label: t.filters.education },
    { id: 'agriculture' as CategoryType, label: t.filters.agriculture },
    { id: 'eau' as CategoryType, label: t.filters.eau },
    { id: 'sante' as CategoryType, label: t.filters.sante },
    { id: 'infrastructure' as CategoryType, label: t.filters.infrastructure },
    { id: 'gouvernance' as CategoryType, label: t.filters.gouvernance }
  ];

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('date');
    setSortOrder('desc');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-olive-nature to-forest-deep flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-sun-gold animate-spin mx-auto mb-4" />
          <p className="text-warm-white">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-olive-nature to-forest-deep flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-text-dark text-xl font-medium mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sun-gold text-forest-deep font-medium rounded-lg hover:bg-soft-sun transition-colors"
          >
            <FaArrowLeft />
            {t.backToHome}
          </Link>
        </div>
      </div>
    );
  }

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
            {t.backToHome}
          </Link>
        </div>

        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-warm-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-warm-white/30 mb-6">
            <span className="w-2 h-2 bg-sun-gold rounded-full mr-2 animate-pulse" />
            <span className="text-warm-white text-sm font-bold tracking-wider">
              {t.badge}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white mb-6 drop-shadow-lg">
            {t.title}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-sun-gold to-soft-sun bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-sun-gold/30 -z-0 blur-md"></span>
            </span>
          </h1>
          <p className="text-xl text-warm-white/90 max-w-3xl mx-auto drop-shadow">
            {t.subtitle}
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-border-light">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-sun-gold focus:border-transparent bg-ultra-light/30"
              />
            </div>

            {/* Filtres rapides */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-sun-gold bg-white"
              >
                <option value="date">Date</option>
                <option value="title">Titre</option>
                <option value="beneficiaires">Bénéficiaires</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-border-light rounded-xl hover:bg-ultra-light transition-colors"
                title={sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
              >
                {sortOrder === 'asc' ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-sun-gold/10 text-forest-deep rounded-xl hover:bg-sun-gold hover:text-white transition-colors flex items-center gap-2"
              >
                <FaFilter />
                <span className="hidden sm:inline">Filtres</span>
              </button>
            </div>
          </div>

          {/* Filtres détaillés */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-border-light">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-forest-deep">Catégories :</span>
                {domainesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? cat.id === 'all'
                          ? 'bg-gradient-to-r from-sun-gold to-soft-sun text-forest-deep shadow-lg'
                          : `bg-gradient-to-r ${categoryColors[cat.id as CategoryType]?.bg} text-white shadow-lg`
                        : 'bg-ultra-light text-text-secondary hover:bg-light-moss/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
                
                {(selectedCategory !== 'all' || searchTerm) && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  >
                    ✕ {t.resetFilters}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Résultats */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-warm-white/80">
            <span className="font-semibold text-warm-white">{filteredProjets.length}</span> {t.results}
          </p>
        </div>

        {/* Grille des projets */}
        {paginatedProjets.length === 0 ? (
          <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border-light">
            <div className="w-24 h-24 bg-sun-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-sun-gold" />
            </div>
            <p className="text-text-secondary text-lg">{t.noProjects}</p>
            {(selectedCategory !== 'all' || searchTerm) && (
              <button
                onClick={resetFilters}
                className="mt-4 px-6 py-2 bg-sun-gold text-forest-deep font-medium rounded-lg hover:bg-soft-sun transition-colors"
              >
                {t.resetFilters}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProjets.map((projet) => {
                const colors = getCategoryColor(projet.domaineFr, projet.domaineEn);
                const icon = getIconForProjet(projet.domaineFr, projet.domaineEn);
                const status = statusConfig[projet.statut] || statusConfig.en_cours;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={projet.id}
                    className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-border-light"
                    onMouseEnter={() => setHoveredId(projet.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10`} />
                      {projet.imageUrl ? (
                        <img
                          src={`https://web-production-03b53.up.railway.app/${projet.imageUrl}`}
                          alt={language === 'fr' ? projet.titreFr : projet.titreEn}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-ultra-light to-warm-white flex items-center justify-center">
                          <div className="text-text-secondary text-5xl">{icon}</div>
                        </div>
                      )}
                      
                      {/* Badge catégorie */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className={`inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold ${colors.text} shadow-lg border ${colors.border}`}>
                          <span className="mr-1.5 text-sm">{icon}</span>
                          {language === 'fr' ? projet.domaineFr : projet.domaineEn}
                        </span>
                      </div>

                      {/* Badge statut */}
                      <div className="absolute top-4 right-4 z-20">
                        <span className={`inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold ${status.color} shadow-lg`}>
                          <StatusIcon className="w-3 h-3 mr-1.5" />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-forest-deep mb-3 group-hover:text-olive-nature transition-colors line-clamp-2">
                        {language === 'fr' ? projet.titreFr : projet.titreEn}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        {language === 'fr' ? projet.descriptionFr : projet.descriptionEn}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-xs text-text-secondary">
                          <FaMapMarkerAlt className="w-3 h-3 mr-1.5 text-olive-nature" />
                          <span className="truncate">{projet.region?.nom || t.national}</span>
                        </div>
                        <div className="flex items-center text-xs text-text-secondary">
                          <FaUsers className="w-3 h-3 mr-1.5 text-water-blue" />
                          <span>{formatBeneficiaires(projet.beneficiaires)} {t.beneficiaries}</span>
                        </div>
                        <div className="flex items-center text-xs text-text-secondary">
                          <FaCalendarAlt className="w-3 h-3 mr-1.5 text-sun-gold" />
                          <span>{new Date(projet.dateDebut).getFullYear()}</span>
                        </div>
                        <div className="flex items-center text-xs text-text-secondary">
                          <FaClock className="w-3 h-3 mr-1.5 text-earth-brown" />
                          <span>{projet.dateFin ? new Date(projet.dateFin).getFullYear() : t.ongoing}</span>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 border-2 border-warm-white/30"
                >
                  <FaArrowLeft className="w-5 h-5 text-warm-white" />
                </button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-full font-medium transition-all hover:scale-110 ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-sun-gold to-soft-sun text-forest-deep shadow-lg border-2 border-white'
                            : 'bg-white/10 backdrop-blur-sm text-warm-white hover:bg-white/20 border-2 border-warm-white/30'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 border-2 border-warm-white/30"
                >
                  <FaArrowRight className="w-5 h-5 text-warm-white" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Statistiques globales */}
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-warm-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h4 className="text-2xl font-bold text-warm-white mb-2">
                {t.globalImpact} {new Date().getFullYear()}
              </h4>
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-3xl font-bold text-sun-gold">{projets.length}</p>
                  <p className="text-sm text-warm-white/80">{t.activeProjects}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-sky-soft">{regionsUniques}</p>
                  <p className="text-sm text-warm-white/80">{t.coveredRegions}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-soft-sun">
                    {formatBeneficiaires(totalBeneficiaires)}
                  </p>
                  <p className="text-sm text-warm-white/80">{t.totalBeneficiaries}</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-warm-white">{t.globalProgress}</span>
                <span className="text-sm font-bold text-sun-gold">
                  {projets.length > 0 ? Math.round((projetsEnCours / projets.length) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-warm-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sun-gold to-soft-sun rounded-full transition-all duration-1000"
                  style={{ width: `${projets.length > 0 ? (projetsEnCours / projets.length) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-warm-white/60 mt-2">
                {projetsEnCours} {language === 'fr' ? 'projet' : 'project'}{projetsEnCours > 1 ? 's' : ''} {language === 'fr' ? 'en cours sur' : 'in progress out of'} {projets.length}
              </p>
            </div>
          </div>
        </div>
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
    </div>
  );
}