// src/pages/admin/PartenairesAdmin.tsx
import { useState, useEffect } from 'react';
import PartenaireService, { type Partenaire } from '../../services/partenaireService';
import PartenaireModal from '../../components/admin/PartenaireModal';
import { useStats } from '../../contexts/StatsContext';

export default function PartenairesAdmin() {
  const { updateStats } = useStats();
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPartenaire, setEditingPartenaire] = useState<Partenaire | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterActif, setFilterActif] = useState<boolean>(false);

  const fetchPartenaires = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await PartenaireService.getAllPartenaires();
      setPartenaires(data);
      
      // Mettre à jour les statistiques globales
      updateStats({ totalPartenaires: data.length });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des partenaires');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartenaires();
  }, []);

  const handleCreate = () => {
    setEditingPartenaire(null);
    setShowModal(true);
  };

  const handleEdit = (partenaire: Partenaire) => {
    setEditingPartenaire(partenaire);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      return;
    }

    try {
      await PartenaireService.deletePartenaire(id);
      const newPartenaires = partenaires.filter(p => p.id !== id);
      setPartenaires(newPartenaires);
      updateStats({ totalPartenaires: newPartenaires.length });
      alert('Partenaire supprimé avec succès');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (editingPartenaire) {
        const updated = await PartenaireService.updatePartenaire(editingPartenaire.id, formData);
        const newPartenaires = partenaires.map(p => p.id === updated.id ? updated : p);
        setPartenaires(newPartenaires);
        updateStats({ totalPartenaires: newPartenaires.length });
        alert('Partenaire modifié avec succès');
      } else {
        const created = await PartenaireService.createPartenaire(formData);
        const newPartenaires = [...partenaires, created];
        setPartenaires(newPartenaires);
        updateStats({ totalPartenaires: newPartenaires.length });
        alert('Partenaire créé avec succès');
      }
      fetchPartenaires();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'entreprise': return 'bg-olive-nature/20 text-olive-nature border border-olive-nature/30';
      case 'individu': return 'bg-water-blue/20 text-water-blue border border-water-blue/30';
      case 'association': return 'bg-sun-gold/20 text-sun-gold border border-sun-gold/30';
      case 'institution': return 'bg-earth-brown/20 text-earth-brown border border-earth-brown/30';
      default: return 'bg-ultra-light text-text-secondary border border-border-light';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'entreprise': return 'Entreprise';
      case 'individu': return 'Individu';
      case 'association': return 'Association';
      case 'institution': return 'Institution';
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

  const filteredPartenaires = partenaires.filter(partenaire => {
    const matchesSearch = 
      partenaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partenaire.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partenaire.adresse?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || partenaire.type === filterType;
    const matchesActif = !filterActif || partenaire.actif;
    
    return matchesSearch && matchesType && matchesActif;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-olive-nature border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Chargement des partenaires...</p>
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
            <h1 className="text-2xl font-bold text-premium-dark">Gestion des Partenaires</h1>
            <p className="text-text-secondary mt-1">
              Gérez tous les partenaires de l'association VINA
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-semibold rounded-lg hover:from-forest-deep hover:to-premium-dark transition-all shadow-md hover-lift"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau partenaire
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
            placeholder="Rechercher un partenaire..."
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
              <option value="entreprise">Entreprises</option>
              <option value="individu">Individus</option>
              <option value="association">Associations</option>
              <option value="institution">Institutions</option>
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

      {/* Tableau des partenaires */}
      <div className="bg-warm-white rounded-xl shadow-lg overflow-hidden border border-border-light">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-ultra-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Partenaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Type & Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-warm-white divide-y divide-border-light">
              {filteredPartenaires.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-text-secondary">
                      <svg className="w-12 h-12 mx-auto mb-4 text-border-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-lg font-medium text-forest-deep mb-2">
                        {partenaires.length === 0 ? 'Aucun partenaire trouvé' : 'Aucun résultat pour votre recherche'}
                      </p>
                      {partenaires.length === 0 && (
                        <p className="text-sm">Commencez par créer votre premier partenaire</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPartenaires.map((partenaire) => (
                  <tr key={partenaire.id} className="hover:bg-ultra-light transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        {partenaire.logoUrl && (
                          <img
                            src={`https://web-production-03b53.up.railway.app/${partenaire.logoUrl}`}
                            alt={partenaire.nom}
                            className="w-16 h-16 object-contain rounded-lg bg-warm-white p-1 border border-border-light"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Logo';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-premium-dark">{partenaire.nom}</div>
                          <div className="mt-1 text-sm text-text-secondary line-clamp-2">
                            {partenaire.descriptionFr?.substring(0, 100) || 'Pas de description'}
                          </div>
                          {partenaire.siteWeb && (
                            <a
                              href={partenaire.siteWeb}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-2 text-sm text-water-blue hover:text-forest-deep transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Visiter le site
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(partenaire.type)}`}>
                          {getTypeText(partenaire.type)}
                        </span>
                        <div>
                          {partenaire.actif ? (
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
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        {partenaire.email && (
                          <div className="flex items-center text-text-secondary">
                            <svg className="w-4 h-4 mr-2 text-border-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {partenaire.email}
                          </div>
                        )}
                        {partenaire.telephone && (
                          <div className="flex items-center text-text-secondary">
                            <svg className="w-4 h-4 mr-2 text-border-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {partenaire.telephone}
                          </div>
                        )}
                        {partenaire.adresse && (
                          <div className="flex items-start text-text-secondary">
                            <svg className="w-4 h-4 mr-2 text-border-light mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs">{partenaire.adresse}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div className="font-medium text-forest-deep">Début: {formatDate(partenaire.dateDebutPartenaire)}</div>
                      <div className="text-border-light">
                        Créé: {formatDate(partenaire.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(partenaire)}
                          className="p-2 text-water-blue hover:text-forest-deep hover:bg-sky-soft/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(partenaire.id)}
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
      <PartenaireModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPartenaire(null);
        }}
        onSave={handleSave}
        partenaire={editingPartenaire}
      />

      {/* Statistiques */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total partenaires</p>
              <p className="text-2xl font-bold text-premium-dark mt-1">{partenaires.length}</p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/20 rounded-lg flex items-center justify-center border border-olive-nature/30">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Entreprises</p>
              <p className="text-2xl font-bold text-olive-nature mt-1">
                {partenaires.filter(p => p.type === 'entreprise').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/20 rounded-lg flex items-center justify-center border border-olive-nature/30">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Actifs</p>
              <p className="text-2xl font-bold text-water-blue mt-1">
                {partenaires.filter(p => p.actif).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sky-soft/20 rounded-lg flex items-center justify-center border border-sky-soft/30">
              <svg className="w-6 h-6 text-water-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Inactifs</p>
              <p className="text-2xl font-bold text-earth-brown mt-1">
                {partenaires.filter(p => !p.actif).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-earth-brown/20 rounded-lg flex items-center justify-center border border-earth-brown/30">
              <svg className="w-6 h-6 text-earth-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}