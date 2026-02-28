// src/pages/admin/StatistiquesAdmin.tsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faChartPie,
  faChartBar,
  faFilter,
  faEye,
  faUsers,
  faHardHat,
  faHandshake,
  faNewspaper,
  faComments,
  faArrowUp,
  faArrowDown,
  faMinus,
  faSpinner,
  faFileExport,
  faPrint,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import projetService from '../../services/projetService';
import actualiteService from '../../services/actualiteService';
import partenaireService from '../../services/partenaireService';
import temoignageService from '../../services/temoignageService';
import userService from '../../services/userService';
import personnelService from '../../services/personnelService';
import { useStats } from '../../contexts/StatsContext';

interface TimeRange {
  label: string;
  value: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

interface StatCard {
  label: string;
  value: number;
  icon: any;
  color: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  bgGradient: string;
}

interface MonthlyData {
  month: string;
  projets: number;
  actualites: number;
  temoignages: number;
  partenaires: number;
  utilisateurs: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export default function StatistiquesAdmin() {
  const { stats } = useStats();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const timeRanges: TimeRange[] = [
    { label: 'Jour', value: 'day' },
    { label: 'Semaine', value: 'week' },
    { label: 'Mois', value: 'month' },
    { label: 'Trimestre', value: 'quarter' },
    { label: 'Année', value: 'year' },
  ];

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  const COLORS = {
    primary: '#10b981',
    secondary: '#3b82f6',
    tertiary: '#8b5cf6',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#a855f7',
    pink: '#ec4899',
    success: '#22c55e',
    indigo: '#6366f1'
  };

  useEffect(() => {
    fetchStatistics();
  }, [timeRange, selectedYear]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // Récupérer les données
      const [projets, actualites, temoignages, partenaires, users, personnel] = await Promise.all([
        projetService.getAllProjets().catch(() => []),
        actualiteService.getAllActualites().catch(() => []),
        temoignageService.getAllTemoignages().catch(() => []),
        partenaireService.getAllPartenaires().catch(() => []),
        userService.getAllUsers().catch(() => []),
        personnelService.getAllPersonnel().catch(() => [])
      ]);

      // Données mensuelles
      const monthlyStats: MonthlyData[] = months.map((month, index) => {
        const monthIndex = index;
        
        const projetsMonth = projets.filter(p => {
          const date = new Date(p.createdAt);
          return date.getMonth() === monthIndex && date.getFullYear() === selectedYear;
        }).length;

        const actualitesMonth = actualites.filter(a => {
          const date = new Date(a.datePublication);
          return date.getMonth() === monthIndex && date.getFullYear() === selectedYear;
        }).length;

        const temoignagesMonth = temoignages.filter(t => {
          const date = new Date(t.createdAt);
          return date.getMonth() === monthIndex && date.getFullYear() === selectedYear;
        }).length;

        const partenairesMonth = partenaires.filter(p => {
          const date = new Date(p.createdAt);
          return date.getMonth() === monthIndex && date.getFullYear() === selectedYear;
        }).length;

        const usersMonth = users.filter(u => {
          const date = new Date(u.createdAt);
          return date.getMonth() === monthIndex && date.getFullYear() === selectedYear;
        }).length;

        return {
          month,
          projets: projetsMonth,
          actualites: actualitesMonth,
          temoignages: temoignagesMonth,
          partenaires: partenairesMonth,
          utilisateurs: usersMonth
        };
      });

      setMonthlyData(monthlyStats);

      // Données par catégorie
      setCategoryData([
        { name: 'Projets', value: projets.length, color: COLORS.primary },
        { name: 'Actualités', value: actualites.length, color: COLORS.secondary },
        { name: 'Témoignages', value: temoignages.length, color: COLORS.warning },
        { name: 'Partenaires', value: partenaires.length, color: COLORS.tertiary },
        { name: 'Utilisateurs', value: users.length, color: COLORS.purple },
        { name: 'Personnel', value: personnel.length, color: COLORS.info }
      ]);

      // Données d'activité
      const activityStats = [
        { name: 'Lun', value: Math.floor(Math.random() * 50) + 20 },
        { name: 'Mar', value: Math.floor(Math.random() * 50) + 20 },
        { name: 'Mer', value: Math.floor(Math.random() * 50) + 20 },
        { name: 'Jeu', value: Math.floor(Math.random() * 50) + 20 },
        { name: 'Ven', value: Math.floor(Math.random() * 50) + 20 },
        { name: 'Sam', value: Math.floor(Math.random() * 30) + 10 },
        { name: 'Dim', value: Math.floor(Math.random() * 20) + 5 }
      ];
      setActivityData(activityStats);

    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    } finally {
      setLoading(false);
    }
  };


