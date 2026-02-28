import React, { useState } from 'react';
import type { DonIntention } from '../../types/api';
import { X, Phone, Mail, MapPin, Calendar, DollarSign, CreditCard, MessageSquare, FileText, User } from 'lucide-react';

interface DonIntentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  intention: DonIntention | null;
  onUpdateStatut: (id: number, statut: string, notes?: string) => void;
  onAddNote: (id: number, note: string) => void;
}

const DonIntentionModal: React.FC<DonIntentionModalProps> = ({
  isOpen,
  onClose,
  intention,
  onUpdateStatut,
  onAddNote
}) => {
  const [newNote, setNewNote] = useState('');
  const [selectedStatut, setSelectedStatut] = useState<DonIntention['statut']>(intention?.statut || 'EN_ATTENTE');

  if (!isOpen || !intention) return null;

  const statutOptions: { value: DonIntention['statut']; label: string; color: string }[] = [
    { value: 'EN_ATTENTE', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONTACTE', label: 'Contacté', color: 'bg-blue-100 text-blue-800' },
    { value: 'CONVERTI', label: 'Converti', color: 'bg-green-100 text-green-800' },
    { value: 'PERDU', label: 'Perdu', color: 'bg-red-100 text-red-800' },
    { value: 'REPORTE', label: 'Reporté', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleStatutChange = () => {
    onUpdateStatut(intention.id, selectedStatut, newNote || undefined);
    setNewNote('');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(intention.id, newNote);
      setNewNote('');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMontant = (montant?: number) => {
    if (!montant) return 'Non spécifié';
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Détails de l'intention de don
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Corps */}
        <div className="p-6 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-vert-fonce">Informations personnelles</h3>
              
              <div className="flex items-center gap-3">
                <div className="bg-bleu-ciel bg-opacity-20 p-2 rounded-full">
                  <User size={20} className="text-bleu-terre" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">{intention.nomComplet}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-bleu-ciel bg-opacity-20 p-2 rounded-full">
                  <Mail size={20} className="text-bleu-terre" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${intention.email}`} className="font-medium text-bleu-terre hover:underline">
                    {intention.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-bleu-ciel bg-opacity-20 p-2 rounded-full">
                  <Phone size={20} className="text-bleu-terre" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <a href={`tel:${intention.telephone}`} className="font-medium">
                    {intention.telephone}
                  </a>
                </div>
              </div>

              {intention.pays && (
                <div className="flex items-center gap-3">
                  <div className="bg-bleu-ciel bg-opacity-20 p-2 rounded-full">
                    <MapPin size={20} className="text-bleu-terre" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-medium">
                      {intention.ville ? `${intention.ville}, ` : ''}{intention.pays}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-vert-fonce">Détails du don</h3>
              
              <div className="flex items-center gap-3">
                <div className="bg-vert-jeune bg-opacity-20 p-2 rounded-full">
                  <DollarSign size={20} className="text-vert-mousse" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Montant</p>
                  <p className="font-medium text-lg">{formatMontant(intention.montant)}</p>
                </div>
              </div>

              {intention.modePaiementSouhaite && (
                <div className="flex items-center gap-3">
                  <div className="bg-vert-jeune bg-opacity-20 p-2 rounded-full">
                    <CreditCard size={20} className="text-vert-mousse" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mode de paiement souhaité</p>
                    <p className="font-medium">{intention.modePaiementSouhaite}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="bg-vert-jeune bg-opacity-20 p-2 rounded-full">
                  <Calendar size={20} className="text-vert-mousse" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de soumission</p>
                  <p className="font-medium">{formatDate(intention.dateSoumission)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message du donateur */}
          {intention.message && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={18} className="text-gray-600" />
                <h3 className="font-semibold text-gray-700">Message du donateur</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{intention.message}</p>
            </div>
          )}

          {/* Notes internes */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-700">Notes internes</h3>
            </div>

            {intention.notesInternes && (
              <div className="bg-gray-50 p-3 rounded mb-3 whitespace-pre-wrap text-sm">
                {intention.notesInternes}
              </div>
            )}

            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vert-jeune"
                rows={2}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="bg-vert-jeune text-white px-4 py-2 rounded-lg hover:bg-vert-mousse disabled:opacity-50 disabled:cursor-not-allowed self-end"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Changement de statut */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Changer le statut</h3>
            <div className="flex flex-wrap gap-2">
              {statutOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatut(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatut === option.value
                      ? option.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleStatutChange}
              disabled={selectedStatut === intention.statut}
              className="mt-3 bg-vert-fonce text-white px-6 py-2 rounded-lg hover:bg-vert-mousse disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mettre à jour le statut
            </button>
          </div>

          {/* Tracking UTM (caché par défaut, voir dans la console) */}
          {(intention.utmSource || intention.utmMedium || intention.utmCampaign) && (
            <div className="border-t pt-4">
              <details className="text-sm">
                <summary className="font-semibold text-gray-700 cursor-pointer">
                  Informations de tracking
                </summary>
                <div className="mt-2 space-y-1 text-gray-600">
                  {intention.utmSource && <p>Source: {intention.utmSource}</p>}
                  {intention.utmMedium && <p>Medium: {intention.utmMedium}</p>}
                  {intention.utmCampaign && <p>Campagne: {intention.utmCampaign}</p>}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonIntentionModal;