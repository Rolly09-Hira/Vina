// src/pages/admin/RegionsAdmin.tsx
import { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaSearch,
  FaSpinner,
  FaExclamationCircle,
  FaCalendarAlt,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import RegionService, { type Region } from '../../services/regionService';
import RegionModal from '../../components/admin/RegionModal';
import { useStats } from '../../contexts/StatsContext';

export default function RegionsAdmin() {
  const { updateStats } = useStats();
  const [regions, setRegions] = useState<Region[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Charger les régions
  const fetchRegions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await RegionService.getAllRegions();
      setRegions(data);
      setFilteredRegions(data);
      updateStats({ totalRegions: data.length });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des régions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  // Recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRegions(regions);
    } else {
      const filtered = regions.filter(region =>
        region.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRegions(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, regions]);

  // Pagination
  const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);
  const paginatedRegions = filteredRegions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setEditingRegion(null);
    setShowModal(true);
  };

  const handleEdit = (region: Region) => {
    setEditingRegion(region);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await RegionService.deleteRegion(id);
      const newRegions = regions.filter(r => r.id !== id);
      setRegions(newRegions);
      updateStats({ totalRegions: newRegions.length });
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData: { nom: string; description?: string }) => {
    if (editingRegion) {
      const updated = await RegionService.updateRegion(editingRegion.id, formData);
      const newRegions = regions.map(r => r.id === updated.id ? updated : r);
      setRegions(newRegions);
      updateStats({ totalRegions: newRegions.length });
    } else {
      const created = await RegionService.createRegion(formData);
      setRegions([...regions, created]);
      updateStats({ totalRegions: regions.length + 1 });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="w-10 h-10 text-olive-nature animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement des régions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-olive-nature/20 rounded-xl border border-olive-nature/30">
                <FaMapMarkerAlt className="w-6 h-6 text-olive-nature" />
              </div>
              <h1 className="text-2xl font-bold text-premium-dark">Gestion des Régions</h1>
            </div>
            <p className="text-text-secondary ml-14">
              Gérez les régions d'intervention de l'association VINA
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-semibold rounded-xl hover:from-forest-deep hover:to-premium-dark transition-all shadow-lg hover-lift"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Nouvelle région
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FaExclamationCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-text-secondary" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une région par nom ou description..."
            className="w-full pl-11 pr-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-olive-nature focus:border-olive-nature bg-warm-white text-text-dark transition-all"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-warm-white rounded-xl shadow-lg overflow-hidden border border-border-light">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-ultra-light">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Date création
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-warm-white divide-y divide-border-light">
              {paginatedRegions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-text-secondary">
                      <FaMapMarkerAlt className="w-12 h-12 mx-auto mb-4 text-border-light" />
                      <p className="text-lg font-medium text-forest-deep mb-1">
                        {regions.length === 0 ? 'Aucune région trouvée' : 'Aucun résultat'}
                      </p>
                      <p className="text-sm text-border-light">
                        {regions.length === 0 
                          ? 'Commencez par ajouter votre première région'
                          : 'Essayez de modifier vos critères de recherche'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRegions.map((region) => (
                  <tr key={region.id} className="hover:bg-ultra-light transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-olive-nature/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-olive-nature/30 transition-colors border border-olive-nature/30">
                          <FaMapMarkerAlt className="w-4 h-4 text-olive-nature" />
                        </div>
                        <div>
                          <div className="font-medium text-premium-dark">{region.nom}</div>
                          <div className="text-xs text-text-secondary mt-0.5">
                            ID: {region.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-secondary max-w-md">
                        {region.description ? (
                          <div className="flex items-start">
                            <FaFileAlt className="w-3.5 h-3.5 text-border-light mr-2 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{region.description}</span>
                          </div>
                        ) : (
                          <span className="text-border-light italic flex items-center">
                            <FaFileAlt className="w-3.5 h-3.5 mr-2" />
                            Aucune description
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-text-secondary">
                        <FaCalendarAlt className="w-3.5 h-3.5 text-border-light mr-2" />
                        {formatDate(region.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(region)}
                          className="p-2 text-water-blue hover:text-forest-deep hover:bg-sky-soft/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        
                        {deleteConfirm === region.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDelete(region.id)}
                              className="px-3 py-1.5 text-xs font-medium text-warm-white bg-gradient-to-r from-sun-gold to-sun-gold/80 rounded-lg hover:from-sun-gold/80 hover:to-sun-gold transition-colors"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1.5 text-xs font-medium text-text-secondary bg-ultra-light border border-border-light rounded-lg hover:bg-border-light transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(region.id)}
                            className="p-2 text-sun-gold hover:text-earth-brown hover:bg-sun-gold/10 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-ultra-light border-t border-border-light flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Page {currentPage} sur {totalPages} • {filteredRegions.length} région(s)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-border-light rounded-lg text-sm font-medium text-text-secondary bg-warm-white hover:bg-ultra-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <FaChevronLeft className="w-3 h-3 mr-1" />
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-border-light rounded-lg text-sm font-medium text-text-secondary bg-warm-white hover:bg-ultra-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                Suivant
                <FaChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total régions</p>
              <p className="text-2xl font-bold text-premium-dark mt-1">{regions.length}</p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/20 rounded-xl flex items-center justify-center border border-olive-nature/30">
              <FaMapMarkerAlt className="w-6 h-6 text-olive-nature" />
            </div>
          </div>
        </div>

        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Avec description</p>
              <p className="text-2xl font-bold text-water-blue mt-1">
                {regions.filter(r => r.description).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sky-soft/20 rounded-xl flex items-center justify-center border border-sky-soft/30">
              <FaFileAlt className="w-6 h-6 text-water-blue" />
            </div>
          </div>
        </div>

        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Sans description</p>
              <p className="text-2xl font-bold text-sun-gold mt-1">
                {regions.filter(r => !r.description).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sun-gold/20 rounded-xl flex items-center justify-center border border-sun-gold/30">
              <FaExclamationCircle className="w-6 h-6 text-sun-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RegionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRegion(null);
        }}
        onSave={handleSave}
        region={editingRegion}
      />
    </div>
  );
}