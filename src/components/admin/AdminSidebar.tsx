// src/components/admin/AdminSidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useStats } from '../../contexts/StatsContext';
import { useAuth } from '../../contexts/AuthContext';
import logoSrc from '../../assets/VraiLogo.jpg';

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

  // Palette de couleurs VINA - harmonisée avec tes variables CSS
  const colors = {
    primary: 'var(--olive-nature)',      // #6B7333
    primaryDark: 'var(--forest-deep)',    // #4E5523
    premium: 'var(--premium-dark)',       // #3E4420
    secondary: 'var(--light-moss)',       // #8A9450
    accent: 'var(--sun-gold)',            // #E0B93B
    accentLight: 'var(--soft-sun)',        // #F3D77A
    earth: 'var(--earth-brown)',           // #6B4F3A
    water: 'var(--water-blue)',            // #2C7FB8
    sky: 'var(--sky-soft)',                // #87CFEA
    lightBg: 'var(--warm-white)',          // #F2F2E9
    ultraLight: 'var(--ultra-light)',      // #F7F8F1
    border: 'var(--border-light)',          // #E5E7EB
    textSecondary: 'var(--text-secondary)', // #6B7280
    textDark: 'var(--text-dark)',           // #333333
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
    },
    {
      label: 'Dons',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      path: '/admin/dons',
      badge: stats.totalDonsIntentions
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
          w-64 flex-shrink-0 overflow-hidden
        `}
        style={{ 
          backgroundColor: colors.lightBg, 
          borderColor: colors.border 
        }}
      >
        {/* En-tête avec logo - Hauteur fixe */}
        <div className="p-4 border-b flex-shrink-0" style={{ borderColor: colors.border, minHeight: '80px' }}>
          <div className="flex items-center space-x-3">
            {/* Logo en cercle - Correction du ring */}
            <div 
              className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden transition-all duration-300 shadow-lg flex-shrink-0"
              style={{ 
                boxShadow: `0 0 0 2px ${colors.accent}, 0 4px 6px -1px rgba(0, 0, 0, 0.1)` 
              }}
            >
              <img 
                src={logoSrc} 
                alt="VINA Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold truncate" style={{ color: colors.primary }}>VINA Madagascar</h2>
              <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                {user ? `${user.nom} (${user.role === 'ADMIN' ? 'Admin' : 'Éditeur'})` : 'Administration'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Zone scrollable avec hauteur calculée */}
        <div className="flex-1 overflow-y-auto py-4 px-3 sidebar-scrollable" style={{ backgroundColor: colors.lightBg }}>
          <nav className="space-y-1">
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
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
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group"
                  style={{
                    backgroundColor: active ? `${colors.primary}10` : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = `${colors.primary}08`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <span className="flex-shrink-0" style={{ 
                      color: active ? colors.accent : colors.textSecondary,
                      transition: 'color 0.2s'
                    }}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium truncate" style={{ 
                      color: active ? colors.primary : colors.textSecondary,
                      transition: 'color 0.2s'
                    }}>
                      {item.label}
                    </span>
                    {item.adminOnly && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: `${colors.sky}20`, 
                          color: colors.water,
                          border: `1px solid ${colors.sky}30`
                        }}
                      >
                        Admin
                      </span>
                    )}
                  </div>
                  {badgeValue !== null && (
                    <span
                      className="inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 text-xs font-bold rounded-full flex-shrink-0 ml-2"
                      style={{
                        backgroundColor: active ? colors.accent : `${colors.textSecondary}15`,
                        color: active ? colors.lightBg : colors.textSecondary,
                      }}
                    >
                      {badgeValue}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Section Mon compte */}
            <div className="px-3 mt-6 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                Mon compte
              </p>
            </div>

            <Link
              to="/admin/profile"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group"
              style={{
                backgroundColor: location.pathname === '/admin/profile' ? `${colors.primary}10` : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/admin/profile') {
                  e.currentTarget.style.backgroundColor = `${colors.primary}08`;
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/admin/profile') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className="flex-shrink-0" style={{ 
                color: location.pathname === '/admin/profile' ? colors.accent : colors.textSecondary 
              }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span className="text-sm font-medium truncate" style={{ 
                color: location.pathname === '/admin/profile' ? colors.primary : colors.textSecondary 
              }}>
                Mon profil
              </span>
            </Link>
          </nav>
        </div>

        {/* Pied de page - Hauteur fixe */}
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: colors.border, backgroundColor: colors.ultraLight }}>
          <div className="px-2 mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
              Accès rapide
            </p>
          </div>

          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 group mb-3"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}08`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span className="flex-shrink-0 group-hover:text-forest-deep transition-colors" style={{ color: colors.textSecondary }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span className="text-sm group-hover:text-forest-deep transition-colors truncate">Retour au site</span>
          </Link>

          {/* Profil utilisateur */}
          <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: `${colors.border}40` }}>
            <div className="flex items-center space-x-3">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.nom}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  style={{ borderColor: colors.accent, borderWidth: '2px' }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-warm-white font-semibold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}
                >
                  {getUserInitials()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ color: colors.primary }}>
                  {user ? user.nom : 'Chargement...'}
                </p>
                <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
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