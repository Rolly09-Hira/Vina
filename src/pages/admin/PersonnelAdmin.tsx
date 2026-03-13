import { useState, useEffect } from 'react';
import personnelService from '../../services/personnelService';
import PersonnelModal from '../../components/admin/PersonnelModal';
import DeleteConfirmationModal from '../../components/admin/DeleteConfirmationModal';
import type { Personnel } from '../../types/api';

export default function PersonnelAdmin() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departementFilter, setDepartementFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [personnelToDelete, setPersonnelToDelete] = useState<Personnel | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    parDepartement: {} as Record<string, number>
  });

  // Charger les données
  useEffect(() => {
    loadPersonnel();
  }, []);

  // Filtrer quand les filtres changent
  useEffect(() => {
    filterPersonnel();
  }, [personnel, searchTerm, departementFilter]);

  const loadPersonnel = async () => {
    setLoading(true);
    try {
      const data = await personnelService.getAllPersonnel();
      setPersonnel(data);
      
      // Calculer les stats
      const total = data.length;
      const parDepartement: Record<string, number> = {};
      
      data.forEach(p => {
        if (p.departement) {
          const dept = p.departement;
          parDepartement[dept] = (parDepartement[dept] || 0) + 1;
        }
      });
      
      setStats({ total, parDepartement });
      
    } catch (error) {
      console.error('Error loading personnel:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPersonnel = () => {
    let filtered = [...personnel];
    
    // Filtrer par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(term) ||
        p.prenom.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        p.poste.toLowerCase().includes(term)
      );
    }
    
    // Filtrer par département
    if (departementFilter !== 'all') {
      filtered = filtered.filter(p => p.departement === departementFilter);
    }
    
    // Trier par ordre d'affichage
    filtered.sort((a, b) => (a.ordreAffichage || 0) - (b.ordreAffichage || 0));
    
    setFilteredPersonnel(filtered);
  };

  const handleAdd = () => {
    setSelectedPersonnel(null);
    setModalOpen(true);
  };

  const handleEdit = (p: Personnel) => {
    setSelectedPersonnel(p);
    setModalOpen(true);
  };

  const handleDelete = (p: Personnel) => {
    setPersonnelToDelete(p);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (personnelToDelete) {
      try {
        await personnelService.deletePersonnel(personnelToDelete.id);
        await loadPersonnel();
      } catch (error) {
        console.error('Error deleting personnel:', error);
      }
    }
  };

  const getPhotoUrl = (p: Personnel) => {
    if (!p.photoUrl) return null;
    return p.photoUrl.startsWith('http') ? p.photoUrl : `${p.photoUrl}`;
  };

  // Filtrer les départements pour n'avoir que ceux qui existent
  const departements = [...new Set(
    personnel
      .map(p => p.departement)
      .filter((dept): dept is string => dept !== undefined && dept !== null && dept !== '')
  )];

  return (
    <div className="min-h-screen bg-ultra-light">
      {/* En-tête */}
      <div className="bg-warm-white shadow-md border-b border-border-light sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-premium-dark">Gestion du Personnel</h1>
              <p className="text-sm text-text-secondary mt-1">
                {stats.total} membre{stats.total > 1 ? 's' : ''} au total
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white rounded-lg hover:from-forest-deep hover:to-premium-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-olive-nature transition-all shadow-md hover-lift flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter un membre
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        {/* Filtres */}
        <div className="bg-warm-white rounded-lg shadow-lg border border-border-light p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Rechercher par nom, prénom, email, poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg bg-warm-white text-text-dark focus:outline-none focus:ring-2 focus:ring-olive-nature focus:border-olive-nature text-sm"
                />
              </div>
            </div>

            {/* Filtre département */}
            <div className="w-full md:w-64">
              <select
                value={departementFilter}
                onChange={(e) => setDepartementFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-border-light rounded-lg bg-warm-white text-text-dark focus:outline-none focus:ring-2 focus:ring-olive-nature focus:border-olive-nature text-sm"
              >
                <option value="all">Tous les départements</option>
                {departements.map(dept => (
                  <option key={dept} value={dept}>
                    {dept} ({stats.parDepartement[dept] || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste du personnel */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-olive-nature border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPersonnel.length === 0 ? (
          <div className="bg-warm-white rounded-lg shadow-lg border border-border-light p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-ultra-light rounded-full flex items-center justify-center border border-border-light">
              <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-premium-dark mb-2">Aucun membre trouvé</h3>
            <p className="text-text-secondary mb-6">
              {searchTerm || departementFilter !== 'all' 
                ? 'Aucun membre ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter un membre du personnel.'}
            </p>
            {!searchTerm && departementFilter === 'all' && (
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white rounded-lg hover:from-forest-deep hover:to-premium-dark inline-flex items-center shadow-md hover-lift transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter un membre
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonnel.map((person) => (
              <div
                key={person.id}
                className="bg-warm-white rounded-lg shadow-lg border border-border-light overflow-hidden hover:shadow-xl transition-all hover-lift"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      {getPhotoUrl(person) ? (
                        <img
                          src={getPhotoUrl(person)!}
                          alt={`${person.prenom} ${person.nom}`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-olive-nature"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-olive-nature to-forest-deep flex items-center justify-center">
                          <span className="text-warm-white font-bold text-xl">
                            {person.prenom.charAt(0)}{person.nom.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-premium-dark truncate">
                        {person.prenom} {person.nom}
                      </h3>
                      <p className="text-sm text-olive-nature font-medium">{person.poste}</p>
                      {person.departement && (
                        <p className="text-xs text-text-secondary mt-1">{person.departement}</p>
                      )}
                      <p className="text-xs text-text-secondary mt-1 truncate">{person.email}</p>
                      {person.telephone && (
                        <p className="text-xs text-text-secondary">{person.telephone}</p>
                      )}
                    </div>
                  </div>

                  {/* Spécialités */}
                  {person.specialites && (
                    <div className="mt-3">
                      <p className="text-xs text-text-secondary line-clamp-2">{person.specialites}</p>
                    </div>
                  )}

                  {/* Ordre d'affichage */}
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-sky-soft/20 text-water-blue border border-sky-soft/30">
                      Ordre: {person.ordreAffichage || 1}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-end space-x-2 border-t border-border-light pt-3">
                    <button
                      onClick={() => handleEdit(person)}
                      className="p-2 text-water-blue hover:text-forest-deep hover:bg-sky-soft/10 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(person)}
                      className="p-2 text-sun-gold hover:text-earth-brown hover:bg-sun-gold/10 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <PersonnelModal
        isOpen={modalOpen}
        onClose={(reload) => {
          setModalOpen(false);
          if (reload) loadPersonnel();
        }}
        personnel={selectedPersonnel}
        onPersonnelUpdated={loadPersonnel}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer un membre"
        message={`Êtes-vous sûr de vouloir supprimer ${personnelToDelete?.prenom} ${personnelToDelete?.nom} ?`}
      />
    </div>
  );
}