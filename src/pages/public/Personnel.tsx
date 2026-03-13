// src/pages/public/Personnel.tsx
import { useState, useEffect } from 'react';
import { 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone,
  FaQuoteLeft,
  FaQuoteRight,
  FaUsers,
  FaHandshake,
  FaLeaf,
  FaSeedling,
  FaTree,
  FaHeart,
  FaGlobeAfrica,
  FaSpinner,
  FaTwitter,
  FaFacebook
} from 'react-icons/fa';
import personnelService from '../../services/personnelService';
import type { Personnel } from '../../types/api';
import { useLanguage } from '../../contexts/LanguageContext';

// Import des images (garder les images par défaut pour le fallback)
import equipeBg from '../../assets/equipe.jpg';

// Interface pour le contenu multilingue
interface Content {
  fr: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    stats: {
      members: string;
    };
    governance: string;
    governanceTitle: string;
    governanceSubtitle: string;
    joinUs: string;
    joinUsTitle: string;
    joinUsSubtitle: string;
    values: string[];
    contact: string;
    valuesTitle: string;
    valuesSubtitle: string;
    years: string;
    email: string;
    phone: string;
    specialities: string;
    department: string;
  };
  en: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    stats: {
      members: string;
    };
    governance: string;
    governanceTitle: string;
    governanceSubtitle: string;
    joinUs: string;
    joinUsTitle: string;
    joinUsSubtitle: string;
    values: string[];
    contact: string;
    valuesTitle: string;
    valuesSubtitle: string;
    years: string;
    email: string;
    phone: string;
    specialities: string;
    department: string;
  };
}

// Texte multilingue
const content: Content = {
  fr: {
    badge: 'Notre équipe',
    title: 'Les femmes et les hommes',
    titleHighlight: 'derrière VINA',
    subtitle: 'Une équipe pluridisciplinaire de passionnés, unie par une vision commune : construire un avenir durable et inclusif pour les communautés malgaches.',
    stats: {
      members: 'Membres actifs',
    },
    governance: 'Gouvernance',
    governanceTitle: 'Notre',
    governanceSubtitle: 'Une équipe pluridisciplinaire d\'experts engagés au service de notre mission',
    joinUs: 'Rejoindre l\'aventure',
    joinUsTitle: 'Vous souhaitez nous',
    joinUsSubtitle: 'Nous recherchons régulièrement des talents passionnés par le développement durable et l\'impact social. Si vous partagez nos valeurs et souhaitez contribuer à notre mission, n\'hésitez pas à nous contacter.',
    values: [
      'Égalité des chances et non-discrimination',
      'Développement des compétences et formation continue',
      'Environnement de travail inclusif et bienveillant',
      'Engagement bénévole reconnu et valorisé'
    ],
    contact: 'Contactez-nous',
    valuesTitle: 'Nos valeurs RH',
    valuesSubtitle: 'Un engagement réciproque',
    years: 'Ans',
    email: 'Email',
    phone: 'Téléphone',
    specialities: 'Spécialités',
    department: 'Département'
  },
  en: {
    badge: 'Our team',
    title: 'The women and men',
    titleHighlight: 'behind VINA',
    subtitle: 'A multidisciplinary team of passionate people, united by a common vision: building a sustainable and inclusive future for Malagasy communities.',
    stats: {
      members: 'Active members',
    },
    governance: 'Governance',
    governanceTitle: 'Our',
    governanceSubtitle: 'A multidisciplinary team of committed experts serving our mission',
    joinUs: 'Join the adventure',
    joinUsTitle: 'Want to',
    joinUsSubtitle: 'We regularly look for talents passionate about sustainable development and social impact. If you share our values and wish to contribute to our mission, feel free to contact us.',
    values: [
      'Equal opportunities and non-discrimination',
      'Skills development and continuous training',
      'Inclusive and caring work environment',
      'Recognized and valued volunteer commitment'
    ],
    contact: 'Contact us',
    valuesTitle: 'Our HR values',
    valuesSubtitle: 'A mutual commitment',
    years: 'Years',
    email: 'Email',
    phone: 'Phone',
    specialities: 'Specialties',
    department: 'Department'
  }
};

