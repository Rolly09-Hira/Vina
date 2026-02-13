// src/components/admin/AdminSidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useStats } from '../../contexts/StatsContext';
import { useAuth } from '../../contexts/AuthContext'; // Ajout de l'import

interface AdminSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number | string;
  children?: NavItem[];
  adminOnly?: boolean; // Nouvelle propriété pour restreindre l'accès
}

export default function AdminSidebar({ isOpen, closeSidebar }: AdminSidebarProps) {
  const location = useLocation();
  const { stats } = useStats();
  const { user } = useAuth(); // Récupérer l'utilisateur connecté

  // Items de navigation de base (accessibles à tous)
  const baseNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/admin'
    },
    {
      label: 'Projets',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      path: '/admin/projets',
      badge: stats.totalProjets
    },
    {
      label: 'Actualités',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      path: '/admin/actualites',
      badge: stats.totalActualites
    },
    {
      label: 'Témoignages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      path: '/admin/temoignages',
      badge: stats.totalTemoignages
    },
    {
      label: 'Partenaires',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/admin/partenaires',
      badge: stats.totalPartenaires
    },
    {
      label: 'Missions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/admin/missions',
      badge: stats.totalMissions
    },
    {
      label: 'Contacts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      path: '/admin/contacts',
      badge: stats.totalContacts
    },
  ];

  // Items de navigation seulement pour les administrateurs
  const adminOnlyNavItems: NavItem[] = [
    {
      label: 'Utilisateurs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.66 0-1.293-.14-1.872-.396a6 6 0 01-3.156-5.268 6 6 0 013.156-5.268A5.99 5.99 0 0121 4v1a6 6 0 01-6 6z" />
        </svg>
      ),
      path: '/admin/utilisateurs',
      badge: stats.totalUtilisateurs,
      adminOnly: true
    },
    // Vous pouvez ajouter d'autres items admin-only ici
    {
      label: 'Paramètres',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/admin/parametres',
      adminOnly: true
    },
  ];

  // Combiner les items en fonction du rôle de l'utilisateur
  const getNavItems = () => {
    if (user?.role === 'ADMIN') {
      return [...baseNavItems, ...adminOnlyNavItems];
    }
    return baseNavItems;
  };

  const navItems = getNavItems();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Fonction pour fermer la sidebar au clic sur un lien (mobile seulement)
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  // Fonction pour formater le badge (ne pas afficher 0)
  const formatBadge = (badge?: number | string) => {
    if (badge === undefined || badge === null) return null;
    
    const value = typeof badge === 'number' ? badge : parseInt(badge.toString());
    if (value === 0) return null;
    
    if (value > 99) return '99+';
    return value;
  };

  // Fonction pour obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user) return 'U';
    return user.nom.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Sidebar FIXE */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col h-screen bg-white border-r border-gray-200
        w-64 flex-shrink-0
      `}>
        {/* Logo de la sidebar - fixe */}
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin VINA</h2>
              <p className="text-xs text-gray-500">
                {user ? `${user.nom} (${user.role === 'ADMIN' ? 'Administrateur' : 'Éditeur'})` : 'Tableau de bord'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - scrollable indépendante */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-6 space-y-1">
            {/* Section principale */}
            <div className="px-3 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navigation Principale
              </p>
            </div>
            
            {navItems.map((item) => {
              const badgeValue = formatBadge(item.badge);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg transition-all
                    ${isActive(item.path)
                      ? 'bg-gradient-to-r from-green-50 to-teal-50 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${item.adminOnly ? 'relative' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      ${isActive(item.path) ? 'text-green-600' : 'text-gray-500'}
                    `}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {item.adminOnly && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  {badgeValue !== null && (
                    <span className={`
                      inline-flex items-center justify-center min-w-[24px] px-2 py-1 text-xs font-bold
                      ${isActive(item.path)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                      } rounded-full
                    `}>
                      {badgeValue}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Section Outils */}
            <div className="px-3 mt-8 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Outils
              </p>
            </div>

            <button 
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <div className="text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-medium">Statistiques</span>
            </button>

            <button 
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <div className="text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-medium">Rapports</span>
            </button>

            {/* Section Profile (toujours visible) */}
            <div className="px-3 mt-8 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mon compte
              </p>
            </div>

            <Link
              to="/admin/profile"
              onClick={handleLinkClick}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                ${location.pathname === '/admin/profile'
                  ? 'bg-gradient-to-r from-green-50 to-teal-50 text-green-700 border-l-4 border-green-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className={`
                ${location.pathname === '/admin/profile' ? 'text-green-600' : 'text-gray-500'}
              `}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="font-medium">Mon profil</span>
            </Link>
          </nav>
        </div>

        {/* Pied de page de la sidebar - fixe en bas */}
        <div className="p-4 border-t flex-shrink-0">
          <div className="px-3 mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Accès rapide
            </p>
          </div>
          
          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors mb-2"
          >
            <div className="text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="font-medium">Retour au site</span>
          </Link>

          {/* Affichage du profil utilisateur */}
          <div className="px-4 py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {user?.photoUrl ? (
                <img
                  src={`http://localhost:5005/${user.photoUrl}`}
                  alt={user.nom}
                  className="w-8 h-8 rounded-full object-cover border border-green-500"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {getUserInitials()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user ? user.nom : 'Chargement...'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user ? `${user.role.toLowerCase()} • Connecté` : 'Déconnecté'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}