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
      case 'evenement': return 'bg-water-blue/10 text-water-blue border border-water-blue/30';
      case 'nouvelle': return 'bg-olive-nature/10 text-olive-nature border border-olive-nature/30';
      case 'rapport': return 'bg-earth-brown/10 text-earth-brown border border-earth-brown/30';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
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
          <div className="relative">
            <div className="w-12 h-12 border-4 border-border-light rounded-full"></div>
            <div className="w-12 h-12 border-4 border-olive-nature border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-forest-deep mt-4">Chargement des actualités...</p>
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
            <h1 className="text-2xl font-bold text-forest-deep">Gestion des Actualités</h1>
            <p className="text-text-secondary mt-1">
              Gérez toutes les actualités de l'association VINA
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-semibold rounded-lg hover:from-forest-deep hover:to-premium-dark transition-colors"
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
            <svg className="h-5 w-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une actualité..."
            className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-forest-deep">Filtrer par type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white text-text-secondary"
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
              className="w-4 h-4 text-sun-gold border-border-light rounded focus:ring-sun-gold"
            />
            <label htmlFor="importantFilter" className="ml-2 text-sm font-medium text-forest-deep">
              Afficher uniquement les importantes
            </label>
          </div>
        </div>
      </div>

      {/* Tableau des actualités */}
      <div className="bg-warm-white rounded-xl shadow-lg border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-ultra-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actualité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Important
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-warm-white divide-y divide-border-light">
              {filteredActualites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-text-secondary">
                      <svg className="w-12 h-12 mx-auto mb-4 text-text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <p className="text-lg font-medium mb-2 text-forest-deep">
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
                  <tr key={actualite.id} className="hover:bg-ultra-light transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        {actualite.imageUrl && (
                          <img
                            src={`https://web-production-03b53.up.railway.app/${actualite.imageUrl}`}
                            alt={actualite.titreFr}
                            className="w-16 h-16 object-cover rounded-lg border border-border-light"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Image';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-forest-deep">{actualite.titreFr}</div>
                          <div className="text-sm text-text-secondary italic">{actualite.titreEn}</div>
                          <div className="mt-1 text-sm text-text-secondary line-clamp-2">
                            {actualite.contenuFr.substring(0, 100)}...
                          </div>
                          {actualite.lieu && (
                            <div className="mt-1 text-xs text-text-secondary">
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
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div className="font-medium">Publié: {formatDate(actualite.datePublication)}</div>
                      {actualite.dateEvenement && (
                        <div className="text-text-secondary">
                          Événement: {formatDate(actualite.dateEvenement)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {actualite.important ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-sun-gold/10 text-sun-gold rounded-full border border-sun-gold/30">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414L1.414 8l3.636 3.636a1 1 0 11-1.414 1.414L0 8l4.95-4.95a1 1 0 011.414 0zM14.95 3.636a1 1 0 011.414 0L20 8l-4.95 4.95a1 1 0 01-1.414-1.414L18.586 8l-3.636-3.636a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Important
                        </span>
                      ) : (
                        <span className="text-text-secondary text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(actualite)}
                          className="p-2 text-water-blue hover:text-white hover:bg-water-blue rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(actualite.id)}
                          className="p-2 text-earth-brown hover:text-white hover:bg-earth-brown rounded-lg transition-colors"
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
        <div className="bg-warm-white p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total actualités</p>
              <p className="text-2xl font-bold text-forest-deep mt-1">{actualites.length}</p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Nouvelles</p>
              <p className="text-2xl font-bold text-olive-nature mt-1">
                {actualites.filter(a => a.type === 'nouvelle').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Événements</p>
              <p className="text-2xl font-bold text-water-blue mt-1">
                {actualites.filter(a => a.type === 'evenement').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-water-blue/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-water-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Importantes</p>
              <p className="text-2xl font-bold text-sun-gold mt-1">
                {actualites.filter(a => a.important).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sun-gold/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-sun-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}