// src/components/sections/TestimonialSection.tsx
import  { useState, useRef } from 'react';
import { 
  FaQuoteLeft, 
  FaPlay, 
  FaStar, 
  FaStarHalf,
  FaUserCircle,
  FaVideo,
  FaCamera,
  FaPlayCircle,
  FaLeaf,
  FaTree,
  FaSeedling
} from 'react-icons/fa';

// Interface pour les témoignages
interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  type: 'photo' | 'video' | 'both';
  image?: string;
  videoThumb?: string;
  videoUrl?: string;
  project: string;
}

// Données des témoignages
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rasoa Marie',
    role: 'Agricultrice',
    location: 'Région Analamanga',
    content: 'Grâce au projet de potagers communautaires, j\'ai appris des techniques agroécologiques qui ont augmenté ma production. Aujourd\'hui, je nourris ma famille et je vends le surplus au marché.',
    rating: 5,
    type: 'photo',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    project: 'Potagers communautaires'
  },
  {
    id: 2,
    name: 'Rakoto Jean',
    role: 'Président COBA',
    location: 'Région Alaotra-Mangoro',
    content: 'Le reboisement participatif a transformé notre village. Nous avons planté plus de 10 000 arbres et l\'eau de source est revenue. Nos enfants connaissent maintenant l\'importance de la forêt.',
    rating: 5,
    type: 'video',
    videoThumb: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    videoUrl: '#',
    project: 'Reboisement participatif'
  },
  {
    id: 3,
    name: 'Fara Niry',
    role: 'Mère de famille',
    location: 'Région Vakinankaratra',
    content: 'L\'école verte a changé la vie de mes trois enfants. Ils apprennent à lire, écrire et aussi à protéger l\'environnement. Le jardin scolaire leur donne même des légumes frais pour la cantine.',
    rating: 5,
    type: 'both',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    videoThumb: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    videoUrl: '#',
    project: 'Écoles vertes'
  },
  {
    id: 4,
    name: 'Solofoarisoa',
    role: 'Jeune entrepreneur',
    location: 'Région Atsinanana',
    content: 'La formation en AGR m\'a permis de lancer mon petit élevage de poules. Aujourd\'hui, j\'emploie deux jeunes du village et je fournis des œufs à toute la commune.',
    rating: 4,
    type: 'photo',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    project: 'Plateforme AGR'
  },
  {
    id: 5,
    name: 'Mme Rahanta',
    role: 'Responsable comité eau',
    location: 'Région Menabe',
    content: 'Avant le forage, nos femmes marchaient 5 km pour chercher de l\'eau. Maintenant, l\'eau potable coule à 100 mètres du village. La santé des enfants s\'est améliorée.',
    rating: 5,
    type: 'video',
    videoThumb: 'https://images.unsplash.com/photo-1563794698-732c0b88173a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    videoUrl: '#',
    project: 'Adduction d\'eau'
  },
  {
    id: 6,
    name: 'Razanamahasoa',
    role: 'Éleveur',
    location: 'Région Itasy',
    content: 'L\'élevage durable m\'a appris à nourrir mes zébus avec des fourrages améliorés. Mes bêtes sont en meilleure santé et je gagne plus qu\'avant.',
    rating: 4,
    type: 'both',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    videoThumb: 'https://images.unsplash.com/photo-1527153818091-1a9638521e2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    videoUrl: '#',
    project: 'Élevage durable'
  }
];

