// src/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay pour fermer la sidebar (mobile seulement) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar fixe */}
      <AdminSidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      
      {/* Contenu principal (navbar + outlet) */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar fixe en haut */}
        <div className="sticky top-0 z-30">
          <AdminNavbar 
            toggleSidebar={toggleSidebar} 
            isSidebarOpen={isSidebarOpen} 
            closeSidebar={closeSidebar}
          />
        </div>
        
        {/* Main content - scrollable indépendamment */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile menu button fixé en bas */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-50 md:hidden p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  );
}