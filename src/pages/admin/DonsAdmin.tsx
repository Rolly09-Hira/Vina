// src/pages/admin/DonsAdmin.tsx

import React, { useState, useEffect } from 'react';
import { donService } from '../../services/donService';
import type { DonIntention, DonIntentionStats } from '../../types/api';
import DonIntentionModal from '../../components/admin/DonIntentionModal';
import { 
  Heart, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Mail,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const DonsAdmin: React.FC = () => {
  const [intentions, setIntentions] = useState<DonIntention[]>([]);
  const [stats, setStats] = useState<DonIntentionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIntention, setSelectedIntention] = useState<DonIntention | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentPage, statutFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [intentionsData, statsData] = await Promise.all([
        donService.getAllIntentions(currentPage, 10, 'dateSoumission', 'DESC'),
        donService.getStatistiques()
      ]);
      setIntentions(intentionsData.content);
      setTotalPages(intentionsData.totalPages);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur chargement des dons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (intention: DonIntention) => {
    setSelectedIntention(intention);
    setIsModalOpen(true);
  };

  const handleUpdateStatut = async (id: number, statut: string, notes?: string) => {
    try {
      await donService.updateStatut(id, statut, notes);
      await loadData(); // Recharger les données
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  const handleAddNote = async (id: number, note: string) => {
    try {
      await donService.addNotes(id, note);
      await loadData(); // Recharger pour voir la note
    } catch (error) {
      console.error('Erreur ajout note:', error);
    }
  };

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, { color: string; icon: any }> = {
      EN_ATTENTE: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      CONTACTE: { color: 'bg-blue-100 text-blue-800', icon: Phone },
      CONVERTI: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      PERDU: { color: 'bg-red-100 text-red-800', icon: XCircle },
      REPORTE: { color: 'bg-purple-100 text-purple-800', icon: AlertCircle }
    };
    const badge = badges[statut] || badges['EN_ATTENTE'];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon size={12} />
        {statut.replace('_', ' ')}
      </span>
    );
  };

  const formatMontant = (montant?: number) => {
    if (!montant) return '-';
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading && !intentions.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vert-fonce flex items-center gap-2">
          <Heart className="text-rouge-terre" />
          Gestion des dons
        </h1>
        <button
          onClick={loadData}
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Actualiser
        </button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total intentions</p>
                <p className="text-2xl font-bold">{stats.totalIntentions}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Heart size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.enAttente}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Convertis</p>
                <p className="text-2xl font-bold text-green-600">{stats.convertis}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Taux: {stats.tauxConversion}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Montant total</p>
                <p className="text-2xl font-bold text-vert-fonce">
                  {formatMontant(stats.montantTotalConverti)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vert-jeune"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Filter size={20} />
            Filtres
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download size={20} />
            Exporter
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vert-jeune"
            >
              <option value="">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="CONTACTE">Contacté</option>
              <option value="CONVERTI">Converti</option>
              <option value="PERDU">Perdu</option>
              <option value="REPORTE">Reporté</option>
            </select>
            <input
              type="date"
              placeholder="Date début"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vert-jeune"
            />
            <input
              type="date"
              placeholder="Date fin"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vert-jeune"
            />
          </div>
        )}
      </div>

      {/* Tableau des intentions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {intentions.map((intention) => (
                <tr key={intention.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{intention.nomComplet}</div>
                    {intention.pays && (
                      <div className="text-sm text-gray-500">{intention.pays}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Mail size={14} className="mr-1 text-gray-400" />
                      <a href={`mailto:${intention.email}`} className="text-bleu-terre hover:underline">
                        {intention.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <Phone size={14} className="mr-1 text-gray-400" />
                      <span>{intention.telephone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{formatMontant(intention.montant)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(intention.dateSoumission)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatutBadge(intention.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleViewDetails(intention)}
                      className="text-bleu-terre hover:text-bleu-ciel font-medium text-sm"
                    >
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t">
            <div className="flex-1 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} className="mr-1" />
                Précédent
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage + 1} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="relative inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Suivant
                <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      <DonIntentionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        intention={selectedIntention}
        onUpdateStatut={handleUpdateStatut}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default DonsAdmin;