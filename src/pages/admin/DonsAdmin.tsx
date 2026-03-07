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
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Trash2,
  MapPin,
  Calendar,
  Info
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
  const [sortField, setSortField] = useState<string>('dateSoumission');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  
  // État pour gérer les messages d'erreur
  const [errorMessage, setErrorMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    loadData();
  }, [currentPage, statutFilter, sortField, sortDirection]);

  // Fonction pour afficher un message temporaire
  const showMessage = (type: 'success' | 'error', text: string) => {
    setErrorMessage({ type, text });
    setTimeout(() => setErrorMessage(null), 5000); // Disparaît après 5 secondes
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [intentionsData, statsData] = await Promise.all([
        donService.getAllIntentions(currentPage, 10, sortField, sortDirection),
        donService.getStatistiques()
      ]);
      setIntentions(intentionsData.content);
      setTotalPages(intentionsData.totalPages);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur chargement des dons:', error);
      showMessage('error', 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortDirection('ASC');
    }
  };

  const handleViewDetails = (intention: DonIntention) => {
    setSelectedIntention(intention);
    setIsModalOpen(true);
  };

  const handleUpdateStatut = async (id: number, statut: string, notes?: string) => {
    try {
      await donService.updateStatut(id, statut, notes);
      await loadData();
      setIsModalOpen(false);
      showMessage('success', 'Statut mis à jour avec succès');
    } catch (error: any) {
      console.error('Erreur mise à jour statut:', error);
      showMessage('error', error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleAddNote = async (id: number, note: string) => {
    try {
      await donService.addNotes(id, note);
      await loadData();
      showMessage('success', 'Note ajoutée avec succès');
    } catch (error: any) {
      console.error('Erreur ajout note:', error);
      showMessage('error', error.response?.data?.message || 'Erreur lors de l\'ajout de la note');
    }
  };

  const handleDelete = async (id: number) => {
    // Vérifier d'abord si le don est converti avant de demander confirmation
    const intention = intentions.find(i => i.id === id);
    if (intention?.statut === 'CONVERTI') {
      showMessage('error', '❌ Impossible de supprimer un don déjà converti');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette intention de don ? Cette action est irréversible.')) {
      return;
    }

    try {
      await donService.deleteIntention(id);
      await loadData();
      if (selectedIntention?.id === id) {
        setIsModalOpen(false);
      }
      showMessage('success', 'Intention de don supprimée avec succès');
    } catch (error: any) {
      console.error('Erreur suppression intention:', error);
      
      // Analyser l'erreur retournée par le backend
      const errorMsg = error.response?.data?.message || error.message || '';
      
      if (errorMsg.includes('déjà convertie') || errorMsg.includes('converti')) {
        showMessage('error', '❌ Impossible de supprimer un don déjà converti');
      } else {
        showMessage('error', errorMsg || 'Erreur lors de la suppression');
      }
    }
  };

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, { color: string; icon: any }> = {
      EN_ATTENTE: { color: 'bg-sun-gold/20 text-sun-gold border border-sun-gold/30', icon: Clock },
      CONTACTE: { color: 'bg-water-blue/20 text-water-blue border border-water-blue/30', icon: Phone },
      CONVERTI: { color: 'bg-olive-nature/20 text-olive-nature border border-olive-nature/30', icon: CheckCircle },
      PERDU: { color: 'bg-earth-brown/20 text-earth-brown border border-earth-brown/30', icon: XCircle },
      REPORTE: { color: 'bg-sky-soft/20 text-sky-soft border border-sky-soft/30', icon: AlertCircle }
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
    return new Intl.NumberFormat('fr-FR').format(montant) + ' Ar';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredIntentions = intentions.filter(intention => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      intention.nomComplet.toLowerCase().includes(term) ||
      intention.email.toLowerCase().includes(term) ||
      intention.telephone.includes(term)
    );
  });

  if (loading && !intentions.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-olive-nature border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Chargement des dons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-premium-dark flex items-center gap-2">
          <Heart size={20} className="text-sun-gold" />
          Gestion des dons
        </h1>
        <button
          onClick={loadData}
          className="bg-ultra-light text-text-secondary px-3 py-1.5 rounded-lg hover:bg-border-light transition-colors flex items-center gap-1.5 text-sm border border-border-light"
        >
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>

      {/* Message d'erreur/succès */}
      {errorMessage && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          errorMessage.type === 'success' 
            ? 'bg-olive-nature/20 text-olive-nature border border-olive-nature/30' 
            : 'bg-earth-brown/20 text-earth-brown border border-earth-brown/30'
        }`}>
          {errorMessage.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <p className="text-sm font-medium">{errorMessage.text}</p>
        </div>
      )}

      {/* Statistiques avec couleurs VINA */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-warm-white rounded-lg shadow-lg p-3 border border-border-light hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary">Total</p>
                <p className="text-lg font-bold text-premium-dark">{stats.totalIntentions}</p>
              </div>
              <div className="bg-olive-nature/20 p-2 rounded-full border border-olive-nature/30">
                <Heart size={18} className="text-olive-nature" />
              </div>
            </div>
          </div>

          <div className="bg-warm-white rounded-lg shadow-lg p-3 border border-border-light hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary">En attente</p>
                <p className="text-lg font-bold text-sun-gold">{stats.enAttente}</p>
              </div>
              <div className="bg-sun-gold/20 p-2 rounded-full border border-sun-gold/30">
                <Clock size={18} className="text-sun-gold" />
              </div>
            </div>
          </div>

          <div className="bg-warm-white rounded-lg shadow-lg p-3 border border-border-light hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary">Convertis</p>
                <p className="text-lg font-bold text-olive-nature">{stats.convertis}</p>
              </div>
              <div className="bg-olive-nature/20 p-2 rounded-full border border-olive-nature/30">
                <CheckCircle size={18} className="text-olive-nature" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-1">Taux: {stats.tauxConversion}%</p>
          </div>

          <div className="bg-warm-white rounded-lg shadow-lg p-3 border border-border-light hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary">Montant total</p>
                <p className="text-lg font-bold text-water-blue">
                  {stats.montantTotalConverti?.toLocaleString()} Ar
                </p>
              </div>
              <div className="bg-water-blue/20 p-2 rounded-full border border-water-blue/30">
                <DollarSign size={18} className="text-water-blue" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-warm-white rounded-lg shadow-lg p-3 border border-border-light">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Rechercher un donateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-nature focus:border-olive-nature bg-warm-white text-text-dark"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border-light rounded-lg hover:bg-ultra-light transition-colors text-text-secondary"
          >
            <Filter size={16} />
            Filtres
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border-light rounded-lg hover:bg-ultra-light transition-colors text-text-secondary">
            <Download size={16} />
            Export
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-border-light grid grid-cols-1 md:grid-cols-3 gap-2">
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="border border-border-light rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive-nature bg-warm-white text-text-dark"
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
              className="border border-border-light rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive-nature bg-warm-white text-text-dark"
            />
            <input
              type="date"
              placeholder="Date fin"
              className="border border-border-light rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive-nature bg-warm-white text-text-dark"
            />
          </div>
        )}
      </div>

      {/* Tableau des intentions */}
      <div className="bg-warm-white rounded-lg shadow-lg overflow-hidden border border-border-light">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-ultra-light">
              <tr>
                {['Donateur', 'Contact', 'Montant', 'Date', 'Statut', 'Actions'].map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-border-light transition-colors"
                    onClick={() => {
                      if (idx === 0) handleSort('nomComplet');
                      if (idx === 2) handleSort('montant');
                      if (idx === 3) handleSort('dateSoumission');
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {header}
                      {sortField === 
                        (idx === 0 ? 'nomComplet' : 
                         idx === 2 ? 'montant' : 
                         idx === 3 ? 'dateSoumission' : '') && (
                        sortDirection === 'ASC' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredIntentions.map((intention) => (
                <tr key={intention.id} className="hover:bg-ultra-light transition-colors text-sm">
                  <td className="px-4 py-3">
                    <div className="font-medium text-premium-dark">{intention.nomComplet}</div>
                    <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                      <MapPin size={10} />
                      {intention.pays || 'Pays non spécifié'}
                      {intention.ville && `, ${intention.ville}`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Mail size={12} className="text-text-secondary" />
                      <a 
                        href={`mailto:${intention.email}`} 
                        className="text-water-blue hover:text-forest-deep transition-colors text-xs truncate max-w-[120px]"
                      >
                        {intention.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Phone size={12} className="text-text-secondary" />
                      <span className="text-xs text-text-secondary">{intention.telephone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-premium-dark text-sm">
                      {formatMontant(intention.montant)}
                    </span>
                    {intention.montantType && (
                      <div className="text-xs text-text-secondary">
                        {intention.montantType === 'FIXE' ? 'Montant fixe' : 'Montant libre'}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <Calendar size={10} />
                      {formatDate(intention.dateSoumission)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatutBadge(intention.statut)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetails(intention)}
                        className="text-water-blue hover:text-forest-deep text-xs font-medium px-2 py-1 rounded hover:bg-sky-soft/10 transition-colors"
                        title="Voir les détails"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDelete(intention.id)}
                        className={`text-xs font-medium px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                          intention.statut === 'CONVERTI'
                            ? 'text-text-secondary cursor-not-allowed opacity-50'
                            : 'text-sun-gold hover:text-earth-brown hover:bg-sun-gold/10'
                        }`}
                        title={intention.statut === 'CONVERTI' ? 'Impossible de supprimer un don converti' : 'Supprimer'}
                        disabled={intention.statut === 'CONVERTI'}
                      >
                        <Trash2 size={14} />
                        {intention.statut === 'CONVERTI' && <Info size={12} className="ml-1" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIntentions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                    <Heart size={32} className="mx-auto mb-2 text-border-light" />
                    <p>Aucune intention de don trouvée</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-border-light bg-ultra-light">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="inline-flex items-center gap-1 px-3 py-1 border border-border-light rounded-md text-xs text-text-secondary bg-warm-white hover:bg-ultra-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              Précédent
            </button>
            <span className="text-xs text-text-secondary">
              Page {currentPage + 1} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="inline-flex items-center gap-1 px-3 py-1 border border-border-light rounded-md text-xs text-text-secondary bg-warm-white hover:bg-ultra-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <DonIntentionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        intention={selectedIntention}
        onUpdateStatut={handleUpdateStatut}
        onAddNote={handleAddNote}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DonsAdmin;