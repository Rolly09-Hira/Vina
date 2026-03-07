// src/components/admin/DonIntentionModal.tsx
import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  DollarSign, 
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Trash2,
  FileText
} from 'lucide-react';
import type { DonIntention } from '../../types/api';

interface DonIntentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  intention: DonIntention | null;
  onUpdateStatut: (id: number, statut: string, notes?: string) => Promise<void>;
  onAddNote: (id: number, note: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>; // 👈 Ajout de onDelete optionnel
}

const DonIntentionModal: React.FC<DonIntentionModalProps> = ({
  isOpen,
  onClose,
  intention,
  onUpdateStatut,
  onAddNote,
  onDelete
}) => {
  const [newNote, setNewNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !intention) return null;

  const handleUpdateStatut = async (statut: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStatut(intention.id, statut);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsUpdating(true);
    try {
      await onAddNote(intention.id, newNote);
      setNewNote('');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete(intention.id);
      onClose();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return <Clock size={16} className="text-sun-gold" />;
      case 'CONTACTE': return <Phone size={16} className="text-water-blue" />;
      case 'CONVERTI': return <CheckCircle size={16} className="text-olive-nature" />;
      case 'PERDU': return <XCircle size={16} className="text-earth-brown" />;
      case 'REPORTE': return <AlertCircle size={16} className="text-sky-soft" />;
      default: return <Clock size={16} className="text-sun-gold" />;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-sun-gold/20 text-sun-gold border border-sun-gold/30';
      case 'CONTACTE': return 'bg-water-blue/20 text-water-blue border border-water-blue/30';
      case 'CONVERTI': return 'bg-olive-nature/20 text-olive-nature border border-olive-nature/30';
      case 'PERDU': return 'bg-earth-brown/20 text-earth-brown border border-earth-brown/30';
      case 'REPORTE': return 'bg-sky-soft/20 text-sky-soft border border-sky-soft/30';
      default: return 'bg-sun-gold/20 text-sun-gold border border-sun-gold/30';
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

  const formatMontant = (montant?: number) => {
    if (!montant) return '-';
    return new Intl.NumberFormat('fr-FR').format(montant) + ' Ar';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-premium-dark bg-opacity-60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-warm-white rounded-2xl shadow-2xl border border-border-light">
          {/* En-tête */}
          <div className="px-6 py-4 bg-gradient-to-r from-olive-nature to-forest-deep flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warm-white bg-opacity-20 rounded-xl">
                <User className="w-5 h-5 text-warm-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-warm-white">Détails de l'intention de don</h3>
                <p className="text-xs text-warm-white text-opacity-90">
                  Référence: DON-{intention.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-warm-white hover:bg-warm-white hover:bg-opacity-20 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Contenu */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {/* Statut actuel */}
            <div className="mb-4 p-4 bg-ultra-light rounded-xl border border-border-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatutIcon(intention.statut)}
                  <span className="font-medium text-premium-dark">Statut actuel:</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(intention.statut)}`}>
                  {intention.statut.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Informations donateur */}
            <div className="mb-4 p-4 bg-ultra-light rounded-xl border border-border-light">
              <h4 className="text-sm font-semibold text-premium-dark mb-3 flex items-center gap-2">
                <User size={16} className="text-water-blue" />
                Informations donateur
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-secondary">Nom complet</p>
                  <p className="text-sm font-medium text-premium-dark">{intention.nomComplet}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <a href={`mailto:${intention.email}`} className="text-sm text-water-blue hover:text-forest-deep">
                    {intention.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Téléphone</p>
                  <a href={`tel:${intention.telephone}`} className="text-sm text-water-blue hover:text-forest-deep">
                    {intention.telephone}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Localisation</p>
                  <p className="text-sm text-premium-dark">
                    {intention.pays || 'Non spécifié'}
                    {intention.ville && `, ${intention.ville}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Informations don */}
            <div className="mb-4 p-4 bg-ultra-light rounded-xl border border-border-light">
              <h4 className="text-sm font-semibold text-premium-dark mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-sun-gold" />
                Détails du don
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-secondary">Montant</p>
                  <p className="text-lg font-bold text-olive-nature">{formatMontant(intention.montant)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Type de montant</p>
                  <p className="text-sm text-premium-dark">
                    {intention.montantType === 'FIXE' ? 'Montant fixe' : 'Montant libre'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Mode de paiement souhaité</p>
                  <p className="text-sm text-premium-dark">
                    {intention.modePaiementSouhaite || 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Date de soumission</p>
                  <p className="text-sm text-premium-dark">{formatDate(intention.dateSoumission)}</p>
                </div>
              </div>
            </div>

            {/* Message */}
            {intention.message && (
              <div className="mb-4 p-4 bg-ultra-light rounded-xl border border-border-light">
                <h4 className="text-sm font-semibold text-premium-dark mb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-sky-soft" />
                  Message du donateur
                </h4>
                <p className="text-sm text-text-dark p-3 bg-warm-white rounded-lg border border-border-light">
                  {intention.message}
                </p>
              </div>
            )}

            {/* Notes internes */}
            <div className="mb-4 p-4 bg-ultra-light rounded-xl border border-border-light">
              <h4 className="text-sm font-semibold text-premium-dark mb-3 flex items-center gap-2">
                <FileText size={16} className="text-earth-brown" />
                Notes internes
              </h4>
              {intention.notesInternes && (
                <div className="mb-3 p-3 bg-warm-white rounded-lg border border-border-light">
                  <p className="text-sm whitespace-pre-wrap text-text-dark">{intention.notesInternes}</p>
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ajouter une note interne..."
                  className="flex-1 px-3 py-2 text-sm border border-border-light rounded-lg focus:ring-2 focus:ring-olive-nature focus:border-olive-nature bg-warm-white resize-none"
                  rows={2}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || isUpdating}
                  className="px-4 py-2 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white rounded-lg hover:from-forest-deep hover:to-premium-dark transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                >
                  <Save size={16} />
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="px-6 py-4 bg-ultra-light border-t border-border-light">
            {/* Confirmation suppression */}
            {showDeleteConfirm && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 mb-2">Êtes-vous sûr de vouloir supprimer cette intention ?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Oui, supprimer
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <select
                  onChange={(e) => handleUpdateStatut(e.target.value)}
                  disabled={isUpdating}
                  className="px-3 py-2 border border-border-light rounded-lg text-sm focus:ring-2 focus:ring-olive-nature bg-warm-white"
                  value={intention.statut}
                >
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="CONTACTE">Contacté</option>
                  <option value="CONVERTI">Converti</option>
                  <option value="PERDU">Perdu</option>
                  <option value="REPORTE">Reporté</option>
                </select>
                
                {onDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 text-earth-brown hover:text-warm-white border border-earth-brown/30 hover:bg-earth-brown rounded-lg transition-all flex items-center gap-2 text-sm"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-warm-white border border-border-light rounded-lg hover:bg-ultra-light transition-all text-text-secondary text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonIntentionModal;