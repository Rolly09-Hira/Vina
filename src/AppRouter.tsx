// src/AppRouter.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Login from './pages/public/Login';
import Dashboard from './pages/admin/Dashboard';
import ProjetsAdmin from './pages/admin/ProjetsAdmin';
import NotFoundPage from './pages/NotFoundPage';
import ActualitesAdmin from './pages/admin/ActualitesAdmin';
import PartenairesAdmin from './pages/admin/PartenairesAdmin';
import MissionsAdmin from './pages/admin/MissionsAdmin';
import ContactsAdmin from './pages/admin/ContactsAdmin';
import TemoignagesAdmin from './pages/admin/TemoignagesAdmin';
import Personnel from './pages/public/Personnel'; 

// Composant pour remonter en haut à chaque changement de route
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // 'smooth' pour animation douce, 'instant' pour immédiat
    });
  }, [pathname]);

  return null;
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Routes admin protégées */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projets" element={<ProjetsAdmin />} />
          <Route path="actualites" element={<ActualitesAdmin />} />
          <Route path="partenaires" element={<PartenairesAdmin />} />
          <Route path="missions" element={<MissionsAdmin />} />
          <Route path="contacts" element={<ContactsAdmin />} />
          <Route path="temoignages" element={<TemoignagesAdmin />} />
        </Route>
      </Routes>
    </>
  );
}