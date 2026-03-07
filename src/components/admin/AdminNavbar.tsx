import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { donService } from '../../services/donService';

interface AdminNavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function AdminNavbar({ toggleSidebar, isSidebarOpen }: AdminNavbarProps) {
  const { user, logout } = useAuth();
  const [donsEnAttente, setDonsEnAttente] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Charger les dons en attente
  useEffect(() => {
    const chargerDonsEnAttente = async () => {
      try {
        const statsDons = await donService.getStatistiques();
        setDonsEnAttente(statsDons.enAttente);
      } catch (error) {
        console.error('Erreur chargement dons en attente:', error);
      }
    };
    
    chargerDonsEnAttente();
    
    // Actualiser toutes les 5 minutes
    const interval = setInterval(chargerDonsEnAttente, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notifications-menu') && !target.closest('.profile-menu')) {
        setShowNotifications(false);
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getAvatarUrl = () => {
    return user?.photoUrl ? `https://web-production-03b53.up.railway.app/${user.photoUrl}` : undefined;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return user.nom.charAt(0).toUpperCase();
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setIsProfileMenuOpen(false);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="bg-warm-white shadow-md border-b border-border-light sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Bouton menu mobile et logo */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-text-secondary hover:text-forest-deep hover:bg-ultra-light md:hidden transition-all duration-200"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Centre : Recherche rapide */}
          <div className="flex-1 max-w-lg mx-4 hidden lg:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Rechercher..."
                className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg bg-ultra-light text-text-dark focus:outline-none focus:ring-2 focus:ring-olive-nature focus:border-olive-nature text-sm transition-all"
              />
            </div>
          </div>

          {/* Droite : Utilisateur et actions */}
          <div className="flex items-center space-x-4">
            {/* Boutons d'action rapide */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Bouton notification avec compteur */}
              <div className="relative notifications-menu">
                <button 
                  onClick={handleNotificationClick}
                  className="p-2 text-text-secondary hover:text-forest-deep hover:bg-ultra-light rounded-lg transition-all duration-200 relative"
                  title="Notifications"
                >
                  <div className="relative">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {donsEnAttente > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] bg-red-500 text-warm-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-red-500/30 animate-pulse">
                        {donsEnAttente > 9 ? '9+' : donsEnAttente}
                      </span>
                    )}
                  </div>
                </button>

                {/* Menu déroulant des notifications */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-warm-white rounded-xl shadow-xl border border-border-light py-2 z-50 animate-fade-in">
                    <div className="px-5 py-3 border-b border-border-light bg-ultra-light rounded-t-xl">
                      <h3 className="font-semibold text-premium-dark flex items-center gap-2">
                        <svg className="w-5 h-5 text-sun-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {donsEnAttente > 0 ? (
                        <Link
                          to="/admin/dons"
                          onClick={() => setShowNotifications(false)}
                          className="flex items-start gap-4 px-5 py-4 hover:bg-ultra-light transition-colors border-b border-border-light last:border-0 group"
                        >
                          <div className="bg-sun-gold/20 p-3 rounded-full flex-shrink-0 border border-sun-gold/30">
                            <svg className="w-5 h-5 text-sun-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-premium-dark">
                              {donsEnAttente} nouvelle{donsEnAttente > 1 ? 's' : ''} intention{donsEnAttente > 1 ? 's' : ''} de don
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              Des personnes souhaitent soutenir VINA
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-medium text-water-blue group-hover:text-forest-deep transition-colors">
                                Cliquez pour voir
                              </span>
                              <svg className="w-4 h-4 text-water-blue group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="px-5 py-12 text-center text-text-secondary">
                          <div className="w-20 h-20 mx-auto bg-ultra-light rounded-full flex items-center justify-center mb-4 border border-border-light">
                            <svg className="w-10 h-10 text-border-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-premium-dark mb-1">Aucune notification</p>
                          <p className="text-xs text-border-light">Vous n'avez pas de nouvelles notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-border-light px-5 py-3 bg-ultra-light rounded-b-xl">
                      <Link
                        to="/admin/dons"
                        onClick={() => setShowNotifications(false)}
                        className="text-sm font-medium text-water-blue hover:text-forest-deep transition-colors block text-center"
                      >
                        Voir toutes les intentions de don
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Séparateur */}
            <div className="hidden md:block h-8 w-px bg-border-light"></div>

            {/* Profile utilisateur */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-premium-dark">{user.nom}</p>
                  <p className="text-xs text-text-secondary capitalize flex items-center justify-end gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${user.role === 'ADMIN' ? 'bg-sun-gold' : 'bg-water-blue'}`}></span>
                    {user.role.toLowerCase()}
                  </p>
                </div>
                
                <div className="relative profile-menu">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 cursor-pointer group focus:outline-none"
                  >
                    {getAvatarUrl() ? (
                      <img
                        src={getAvatarUrl()}
                        alt={user.nom}
                        className="w-10 h-10 rounded-full object-cover border-2 border-olive-nature group-hover:border-accent transition-colors shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-olive-nature to-forest-deep rounded-full flex items-center justify-center text-warm-white font-semibold shadow-md group-hover:shadow-lg transition-all">
                        {getUserInitials()}
                      </div>
                    )}
                    <svg className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-warm-white rounded-xl shadow-xl border border-border-light py-1 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-border-light">
                        <p className="text-sm font-semibold text-premium-dark">{user.nom}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{user.email}</p>
                      </div>
                      <Link
                        to="/admin/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-text-dark hover:bg-ultra-light transition-colors group"
                      >
                        <svg className="w-4 h-4 mr-3 text-water-blue group-hover:text-forest-deep transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mon profil
                      </Link>
                      <div className="border-t border-border-light my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-sun-gold hover:bg-sun-gold/5 transition-colors group"
                      >
                        <svg className="w-4 h-4 mr-3 text-sun-gold group-hover:text-earth-brown transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Rechercher..."
              className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg bg-ultra-light text-text-dark focus:outline-none focus:ring-2 focus:ring-olive-nature focus:border-olive-nature text-sm transition-all"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}