// src/pages/admin/ContactsAdmin.tsx
import { useState, useEffect } from 'react';
import ContactInfoService, { type ContactInfo } from '../../services/contactInfoService';
import ContactInfoModal from '../../components/admin/ContactInfoModal';
import { useStats } from '../../contexts/StatsContext';

export default function ContactsAdmin() {
  const { updateStats } = useStats();
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterActif, setFilterActif] = useState<boolean>(false);

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ContactInfoService.getAllContactsWithDetails();
      setContacts(data);
      
      // Mettre à jour les statistiques globales
      updateStats({ totalContacts: data.length });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des contacts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleCreate = () => {
    setEditingContact(null);
    setShowModal(true);
  };

  const handleEdit = (contact: ContactInfo) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      return;
    }

    try {
      await ContactInfoService.deleteContactInfo(id);
      const newContacts = contacts.filter(c => c.id !== id);
      setContacts(newContacts);
      updateStats({ totalContacts: newContacts.length });
      alert('Contact supprimé avec succès');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleToggleActif = async (id: number) => {
    try {
      const updated = await ContactInfoService.toggleActif(id);
      const newContacts = contacts.map(c => c.id === updated.id ? updated : c);
      setContacts(newContacts);
      alert(`Contact ${updated.actif ? 'activé' : 'désactivé'} avec succès`);
    } catch (err: any) {
      alert(err.message || 'Erreur lors du changement de statut');
    }
  };

  const handleSave = async (contactData: any) => {
    try {
      // Pour les emails, générer automatiquement le lien mailto si non fourni
      if (contactData.typeContact === 'email' && contactData.valeur && !contactData.lien) {
        contactData.lien = `mailto:${contactData.valeur}`;
      }

      if (editingContact) {
        const updated = await ContactInfoService.updateContactInfo(editingContact.id, contactData);
        const newContacts = contacts.map(c => c.id === updated.id ? updated : c);
        setContacts(newContacts);
        updateStats({ totalContacts: newContacts.length });
        alert('Contact modifié avec succès');
      } else {
        const created = await ContactInfoService.createContactInfo(contactData);
        const newContacts = [...contacts, created];
        setContacts(newContacts);
        updateStats({ totalContacts: newContacts.length });
        alert('Contact créé avec succès');
      }
      fetchContacts();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'telephone': return 'bg-water-blue/20 text-water-blue border border-water-blue/30';
      case 'email': return 'bg-olive-nature/20 text-olive-nature border border-olive-nature/30';
      case 'adresse': return 'bg-earth-brown/20 text-earth-brown border border-earth-brown/30';
      case 'reseau_social': return 'bg-sun-gold/20 text-sun-gold border border-sun-gold/30';
      default: return 'bg-ultra-light text-text-secondary border border-border-light';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'telephone': return 'Téléphone';
      case 'email': return 'Email';
      case 'adresse': return 'Adresse';
      case 'reseau_social': return 'Réseau social';
      default: return type;
    }
  };

  const getIconPreview = (icone?: string, type?: string) => {
    if (!icone) {
      switch (type) {
        case 'telephone': return '📞';
        case 'email': return '✉️';
        case 'adresse': return '📍';
        case 'reseau_social': return '🌐';
        default: return '📱';
      }
    }
    
    // Extraire l'emoji de l'icône FontAwesome si présent
    const iconMap: { [key: string]: string } = {
      'fa-phone': '📞',
      'fa-mobile-alt': '📱',
      'fa-whatsapp': '💬',
      'fa-envelope': '✉️',
      'fa-at': '@',
      'fa-map-marker-alt': '📍',
      'fa-home': '🏠',
      'fa-building': '🏢',
      'fa-facebook': '📘',
      'fa-twitter': '🐦',
      'fa-instagram': '📷',
      'fa-linkedin': '💼',
      'fa-youtube': '🎬',
      'fa-telegram': '✈️',
    };
    
    return iconMap[icone] || '📱';
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.valeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.typeContact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || contact.typeContact === filterType;
    const matchesActif = !filterActif || contact.actif;
    
    return matchesSearch && matchesType && matchesActif;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-olive-nature border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Chargement des contacts...</p>
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
            <h1 className="text-2xl font-bold text-premium-dark">Gestion des Contacts</h1>
            <p className="text-text-secondary mt-1">
              Gérez toutes les informations de contact de l'association VINA
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-semibold rounded-lg hover:from-forest-deep hover:to-premium-dark transition-all shadow-md hover-lift"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau contact
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
            placeholder="Rechercher un contact..."
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
              <option value="telephone">Téléphones</option>
              <option value="email">Emails</option>
              <option value="adresse">Adresses</option>
              <option value="reseau_social">Réseaux sociaux</option>
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

      {/* Tableau des contacts */}
      <div className="bg-warm-white rounded-xl shadow-lg overflow-hidden border border-border-light">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-ultra-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Type & Icône
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Ordre & Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-warm-white divide-y divide-border-light">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-text-secondary">
                      <svg className="w-12 h-12 mx-auto mb-4 text-border-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg font-medium text-forest-deep mb-2">
                        {contacts.length === 0 ? 'Aucun contact trouvé' : 'Aucun résultat pour votre recherche'}
                      </p>
                      {contacts.length === 0 && (
                        <p className="text-sm">Commencez par créer votre premier contact</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-ultra-light transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-ultra-light rounded-full flex items-center justify-center flex-shrink-0 border border-border-light">
                          <span className="text-lg">
                            {getIconPreview(contact.icone, contact.typeContact)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-premium-dark truncate">{contact.titre}</div>
                          <div className="text-sm text-text-secondary truncate">{contact.valeur}</div>
                          {contact.lien && (
                            <a
                              href={contact.lien}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-1 text-xs text-water-blue hover:text-forest-deep transition-colors"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {contact.typeContact === 'email' ? 'Envoyer email' : 'Visiter'}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(contact.typeContact)}`}>
                          {getTypeText(contact.typeContact)}
                        </span>
                        {contact.icone && (
                          <div className="text-xs text-text-secondary">
                            <span className="font-medium text-forest-deep">Icône:</span> {contact.icone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm text-text-secondary mr-2">Ordre:</span>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-soft/20 text-water-blue text-xs font-bold border border-sky-soft/30">
                            {contact.ordreAffichage || 1}
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() => handleToggleActif(contact.id)}
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-colors border ${
                              contact.actif
                                ? 'bg-olive-nature/20 text-olive-nature border-olive-nature/30 hover:bg-olive-nature/30'
                                : 'bg-earth-brown/20 text-earth-brown border-earth-brown/30 hover:bg-earth-brown/30'
                            }`}
                          >
                            {contact.actif ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Actif
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Inactif
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(contact)}
                          className="p-2 text-water-blue hover:text-forest-deep hover:bg-sky-soft/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
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
      <ContactInfoModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingContact(null);
        }}
        onSave={handleSave}
        contactInfo={editingContact}
      />

      {/* Statistiques */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total contacts</p>
              <p className="text-2xl font-bold text-premium-dark mt-1">{contacts.length}</p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/20 rounded-lg flex items-center justify-center border border-olive-nature/30">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Téléphones</p>
              <p className="text-2xl font-bold text-water-blue mt-1">
                {contacts.filter(c => c.typeContact === 'telephone').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sky-soft/20 rounded-lg flex items-center justify-center border border-sky-soft/30">
              <svg className="w-6 h-6 text-water-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Emails</p>
              <p className="text-2xl font-bold text-olive-nature mt-1">
                {contacts.filter(c => c.typeContact === 'email').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-olive-nature/20 rounded-lg flex items-center justify-center border border-olive-nature/30">
              <svg className="w-6 h-6 text-olive-nature" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-warm-white p-6 rounded-xl shadow-lg hover-lift border border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Actifs</p>
              <p className="text-2xl font-bold text-sun-gold mt-1">
                {contacts.filter(c => c.actif).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sun-gold/20 rounded-lg flex items-center justify-center border border-sun-gold/30">
              <svg className="w-6 h-6 text-sun-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}