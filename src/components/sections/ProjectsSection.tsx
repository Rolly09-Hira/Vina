// src/components/sections/ProjectsSection.tsx
import { 
  FaSeedling, 
  FaTree, 
  FaBook, 
  FaHandsHelping, 
  FaTint,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaLeaf,           // Ajouté pour Environnement
  FaUserFriends,    // Ajouté pour Social (remplace 👥)
  FaChartLine       // Ajouté pour Économique (remplace 📊)
} from 'react-icons/fa';

// Import des images projets
import proj1 from '../../assets/projet/proj1.jpg';
import proj2 from '../../assets/projet/proj2.jpg';
import proj3 from '../../assets/projet/proj3.jpg';
import proj4 from '../../assets/projet/proj4.jpg';
import proj5 from '../../assets/projet/proj5.jpg';

const projects = [
  {
    id: 1,
    title: 'Potagers communautaires agroécologiques',
    description: 'Sécurité alimentaire et nutritionnelle à travers des jardins potagers durables pour 500 ménages.',
    icon: <FaSeedling className="w-6 h-6" />,
    image: proj1,
    color: 'from-[#6FBF4A] to-[#4E8B3A]',
    location: 'Région Analamanga',
    beneficiaries: '500 ménages',
    duration: '24 mois',
    status: 'En cours',
    category: 'environnement'
  },
  {
    id: 2,
    title: 'Reboisement participatif et restauration des forêts',
    description: 'Lutte contre la déforestation avec plantation de 50 000 arbres et sensibilisation communautaire.',
    icon: <FaTree className="w-6 h-6" />,
    image: proj2,
    color: 'from-[#2F5D2F] to-[#4E8B3A]',
    location: 'Région Alaotra-Mangoro',
    beneficiaries: '1 200 familles',
    duration: '36 mois',
    status: 'En cours',
    category: 'environnement'
  },
  {
    id: 3,
    title: 'Écoles vertes et soutien scolaire',
    description: 'Éducation environnementale et appui scolaire pour 300 enfants dans 5 écoles primaires.',
    icon: <FaBook className="w-6 h-6" />,
    image: proj3,
    color: 'from-[#2C7FB8] to-[#6E8FA3]',
    location: 'Région Vakinankaratra',
    beneficiaries: '300 élèves',
    duration: '12 mois',
    status: 'À venir',
    category: 'social'
  },
  {
    id: 4,
    title: 'Plateforme AGR pour femmes et jeunes',
    description: 'Autonomisation économique via formation entrepreneuriale et appui aux activités génératrices de revenus.',
    icon: <FaHandsHelping className="w-6 h-6" />,
    image: proj4,
    color: 'from-[#F2D16B] to-[#6B4F3A]',
    location: 'Région Atsinanana',
    beneficiaries: '200 femmes et jeunes',
    duration: '18 mois',
    status: 'En cours',
    category: 'economique'
  },
  {
    id: 5,
    title: 'Adduction d\'eau potable villageoise',
    description: 'Accès à l\'eau potable et assainissement pour 8 villages grâce à des forages et bornes fontaines.',
    icon: <FaTint className="w-6 h-6" />,
    image: proj5,
    color: 'from-[#87CFEA] to-[#2C7FB8]',
    location: 'Région Menabe',
    beneficiaries: '3 000 personnes',
    duration: '30 mois',
    status: 'Planification',
    category: 'social'
  }
];

