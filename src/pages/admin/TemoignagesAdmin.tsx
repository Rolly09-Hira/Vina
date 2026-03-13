// src/pages/admin/TemoignagesAdmin.tsx
import { useState, useEffect } from 'react';
import TemoignageService, { type Temoignage } from '../../services/temoignageService';
import TemoignageModal from '../../components/admin/TemoignageModal';
import { useStats } from '../../contexts/StatsContext';

export default function TemoignagesAdmin() {
  const { updateStats } = useStats();
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTemoignage, setEditingTemoignage] = useState<Temoignage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterActif, setFilterActif] = useState<boolean>(false);

  const fetchTemoignages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await TemoignageService.getAllTemoignages();
      setTemoignages(data);
      
      // Mettre à jour les statistiques globales
      updateStats({ totalTemoignages: data.length });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des témoignages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemoignages();
  }, []);

  const handleCreate = () => {
    setEditingTemoignage(null);
    setShowModal(true);
  };

  const handleEdit = (temoignage: Temoignage) => {
    setEditingTemoignage(temoignage);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      return;
    }

    try {
      await TemoignageService.deleteTemoignage(id);
      const newTemoignages = temoignages.filter(t => t.id !== id);
      setTemoignages(newTemoignages);
      updateStats({ totalTemoignages: newTemoignages.length });
      alert('Témoignage supprimé avec succès');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (editingTemoignage) {
        const updated = await TemoignageService.updateTemoignage(editingTemoignage.id, formData);
        const newTemoignages = temoignages.map(t => t.id === updated.id ? updated : t);
        setTemoignages(newTemoignages);
        updateStats({ totalTemoignages: newTemoignages.length });
        alert('Témoignage modifié avec succès');
      } else {
        const created = await TemoignageService.createTemoignage(formData);
        const newTemoignages = [...temoignages, created];
        setTemoignages(newTemoignages);
        updateStats({ totalTemoignages: newTemoignages.length });
        alert('Témoignage créé avec succès');
      }
      fetchTemoignages();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PHOTO': return 'bg-sky-soft/20 text-water-blue border border-sky-soft/30';
      case 'VIDEO': return 'bg-sun-gold/20 text-sun-gold border border-sun-gold/30';
      case 'PHOTO_VIDEO': return 'bg-olive-nature/20 text-olive-nature border border-olive-nature/30';
      default: return 'bg-ultra-light text-text-secondary border border-border-light';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'PHOTO': return 'Photo';
      case 'VIDEO': return 'Vidéo';
      case 'PHOTO_VIDEO': return 'Photo & Vidéo';
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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredTemoignages = temoignages.filter(temoignage => {
    const matchesSearch = 
      temoignage.auteurFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      temoignage.auteurEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      temoignage.contenuFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      temoignage.fonctionFr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || temoignage.typeTemoignage === filterType;
    const matchesActif = !filterActif || temoignage.actif;
    
    return matchesSearch && matchesType && matchesActif;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-olive-nature border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Chargement des témoignages...</p>
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
            <h1 className="text-2xl font-bold text-premium-dark">Gestion des Témoignages</h1>
            <p className="text-text-secondary mt-1">
              Gérez tous les témoignages de l'association VINA
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-semibold rounded-lg hover:from-forest-deep hover:to-premium-dark transition-all shadow-md hover-lift"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau témoignage
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
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
            placeholder="Rechercher un témoignage..."
            className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature bg-warm-white text-text-dark"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-forest-deep">Filtrer par type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature bg-warm-white text-text-dark"
            >
              <option value="all">Tous les types</option>
              <option value="PHOTO">Photos seulement</option>
              <option value="VIDEO">Vidéos seulement</option>
              <option value="PHOTO_VIDEO">Photo & Vidéo</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="actifFilter"
              checked={filterActif}
              onChange={(e) => setFilterActif(e.target.checked)}
              className="w-4 h-4 text-olive-nature border-border-light rounded focus:ring-olive-nature"
            />
            <label htmlFor="actifFilter" className="ml-2 text-sm font-medium text-forest-deep">
              Afficher uniquement les actifs
            </label>
          </div>
        </div>
      </div>

      {/* Tableau des témoignages */}
      <div className="bg-warm-white rounded-xl shadow-lg overflow-hidden border border-border-light">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-ultra-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Témoignage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Type & Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Ordre & Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-warm-white divide-y divide-border-light">
              {filteredTemoignages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-text-secondary">
                      <svg className="w-12 h-12 mx-auto mb-4 text-border-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className="text-lg font-medium text-forest-deep mb-2">
                        {temoignages.length === 0 ? 'Aucun témoignage trouvé' : 'Aucun résultat pour votre recherche'}
                      </p>
                      {temoignages.length === 0 && (
                        <p className="text-sm">Commencez par créer votre premier témoignage</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTemoignages.map((temoignage) => (
                  <tr key={temoignage.id} className="hover:bg-ultra-light transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        {temoignage.photoUrl && (
                          <img
                            src={temoignage.photoUrl}
                            alt={temoignage.auteurFr}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-border-light"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/64?text=Photo';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-premium-dark">
                            {temoignage.auteurFr}
                            <span className="ml-2 text-sm text-text-secondary italic">
                              ({temoignage.auteurEn})
                            </span>
                          </div>
                          <div className="text-sm text-text-secondary">
                            {temoignage.fonctionFr}
                            <span className="ml-2 text-xs text-border-light italic">
                              ({temoignage.fonctionEn})
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-text-secondary line-clamp-2">
                            {truncateText(temoignage.contenuFr, 80)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(temoignage.typeTemoignage)}`}>
                          {getTypeText(temoignage.typeTemoignage)}
                        </span>
                        <div className="flex items-center space-x-2">
                          {temoignage.photoUrl && (
                            <span className="inline-flex items-center text-xs text-water-blue">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Photo
                            </span>
                          )}
                          {temoignage.videoUrl && (
                            <span className="inline-flex items-center text-xs text-sun-gold">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Vidéo
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm text-text-secondary mr-2">Ordre:</span>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-soft/20 text-water-blue text-xs font-bold border border-sky-soft/30">
                            {temoignage.ordreAffichage || 1}
                          </span>
                        </div>
                        <div>
                          {temoignage.actif ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-olive-nature/20 text-olive-nature rounded-full border border-olive-nature/30">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-earth-brown/20 text-earth-brown rounded-full border border-earth-brown/30">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Inactif
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div className="font-medium text-forest-deep">Publié: {formatDate(temoignage.datePublication)}</div>
                      <div className="text-xs text-border-light">
                        Créé: {formatDate(temoignage.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(temoignage)}
                          className="p-2 text-water-blue hover:text-forest-deep hover:bg-sky-soft/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(temoignage.id)}
                          className="p-2 text-sun-gold hover:text-earth-brown hover:bg-sun-gold/10 rounded-lg transition-colors"
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
      <TemoignageModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTemoignage(null);
        }}
        onSave={handleSave}
        temoignage={editingTemoignage}
      />

      {/* Statistiques */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total témoignages</p>
              <p className="text-2xl font-bold text-premium-dark mt-1">{temoignages.length}</p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/20 rounded-lg flex items-center justify-center border border-olive-nature/30">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Témoignages photo</p>
              <p className="text-2xl font-bold text-water-blue mt-1">
                {temoignages.filter(t => t.typeTemoignage === 'PHOTO').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sky-soft/20 rounded-lg flex items-center justify-center border border-sky-soft/30">
              <svg className="w-6 h-6 text-water-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Témoignages vidéo</p>
              <p className="text-2xl font-bold text-sun-gold mt-1">
                {temoignages.filter(t => t.typeTemoignage === 'VIDEO').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sun-gold/20 rounded-lg flex items-center justify-center border border-sun-gold/30">
              <svg className="w-6 h-6 text-sun-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Actifs</p>
              <p className="text-2xl font-bold text-olive-nature mt-1">
                {temoignages.filter(t => t.actif).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/20 rounded-lg flex items-center justify-center border border-olive-nature/30">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}