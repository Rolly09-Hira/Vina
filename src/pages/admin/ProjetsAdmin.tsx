// src/pages/admin/ProjetsAdmin.tsx
import { useState, useEffect } from 'react';
import ProjetService, { type Projet } from '../../services/projetService';
import ProjetModal from '../../components/admin/ProjetModal';
import { useStats } from '../../contexts/StatsContext';

export default function ProjetsAdmin() {
  const { updateStats } = useStats();
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProjet, setEditingProjet] = useState<Projet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjets = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ProjetService.getAllProjets();
      setProjets(data);
      
      // Calculer les statistiques avancées
      const totalBeneficiaires = data.reduce((acc, p) => acc + (p.beneficiaires || 0), 0);
      const projetsAvecRegion = data.filter(p => p.region).length;
      
      // Mettre à jour les statistiques globales
      updateStats({ 
        totalProjets: data.length,
        totalBeneficiaires,
        projetsAvecRegion
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des projets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjets();
  }, []);

  const handleCreate = () => {
    setEditingProjet(null);
    setShowModal(true);
  };

  const handleEdit = (projet: Projet) => {
    setEditingProjet(projet);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      await ProjetService.deleteProjet(id);
      const newProjets = projets.filter(p => p.id !== id);
      setProjets(newProjets);
      
      // Recalculer les stats après suppression
      const totalBeneficiaires = newProjets.reduce((acc, p) => acc + (p.beneficiaires || 0), 0);
      updateStats({ 
        totalProjets: newProjets.length,
        totalBeneficiaires
      });
      
      alert('Projet supprimé avec succès');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (editingProjet) {
        const updated = await ProjetService.updateProjet(editingProjet.id, formData);
        const newProjets = projets.map(p => p.id === updated.id ? updated : p);
        setProjets(newProjets);
        
        // Recalculer les stats après modification
        const totalBeneficiaires = newProjets.reduce((acc, p) => acc + (p.beneficiaires || 0), 0);
        updateStats({ 
          totalProjets: newProjets.length,
          totalBeneficiaires
        });
        
        alert('Projet modifié avec succès');
      } else {
        const created = await ProjetService.createProjet(formData);
        const newProjets = [...projets, created];
        setProjets(newProjets);
        
        // Recalculer les stats après création
        const totalBeneficiaires = newProjets.reduce((acc, p) => acc + (p.beneficiaires || 0), 0);
        updateStats({ 
          totalProjets: newProjets.length,
          totalBeneficiaires
        });
        
        alert('Projet créé avec succès');
      }
      fetchProjets(); // Recharger les données pour avoir les dernières infos
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_cours': return 'bg-olive-nature/10 text-olive-nature border border-olive-nature/30';
      case 'termine': return 'bg-water-blue/10 text-water-blue border border-water-blue/30';
      case 'a_venir': return 'bg-sun-gold/10 text-sun-gold border border-sun-gold/30';
      case 'suspendu': return 'bg-earth-brown/10 text-earth-brown border border-earth-brown/30';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      case 'a_venir': return 'À venir';
      case 'suspendu': return 'Suspendu';
      default: return statut;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatNumber = (num?: number) => {
    return num ? num.toLocaleString('fr-FR') : '-';
  };

  const filteredProjets = projets.filter(projet =>
    projet.titreFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.titreEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.descriptionFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.domaineFr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.region?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border-light rounded-full"></div>
          <div className="w-12 h-12 border-4 border-olive-nature border-t-transparent rounded-full animate-spin absolute top-0"></div>
          <p className="text-forest-deep mt-4">Chargement des projets...</p>
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
            <h1 className="text-2xl font-bold text-forest-deep">Gestion des Projets</h1>
            <p className="text-text-secondary mt-1">
              Gérez tous les projets de l'association VINA
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-semibold rounded-lg hover:from-forest-deep hover:to-premium-dark transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau projet
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

      {/* Barre de recherche */}
      <div className="mb-6">
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
            placeholder="Rechercher un projet par titre, description, domaine ou région..."
            className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature transition-all bg-warm-white"
          />
        </div>
      </div>

      {/* Tableau des projets */}
      <div className="bg-warm-white rounded-xl shadow-lg border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-ultra-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Projet (FR/EN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Domaine / Région
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Bénéficiaires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Statut
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
              {filteredProjets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-text-secondary">
                      <svg className="w-12 h-12 mx-auto mb-4 text-text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-lg font-medium mb-2 text-forest-deep">
                        {projets.length === 0 ? 'Aucun projet trouvé' : 'Aucun résultat pour votre recherche'}
                      </p>
                      {projets.length === 0 && (
                        <p className="text-sm text-text-secondary">Commencez par créer votre premier projet</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjets.map((projet) => (
                  <tr key={projet.id} className="hover:bg-ultra-light transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-forest-deep">{projet.titreFr}</div>
                        <div className="text-sm text-text-secondary italic">{projet.titreEn}</div>
                        <div className="mt-1 text-sm text-text-secondary line-clamp-2">
                          {projet.descriptionFr.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {projet.imageUrl ? (
                        <img
                          src={`https://web-production-03b53.up.railway.app/${projet.imageUrl}`}
                          alt={projet.titreFr}
                          className="w-16 h-16 object-cover rounded-lg border border-border-light"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-ultra-light rounded-lg flex items-center justify-center border border-border-light">
                          <span className="text-text-secondary text-xs">Aucune image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-1">
                        <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                          {projet.domaineFr}
                        </span>
                      </div>
                      {projet.region && (
                        <div className="flex items-center text-sm text-text-secondary">
                          <svg className="w-4 h-4 mr-1 text-sun-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {projet.region.nom}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-forest-deep">
                        {formatNumber(projet.beneficiaires)}
                      </div>
                      <div className="text-xs text-text-secondary">personnes</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(projet.statut)}`}>
                        {getStatusText(projet.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div className="font-medium">Début: {formatDate(projet.dateDebut)}</div>
                      {projet.dateFin && (
                        <div className="text-text-secondary">
                          Fin: {formatDate(projet.dateFin)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(projet)}
                          className="p-2 text-water-blue hover:text-white hover:bg-water-blue rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(projet.id)}
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
      <ProjetModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProjet(null);
        }}
        onSave={handleSave}
        projet={editingProjet}
      />

      {/* Statistiques améliorées */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-warm-white p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total projets</p>
              <p className="text-2xl font-bold text-forest-deep mt-1">{projets.length}</p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-warm-white p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Bénéficiaires</p>
              <p className="text-2xl font-bold text-water-blue mt-1">
                {formatNumber(projets.reduce((acc, p) => acc + (p.beneficiaires || 0), 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-water-blue/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-water-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-warm-white p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">En cours</p>
              <p className="text-2xl font-bold text-sun-gold mt-1">
                {projets.filter(p => p.statut === 'en_cours').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sun-gold/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-sun-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-warm-white p-6 rounded-xl shadow-lg border border-border-light hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Régions couvertes</p>
              <p className="text-2xl font-bold text-earth-brown mt-1">
                {new Set(projets.filter(p => p.region).map(p => p.region?.id)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-earth-brown/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-earth-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2 2 2 4-4 2 2 2-2 2 2 2-2 2 2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21v-7m4 7v-7m4 7v-7m4 7v-7m4 7v-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}