export default function ProjectsSection() {
  return (
    <section className="py-6 bg-[#F4F8F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <div className="inline-flex items-center justify-center bg-[#87CFEA]/20 px-4 py-2 rounded-full border border-[#87CFEA]/30 mb-4 mx-auto">
              <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2 animate-pulse" />
              <span className="text-[#2F5D2F] text-sm font-medium tracking-wider">
                NOS PROJETS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F5D2F] mb-4">
              Projets en cours
            </h2>
            <p className="text-xl text-[#6E8FA3] max-w-2xl">
              Des actions concrètes pour un impact durable sur le terrain
            </p>
          </div>
        </div>

        {/* Grille des projets */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Premier projet - grand format */}
          <div className="lg:col-span-2 lg:row-span-1 group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="relative h-72 lg:h-full lg:absolute lg:inset-0">
              <img 
                src={projects[0].image} 
                alt={projects[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0 p-8 lg:p-10 text-white bg-gradient-to-t from-black/70 via-black/50 to-transparent">
              <div className="flex items-center space-x-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30">
                  {projects[0].category === 'environnement' && <><FaLeaf className="w-3 h-3 mr-1" /> Environnement</>}
                  {projects[0].category === 'social' && <><FaUserFriends className="w-3 h-3 mr-1" /> Social</>}
                  {projects[0].category === 'economique' && <><FaChartLine className="w-3 h-3 mr-1" /> Économique</>}
                </span>
                <span className="px-3 py-1 bg-[#6FBF4A]/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                  {projects[0].status}
                </span>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">{projects[0].title}</h3>
              <p className="text-white/90 mb-4 max-w-2xl">{projects[0].description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                <span className="flex items-center">
                  <FaMapMarkerAlt className="w-4 h-4 mr-1" /> {projects[0].location}
                </span>
                <span className="flex items-center">
                  <FaUsers className="w-4 h-4 mr-1" /> {projects[0].beneficiaries}
                </span>
                <span className="flex items-center">
                  <FaClock className="w-4 h-4 mr-1" /> {projects[0].duration}
                </span>
              </div>
            </div>
          </div>

          {/* Deuxième projet */}
          <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="relative h-48">
              <img 
                src={projects[1].image} 
                alt={projects[1].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-3 py-1 bg-[#87CFEA]/20 rounded-full text-xs font-semibold text-[#2C7FB8]">
                  <FaLeaf className="w-3 h-3 mr-1" /> Environnement
                </span>
                <span className="text-xs font-semibold text-[#6FBF4A]">{projects[1].status}</span>
              </div>
              
              <h3 className="text-xl font-bold text-[#2F5D2F] mb-2">{projects[1].title}</h3>
              <p className="text-[#6E8FA3] text-sm mb-4">{projects[1].description}</p>
              
              <div className="flex flex-col space-y-2 text-xs text-[#8C857C] mb-4">
                <span className="flex items-center">
                  <FaMapMarkerAlt className="w-3 h-3 mr-1" /> {projects[1].location}
                </span>
                <span className="flex items-center">
                  <FaUsers className="w-3 h-3 mr-1" /> {projects[1].beneficiaries}
                </span>
              </div>
            </div>
          </div>

          {/* Troisième projet */}
          <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="relative h-48">
              <img 
                src={projects[2].image} 
                alt={projects[2].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-3 py-1 bg-[#87CFEA]/20 rounded-full text-xs font-semibold text-[#2C7FB8]">
                  <FaUserFriends className="w-3 h-3 mr-1" /> Social
                </span>
                <span className="text-xs font-semibold text-[#F2D16B]">{projects[2].status}</span>
              </div>
              
              <h3 className="text-xl font-bold text-[#2F5D2F] mb-2">{projects[2].title}</h3>
              <p className="text-[#6E8FA3] text-sm mb-4">{projects[2].description}</p>
              
              <div className="flex flex-col space-y-2 text-xs text-[#8C857C] mb-4">
                <span className="flex items-center">
                  <FaMapMarkerAlt className="w-3 h-3 mr-1" /> {projects[2].location}
                </span>
                <span className="flex items-center">
                  <FaUsers className="w-3 h-3 mr-1" /> {projects[2].beneficiaries}
                </span>
              </div>
            
            </div>
          </div>

          {/* Quatrième projet */}
          <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="relative h-48">
              <img 
                src={projects[3].image} 
                alt={projects[3].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-3 py-1 bg-[#F2D16B]/20 rounded-full text-xs font-semibold text-[#6B4F3A]">
                  <FaChartLine className="w-3 h-3 mr-1" /> Économique
                </span>
                <span className="text-xs font-semibold text-[#6FBF4A]">{projects[3].status}</span>
              </div>
              
              <h3 className="text-xl font-bold text-[#2F5D2F] mb-2">{projects[3].title}</h3>
              <p className="text-[#6E8FA3] text-sm mb-4">{projects[3].description}</p>
              
              <div className="flex flex-col space-y-2 text-xs text-[#8C857C] mb-4">
                <span className="flex items-center">
                  <FaMapMarkerAlt className="w-3 h-3 mr-1" /> {projects[3].location}
                </span>
                <span className="flex items-center">
                  <FaUsers className="w-3 h-3 mr-1" /> {projects[3].beneficiaries}
                </span>
              </div>
              
        
            </div>
          </div>

          {/* Cinquième projet */}
          <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="relative h-48">
              <img 
                src={projects[4].image} 
                alt={projects[4].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-3 py-1 bg-[#87CFEA]/20 rounded-full text-xs font-semibold text-[#2C7FB8]">
                  <FaUserFriends className="w-3 h-3 mr-1" /> Social
                </span>
                <span className="text-xs font-semibold text-[#8C857C]">{projects[4].status}</span>
              </div>
              
              <h3 className="text-xl font-bold text-[#2F5D2F] mb-2">{projects[4].title}</h3>
              <p className="text-[#6E8FA3] text-sm mb-4">{projects[4].description}</p>
              
              <div className="flex flex-col space-y-2 text-xs text-[#8C857C] mb-4">
                <span className="flex items-center">
                  <FaMapMarkerAlt className="w-3 h-3 mr-1" /> {projects[4].location}
                </span>
                <span className="flex items-center">
                  <FaUsers className="w-3 h-3 mr-1" /> {projects[4].beneficiaries}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-[#2F5D2F] mb-2">Impact global 2026</h4>
              <p className="text-[#6E8FA3]">5 projets actifs • 8 régions • 5000+ bénéficiaires</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className="text-sm font-medium text-[#2F5D2F]">78% réalisé</span>
              <div className="w-48 h-2 bg-[#87CFEA]/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}