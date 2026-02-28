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
          <FaSpinner className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des régions...</p>
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
              <div className="p-2 bg-blue-100 rounded-xl">
                <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Régions</h1>
            </div>
            <p className="text-gray-600 ml-14">
              Gérez les régions d'intervention de l'association VINA
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
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
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une région par nom ou description..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date création
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRegions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FaMapMarkerAlt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-1">
                        {regions.length === 0 ? 'Aucune région trouvée' : 'Aucun résultat'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {regions.length === 0 
                          ? 'Commencez par ajouter votre première région'
                          : 'Essayez de modifier vos critères de recherche'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRegions.map((region) => (
                  <tr key={region.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                          <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{region.nom}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            ID: {region.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md">
                        {region.description ? (
                          <div className="flex items-start">
                            <FaFileAlt className="w-3.5 h-3.5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{region.description}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic flex items-center">
                            <FaFileAlt className="w-3.5 h-3.5 mr-2" />
                            Aucune description
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendarAlt className="w-3.5 h-3.5 text-gray-400 mr-2" />
                        {formatDate(region.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(region)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        
                        {deleteConfirm === region.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDelete(region.id)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(region.id)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages} • {filteredRegions.length} région(s)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <FaChevronLeft className="w-3 h-3 mr-1" />
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
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
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total régions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{regions.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avec description</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {regions.filter(r => r.description).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaFileAlt className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sans description</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {regions.filter(r => !r.description).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FaExclamationCircle className="w-6 h-6 text-orange-600" />
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