// src/components/admin/AdminSidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useStats } from '../../contexts/StatsContext';
import { useAuth } from '../../contexts/AuthContext';
import logoSrc from '../../assets/VraiLogo.jpg'; // Assurez-vous que le chemin est correct

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
  adminOnly?: boolean;
}

export default function AdminSidebar({ isOpen, closeSidebar }: AdminSidebarProps) {
  const location = useLocation();
  const { stats } = useStats();
  const { user } = useAuth();

  // Palette de couleurs VINA - harmonisée
  const colors = {
    primary: '#2F5D2F',      // Vert foncé (texte principal, titres)
    secondary: '#4E8B3A',    // Vert mousse (accents)
    accent: '#6FBF4A',       // Vert jeune (badges actifs, bordures actives)
    earth: '#6B4F3A',        // Brun terre (texte secondaire, icônes inactives)
    sky: '#87CFEA',          // Bleu ciel (fonds légers, admin tag)
    water: '#2C7FB8',        // Bleu terre (non utilisé ici)
    lightBg: '#F4F8F9',      // Blanc lumière (fond de la sidebar)
    lightGray: '#E5E7EB',    // Gris très clair (bordures, fonds de badges inactifs)
    mediumGray: '#9CA3AF',   // Gris moyen (texte désactivé)
    white: '#FFFFFF',
    black: '#1F2937',
    activeBg: '#F0F9F0',     // Vert très pâle pour fond actif
    hoverBg: '#F3F4F6',      // Gris clair pour survol
  };

  // Items de navigation
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
    {
      label: 'Régions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/admin/regions',
      badge: stats.totalRegions
    },
    {
      label: 'Personnel',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/admin/personnel',
      badge: stats.totalPersonnel
    },
  ];

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
    }
  ];

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

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  const formatBadge = (badge?: number | string) => {
    if (badge === undefined || badge === null) return null;
    const value = typeof badge === 'number' ? badge : parseInt(badge.toString());
    if (value === 0) return null;
    if (value > 99) return '99+';
    return value;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return user.nom.charAt(0).toUpperCase();
  };

  return (
    <>
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          flex flex-col h-screen border-r shadow-xl
          w-64 flex-shrink-0
        `}
        style={{ backgroundColor: colors.lightBg, borderColor: colors.lightGray }}
      >
        {/* En-tête avec logo */}
        <div className="p-6 border-b flex-shrink-0" style={{ borderColor: colors.lightGray }}>
          <div className="flex items-center space-x-3">
            {/* Logo en cercle comme dans la navbar */}
            <div className={`
              relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden transition-all duration-300
              ring-2 ring-[#6FBF4A] shadow-lg
            `}>
              <img 
                src={logoSrc} 
                alt="VINA Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: colors.primary }}>VINA</h2>
              <p className="text-xs" style={{ color: colors.earth }}>
                {user ? `${user.nom} (${user.role === 'ADMIN' ? 'Admin' : 'Éditeur'})` : 'Administration'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            <div className="px-3 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.earth }}>
                Navigation
              </p>
            </div>

            {navItems.map((item) => {
              const badgeValue = formatBadge(item.badge);
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: active ? colors.activeBg : 'transparent',
                    color: active ? colors.primary : colors.earth,
                    borderLeft: active ? `4px solid ${colors.accent}` : '4px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = colors.hoverBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span style={{ color: active ? colors.accent : colors.earth }}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.adminOnly && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: colors.sky, color: colors.primary }}
                      >
                        Admin
                      </span>
                    )}
                  </div>
                  {badgeValue !== null && (
                    <span
                      className="inline-flex items-center justify-center min-w-[24px] px-2 py-1 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: active ? colors.accent : colors.lightGray,
                        color: active ? colors.white : colors.earth,
                      }}
                    >
                      {badgeValue}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Section Mon compte */}
            <div className="px-3 mt-8 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.earth }}>
                Mon compte
              </p>
            </div>

            <Link
              to="/admin/profile"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: location.pathname === '/admin/profile' ? colors.activeBg : 'transparent',
                color: location.pathname === '/admin/profile' ? colors.primary : colors.earth,
                borderLeft: location.pathname === '/admin/profile' ? `4px solid ${colors.accent}` : '4px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/admin/profile') {
                  e.currentTarget.style.backgroundColor = colors.hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/admin/profile') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ color: location.pathname === '/admin/profile' ? colors.accent : colors.earth }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span className="text-sm font-medium">Mon profil</span>
            </Link>
          </nav>
        </div>

        {/* Pied de page */}
        <div className="p-4 border-t flex-shrink-0" style={{ borderColor: colors.lightGray }}>
          <div className="px-3 mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.earth }}>
              Accès rapide
            </p>
          </div>

          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200"
            style={{ color: colors.earth }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hoverBg}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ color: colors.earth }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span className="text-sm">Retour au site</span>
          </Link>

          {/* Profil utilisateur */}
          <div className="mt-4 px-4 py-3 rounded-lg" style={{ backgroundColor: colors.lightGray }}>
            <div className="flex items-center space-x-3">
              {user?.photoUrl ? (
                <img
                  src={`http://localhost:5005/${user.photoUrl}`}
                  alt={user.nom}
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ borderColor: colors.accent, borderWidth: '2px' }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                >
                  {getUserInitials()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: colors.primary }}>
                  {user ? user.nom : 'Chargement...'}
                </p>
                <p className="text-xs" style={{ color: colors.earth }}>
                  {user ? `${user.role.toLowerCase()} • Connecté` : 'Déconnecté'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}