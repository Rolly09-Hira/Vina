// src/pages/auth/Login.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowLeft, 
  FaShieldAlt,
  FaLeaf,
  FaTree,
  FaSeedling
} from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('admin@vina.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = location.state?.from || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const sessionCheck = await authService.checkSession();
        console.log('Session after login:', sessionCheck);
        
        if (sessionCheck.success && sessionCheck.authenticated) {
          const from = location.state?.from || '/admin';
          navigate(from, { replace: true });
        } else {
          setError('Session non établie après connexion');
        }
      } else {
        setError(result.message || 'Email ou mot de passe incorrect');
      }
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // Si en cours de vérification d'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2F5D2F] to-[#2C7FB8] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6FBF4A]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-20 opacity-10">
            <FaLeaf className="w-32 h-32 text-white" />
          </div>
        </div>
        <div className="relative bg-white/95 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/30 text-center max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[#6FBF4A] to-[#2C7FB8] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <FaShieldAlt className="w-10 h-10 text-white" />
          </div>
          <div className="w-12 h-12 border-4 border-[#6FBF4A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2F5D2F] font-medium text-lg">Vérification en cours...</p>
          <p className="text-[#6E8FA3] text-sm mt-2">Préparation de votre espace sécurisé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2F5D2F] to-[#2C7FB8] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6FBF4A]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#87CFEA]/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F2D16B]/10 rounded-full blur-3xl"></div>
        
        {/* Motifs flottants */}
        <div className="absolute top-20 left-20 opacity-20 animate-float">
          <FaTree className="w-32 h-32 text-white" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20 animate-float animation-delay-3000">
          <FaSeedling className="w-32 h-32 text-white" />
        </div>
        
        {/* Grille décorative */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Carte de connexion */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/30 transform transition-all duration-500 hover:shadow-3xl">
          
          {/* En-tête premium */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6FBF4A] to-[#2C7FB8] rounded-2xl blur-xl opacity-70"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#6FBF4A] to-[#2C7FB8] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-white font-bold text-3xl">V</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-[#2F5D2F] mb-2">
              Espace Administrateur
            </h2>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-[#6FBF4A] rounded-full"></div>
              <p className="text-sm text-[#6E8FA3] font-medium">
                Accès sécurisé • Personnel autorisé uniquement
              </p>
              <div className="w-2 h-2 bg-[#2C7FB8] rounded-full"></div>
            </div>
            
            <div className="w-20 h-1 bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] mx-auto mt-4 rounded-full"></div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Message d'erreur premium */}
            {error && (
              <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl animate-shake">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Champ Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-[#2F5D2F]">
                Adresse email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-[#6E8FA3] group-focus-within:text-[#6FBF4A] transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-[#87CFEA]/30 rounded-xl bg-white/80 backdrop-blur-sm placeholder-[#8C857C]/60 focus:outline-none focus:border-[#6FBF4A] focus:ring-2 focus:ring-[#6FBF4A]/20 transition-all duration-300 text-[#2F5D2F] font-medium"
                  placeholder="admin@vina.org"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs text-[#6FBF4A] bg-[#6FBF4A]/10 px-2 py-1 rounded-full">admin</span>
                </div>
              </div>
            </div>
            
            {/* Champ Mot de passe avec affichage/cachage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-[#2F5D2F]">
                  Mot de passe
                </label>
                <button 
                  type="button"
                  className="text-xs text-[#2C7FB8] hover:text-[#6FBF4A] transition-colors font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#6E8FA3] group-focus-within:text-[#6FBF4A] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border-2 border-[#87CFEA]/30 rounded-xl bg-white/80 backdrop-blur-sm placeholder-[#8C857C]/60 focus:outline-none focus:border-[#6FBF4A] focus:ring-2 focus:ring-[#6FBF4A]/20 transition-all duration-300 text-[#2F5D2F] font-medium"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6E8FA3] hover:text-[#6FBF4A] transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Se souvenir de moi */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#6FBF4A] focus:ring-[#6FBF4A] border-[#87CFEA]/30 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#6E8FA3]">
                  Se souvenir de moi
                </label>
              </div>
              
              <div className="flex items-center space-x-1">
                <FaShieldAlt className="w-3 h-3 text-[#6FBF4A]" />
                <span className="text-xs text-[#6E8FA3]">Connexion sécurisée</span>
              </div>
            </div>

            {/* Bouton de connexion premium */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6FBF4A] to-[#4E8B3A] hover:from-[#4E8B3A] hover:to-[#2F5D2F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6FBF4A] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#2C7FB8] to-[#6E8FA3] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative z-10 flex items-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Accéder au tableau de bord
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Identifiants de test - Design premium */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#87CFEA]/30"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-[#6E8FA3] font-medium">
                  Accès démonstration
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#F4F8F9] to-white rounded-xl p-5 border border-[#87CFEA]/30">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#6FBF4A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="w-4 h-4 text-[#6FBF4A]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#2F5D2F] mb-2">Identifiants de test :</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6E8FA3]">Email :</span>
                      <span className="text-xs font-mono font-bold text-[#2F5D2F] bg-white px-2 py-1 rounded border border-[#87CFEA]/30">
                        admin@vina.org
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6E8FA3]">Mot de passe :</span>
                      <span className="text-xs font-mono font-bold text-[#2F5D2F] bg-white px-2 py-1 rounded border border-[#87CFEA]/30">
                        admin123
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lien retour */}
            <div className="text-center pt-4">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-[#2C7FB8] hover:text-[#6FBF4A] transition-colors group"
              >
                <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour à l'accueil
              </Link>
            </div>
          </form>
        </div>

        {/* Footer de la page de login */}
        <div className="text-center mt-6">
          <p className="text-xs text-white/80">
            © {new Date().getFullYear()} VINA Association. Tous droits réservés.
          </p>
          <p className="text-xs text-white/60 mt-1">
            Espace sécurisé • Connexion protégée par chiffrement SSL
          </p>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        .animation-delay-3000 {
          animation-delay: 3000ms;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}