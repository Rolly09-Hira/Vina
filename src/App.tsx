function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl font-bold text-white">V</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FrontVina
          </h1>
        </div>
        
        <p className="text-center text-gray-600 text-lg mb-10">
          Votre projet React + Vite + TypeScript + Tailwind est opérationnel ! 🚀
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">⚛️ React 18</h3>
            <p className="text-gray-600">Avec les dernières fonctionnalités et hooks</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">⚡ Vite</h3>
            <p className="text-gray-600">Build ultra-rapide et HMR instantané</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-xl font-semibold text-green-700 mb-3">🎨 Tailwind</h3>
            <p className="text-gray-600">Styling utilitaire et design system</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl">
            Démarrer le projet
          </button>
          <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition duration-300">
            Documentation
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition duration-300">
            Explorer les composants
          </button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Prochaines étapes :</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Créer des composants dans <code className="bg-gray-100 px-2 py-1 rounded">src/components/</code></span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>Ajouter React Router pour la navigation</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span>Configurer un store global (Redux/Zustand)</span>
            </li>
          </ul>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Développé avec ❤️ - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