export default function TestimonialSection() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
 
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const filteredTestimonials = testimonials.filter(t => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'photo') return t.type === 'photo' || t.type === 'both';
    if (activeFilter === 'video') return t.type === 'video' || t.type === 'both';
    return true;
  });

  const handlePlayVideo = (id: number) => {
    if (playingVideo === id) {
      videoRefs.current[id]?.pause();
      setPlayingVideo(null);
    } else {
      if (playingVideo) {
        videoRefs.current[playingVideo]?.pause();
      }
      videoRefs.current[id]?.play();
      setPlayingVideo(id);
    }
  };

  

  // Rendu des étoiles
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="w-4 h-4 text-[#F2D16B]" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalf key={i} className="w-4 h-4 text-[#F2D16B]" />);
      } else {
        stars.push(<FaStar key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <section className="py-6 bg-gradient-to-b from-[#F4F8F9] via-white to-[#F4F8F9] relative overflow-hidden">
      {/* Éléments décoratifs de fond - Thème VINA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Formes organiques */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#6FBF4A]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2C7FB8]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#87CFEA]/10 rounded-full blur-2xl"></div>
        
        {/* Motif feuilles */}
        <div className="absolute top-20 right-20 opacity-5">
          <FaLeaf className="w-32 h-32 text-[#2F5D2F]" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-5">
          <FaSeedling className="w-32 h-32 text-[#6FBF4A]" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-5">
          <FaTree className="w-40 h-40 text-[#4E8B3A]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête avec design amélioré */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-[#6FBF4A]/20 to-[#2C7FB8]/20 px-6 py-3 rounded-full border border-[#87CFEA]/30 mb-6 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2 animate-pulse" />
            <span className="text-[#2F5D2F] text-sm font-bold tracking-wider">
              PAROLES DE TERRAIN
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2F5D2F] mb-6 leading-tight">
            Ce qu'ils disent de{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] bg-clip-text text-transparent">
                VINA
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-[#6FBF4A]/20 -z-0 blur-md"></span>
            </span>
          </h2>
          
          <p className="text-xl text-[#6E8FA3] max-w-3xl mx-auto leading-relaxed">
            Découvrez l'impact réel de nos projets à travers les histoires authentiques 
            de ceux que nous accompagnons au quotidien
          </p>

          {/* Filtres stylisés */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <button
              onClick={() => setActiveFilter('all')}
              className={`
                relative inline-flex items-center px-8 py-3.5 rounded-full font-semibold transition-all duration-500 overflow-hidden group
                ${activeFilter === 'all' 
                  ? 'text-white shadow-xl scale-105' 
                  : 'text-[#6E8FA3] bg-white hover:bg-[#87CFEA]/20 border border-[#87CFEA]/30'
                }
              `}
            >
              {activeFilter === 'all' && (
                <span className="absolute inset-0 bg-gradient-to-r from-[#6FBF4A] to-[#4E8B3A]"></span>
              )}
              <span className="relative z-10 flex items-center">
                <FaQuoteLeft className="w-4 h-4 mr-2" />
                Tous les témoignages
              </span>
            </button>
            
            <button
              onClick={() => setActiveFilter('photo')}
              className={`
                relative inline-flex items-center px-8 py-3.5 rounded-full font-semibold transition-all duration-500 overflow-hidden group
                ${activeFilter === 'photo' 
                  ? 'text-white shadow-xl scale-105' 
                  : 'text-[#6E8FA3] bg-white hover:bg-[#87CFEA]/20 border border-[#87CFEA]/30'
                }
              `}
            >
              {activeFilter === 'photo' && (
                <span className="absolute inset-0 bg-gradient-to-r from-[#2C7FB8] to-[#6E8FA3]"></span>
              )}
              <span className="relative z-10 flex items-center">
                <FaCamera className="w-4 h-4 mr-2" />
                Témoignages photos
              </span>
            </button>
            
            <button
              onClick={() => setActiveFilter('video')}
              className={`
                relative inline-flex items-center px-8 py-3.5 rounded-full font-semibold transition-all duration-500 overflow-hidden group
                ${activeFilter === 'video' 
                  ? 'text-white shadow-xl scale-105' 
                  : 'text-[#6E8FA3] bg-white hover:bg-[#87CFEA]/20 border border-[#87CFEA]/30'
                }
              `}
            >
              {activeFilter === 'video' && (
                <span className="absolute inset-0 bg-gradient-to-r from-[#6B4F3A] to-[#8C857C]"></span>
              )}
              <span className="relative z-10 flex items-center">
                <FaVideo className="w-4 h-4 mr-2" />
                Témoignages vidéos
              </span>
            </button>
          </div>
        </div>

        {/* Grille des témoignages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 overflow-hidden border border-[#87CFEA]/20 relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Badge de catégorie flottant */}
              <div className="absolute top-4 left-4 z-20">
                <span className={`
                  inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm
                  ${testimonial.type === 'photo' ? 'bg-[#2C7FB8]/90 text-white border border-[#87CFEA]/50' : ''}
                  ${testimonial.type === 'video' ? 'bg-[#6B4F3A]/90 text-white border border-[#8C857C]/50' : ''}
                  ${testimonial.type === 'both' ? 'bg-gradient-to-r from-[#6FBF4A]/90 to-[#2C7FB8]/90 text-white' : ''}
                `}>
                  {testimonial.type === 'photo' && <><FaCamera className="w-3 h-3 mr-1" /> Photo</>}
                  {testimonial.type === 'video' && <><FaVideo className="w-3 h-3 mr-1" /> Vidéo</>}
                  {testimonial.type === 'both' && <><FaPlayCircle className="w-3 h-3 mr-1" /> Photo + Vidéo</>}
                </span>
              </div>

              {/* Media Section avec overlay gradient */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#2F5D2F]/20 to-[#2C7FB8]/20">
                {testimonial.type === 'photo' && testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                
                {testimonial.type === 'video' && testimonial.videoThumb && (
                  <div className="relative w-full h-full">
                    <img
                      src={testimonial.videoThumb}
                      alt={testimonial.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                      <button 
                        onClick={() => handlePlayVideo(testimonial.id)}
                        className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 group/play hover:scale-110 shadow-2xl"
                      >
                        <FaPlay className="w-8 h-8 text-[#6FBF4A] ml-1 group-hover/play:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
                
                {testimonial.type === 'both' && (
                  <div className="relative w-full h-full">
                    <img
                      src={testimonial.videoThumb}
                      alt={testimonial.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                      <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-white text-xs font-medium">Témoignage complet</span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <button 
                        onClick={() => handlePlayVideo(testimonial.id)}
                        className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-2xl"
                      >
                        <FaPlay className="w-6 h-6 text-[#6FBF4A] ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Contenu avec design amélioré */}
              <div className="p-8">
                {/* Badge projet */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-[#6FBF4A]/10 to-[#2C7FB8]/10 rounded-full text-xs font-bold text-[#2C7FB8] border border-[#87CFEA]/30">
                    <FaSeedling className="w-3 h-3 mr-1 text-[#6FBF4A]" />
                    {testimonial.project}
                  </span>
                  <span className="text-xs text-[#8C857C]">#{testimonial.id}</span>
                </div>

                {/* Citation avec guillemets décoratifs */}
                <div className="relative mb-6">
                  <FaQuoteLeft className="absolute -top-2 -left-2 w-8 h-8 text-[#6FBF4A]/10" />
                  <p className="text-[#6E8FA3] text-sm leading-relaxed italic pl-4 line-clamp-4">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Évaluation avec design */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="text-xs font-medium text-[#8C857C] ml-3 bg-[#F4F8F9] px-3 py-1 rounded-full">
                    {testimonial.rating}/5
                  </span>
                </div>

                {/* Informations personne avec style */}
                <div className="flex items-center pt-4 border-t border-[#87CFEA]/20">
                  {testimonial.image && testimonial.type !== 'both' ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-[#6FBF4A] mr-4 shadow-lg">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6FBF4A] to-[#2C7FB8] flex items-center justify-center mr-4 shadow-lg">
                      <FaUserCircle className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-[#2F5D2F] group-hover:text-[#6FBF4A] transition-colors">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-[#6E8FA3] font-medium">{testimonial.role}</p>
                    <p className="text-xs text-[#8C857C] flex items-center mt-1">
                      <span className="w-1.5 h-1.5 bg-[#6FBF4A] rounded-full mr-2"></span>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Indicateur de confiance */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-[#6E8FA3]">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2"></span>
            Témoignages vérifiés
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-[#2C7FB8] rounded-full mr-2"></span>
            +100 bénéficiaires
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-[#F2D16B] rounded-full mr-2"></span>
            Notes 4.8/5
          </span>
        </div>
      </div>
    </section>
  );
}