// Fonction pour obtenir une icône en fonction du département ou poste
const getIconForMember = (poste: string, departement?: string) => {
  const text = (poste + ' ' + (departement || '')).toLowerCase();
  
  if (text.includes('pr&eacute;sident') || text.includes('president') || text.includes('direction')) 
    return <FaLeaf className="w-5 h-5" />;
  if (text.includes('vice') || text.includes('partenariat')) 
    return <FaHandshake className="w-5 h-5" />;
  if (text.includes('secr&eacute;taire') || text.includes('secretary') || text.includes('administration')) 
    return <FaGlobeAfrica className="w-5 h-5" />;
  if (text.includes('tr&eacute;sor') || text.includes('treasurer') || text.includes('finance')) 
    return <FaSeedling className="w-5 h-5" />;
  if (text.includes('technique') || text.includes('expert') || text.includes('conseil')) 
    return <FaTree className="w-5 h-5" />;
  if (text.includes('communication') || text.includes('media') || text.includes('relation')) 
    return <FaHeart className="w-5 h-5" />;
  
  return <FaUsers className="w-5 h-5" />;
};

// Fonction pour obtenir un dégradé de couleurs en fonction du département (adapté à la charte)
const getGradientForMember = (departement?: string) => {
  if (!departement) return 'from-olive-nature to-forest-deep';
  
  const dept = departement.toLowerCase();
  
  if (dept.includes('direction')) return 'from-olive-nature to-forest-deep';
  if (dept.includes('partenariat') || dept.includes('relation')) return 'from-water-blue to-sky-soft';
  if (dept.includes('administration')) return 'from-earth-brown to-forest-deep';
  if (dept.includes('finance') || dept.includes('tr&eacute;sor')) return 'from-sun-gold to-earth-brown';
  if (dept.includes('technique') || dept.includes('programme')) return 'from-olive-nature to-forest-deep';
  if (dept.includes('communication')) return 'from-sky-soft to-water-blue';
  
  return 'from-olive-nature to-forest-deep';
};

