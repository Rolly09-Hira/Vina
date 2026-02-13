import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Projets actifs', value: '12', color: 'bg-green-500', icon: '🏗️' },
    { label: 'Partenaires', value: '8', color: 'bg-blue-500', icon: '🤝' },
    { label: 'Actualités', value: '24', color: 'bg-purple-500', icon: '📰' },
    { label: 'Témoignages', value: '15', color: 'bg-yellow-500', icon: '💬' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.nom} 👋
        </h1>
        <p className="text-gray-600">
          Bienvenue dans votre tableau de bord de gestion
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/projets/nouveau"
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 hover:bg-green-50 transition"
          >
            <div className="text-2xl mb-2">➕</div>
            <p className="font-medium">Nouveau projet</p>
          </Link>
          <Link
            to="/admin/actualites/nouveau"
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <div className="text-2xl mb-2">📝</div>
            <p className="font-medium">Nouvelle actualité</p>
          </Link>
          <Link
            to="/admin/temoignages/nouveau"
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow-500 hover:bg-yellow-50 transition"
          >
            <div className="text-2xl mb-2">🎥</div>
            <p className="font-medium">Nouveau témoignage</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Activité récente</h2>
        <div className="space-y-4">
          {[
            { action: 'Projet "Potagers" modifié', time: 'Il y a 2 heures', user: 'Vous' },
            { action: 'Nouveau partenaire ajouté', time: 'Il y a 1 jour', user: 'Admin' },
            { action: 'Témoignage publié', time: 'Il y a 2 jours', user: 'Éditeur' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">par {activity.user}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}