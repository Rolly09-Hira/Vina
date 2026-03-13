// src/components/sections/TestimonialSection.tsx
import { useState, useEffect, useRef } from 'react';
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
  FaSeedling,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import temoignageService, { type Temoignage } from '../../services/temoignageService';
import { useLanguage } from '../../contexts/LanguageContext';

// Interface pour le contenu multilingue
interface Content {
  fr: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    filters: {
      all: string;
      photo: string;
      video: string;
    };
    verified: string;
    beneficiaries: string;
    rating: string;
    watchVideo: string;
    pauseVideo: string;
    readMore: string;
    readLess: string;
    noTestimonials: string;
    loading: string;
    testimony: string;
    project: string;
    mute: string;
    unmute: string;
    expand: string;
  };
  en: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    filters: {
      all: string;
      photo: string;
      video: string;
    };
    verified: string;
    beneficiaries: string;
    rating: string;
    watchVideo: string;
    pauseVideo: string;
    readMore: string;
    readLess: string;
    noTestimonials: string;
    loading: string;
    testimony: string;
    project: string;
    mute: string;
    unmute: string;
    expand: string;
  };
}

// Texte multilingue
const content: Content = {
  fr: {
    badge: 'PAROLES DE TERRAIN',
    title: 'Ce qu\'ils disent de',
    titleHighlight: 'VINA',
    subtitle: 'Découvrez l\'impact réel de nos projets à travers les histoires authentiques de ceux que nous accompagnons au quotidien',
    filters: {
      all: 'Tous les témoignages',
      photo: 'Témoignages photos',
      video: 'Témoignages vidéos'
    },
    verified: 'Témoignages vérifiés',
    beneficiaries: 'bénéficiaires',
    rating: 'Note',
    watchVideo: 'Regarder la vidéo',
    pauseVideo: 'Mettre en pause',
    readMore: 'Lire la suite',
    readLess: 'Réduire',
    noTestimonials: 'Aucun témoignage dans cette catégorie',
    loading: 'Chargement des témoignages...',
    testimony: 'Témoignage',
    project: 'Projet',
    mute: 'Couper le son',
    unmute: 'Activer le son',
    expand: 'Plein écran'
  },
  en: {
    badge: 'VOICES FROM THE FIELD',
    title: 'What they say about',
    titleHighlight: 'VINA',
    subtitle: 'Discover the real impact of our projects through authentic stories from those we support every day',
    filters: {
      all: 'All testimonials',
      photo: 'Photo testimonials',
      video: 'Video testimonials'
    },
    verified: 'Verified testimonials',
    beneficiaries: 'beneficiaries',
    rating: 'Rating',
    watchVideo: 'Watch video',
    pauseVideo: 'Pause',
    readMore: 'Read more',
    readLess: 'Read less',
    noTestimonials: 'No testimonials in this category',
    loading: 'Loading testimonials...',
    testimony: 'Testimony',
    project: 'Project',
    mute: 'Mute',
    unmute: 'Unmute',
    expand: 'Full screen'
  }
};

// Interface pour suivre la progression des vidéos
interface VideoProgress {
  currentTime: number;
  duration: number;
  isDragging: boolean;
}

// Fonction pour obtenir le type d'affichage avec les couleurs de la charte
const getDisplayType = (type: string) => {
  switch (type) {
    case 'PHOTO':
      return { icon: FaCamera, label: 'Photo', color: 'bg-water-blue', text: 'text-water-blue', light: 'bg-water-blue/10' };
    case 'VIDEO':
      return { icon: FaVideo, label: 'Vidéo', color: 'bg-sun-gold', text: 'text-sun-gold', light: 'bg-sun-gold/10' };
    case 'PHOTO_VIDEO':
      return { icon: FaPlayCircle, label: 'Photo & Vidéo', color: 'bg-olive-nature', text: 'text-olive-nature', light: 'bg-olive-nature/10' };
    default:
      return { icon: FaCamera, label: 'Photo', color: 'bg-gray-500', text: 'text-gray-500', light: 'bg-gray-50' };
  }
};

