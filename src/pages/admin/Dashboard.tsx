// src/pages/admin/Dashboard.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStats } from '../../contexts/StatsContext';
import { useEffect, useState, useCallback, useRef } from 'react';
import projetService from '../../services/projetService';
import actualiteService from '../../services/actualiteService';
import partenaireService from '../../services/partenaireService';
import temoignageService from '../../services/temoignageService';
import missionService from '../../services/missionService';
import contactInfoService from '../../services/contactInfoService';
import regionService from '../../services/regionService';
import personnelService from '../../services/personnelService';
import userService from '../../services/userService';

// Import des icônes Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHardHat,
  faHandshake,
  faNewspaper,
  faComments,
  faUsers,
  faUsersBetweenLines,
  faBullseye,
  faGlobe,
  faChartLine,
  faCheck,
  faStar,
  faBell,
  faClock,
  faArrowRight,
  faCalendarAlt,
  faSync,
  faChartPie,
  faChartBar,
  faTimeline,
  faMapMarkerAlt,
  faRocket,
  faArrowUp,
  faArrowDown,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';

// Import des composants Recharts
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

interface ActivityItem {
  action: string;
  time: string;
  user: string;
  type: string;
}

interface ProjetStatut {
  name: string;
  value: number;
  color: string;
}

interface ProjetMensuel {
  month: string;
  projets: number;
  beneficiaires: number;
  monthIndex: number;
  year: number;
}

