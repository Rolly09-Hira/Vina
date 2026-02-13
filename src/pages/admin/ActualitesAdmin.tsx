// src/pages/admin/ActualitesAdmin.tsx
import { useState, useEffect } from 'react';
import ActualiteService, { type Actualite } from '../../services/actualiteService';
import ActualiteModal from '../../components/admin/ActualiteModal';
import { useStats } from '../../contexts/StatsContext';

export default function ActualitesAdmin() {
  const { updateStats } = useStats();
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingActualite, setEditingActualite] = useState<Actualite | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterImportant, setFilterImportant] = useState<boolean>(false);

  const fetchActualites = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ActualiteService.getAllActualites();
      setActualites(data);
      
      // Mettre à jour les statistiques globales
      updateStats({ totalActualites: data.length });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des actualités');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActualites();
  }, []);

  const handleCreate = () => {
    setEditingActualite(null);
    setShowModal(true);
  };

  const handleEdit = (actualite: Actualite) => {
    setEditingActualite(actualite);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      return;
    }

    try {
      await ActualiteService.deleteActualite(id);
      const newActualites = actualites.filter(a => a.id !== id);
      setActualites(newActualites);
      updateStats({ totalActualites: newActualites.length });
      alert('Actualité supprimée avec succès');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (editingActualite) {
        const updated = await ActualiteService.updateActualite(editingActualite.id, formData);
        const newActualites = actualites.map(a => a.id === updated.id ? updated : a);
        setActualites(newActualites);
        updateStats({ totalActualites: newActualites.length });
        alert('Actualité modifiée avec succès');
      } else {
        const created = await ActualiteService.createActualite(formData);
        const newActualites = [...actualites, created];
        setActualites(newActualites);
        updateStats({ totalActualites: newActualites.length });
        alert('Actualité créée avec succès');
      }
      fetchActualites();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'evenement': return 'bg-blue-100 text-blue-800';
      case 'nouvelle': return 'bg-green-100 text-green-800';
      case 'rapport': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'evenement': return 'Événement';
      case 'nouvelle': return 'Nouvelle';
      case 'rapport': return 'Rapport';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredActualites = actualites.filter(actualite => {
    const matchesSearch = 
      actualite.titreFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actualite.titreEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actualite.contenuFr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || actualite.type === filterType;
    const matchesImportant = !filterImportant || actualite.important;
    
    return matchesSearch && matchesType && matchesImportant;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des actualités...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Actualités</h1>
            <p className="text-gray-600 mt-1">
              Gérez toutes les actualités de l'association VINA
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle actualité
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une actualité..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filtrer par type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Tous les types</option>
              <option value="nouvelle">Nouvelles</option>
              <option value="evenement">Événements</option>
              <option value="rapport">Rapports</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="importantFilter"
              checked={filterImportant}
              onChange={(e) => setFilterImportant(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="importantFilter" className="ml-2 text-sm font-medium text-gray-700">
              Afficher uniquement les importantes
            </label>
          </div>
        </div>
      </div>

      {/* Tableau des actualités */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actualité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Important
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActualites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">
                        {actualites.length === 0 ? 'Aucune actualité trouvée' : 'Aucun résultat pour votre recherche'}
                      </p>
                      {actualites.length === 0 && (
                        <p className="text-sm">Commencez par créer votre première actualité</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActualites.map((actualite) => (
                  <tr key={actualite.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        {actualite.imageUrl && (
                          <img
                            src={`http://localhost:5005/${actualite.imageUrl}`}
                            alt={actualite.titreFr}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Image';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{actualite.titreFr}</div>
                          <div className="text-sm text-gray-500 italic">{actualite.titreEn}</div>
                          <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {actualite.contenuFr.substring(0, 100)}...
                          </div>
                          {actualite.lieu && (
                            <div className="mt-1 text-xs text-gray-400">
                              📍 {actualite.lieu}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(actualite.type)}`}>
                        {getTypeText(actualite.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="font-medium">Publié: {formatDate(actualite.datePublication)}</div>
                      {actualite.dateEvenement && (
                        <div className="text-gray-400">
                          Événement: {formatDate(actualite.dateEvenement)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {actualite.important ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414L1.414 8l3.636 3.636a1 1 0 11-1.414 1.414L0 8l4.95-4.95a1 1 0 011.414 0zM14.95 3.636a1 1 0 011.414 0L20 8l-4.95 4.95a1 1 0 01-1.414-1.414L18.586 8l-3.636-3.636a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Important
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(actualite)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(actualite.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ActualiteModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingActualite(null);
        }}
        onSave={handleSave}
        actualite={editingActualite}
      />

      {/* Statistiques */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total actualités</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{actualites.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Nouvelles</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {actualites.filter(a => a.type === 'nouvelle').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Événements</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {actualites.filter(a => a.type === 'evenement').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Importantes</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {actualites.filter(a => a.important).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}