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
  FaSeedling,
  FaUserShield
} from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olive-nature to-forest-deep relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sun-gold/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-20 opacity-10">
            <FaLeaf className="w-32 h-32 text-warm-white" />
          </div>
        </div>
        <div className="relative bg-warm-white/95 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-border-light text-center max-w-sm w-full mx-4">
          <div className="w-16 h-16 bg-gradient-to-br from-olive-nature to-water-blue rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaUserShield className="w-8 h-8 text-warm-white" />
          </div>
          <div className="w-10 h-10 border-4 border-olive-nature border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-forest-deep font-medium">Vérification en cours...</p>
          <p className="text-text-secondary text-xs mt-1">Préparation de votre espace sécurisé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olive-nature to-forest-deep relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sun-gold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-water-blue/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sun-gold/5 rounded-full blur-3xl"></div>
        
        {/* Motifs flottants */}
        <div className="absolute top-20 left-20 opacity-10 animate-float">
          <FaTree className="w-24 h-24 text-warm-white" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10 animate-float animation-delay-3000">
          <FaSeedling className="w-24 h-24 text-warm-white" />
        </div>
        
        {/* Grille décorative */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Carte de connexion - Taille réduite */}
        <div className="bg-warm-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-border-light transform transition-all duration-500 hover:shadow-3xl">
          
          {/* En-tête */}
          <div className="text-center mb-5">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-olive-nature to-water-blue rounded-xl blur-md opacity-70"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-olive-nature to-water-blue rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-warm-white font-bold text-2xl">V</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-forest-deep mb-1">
              Espace Administrateur
            </h2>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1.5 h-1.5 bg-olive-nature rounded-full"></div>
              <p className="text-xs text-text-secondary font-medium">
                Accès sécurisé
              </p>
              <div className="w-1.5 h-1.5 bg-water-blue rounded-full"></div>
            </div>
            
            <div className="w-16 h-0.5 bg-gradient-to-r from-olive-nature to-water-blue mx-auto mt-3 rounded-full"></div>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg animate-shake">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Champ Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-forest-deep">
                Adresse email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-text-secondary group-focus-within:text-olive-nature transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border-2 border-border-light rounded-lg bg-white/80 backdrop-blur-sm placeholder-text-secondary/60 focus:outline-none focus:border-olive-nature focus:ring-2 focus:ring-olive-nature/20 transition-all duration-300 text-forest-deep font-medium"
                  placeholder="admin@vina.org"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {/* Champ Mot de passe avec icône pour voir/cacher */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-forest-deep">
                  Mot de passe
                </label>
                <button 
                  type="button"
                  className="text-xs text-water-blue hover:text-olive-nature transition-colors font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-text-secondary group-focus-within:text-olive-nature transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2.5 text-sm border-2 border-border-light rounded-lg bg-white/80 backdrop-blur-sm placeholder-text-secondary/60 focus:outline-none focus:border-olive-nature focus:ring-2 focus:ring-olive-nature/20 transition-all duration-300 text-forest-deep font-medium"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-olive-nature transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
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
                  className="h-3.5 w-3.5 text-olive-nature focus:ring-olive-nature border-border-light rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-text-secondary">
                  Se souvenir de moi
                </label>
              </div>
              
              <div className="flex items-center space-x-1">
                <FaShieldAlt className="w-3 h-3 text-olive-nature" />
                <span className="text-xs text-text-secondary">Connexion sécurisée</span>
              </div>
            </div>

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-warm-white bg-gradient-to-r from-olive-nature to-forest-deep hover:from-forest-deep hover:to-premium-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-olive-nature disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-xl group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-water-blue to-sky-soft opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative z-10 flex items-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-warm-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Lien retour */}
            <div className="text-center pt-2">
              <Link
                to="/"
                className="inline-flex items-center text-xs font-medium text-water-blue hover:text-olive-nature transition-colors group"
              >
                <FaArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
                Retour à l'accueil
              </Link>
            </div>
          </form>
        </div>

        {/* Footer de la page de login */}
        <div className="text-center mt-4">
          <p className="text-xs text-warm-white/80">
            © {new Date().getFullYear()} VINA Association
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
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}