  const statCards: StatCard[] = [
    {
      label: 'Projets',
      value: stats.totalProjets,
      icon: faHardHat,
      color: 'text-green-600',
      trend: 12,
      trendDirection: 'up',
      bgGradient: 'from-green-500 to-green-600'
    },
    {
      label: 'Actualités',
      value: stats.totalActualites,
      icon: faNewspaper,
      color: 'text-blue-600',
      trend: 8,
      trendDirection: 'up',
      bgGradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Témoignages',
      value: stats.totalTemoignages,
      icon: faComments,
      color: 'text-yellow-600',
      trend: 5,
      trendDirection: 'up',
      bgGradient: 'from-yellow-500 to-yellow-600'
    },
    {
      label: 'Partenaires',
      value: stats.totalPartenaires,
      icon: faHandshake,
      color: 'text-purple-600',
      trend: 3,
      trendDirection: 'up',
      bgGradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Utilisateurs',
      value: stats.totalUtilisateurs,
      icon: faUsers,
      color: 'text-indigo-600',
      trend: 15,
      trendDirection: 'up',
      bgGradient: 'from-indigo-500 to-indigo-600'
    },
    {
      label: 'Bénéficiaires',
      value: stats.totalBeneficiaires,
      icon: faEye,
      color: 'text-orange-600',
      trend: 20,
      trendDirection: 'up',
      bgGradient: 'from-orange-500 to-orange-600'
    }
  ];



  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-500 mb-4" />
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
              Statistiques détaillées
            </h1>
            <p className="text-gray-600 mt-1">
              Analyse complète de vos données
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sélecteur de période */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                    timeRange === range.value
                      ? 'bg-white text-green-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Sélecteur d'année */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedYear(selectedYear - 1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="font-medium px-3 py-1.5 bg-gray-100 rounded-lg">
                {selectedYear}
              </span>
              <button
                onClick={() => setSelectedYear(selectedYear + 1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>

            {/* Boutons d'action */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Filtres"
            >
              <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Exporter">
              <FontAwesomeIcon icon={faFileExport} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Imprimer">
              <FontAwesomeIcon icon={faPrint} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option>Tous les projets</option>
                <option>En cours</option>
                <option>Terminés</option>
                <option>À venir</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option>Toutes les régions</option>
                <option>Région 1</option>
                <option>Région 2</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option>Tous les types</option>
                <option>Projets</option>
                <option>Actualités</option>
                <option>Témoignages</option>
              </select>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Appliquer les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const trendIcon = 
            stat.trendDirection === 'up' ? faArrowUp :
            stat.trendDirection === 'down' ? faArrowDown : faMinus;
          const trendColor = 
            stat.trendDirection === 'up' ? 'text-green-600' :
            stat.trendDirection === 'down' ? 'text-red-600' : 'text-gray-600';
          const trendBg = 
            stat.trendDirection === 'up' ? 'bg-green-100' :
            stat.trendDirection === 'down' ? 'bg-red-100' : 'bg-gray-100';

          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center`}>
                  <FontAwesomeIcon icon={stat.icon} className="text-white" />
                </div>
                <span className={`text-xs font-medium ${trendColor} ${trendBg} px-2 py-1 rounded-full flex items-center gap-1`}>
                  <FontAwesomeIcon icon={trendIcon} className="text-xs" />
                  {stat.trend}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faChartBar} className="text-green-500" />
            Évolution mensuelle
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="projets" fill={COLORS.primary} name="Projets" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actualites" fill={COLORS.secondary} name="Actualités" radius={[4, 4, 0, 0]} />
                <Bar dataKey="temoignages" fill={COLORS.warning} name="Témoignages" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par catégorie */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartPie} className="text-purple-500" />
                Répartition par catégorie
            </h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => {
                        const percentage = percent ? (percent * 100).toFixed(0) : '0';
                        return `${name} ${percentage}%`;
                    }}
                    >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip 
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                        const data = payload[0];
                        const value = data.value as number;
                        const name = data.name as string;
                        
                        const total = categoryData.reduce((acc, item) => acc + item.value, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                        
                        return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                            <p className="font-medium text-gray-900">{name}</p>
                            <p className="text-sm text-gray-600">
                                Nombre: <span className="font-bold">{value}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                {percentage}%
                            </p>
                            </div>
                        );
                        }
                        return null;
                    }}
                    />
                </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
                {categoryData.map((item, index) => {
                const total = categoryData.reduce((acc, item) => acc + item.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                return (
                    <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value} ({percentage}%)</span>
                    </div>
                );
                })}
            </div>
        </div>

        {/* Activité hebdomadaire */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} className="text-orange-500" />
            Activité hebdomadaire
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={COLORS.primary} 
                  fillOpacity={1} 
                  fill="url(#colorActivity)" 
                  name="Actions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Indicateurs de performance */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faChartPie} className="text-blue-500" />
            Indicateurs clés
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Taux de complétion des projets</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Engagement utilisateur</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Satisfaction bénéficiaires</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Croissance annuelle</span>
                <span className="font-medium">+15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-gray-900 mb-3">Résumé</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.totalProjets}</p>
                <p className="text-xs text-gray-600">Projets actifs</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.totalUtilisateurs}</p>
                <p className="text-xs text-gray-600">Utilisateurs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des données */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Données détaillées</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Mois</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Projets</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actualités</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Témoignages</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Partenaires</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Utilisateurs</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => {
                const total = data.projets + data.actualites + data.temoignages + data.partenaires + data.utilisateurs;
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{data.month}</td>
                    <td className="py-3 px-4">{data.projets}</td>
                    <td className="py-3 px-4">{data.actualites}</td>
                    <td className="py-3 px-4">{data.temoignages}</td>
                    <td className="py-3 px-4">{data.partenaires}</td>
                    <td className="py-3 px-4">{data.utilisateurs}</td>
                    <td className="py-3 px-4 font-bold text-green-600">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions d'export */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Exporter les données</h3>
            <p className="text-sm text-gray-600 mt-1">
              Téléchargez les statistiques au format souhaité
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:shadow-md transition">
              <FontAwesomeIcon icon={faFileExport} className="text-green-600" />
              <span>CSV</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:shadow-md transition">
              <FontAwesomeIcon icon={faFileExport} className="text-blue-600" />
              <span>Excel</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:shadow-md transition">
              <FontAwesomeIcon icon={faFileExport} className="text-red-600" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}