interface RegionData {
  region: string;
  projets: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ProjetStatut;
  }>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, updateStats } = useStats();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Données pour les graphiques
  const [projetStats, setProjetStats] = useState<ProjetStatut[]>([]);
  const [evolutionData, setEvolutionData] = useState<ProjetMensuel[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [previousMonthStats, setPreviousMonthStats] = useState({
    projets: 0,
    partenaires: 0,
    actualites: 0,
    temoignages: 0,
    personnel: 0,
    beneficiaires: 0,
    missions: 0,
    regions: 0
  });
  
  const initialFetchDone = useRef(false);
  const isMounted = useRef(true);

  // Couleurs VINA pour les graphiques
  const COLORS = {
    primary: '#6B7333',      // olive-nature
    secondary: '#E0B93B',    // sun-gold
    tertiary: '#2C7FB8',     // water-blue
    warning: '#F3D77A',      // soft-sun
    danger: '#6B4F3A',       // earth-brown
    info: '#87CFEA',          // sky-soft
    purple: '#8A9450',        // light-moss
    pink: '#4E5523',          // forest-deep
    gray: '#6B7280',          // text-secondary
    success: '#6B7333',       // olive-nature
    indigo: '#2C7FB8'         // water-blue
  };

  const CHART_COLORS = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.tertiary,
    COLORS.warning,
    COLORS.danger,
    COLORS.info,
    COLORS.purple,
    COLORS.pink
  ];

  // Fonction pour calculer la tendance
  const calculateTrend = (current: number, previous: number): { value: number; direction: 'up' | 'down' | 'stable' } => {
    if (previous === 0) return { value: 0, direction: 'stable' };
    const percentChange = ((current - previous) / previous) * 100;
    
    if (percentChange > 0) {
      return { value: Math.round(percentChange), direction: 'up' };
    } else if (percentChange < 0) {
      return { value: Math.round(Math.abs(percentChange)), direction: 'down' };
    } else {
      return { value: 0, direction: 'stable' };
    }
  };

  const fetchDashboardData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      }
      
      setError(null);

      console.log('Fetching dashboard data...');

      const [
        projets,
        actualites,
        partenaires,
        temoignages,
        missions,
        contacts,
        regions,
        personnel,
        users
      ] = await Promise.all([
        projetService.getAllProjets().catch(err => {
          console.error('Erreur projets:', err);
          return [];
        }),
        actualiteService.getAllActualites().catch(err => {
          console.error('Erreur actualites:', err);
          return [];
        }),
        partenaireService.getAllPartenaires().catch(err => {
          console.error('Erreur partenaires:', err);
          return [];
        }),
        temoignageService.getAllTemoignages().catch(err => {
          console.error('Erreur temoignages:', err);
          return [];
        }),
        missionService.getAllMissions().catch(err => {
          console.error('Erreur missions:', err);
          return [];
        }),
        contactInfoService.getAllContactInfos().catch(err => {
          console.error('Erreur contacts:', err);
          return [];
        }),
        regionService.getAllRegions().catch(err => {
          console.error('Erreur regions:', err);
          return [];
        }),
        personnelService.getAllPersonnel().catch(err => {
          console.error('Erreur personnel:', err);
          return [];
        }),
        userService.getAllUsers().catch(err => {
          console.error('Erreur users:', err);
          return [];
        })
      ]);

      if (!isMounted.current) return;

      // Calculer les statistiques actuelles
      const totalBeneficiaires = projets.reduce((acc, projet) => 
        acc + (projet.beneficiaires || 0), 0
      );

      const projetsAvecRegion = projets.filter(projet => projet.region).length;

      // Mettre à jour les statistiques
      updateStats({
        totalProjets: projets.length,
        totalActualites: actualites.length,
        totalTemoignages: temoignages.length,
        totalPartenaires: partenaires.length,
        totalUtilisateurs: users.length,
        totalContacts: contacts.length,
        totalMissions: missions.length,
        totalBeneficiaires,
        projetsAvecRegion,
        totalRegions: regions.length,
        totalPersonnel: personnel.length,
      });

      // 1. Répartition par statut (données réelles)
      const statutCount = {
        en_cours: projets.filter(p => p.statut === 'en_cours').length,
        termine: projets.filter(p => p.statut === 'termine').length,
        a_venir: projets.filter(p => p.statut === 'a_venir').length,
        suspendu: projets.filter(p => p.statut === 'suspendu').length
      };

      setProjetStats([
        { name: 'En cours', value: statutCount.en_cours, color: COLORS.primary },
        { name: 'Terminés', value: statutCount.termine, color: COLORS.success },
        { name: 'À venir', value: statutCount.a_venir, color: COLORS.warning },
        { name: 'Suspendus', value: statutCount.suspendu, color: COLORS.danger }
      ].filter(item => item.value > 0));

      // 2. Évolution mensuelle
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 5);
      
      const months: ProjetMensuel[] = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(now.getMonth() - 5 + i);
        months.push({
          month: date.toLocaleDateString('fr-FR', { month: 'short' }),
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          projets: 0,
          beneficiaires: 0
        });
      }

      projets.forEach(projet => {
        const createdAt = new Date(projet.createdAt);
        if (createdAt >= sixMonthsAgo) {
          const monthIndex = createdAt.getMonth();
          const year = createdAt.getFullYear();
          
          const monthData = months.find(m => 
            m.monthIndex === monthIndex && m.year === year
          );
          
          if (monthData) {
            monthData.projets += 1;
            monthData.beneficiaires += projet.beneficiaires || 0;
          }
        }
      });

      setEvolutionData(months);

      // 3. Top régions
      const regionCount = projets.reduce((acc: {[key: string]: number}, projet) => {
        const regionName = projet.region?.nom || 'Non assignée';
        acc[regionName] = (acc[regionName] || 0) + 1;
        return acc;
      }, {});

      const topRegions = Object.entries(regionCount)
        .map(([region, count]) => ({ region, projets: count }))
        .sort((a, b) => b.projets - a.projets)
        .slice(0, 5);

      setRegionData(topRegions);

      // 4. Calculer les stats du mois précédent
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      
      const projetsLastMonth = projets.filter(p => {
        const date = new Date(p.createdAt);
        return date.getMonth() === previousMonth.getMonth() && 
               date.getFullYear() === previousMonth.getFullYear();
      }).length;

      const actualitesLastMonth = actualites.filter(a => {
        const date = new Date(a.datePublication);
        return date.getMonth() === previousMonth.getMonth() && 
               date.getFullYear() === previousMonth.getFullYear();
      }).length;

      const partenairesLastMonth = partenaires.filter(p => {
        const date = new Date(p.createdAt);
        return date.getMonth() === previousMonth.getMonth() && 
               date.getFullYear() === previousMonth.getFullYear();
      }).length;

      const temoignagesLastMonth = temoignages.filter(t => {
        const date = new Date(t.createdAt);
        return date.getMonth() === previousMonth.getMonth() && 
               date.getFullYear() === previousMonth.getFullYear();
      }).length;

      setPreviousMonthStats({
        projets: projetsLastMonth,
        partenaires: partenairesLastMonth,
        actualites: actualitesLastMonth,
        temoignages: temoignagesLastMonth,
        personnel: 0,
        beneficiaires: 0,
        missions: 0,
        regions: 0
      });

      // Activités récentes
      const activities: ActivityItem[] = [];
      
      projets
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 2)
        .forEach(projet => {
          activities.push({
            action: `Projet "${projet.titreFr}" ${projet.statut === 'termine' ? 'terminé' : 'modifié'}`,
            time: new Date(projet.updatedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            }),
            user: 'Système',
            type: 'projet'
          });
        });

      actualites
        .sort((a, b) => new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime())
        .slice(0, 2)
        .forEach(actu => {
          activities.push({
            action: `Actualité "${actu.titreFr}" publiée`,
            time: new Date(actu.datePublication).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            }),
            user: 'Système',
            type: 'actualite'
          });
        });

      temoignages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2)
        .forEach(temoignage => {
          activities.push({
            action: `Témoignage de ${temoignage.auteurFr}`,
            time: new Date(temoignage.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            }),
            user: 'Système',
            type: 'temoignage'
          });
        });

      const sortedActivities = activities
        .sort((a, b) => {
          if (a.time === 'Récemment') return -1;
          if (b.time === 'Récemment') return 1;
          return b.time.localeCompare(a.time);
        })
        .slice(0, 5);

      setRecentActivities(sortedActivities);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      if (isMounted.current) {
        setError('Erreur lors du chargement des données');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [updateStats]);

  useEffect(() => {
    isMounted.current = true;
    
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchDashboardData(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchDashboardData(true);
    }
  };

  // Custom tooltip pour le pie chart
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = projetStats.reduce((acc, item) => acc + item.value, 0);
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
      
      return (
        <div className="bg-warm-white p-3 rounded-lg shadow-lg border border-border-light">
          <p className="font-medium text-forest-deep">{data.name}</p>
          <p className="text-sm text-text-secondary">
            Nombre: <span className="font-bold text-olive-nature">{data.value}</span>
          </p>
          <p className="text-xs text-text-secondary">
            {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Fonction pour formater les labels du pie chart
  const renderPieLabel = (entry: any) => {
    const { name, percent } = entry;
    const safePercent = percent || 0;
    const percentage = (safePercent * 100).toFixed(0);
    return `${name} ${percentage}%`;
  };

  // Calculer les tendances pour chaque carte
  const getTrendForCard = (current: number, previous: number) => {
    const trend = calculateTrend(current, previous);
    
    if (trend.direction === 'up') {
      return {
        text: `+${trend.value}%`,
        color: 'text-olive-nature',
        bg: 'bg-olive-nature/10',
        icon: faArrowUp
      };
    } else if (trend.direction === 'down') {
      return {
        text: `-${trend.value}%`,
        color: 'text-earth-brown',
        bg: 'bg-earth-brown/10',
        icon: faArrowDown
      };
    } else {
      return {
        text: '0%',
        color: 'text-text-secondary',
        bg: 'bg-ultra-light',
        icon: faMinus
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-border-light rounded-full"></div>
            <div className="w-24 h-24 border-4 border-olive-nature border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-forest-deep mt-4 font-medium">Chargement du tableau de bord...</p>
          <p className="text-text-secondary text-sm mt-2">Préparation de vos données</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-warm-white p-8 rounded-2xl shadow-xl border border-border-light">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-forest-deep text-xl font-medium mb-2">Une erreur est survenue</p>
          <p className="text-text-secondary mb-6">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
          >
            <FontAwesomeIcon icon={faSync} className="mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* En-tête avec bienvenue */}
      <div className="bg-gradient-to-r from-olive-nature to-forest-deep rounded-2xl p-8 text-warm-white shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bonjour, {user?.nom} <span className="wave">👋</span>
            </h1>
            <p className="text-warm-white/90 text-lg">
              Voici un résumé de votre activité sur VINA
            </p>
            <div className="flex items-center gap-2 mt-4 text-warm-white/80">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-warm-white/20 backdrop-blur-sm rounded-xl hover:bg-warm-white/30 transition-all duration-300 disabled:opacity-50 border border-warm-white/30"
          >
            <FontAwesomeIcon 
              icon={faSync} 
              className={refreshing ? 'animate-spin' : ''} 
            />
            <span className="text-sm font-medium">
              {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards avec couleurs VINA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Carte Projets */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border-light">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Projets</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-forest-deep">{stats.totalProjets}</p>
                  {(() => {
                    const trend = getTrendForCard(stats.totalProjets, previousMonthStats.projets);
                    return (
                      <span className={`text-xs font-medium ${trend.color} ${trend.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
                        <FontAwesomeIcon icon={trend.icon} className="text-xs" />
                        {trend.text}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-text-secondary mt-2">{stats.projetsAvecRegion} avec région</p>
              </div>
              <div className="bg-gradient-to-br from-olive-nature to-forest-deep w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faHardHat} className="text-warm-white text-2xl" />
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-warm-white to-transparent group-hover:via-olive-nature/50 transition-all"></div>
        </div>

        {/* Carte Partenaires */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border-light">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Partenaires</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-forest-deep">{stats.totalPartenaires}</p>
                  {(() => {
                    const trend = getTrendForCard(stats.totalPartenaires, previousMonthStats.partenaires);
                    return (
                      <span className={`text-xs font-medium ${trend.color} ${trend.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
                        <FontAwesomeIcon icon={trend.icon} className="text-xs" />
                        {trend.text}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-text-secondary mt-2">Collaborateurs</p>
              </div>
              <div className="bg-gradient-to-br from-water-blue to-sky-soft w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faHandshake} className="text-warm-white text-2xl" />
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-warm-white to-transparent group-hover:via-water-blue/50 transition-all"></div>
        </div>

        {/* Carte Actualités */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border-light">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Actualités</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-forest-deep">{stats.totalActualites}</p>
                  {(() => {
                    const trend = getTrendForCard(stats.totalActualites, previousMonthStats.actualites);
                    return (
                      <span className={`text-xs font-medium ${trend.color} ${trend.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
                        <FontAwesomeIcon icon={trend.icon} className="text-xs" />
                        {trend.text}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-text-secondary mt-2">Publications</p>
              </div>
              <div className="bg-gradient-to-br from-sun-gold to-soft-sun w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faNewspaper} className="text-forest-deep text-2xl" />
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-warm-white to-transparent group-hover:via-sun-gold/50 transition-all"></div>
        </div>

        {/* Carte Témoignages */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border-light">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Témoignages</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-forest-deep">{stats.totalTemoignages}</p>
                  {(() => {
                    const trend = getTrendForCard(stats.totalTemoignages, previousMonthStats.temoignages);
                    return (
                      <span className={`text-xs font-medium ${trend.color} ${trend.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
                        <FontAwesomeIcon icon={trend.icon} className="text-xs" />
                        {trend.text}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-text-secondary mt-2">Avis</p>
              </div>
              <div className="bg-gradient-to-br from-earth-brown to-forest-deep w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faComments} className="text-warm-white text-2xl" />
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-warm-white to-transparent group-hover:via-earth-brown/50 transition-all"></div>
        </div>

        {/* Carte Personnel */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border-light">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Personnel</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-forest-deep">{stats.totalPersonnel}</p>
                  {(() => {
                    const trend = getTrendForCard(stats.totalPersonnel, previousMonthStats.personnel);
                    return (
                      <span className={`text-xs font-medium ${trend.color} ${trend.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
                        <FontAwesomeIcon icon={trend.icon} className="text-xs" />
                        {trend.text}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-text-secondary mt-2">Équipe</p>
              </div>
              <div className="bg-gradient-to-br from-light-moss to-olive-nature w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faUsers} className="text-warm-white text-2xl" />
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-warm-white to-transparent group-hover:via-light-moss/50 transition-all"></div>
        </div>

        {/* Carte Bénéficiaires */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border-light">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Bénéficiaires</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-forest-deep">{stats.totalBeneficiaires.toLocaleString()}</p>
                  {(() => {
                    const trend = getTrendForCard(stats.totalBeneficiaires, previousMonthStats.beneficiaires);
                    return (
                      <span className={`text-xs font-medium ${trend.color} ${trend.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
                        <FontAwesomeIcon icon={trend.icon} className="text-xs" />
                        {trend.text}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-text-secondary mt-2">Personnes impactées</p>
              </div>
              <div className="bg-gradient-to-br from-sun-gold to-soft-sun w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faUsersBetweenLines} className="text-forest-deep text-2xl" />
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-warm-white to-transparent group-hover:via-sun-gold/50 transition-all"></div>
        </div>

        {/* Carte Missions */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border-light">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Missions</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-forest-deep">{stats.totalMissions}</p>
                  {(() => {
                    const trend = getTrendForCard(stats.totalMissions, previousMonthStats.missions);
                    return (
                      <span className={`text-xs font-medium ${trend.color} ${trend.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
                        <FontAwesomeIcon icon={trend.icon} className="text-xs" />
                        {trend.text}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-text-secondary mt-2">Objectifs</p>
              </div>
              <div className="bg-gradient-to-br from-water-blue to-sky-soft w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faBullseye} className="text-warm-white text-2xl" />
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-warm-white to-transparent group-hover:via-water-blue/50 transition-all"></div>
        </div>

        {/* Carte Régions */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border-light">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Régions</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-forest-deep">{stats.totalRegions}</p>
                  {(() => {
                    const trend = getTrendForCard(stats.totalRegions, previousMonthStats.regions);
                    return (
                      <span className={`text-xs font-medium ${trend.color} ${trend.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
                        <FontAwesomeIcon icon={trend.icon} className="text-xs" />
                        {trend.text}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-text-secondary mt-2">Zones d'intervention</p>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faGlobe} className="text-warm-white text-2xl" />
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-warm-white to-transparent group-hover:via-teal-200 transition-all"></div>
        </div>
      </div>

      {/* Graphiques principaux avec couleurs VINA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en camembert - Répartition des projets */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-border-light">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-forest-deep flex items-center gap-2">
                <FontAwesomeIcon icon={faChartPie} className="text-olive-nature" />
                Répartition des projets
              </h3>
              <p className="text-sm text-text-secondary">Par statut d'avancement</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary">Total: {stats.totalProjets}</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projetStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {projetStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-text-secondary">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique en barres - Évolution mensuelle */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-border-light">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-forest-deep flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} className="text-water-blue" />
                Évolution mensuelle
              </h3>
              <p className="text-sm text-text-secondary">Projets créés par mois</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F2F2E9', 
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="projets" fill={COLORS.primary} name="Nouveaux projets" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique en barres horizontales - Top régions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-border-light">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-forest-deep flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sun-gold" />
                Top 5 régions
              </h3>
              <p className="text-sm text-text-secondary">Nombre de projets par région</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis type="category" dataKey="region" width={100} stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F2F2E9', 
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="projets" fill={COLORS.tertiary} radius={[0, 4, 4, 0]}>
                  {regionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique en courbes - Tendances */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-border-light">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-forest-deep flex items-center gap-2">
                <FontAwesomeIcon icon={faTimeline} className="text-sun-gold" />
                Tendances d'activité
              </h3>
              <p className="text-sm text-text-secondary">Évolution des bénéficiaires</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorBeneficiaires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F2F2E9', 
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="beneficiaires" 
                  stroke={COLORS.secondary} 
                  fillOpacity={1} 
                  fill="url(#colorBeneficiaires)" 
                  name="Bénéficiaires"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Actions rapides et activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions rapides */}
        <div className="lg:col-span-1 bg-gradient-to-br from-olive-nature/5 to-water-blue/5 rounded-2xl shadow-lg p-6 border border-border-light">
          <h3 className="text-lg font-semibold text-forest-deep mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faRocket} className="text-olive-nature" />
            Actions rapides
          </h3>
          <div className="space-y-3">
            <Link
              to="/admin/projets"
              className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all group border border-border-light"
            >
              <div className="w-10 h-10 bg-olive-nature/10 rounded-lg flex items-center justify-center group-hover:bg-olive-nature transition-colors">
                <FontAwesomeIcon icon={faHardHat} className="text-olive-nature group-hover:text-warm-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-forest-deep">Nouveau projet</p>
                <p className="text-xs text-text-secondary">Créer un projet</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-text-secondary group-hover:text-olive-nature transition-colors" />
            </Link>
            <Link
              to="/admin/actualites"
              className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all group border border-border-light"
            >
              <div className="w-10 h-10 bg-water-blue/10 rounded-lg flex items-center justify-center group-hover:bg-water-blue transition-colors">
                <FontAwesomeIcon icon={faNewspaper} className="text-water-blue group-hover:text-warm-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-forest-deep">Nouvelle actualité</p>
                <p className="text-xs text-text-secondary">Publier une actualité</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-text-secondary group-hover:text-water-blue transition-colors" />
            </Link>
            <Link
              to="/admin/temoignages"
              className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all group border border-border-light"
            >
              <div className="w-10 h-10 bg-sun-gold/10 rounded-lg flex items-center justify-center group-hover:bg-sun-gold transition-colors">
                <FontAwesomeIcon icon={faComments} className="text-sun-gold group-hover:text-forest-deep transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-forest-deep">Nouveau témoignage</p>
                <p className="text-xs text-text-secondary">Ajouter un témoignage</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-text-secondary group-hover:text-sun-gold transition-colors" />
            </Link>
            <Link
              to="/admin/personnel"
              className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all group border border-border-light"
            >
              <div className="w-10 h-10 bg-earth-brown/10 rounded-lg flex items-center justify-center group-hover:bg-earth-brown transition-colors">
                <FontAwesomeIcon icon={faUsers} className="text-earth-brown group-hover:text-warm-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-forest-deep">Ajouter membre</p>
                <p className="text-xs text-text-secondary">Nouveau membre d'équipe</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-text-secondary group-hover:text-earth-brown transition-colors" />
            </Link>
          </div>
        </div>

        {/* Activité récente */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-border-light">
          <h3 className="text-lg font-semibold text-forest-deep mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-text-secondary" />
            Activité récente
          </h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-ultra-light rounded-xl hover:bg-warm-white transition border border-border-light">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${activity.type === 'projet' ? 'bg-olive-nature/10' : 
                        activity.type === 'actualite' ? 'bg-water-blue/10' : 
                        activity.type === 'temoignage' ? 'bg-sun-gold/10' : 'bg-earth-brown/10'}`}
                    >
                      <FontAwesomeIcon 
                        icon={
                          activity.type === 'projet' ? faHardHat :
                          activity.type === 'actualite' ? faNewspaper :
                          activity.type === 'temoignage' ? faComments :
                          faHandshake
                        } 
                        className={
                          activity.type === 'projet' ? 'text-olive-nature' :
                          activity.type === 'actualite' ? 'text-water-blue' :
                          activity.type === 'temoignage' ? 'text-sun-gold' :
                          'text-earth-brown'
                        }
                      />
                    </div>
                    <div>
                      <p className="font-medium text-forest-deep">{activity.action}</p>
                      <p className="text-sm text-text-secondary">par {activity.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-secondary bg-white px-3 py-1 rounded-full shadow-sm border border-border-light">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faClock} className="text-4xl text-text-secondary mb-3" />
              <p className="text-text-secondary">Aucune activité récente</p>
            </div>
          )}
        </div>
      </div>

      {/* Mini cartes de résumé */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-olive-nature/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="text-olive-nature" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Projets en cours</p>
              <p className="text-lg font-bold text-forest-deep">
                {projetStats.find(s => s.name === 'En cours')?.value || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-water-blue/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faCheck} className="text-water-blue" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Projets terminés</p>
              <p className="text-lg font-bold text-forest-deep">
                {projetStats.find(s => s.name === 'Terminés')?.value || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sun-gold/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faStar} className="text-sun-gold" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Témoignages actifs</p>
              <p className="text-lg font-bold text-forest-deep">{stats.totalTemoignages}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-earth-brown/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faBell} className="text-earth-brown" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">À venir</p>
              <p className="text-lg font-bold text-forest-deep">
                {projetStats.find(s => s.name === 'À venir')?.value || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}