export default function TestimonialSection() {
  const { language } = useLanguage();
  const t = content[language];
  
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [videoProgress, setVideoProgress] = useState<Map<number, VideoProgress>>(new Map());
  const [seekingVideo, setSeekingVideo] = useState<number | null>(null);
  const [fullscreenVideo, setFullscreenVideo] = useState<number | null>(null);
  
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const progressIntervalRefs = useRef<Map<number, number>>(new Map());
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  
  const itemsPerPage = 6;

  // Charger les témoignages depuis le backend
  useEffect(() => {
    const fetchTemoignages = async () => {
      try {
        setLoading(true);
        const data = await temoignageService.getTemoignagesActifs();
        // Trier par ordre d'affichage
        const sorted = data.sort((a, b) => (a.ordreAffichage || 999) - (b.ordreAffichage || 999));
        setTemoignages(sorted);
      } catch (error) {
        console.error('Erreur chargement témoignages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemoignages();
  }, []);

  // Nettoyer les intervalles
  useEffect(() => {
    return () => {
      progressIntervalRefs.current.forEach(interval => {
        if (interval) {
          window.clearInterval(interval);
        }
      });
    };
  }, []);

  // Gestionnaire d'événement pour le plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenVideo(null);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Filtrer les témoignages
  const filteredTemoignages = temoignages.filter(t => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'photo') return t.typeTemoignage === 'PHOTO' || t.typeTemoignage === 'PHOTO_VIDEO';
    if (activeFilter === 'video') return t.typeTemoignage === 'VIDEO' || t.typeTemoignage === 'PHOTO_VIDEO';
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTemoignages.length / itemsPerPage);
  const paginatedTemoignages = filteredTemoignages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mettre à jour la progression d'une vidéo
  const updateVideoProgress = (id: number) => {
    const video = videoRefs.current.get(id);
    if (video && !seekingVideo) {
      setVideoProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(id, {
          currentTime: video.currentTime,
          duration: video.duration || 0,
          isDragging: false
        });
        return newMap;
      });
    }
  };

  // Démarrer le suivi de progression
  const startProgressTracking = (id: number) => {
    if (progressIntervalRefs.current.has(id)) {
      const intervalId = progressIntervalRefs.current.get(id);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    }
    
    const intervalId = window.setInterval(() => updateVideoProgress(id), 100);
    progressIntervalRefs.current.set(id, intervalId);
  };

  // Arrêter le suivi de progression
  const stopProgressTracking = (id: number) => {
    const intervalId = progressIntervalRefs.current.get(id);
    if (intervalId) {
      window.clearInterval(intervalId);
      progressIntervalRefs.current.delete(id);
    }
  };

  const handlePlayVideo = (id: number) => {
    const video = videoRefs.current.get(id);
    if (!video) return;

    if (playingVideo === id) {
      video.pause();
      setPlayingVideo(null);
      stopProgressTracking(id);
    } else {
      // Mettre en pause la vidéo précédente
      if (playingVideo) {
        const prevVideo = videoRefs.current.get(playingVideo);
        if (prevVideo) {
          prevVideo.pause();
          stopProgressTracking(playingVideo);
        }
      }
      video.play().catch(error => {
        console.error('Erreur lecture vidéo:', error);
      });
      setPlayingVideo(id);
      startProgressTracking(id);
      
      // Initialiser la progression si elle n'existe pas
      if (!videoProgress.has(id)) {
        setVideoProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(id, {
            currentTime: 0,
            duration: video.duration || 0,
            isDragging: false
          });
          return newMap;
        });
      }
    }
  };

  const handleToggleMute = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current.get(id);
    if (video) {
      const newMuted = !mutedVideos.has(id);
      video.muted = newMuted;
      setMutedVideos(prev => {
        const newSet = new Set(prev);
        if (newMuted) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    }
  };

  const handleExpandVideo = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current.get(id);
    const card = cardRefs.current.get(id);
    
    if (video && card) {
      try {
        if (fullscreenVideo === id) {
          await document.exitFullscreen();
          setFullscreenVideo(null);
        } else {
          await card.requestFullscreen();
          setFullscreenVideo(id);
        }
      } catch (error) {
        console.error('Erreur plein écran:', error);
      }
    }
  };

  const handleSeekStart = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSeekingVideo(id);
    setVideoProgress(prev => {
      const newMap = new Map(prev);
      const progress = newMap.get(id);
      if (progress) {
        newMap.set(id, { ...progress, isDragging: true });
      }
      return newMap;
    });
  };

  const handleSeek = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (seekingVideo !== id) return;
    
    const video = videoRefs.current.get(id);
    const progress = videoProgress.get(id);
    if (!video || !progress) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    const newTime = percentage * progress.duration;

    video.currentTime = newTime;
    
    setVideoProgress(prev => {
      const newMap = new Map(prev);
      const currentProgress = newMap.get(id);
      if (currentProgress) {
        newMap.set(id, { ...currentProgress, currentTime: newTime, isDragging: true });
      }
      return newMap;
    });
  };

  const handleSeekEnd = (id: number) => {
    setSeekingVideo(null);
    setVideoProgress(prev => {
      const newMap = new Map(prev);
      const progress = newMap.get(id);
      if (progress) {
        newMap.set(id, { ...progress, isDragging: false });
      }
      return newMap;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Rendu des étoiles
  const renderStars = (rating: number = 5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="w-4 h-4 text-sun-gold" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalf key={i} className="w-4 h-4 text-sun-gold" />);
      } else {
        stars.push(<FaStar key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-ultra-light via-warm-white to-ultra-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <FaSpinner className="w-12 h-12 text-sun-gold animate-spin mb-4" />
            <p className="text-text-secondary">{t.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-ultra-light via-warm-white to-ultra-light relative overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-olive-nature/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-water-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-sun-gold/10 rounded-full blur-2xl"></div>
        
        {/* Motifs feuilles */}
        <div className="absolute top-20 right-20 opacity-5">
          <FaLeaf className="w-32 h-32 text-forest-deep" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-5">
          <FaSeedling className="w-32 h-32 text-olive-nature" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-5">
          <FaTree className="w-40 h-40 text-forest-deep" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-olive-nature/20 to-water-blue/20 px-6 py-3 rounded-full border border-sun-gold/30 mb-6 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 bg-sun-gold rounded-full mr-2 animate-pulse" />
            <span className="text-forest-deep text-sm font-bold tracking-wider">
              {t.badge}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest-deep mb-6 leading-tight">
            {t.title}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-sun-gold to-olive-nature bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-sun-gold/20 -z-0 blur-md"></span>
            </span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <button
              onClick={() => setActiveFilter('all')}
              className={`
                relative inline-flex items-center px-8 py-3.5 rounded-full font-semibold transition-all duration-500 overflow-hidden group
                ${activeFilter === 'all' 
                  ? 'text-white shadow-xl scale-105' 
                  : 'text-text-secondary bg-white hover:bg-sun-gold/10 border border-border-light'
                }
              `}
            >
              {activeFilter === 'all' && (
                <span className="absolute inset-0 bg-gradient-to-r from-olive-nature to-forest-deep"></span>
              )}
              <span className="relative z-10 flex items-center">
                <FaQuoteLeft className="w-4 h-4 mr-2" />
                {t.filters.all}
              </span>
            </button>
            
            <button
              onClick={() => setActiveFilter('photo')}
              className={`
                relative inline-flex items-center px-8 py-3.5 rounded-full font-semibold transition-all duration-500 overflow-hidden group
                ${activeFilter === 'photo' 
                  ? 'text-white shadow-xl scale-105' 
                  : 'text-text-secondary bg-white hover:bg-water-blue/10 border border-border-light'
                }
              `}
            >
              {activeFilter === 'photo' && (
                <span className="absolute inset-0 bg-gradient-to-r from-water-blue to-sky-soft"></span>
              )}
              <span className="relative z-10 flex items-center">
                <FaCamera className="w-4 h-4 mr-2" />
                {t.filters.photo}
              </span>
            </button>
            
            <button
              onClick={() => setActiveFilter('video')}
              className={`
                relative inline-flex items-center px-8 py-3.5 rounded-full font-semibold transition-all duration-500 overflow-hidden group
                ${activeFilter === 'video' 
                  ? 'text-white shadow-xl scale-105' 
                  : 'text-text-secondary bg-white hover:bg-sun-gold/10 border border-border-light'
                }
              `}
            >
              {activeFilter === 'video' && (
                <span className="absolute inset-0 bg-gradient-to-r from-sun-gold to-soft-sun"></span>
              )}
              <span className="relative z-10 flex items-center">
                <FaVideo className="w-4 h-4 mr-2" />
                {t.filters.video}
              </span>
            </button>
          </div>
        </div>

        {/* Message si aucun témoignage */}
        {paginatedTemoignages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">{t.noTestimonials}</p>
          </div>
        )}

        {/* Grille des témoignages centrée */}
        <div className="flex flex-wrap justify-center gap-8">
          {paginatedTemoignages.map((temoignage, index) => {
            const typeInfo = getDisplayType(temoignage.typeTemoignage);
            const TypeIcon = typeInfo.icon;
            const isExpanded = expandedId === temoignage.id;
            const isPlaying = playingVideo === temoignage.id;
            const isMuted = mutedVideos.has(temoignage.id);
            const isHovered = hoveredVideo === temoignage.id;
            const progress = videoProgress.get(temoignage.id);
            const isSeeking = seekingVideo === temoignage.id;
            const isFullscreen = fullscreenVideo === temoignage.id;
            const contenu = language === 'fr' ? temoignage.contenuFr : temoignage.contenuEn;
            const auteur = language === 'fr' ? temoignage.auteurFr : temoignage.auteurEn;
            const fonction = language === 'fr' ? temoignage.fonctionFr : temoignage.fonctionEn;
            const displayContenu = isExpanded ? contenu : contenu.substring(0, 120) + (contenu.length > 120 ? '...' : '');
            
            return (
              <div
                key={temoignage.id}
                ref={el => {
                  if (el) {
                    cardRefs.current.set(temoignage.id, el);
                  } else {
                    cardRefs.current.delete(temoignage.id);
                  }
                }}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 overflow-hidden border-2 border-border-light hover:border-olive-nature/50 relative w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] max-w-md"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  boxShadow: isFullscreen ? 'none' : undefined 
                }}
                onMouseEnter={() => setHoveredVideo(temoignage.id)}
                onMouseLeave={() => setHoveredVideo(null)}
              >
                {/* Badge de catégorie avec design amélioré */}
                <div className={`absolute top-4 left-4 z-30 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-xl backdrop-blur-sm text-white ${typeInfo.color} border border-white/30`}>
                    <TypeIcon className="w-3 h-3 mr-1.5" />
                    {typeInfo.label}
                  </span>
                </div>

                {/* Media Section avec ratio fixe et coins arrondis */}
                <div className="relative w-full pt-[56.25%] bg-gradient-to-br from-forest-deep/10 to-water-blue/10 overflow-hidden">
                  {/* Cas PHOTO uniquement : image en haut */}
                  {temoignage.typeTemoignage === 'PHOTO' && temoignage.photoUrl && (
                    <div className="absolute inset-0">
                      <img
                        src={temoignage.photoUrl}
                        alt={auteur}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay gradient pour meilleure lisibilité */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  
                  {/* Cas VIDEO et PHOTO_VIDEO : vidéo en haut avec contrôles améliorés */}
                  {(temoignage.typeTemoignage === 'VIDEO' || temoignage.typeTemoignage === 'PHOTO_VIDEO') && temoignage.videoUrl && (
                    <div className="absolute inset-0">
                      <video
                        ref={el => {
                          if (el) {
                            videoRefs.current.set(temoignage.id, el);
                          } else {
                            videoRefs.current.delete(temoignage.id);
                          }
                        }}
                        src={temoignage.videoUrl}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        onLoadedMetadata={() => {
                          if (videoRefs.current.has(temoignage.id)) {
                            const video = videoRefs.current.get(temoignage.id);
                            if (video) {
                              setVideoProgress(prev => {
                                const newMap = new Map(prev);
                                newMap.set(temoignage.id, {
                                  currentTime: 0,
                                  duration: video.duration || 0,
                                  isDragging: false
                                });
                                return newMap;
                              });
                            }
                          }
                        }}
                      />
                      
                      {/* Overlay avec contrôles modernes */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                        {/* Bouton lecture/pause central avec animation */}
                        <button 
                          onClick={() => handlePlayVideo(temoignage.id)}
                          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/95 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-2xl ${
                            isPlaying && !isHovered ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                          } hover:scale-110`}
                        >
                          {isPlaying ? (
                            <FaPause className="w-7 h-7 text-olive-nature" />
                          ) : (
                            <FaPlay className="w-7 h-7 text-olive-nature ml-1" />
                          )}
                        </button>

                        {/* Contrôles en bas - visibles au hover */}
                        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
                          isHovered || isSeeking ? 'opacity-100' : 'opacity-0'
                        }`}>
                          {/* Barre de progression avec design amélioré */}
                          {progress && progress.duration > 0 && (
                            <div className="mb-2">
                              <div 
                                className="relative h-2 bg-gray-600/50 rounded-full cursor-pointer overflow-hidden group/progress"
                                onMouseDown={(e) => handleSeekStart(temoignage.id, e)}
                                onMouseMove={(e) => handleSeek(temoignage.id, e)}
                                onMouseUp={() => handleSeekEnd(temoignage.id)}
                                onMouseLeave={() => handleSeekEnd(temoignage.id)}
                              >
                                <div 
                                  className="h-full bg-gradient-to-r from-olive-nature to-water-blue rounded-full relative transition-all duration-100"
                                  style={{ width: `${(progress.currentTime / progress.duration) * 100}%` }}
                                >
                                  {/* Curseur de progression */}
                                  <div className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-opacity duration-200 ${
                                    isHovered || isSeeking ? 'opacity-100' : 'opacity-0'
                                  } group-hover/progress:opacity-100`} />
                                </div>
                              </div>
                              
                              {/* Indicateurs de temps */}
                              <div className="flex justify-between mt-1 text-xs text-white/80">
                                <span>{formatTime(progress.currentTime)}</span>
                                <span>{formatTime(progress.duration)}</span>
                              </div>
                            </div>
                          )}

                          {/* Boutons de contrôle */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handlePlayVideo(temoignage.id)}
                                className="text-white hover:text-olive-nature transition-colors"
                              >
                                {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
                              </button>
                              
                              <button
                                onClick={(e) => handleToggleMute(temoignage.id, e)}
                                className="text-white hover:text-olive-nature transition-colors"
                                title={isMuted ? t.unmute : t.mute}
                              >
                                {isMuted ? <FaVolumeMute className="w-5 h-5" /> : <FaVolumeUp className="w-5 h-5" />}
                              </button>
                            </div>

                            <button
                              onClick={(e) => handleExpandVideo(temoignage.id, e)}
                              className="text-white hover:text-olive-nature transition-colors"
                              title={isFullscreen ? 'Quitter plein écran' : t.expand}
                            >
                              {isFullscreen ? <FaCompress className="w-5 h-5" /> : <FaExpand className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu avec padding amélioré */}
                <div className="p-6">
                  {/* En-tête avec témoignage et date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 ${typeInfo.light} rounded-full text-xs font-medium ${typeInfo.text} border ${typeInfo.color.replace('bg-', 'border-')}/30`}>
                      <TypeIcon className="w-3 h-3 mr-1" />
                      {t.testimony} #{temoignage.id}
                    </span>
                    <span className="text-xs text-text-secondary bg-ultra-light px-2 py-1 rounded-full">
                      {formatDate(temoignage.datePublication)}
                    </span>
                  </div>

                  {/* Citation avec design */}
                  <div className="relative mb-4">
                    <FaQuoteLeft className="absolute -top-1 -left-1 w-6 h-6 text-olive-nature/20" />
                    <p className="text-text-secondary text-sm leading-relaxed italic pl-4 line-clamp-3">
                      "{displayContenu}"
                    </p>
                    {contenu.length > 120 && (
                      <button
                        onClick={() => toggleExpand(temoignage.id)}
                        className="text-xs text-water-blue hover:text-olive-nature font-medium transition-colors mt-2 ml-4"
                      >
                        {isExpanded ? t.readLess : t.readMore}
                      </button>
                    )}
                  </div>

                  {/* Évaluation avec design */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-0.5">
                      {renderStars(5)}
                    </div>
                    <span className="text-xs font-medium text-text-secondary ml-2 bg-ultra-light px-2 py-0.5 rounded-full">
                      5/5
                    </span>
                  </div>

                  {/* Informations personne avec photo en bas */}
                  <div className="flex items-center pt-4 border-t-2 border-border-light">
                    {(temoignage.typeTemoignage === 'PHOTO' || temoignage.typeTemoignage === 'PHOTO_VIDEO') && temoignage.photoUrl ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-3 ring-olive-nature ring-offset-2 mr-4 shadow-xl flex-shrink-0">
                        <img
                          src={temoignage.photoUrl}
                          alt={auteur}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-olive-nature to-water-blue flex items-center justify-center mr-4 shadow-xl flex-shrink-0">
                        <FaUserCircle className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-forest-deep group-hover:text-olive-nature transition-colors truncate">
                        {auteur}
                      </h4>
                      <p className="text-xs text-text-secondary font-medium truncate">{fonction}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination avec design amélioré */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 border-2 border-border-light hover:border-olive-nature"
            >
              <FaChevronLeft className="w-5 h-5 text-forest-deep" />
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full font-medium transition-all hover:scale-110 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-olive-nature to-forest-deep text-white shadow-lg border-2 border-white'
                      : 'bg-white text-forest-deep hover:bg-olive-nature/10 border-2 border-border-light'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 border-2 border-border-light hover:border-olive-nature"
            >
              <FaChevronRight className="w-5 h-5 text-forest-deep" />
            </button>
          </div>
        )}

        {/* Indicateur de confiance avec design amélioré */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-border-light">
          <span className="flex items-center text-sm text-text-secondary">
            <span className="w-2 h-2 bg-olive-nature rounded-full mr-2 animate-pulse"></span>
            {t.verified}
          </span>
          <span className="flex items-center text-sm text-text-secondary">
            <span className="w-2 h-2 bg-water-blue rounded-full mr-2 animate-pulse"></span>
            +{temoignages.length} {t.beneficiaries}
          </span>
          <span className="flex items-center text-sm text-text-secondary">
            <span className="w-2 h-2 bg-sun-gold rounded-full mr-2 animate-pulse"></span>
            {t.rating} 4.8/5
          </span>
        </div>
      </div>
    </section>
  );
}