// src/pages/admin/MissionsAdmin.tsx
import { useState, useEffect } from 'react';
import MissionService, { type Mission } from '../../services/missionService';
import MissionModal from '../../components/admin/MissionModal';
import { useStats } from '../../contexts/StatsContext';

export default function MissionsAdmin() {
  const { updateStats } = useStats();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActif, setFilterActif] = useState<boolean>(false);

  const fetchMissions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await MissionService.getAllMissions();
      setMissions(data);
      
      // Mettre à jour les statistiques globales
      updateStats({ totalMissions: data.length });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des missions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleCreate = () => {
    setEditingMission(null);
    setShowModal(true);
  };

  const handleEdit = (mission: Mission) => {
    setEditingMission(mission);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
      return;
    }

    try {
      await MissionService.deleteMission(id);
      const newMissions = missions.filter(m => m.id !== id);
      setMissions(newMissions);
      updateStats({ totalMissions: newMissions.length });
      alert('Mission supprimée avec succès');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (editingMission) {
        const updated = await MissionService.updateMission(editingMission.id, formData);
        const newMissions = missions.map(m => m.id === updated.id ? updated : m);
        setMissions(newMissions);
        updateStats({ totalMissions: newMissions.length });
        alert('Mission modifiée avec succès');
      } else {
        const created = await MissionService.createMission(formData);
        const newMissions = [...missions, created];
        setMissions(newMissions);
        updateStats({ totalMissions: newMissions.length });
        alert('Mission créée avec succès');
      }
      fetchMissions();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = 
      mission.titreFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.titreEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.descriptionFr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActif = !filterActif || mission.actif;
    
    return matchesSearch && matchesActif;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des missions...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Missions</h1>
            <p className="text-gray-600 mt-1">
              Gérez toutes les missions et valeurs de l'association VINA
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle mission
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
            placeholder="Rechercher une mission..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="actifFilter"
              checked={filterActif}
              onChange={(e) => setFilterActif(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="actifFilter" className="ml-2 text-sm font-medium text-gray-700">
              Afficher uniquement les actives
            </label>
          </div>
        </div>
      </div>

      {/* Tableau des missions */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icône & Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordre & Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">
                        {missions.length === 0 ? 'Aucune mission trouvée' : 'Aucun résultat pour votre recherche'}
                      </p>
                      {missions.length === 0 && (
                        <p className="text-sm">Commencez par créer votre première mission</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMissions.map((mission) => (
                  <tr key={mission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{mission.titreFr}</div>
                        <div className="text-sm text-gray-500 italic">{mission.titreEn}</div>
                        {mission.sloganFr && (
                          <div className="mt-1 text-sm text-gray-600">
                            <span className="font-medium">Slogan: </span>
                            "{mission.sloganFr}"
                            {mission.sloganEn && (
                              <span className="ml-2 text-gray-400 italic">"{mission.sloganEn}"</span>
                            )}
                          </div>
                        )}
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">Description: </span>
                          {truncateText(mission.descriptionFr)}
                        </div>
                        {mission.objectifsFr && (
                          <div className="mt-1 text-xs text-gray-400">
                            <span className="font-medium">Objectifs: </span>
                            {truncateText(mission.objectifsFr, 50)}
                          </div>
                        )}
                        {mission.valeursFr && (
                          <div className="mt-1 text-xs text-gray-400">
                            <span className="font-medium">Valeurs: </span>
                            {truncateText(mission.valeursFr, 50)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        {mission.iconUrl && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Icône:</span>
                            <img
                              src={`http://localhost:5005/${mission.iconUrl}`}
                              alt="Icône"
                              className="w-8 h-8 object-contain rounded"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/32?text=Icon';
                              }}
                            />
                          </div>
                        )}
                        {mission.imageUrl && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Image:</span>
                            <img
                              src={`http://localhost:5005/${mission.imageUrl}`}
                              alt="Image"
                              className="w-12 h-8 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/48x32?text=Image';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">Ordre:</span>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                            {mission.ordreAffichage || 1}
                          </span>
                        </div>
                        <div>
                          {mission.actif ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Créée:</span>
                          <div className="text-gray-400">{formatDate(mission.createdAt)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Modifiée:</span>
                          <div className="text-gray-400">{formatDate(mission.updatedAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(mission)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(mission.id)}
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
      <MissionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMission(null);
        }}
        onSave={handleSave}
        mission={editingMission}
      />

      {/* Statistiques */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total missions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{missions.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Missions actives</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {missions.filter(m => m.actif).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avec icône</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {missions.filter(m => m.iconUrl).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avec image</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {missions.filter(m => m.imageUrl).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}