export default function Personnel() {
  const { language } = useLanguage();
  const t = content[language];
  
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger le personnel depuis le backend
  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        setLoading(true);
        const data = await personnelService.getAllPersonnel();
        // Trier par ordre d'affichage
        const sorted = data.sort((a, b) => (a.ordreAffichage || 0) - (b.ordreAffichage || 0));
        setPersonnel(sorted);
      } catch (error) {
        console.error('Erreur chargement personnel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);

  const getPhotoUrl = (member: Personnel) => {
    if (!member.photoUrl) return null;
    return member.photoUrl.startsWith('http') 
      ? member.photoUrl 
      : `${member.photoUrl}`;
  };

  const getDisplayPoste = (member: Personnel) => {
    return member.poste;
  };

  const getDisplayDepartement = (member: Personnel) => {
    return member.departement || '';
  };

  const getDisplaySpecialites = (member: Personnel) => {
    return member.specialites || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-olive-nature to-forest-deep flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-sun-gold animate-spin mx-auto mb-4" />
          <p className="text-warm-white">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section Premium avec image de fond */}
      <section className="relative min-h-[80vh] pt-36 md:pt-44 lg:pt-52 flex items-center justify-center overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img 
            src={equipeBg} 
            alt="Notre équipe" 
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient avec les nouvelles couleurs */}
          <div className="absolute inset-0 bg-gradient-to-br from-premium-dark/95 via-forest-deep/90 to-water-blue/85"></div>
        </div>

        {/* Éléments décoratifs animés */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-sun-gold/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-sky-soft/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          
          {/* Motifs flottants */}
          <div className="absolute top-40 left-10 opacity-20 animate-float">
            <FaUsers className="w-32 h-32 text-warm-white" />
          </div>
          <div className="absolute bottom-40 right-10 opacity-20 animate-float animation-delay-3000">
            <FaLeaf className="w-32 h-32 text-warm-white" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center bg-warm-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-warm-white/30 mb-8 animate-fade-in-down">
            <span className="w-2 h-2 bg-sun-gold rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-bold tracking-wider uppercase text-warm-white">{t.badge}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up text-warm-white">
            {t.title}
            <span className="relative inline-block ml-4">
              <span className="relative z-10 bg-gradient-to-r from-sun-gold to-olive-nature bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-sun-gold/30 -z-0 blur-md"></span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-warm-white/90 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500">
            {t.subtitle}
          </p>
          
          {/* Statistiques rapides - Une seule statistique centrée */}
          <div className="flex justify-center mt-12 animate-fade-in-up animation-delay-700">
            <div className="text-center">
              <div className="text-4xl font-bold text-sun-gold">{personnel.length}</div>
              <div className="text-sm text-warm-white/80 mt-1">{t.stats.members}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Message de l'équipe - Design Premium */}
      <section className="py-24 bg-gradient-to-b from-warm-white to-ultra-light relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-ultra-light to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-olive-nature/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-water-blue/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-4xl p-12 md:p-16 shadow-2xl border border-border-light relative">
            {/* Éléments décoratifs */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-olive-nature to-forest-deep rounded-full flex items-center justify-center shadow-xl">
              <FaQuoteLeft className="w-8 h-8 text-warm-white" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-water-blue to-sky-soft rounded-full flex items-center justify-center shadow-xl">
              <FaQuoteRight className="w-8 h-8 text-warm-white" />
            </div>
            
            {/* Contenu */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-olive-nature to-transparent"></div>
              
              <p className="text-2xl md:text-3xl lg:text-4xl text-forest-deep font-light italic leading-relaxed mb-8">
                "{language === 'fr' 
                  ? "Chaque membre de notre équipe partage la conviction que le développement ne peut être efficace et durable que s'il repose sur la prise en compte des réalités locales et des besoins exprimés par les communautés."
                  : "Each member of our team shares the belief that development can only be effective and sustainable if it is based on local realities and the needs expressed by communities."}"
              </p>
              
              <div className="flex items-center justify-center">
                <div className="w-16 h-px bg-gradient-to-r from-olive-nature to-water-blue mr-4"></div>
                <span className="text-text-secondary font-medium tracking-wide uppercase text-sm">
                  {language === 'fr' ? 'Le Conseil d\'Administration de VINA' : 'The Board of Directors of VINA'}
                </span>
                <div className="w-16 h-px bg-gradient-to-r from-water-blue to-olive-nature ml-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grille de l'équipe - Design Premium avec centrage */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-40 right-20 w-72 h-72 bg-olive-nature/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-72 h-72 bg-water-blue/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-sun-gold/10 px-6 py-3 rounded-full border border-sun-gold/30 mb-6">
              <span className="w-2 h-2 bg-sun-gold rounded-full mr-2"></span>
              <span className="text-forest-deep text-sm font-bold uppercase tracking-wider">
                {t.governance}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest-deep mb-6">
              {t.governanceTitle}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-olive-nature to-water-blue bg-clip-text text-transparent">
                  {language === 'fr' ? 'conseil d\'administration' : 'board of directors'}
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-sun-gold/20 -z-0 blur-md"></span>
              </span>
            </h2>
            
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              {t.governanceSubtitle}
            </p>
          </div>

          {/* Grille avec centrage */}
          <div className="flex flex-wrap justify-center gap-8">
            {personnel.map((member, index) => {
              const gradient = getGradientForMember(member.departement);
              const icon = getIconForMember(member.poste, member.departement);
              
              return (
                <div
                  key={member.id}
                  className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 overflow-hidden border border-border-light animate-fade-in-up w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] max-w-md"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Background gradient au hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700`}></div>
                  
                  {/* Photo avec effet */}
                  <div className="relative pt-10 px-8 flex justify-center">
                    <div className="relative">
                      {/* Cercle décoratif */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700`}></div>
                      
                      {/* Photo */}
                      <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-border-light group-hover:ring-sun-gold/40 transition-all duration-700 group-hover:scale-105">
                        {getPhotoUrl(member) ? (
                          <img
                            src={getPhotoUrl(member)!}
                            alt={`${member.prenom} ${member.nom}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-olive-nature to-water-blue flex items-center justify-center">
                            <span className="text-warm-white text-2xl font-bold">
                              {member.prenom.charAt(0)}{member.nom.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Badge de position */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20">
                        <div className={`px-5 py-2.5 bg-gradient-to-r ${gradient} text-warm-white text-xs font-bold rounded-full shadow-xl flex items-center space-x-2`}>
                          <span className="w-4 h-4 flex items-center justify-center">
                            {icon}
                          </span>
                          <span>{getDisplayPoste(member)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6 pt-8 text-center">
                    <h3 className="text-xl font-bold text-forest-deep mb-1 group-hover:text-olive-nature transition-colors">
                      {member.prenom} {member.nom}
                    </h3>
                    
                    {getDisplayDepartement(member) && (
                      <p className="text-water-blue font-semibold text-sm mb-3">
                        {t.department} : {getDisplayDepartement(member)}
                      </p>
                    )}
                    
                    {getDisplaySpecialites(member) && (
                      <div className="mb-4">
                        <p className="text-xs text-text-secondary font-medium mb-1">{t.specialities}</p>
                        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 px-2">
                          {getDisplaySpecialites(member)}
                        </p>
                      </div>
                    )}
                    
                    {/* Contacts */}
                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center justify-center text-xs group/email">
                        <div className="w-6 h-6 bg-water-blue/10 rounded-full flex items-center justify-center mr-2 group-hover/email:bg-water-blue transition-colors">
                          <FaEnvelope className={`w-3 h-3 text-water-blue group-hover/email:text-warm-white transition-colors`} />
                        </div>
                        <a href={`mailto:${member.email}`} className="text-text-secondary hover:text-olive-nature transition-colors truncate max-w-[180px]" title={t.email}>
                          {member.email}
                        </a>
                      </div>
                      {member.telephone && (
                        <div className="flex items-center justify-center text-xs group/phone">
                          <div className="w-6 h-6 bg-olive-nature/10 rounded-full flex items-center justify-center mr-2 group-hover/phone:bg-olive-nature transition-colors">
                            <FaPhone className={`w-3 h-3 text-olive-nature group-hover/phone:text-warm-white transition-colors`} />
                          </div>
                          <a href={`tel:${member.telephone}`} className="text-text-secondary hover:text-olive-nature transition-colors" title={t.phone}>
                            {member.telephone}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Réseaux sociaux */}
                    <div className="flex justify-center space-x-4 pt-4 border-t border-border-light">
                      {member.linkedinUrl && (
                        <a 
                          href={member.linkedinUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-[#0077B5]/10 rounded-xl flex items-center justify-center hover:bg-[#0077B5] transition-all duration-300 hover:scale-110 group/linkedin"
                        >
                          <FaLinkedin className="w-5 h-5 text-[#0077B5] group-hover/linkedin:text-warm-white transition-colors" />
                        </a>
                      )}
                      {member.twitterUrl && (
                        <a 
                          href={member.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-[#1DA1F2]/10 rounded-xl flex items-center justify-center hover:bg-[#1DA1F2] transition-all duration-300 hover:scale-110 group/twitter"
                        >
                          <FaTwitter className="w-5 h-5 text-[#1DA1F2] group-hover/twitter:text-warm-white transition-colors" />
                        </a>
                      )}
                      {member.facebookUrl && (
                        <a 
                          href={member.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-[#1877F2]/10 rounded-xl flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 hover:scale-110 group/facebook"
                        >
                          <FaFacebook className="w-5 h-5 text-[#1877F2] group-hover/facebook:text-warm-white transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre approche RH */}
      <section className="py-24 bg-gradient-to-b from-ultra-light to-warm-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-olive-nature/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-water-blue/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-sun-gold/10 px-6 py-3 rounded-full border border-sun-gold/30 mb-6">
              <span className="w-2 h-2 bg-sun-gold rounded-full mr-2 animate-pulse"></span>
              <span className="text-forest-deep text-sm font-bold uppercase tracking-wider">
                {t.joinUs}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-forest-deep mb-6">
              {t.joinUsTitle}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-olive-nature to-water-blue bg-clip-text text-transparent">
                  {language === 'fr' ? 'rejoindre' : 'join'}
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-sun-gold/20 -z-0 blur-md"></span>
              </span>
              ?
            </h2>
            
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10">
              {t.joinUsSubtitle}
            </p>
          </div>
          
          {/* Carte valeurs RH centrée */}
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-border-light hover:shadow-2xl transition-all duration-500 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-olive-nature to-forest-deep rounded-2xl flex items-center justify-center shadow-lg">
                <FaHandshake className="w-8 h-8 text-warm-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-forest-deep">{t.valuesTitle}</h3>
                <p className="text-sm text-text-secondary">{t.valuesSubtitle}</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {t.values.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-olive-nature/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-olive-nature rounded-full"></span>
                  </div>
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        .animation-delay-3000 {
          animation-delay: 3000ms;
        }
        
        .rounded-4xl {
          border-radius: 2rem;
        }
      `}</style>
    </div>
  );
}