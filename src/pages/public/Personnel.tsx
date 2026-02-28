// src/pages/public/Personnel.tsx
import { 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaQuoteRight,
  FaUsers,
  FaHandshake,
  FaLeaf,
  FaSeedling,
  FaTree,
  FaHeart,
  FaGlobeAfrica
} from 'react-icons/fa';

// Import des images
import part1 from '../../assets/partenaire/part1.jpg';
import part2 from '../../assets/partenaire/part2.jpg';
import part3 from '../../assets/partenaire/part3.jpg';
import part4 from '../../assets/partenaire/part4.jpg';
import part5 from '../../assets/partenaire/part5.jpg';
import part6 from '../../assets/partenaire/part6.jpg';
import equipeBg from '../../assets/equipe.jpg'; // Image de fond pour hero

// Données de l'équipe
const teamMembers = [
  {
    id: 1,
    name: 'Rakotomalala Hery',
    position: 'Président Fondateur',
    role: 'Direction stratégique',
    email: 'h.rakotomalala@vina.mg',
    phone: '+261 34 00 000 01',
    location: 'Antananarivo',
    bio: 'Expert en développement durable avec 15 ans d\'expérience dans les projets communautaires à Madagascar. Fondateur de VINA, il porte la vision d\'un développement inclusif et participatif.',
    image: part1,
    icon: <FaLeaf className="w-5 h-5" />,
    color: 'from-[#6FBF4A] to-[#4E8B3A]',
    social: { linkedin: '#' }
  },
  {
    id: 2,
    name: 'Rasoanirina Marie',
    position: 'Vice-Présidente',
    role: 'Développement des partenariats',
    email: 'm.rasoanirina@vina.mg',
    phone: '+261 34 00 000 02',
    location: 'Antsirabe',
    bio: 'Spécialiste en relations internationales et mobilisation des ressources. Elle a développé un réseau de partenaires techniques et financiers pour soutenir les projets de VINA.',
    image: part2,
    icon: <FaHandshake className="w-5 h-5" />,
    color: 'from-[#2C7FB8] to-[#6E8FA3]',
    social: { linkedin: '#' }
  },
  {
    id: 3,
    name: 'Andrianarison Jean',
    position: 'Secrétaire Général',
    role: 'Administration et gouvernance',
    email: 'j.andrianarison@vina.mg',
    phone: '+261 34 00 000 03',
    location: 'Antananarivo',
    bio: 'Juriste de formation, il assure la conformité statutaire et le bon fonctionnement administratif de l\'association. Il veille à la transparence et à la bonne gouvernance.',
    image: part3,
    icon: <FaGlobeAfrica className="w-5 h-5" />,
    color: 'from-[#6B4F3A] to-[#8C857C]',
    social: { linkedin: '#' }
  },
  {
    id: 4,
    name: 'Razanajatovo Fara',
    position: 'Trésorière',
    role: 'Gestion financière',
    email: 'f.razanajatovo@vina.mg',
    phone: '+261 34 00 000 04',
    location: 'Antananarivo',
    bio: 'Experte-comptable, elle gère les finances de l\'association avec rigueur et transparence. Elle assure le suivi budgétaire et la reddition des comptes.',
    image: part4,
    icon: <FaSeedling className="w-5 h-5" />,
    color: 'from-[#F2D16B] to-[#6B4F3A]',
    social: { linkedin: '#' }
  },
  {
    id: 5,
    name: 'Raveloson Solofo',
    position: 'Conseiller Technique',
    role: 'Expert en agroécologie',
    email: 's.raveloson@vina.mg',
    phone: '+261 34 00 000 05',
    location: 'Fianarantsoa',
    bio: 'Ingénieur agronome, il forme les agriculteurs aux techniques agroécologiques et accompagne la transition vers une agriculture durable et résiliente.',
    image: part5,
    icon: <FaTree className="w-5 h-5" />,
    color: 'from-[#2F5D2F] to-[#4E8B3A]',
    social: { linkedin: '#' }
  },
  {
    id: 6,
    name: 'Raharijaona Niry',
    position: 'Chargée de Communication',
    role: 'Relations publiques et médias',
    email: 'n.raharijaona@vina.mg',
    phone: '+261 34 00 000 06',
    location: 'Antananarivo',
    bio: 'Spécialiste en communication digitale, elle met en valeur l\'impact des projets de VINA et tisse des liens avec les communautés et les médias.',
    image: part6,
    icon: <FaHeart className="w-5 h-5" />,
    color: 'from-[#87CFEA] to-[#2C7FB8]',
    social: { linkedin: '#' }
  }
];

export default function Personnel() {
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
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A3A1A]/95 via-[#2F5D2F]/90 to-[#2C7FB8]/85"></div>
          </div>

          {/* Éléments décoratifs animés */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-72 h-72 bg-[#6FBF4A]/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#87CFEA]/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            
            {/* Motifs flottants */}
            <div className="absolute top-40 left-10 opacity-20 animate-float">
              <FaUsers className="w-32 h-32 text-white" />
            </div>
            <div className="absolute bottom-40 right-10 opacity-20 animate-float animation-delay-3000">
              <FaLeaf className="w-32 h-32 text-white" />
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 mb-8 animate-fade-in-down">
              <span className="w-2 h-2 bg-[#F2D16B] rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-bold tracking-wider uppercase text-white">Notre équipe • 2024</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up text-white">
              Les femmes et les hommes
              <span className="relative inline-block ml-4">
                <span className="relative z-10 bg-gradient-to-r from-[#F2D16B] to-[#6FBF4A] bg-clip-text text-transparent">
                  derrière VINA
                </span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-[#F2D16B]/30 -z-0 blur-md"></span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500">
              Une équipe pluridisciplinaire de passionnés, unie par une vision commune : 
              construire un avenir durable et inclusif pour les communautés malgaches.
            </p>
            
            {/* Statistiques rapides */}
            <div className="flex flex-wrap justify-center gap-12 mt-12 animate-fade-in-up animation-delay-700">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#F2D16B]">6</div>
                <div className="text-sm text-white/80 mt-1">Membres actifs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#F2D16B]">8</div>
                <div className="text-sm text-white/80 mt-1">Régions couvertes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#F2D16B]">15+</div>
                <div className="text-sm text-white/80 mt-1">Ans d'expérience</div>
              </div>
            </div>
          </div>
        </section>

      {/* Message de l'équipe - Design Premium */}
      <section className="py-24 bg-gradient-to-b from-white to-[#F4F8F9] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#F4F8F9] to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#6FBF4A]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#2C7FB8]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-4xl p-12 md:p-16 shadow-2xl border border-[#87CFEA]/30 relative">
            {/* Éléments décoratifs */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-[#6FBF4A] to-[#4E8B3A] rounded-full flex items-center justify-center shadow-xl">
              <FaQuoteLeft className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#2C7FB8] to-[#6E8FA3] rounded-full flex items-center justify-center shadow-xl">
              <FaQuoteRight className="w-8 h-8 text-white" />
            </div>
            
            {/* Contenu */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-[#6FBF4A] to-transparent"></div>
              
              <p className="text-2xl md:text-3xl lg:text-4xl text-[#2F5D2F] font-light italic leading-relaxed mb-8">
                "Chaque membre de notre équipe partage la conviction que le développement 
                ne peut être efficace et durable que s'il repose sur la prise en compte 
                des réalités locales et des besoins exprimés par les communautés."
              </p>
              
              <div className="flex items-center justify-center">
                <div className="w-16 h-px bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] mr-4"></div>
                <span className="text-[#6E8FA3] font-medium tracking-wide uppercase text-sm">
                  Le Conseil d'Administration de VINA
                </span>
                <div className="w-16 h-px bg-gradient-to-r from-[#2C7FB8] to-[#6FBF4A] ml-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grille de l'équipe - Design Premium */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-40 right-20 w-72 h-72 bg-[#6FBF4A]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#2C7FB8]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#87CFEA]/20 px-6 py-3 rounded-full border border-[#87CFEA]/30 mb-6">
              <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2"></span>
              <span className="text-[#2F5D2F] text-sm font-bold uppercase tracking-wider">
                Gouvernance
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2F5D2F] mb-6">
              Notre{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] bg-clip-text text-transparent">
                  conseil d'administration
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#6FBF4A]/20 -z-0 blur-md"></span>
              </span>
            </h2>
            
            <p className="text-xl text-[#6E8FA3] max-w-3xl mx-auto">
              Une équipe pluridisciplinaire d'experts engagés au service de notre mission
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 overflow-hidden border border-[#87CFEA]/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background gradient au hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700`}></div>
                
                {/* Photo avec effet */}
                <div className="relative pt-10 px-8 flex justify-center">
                  <div className="relative">
                    {/* Cercle décoratif */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700`}></div>
                    
                    {/* Photo */}
                    <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-[#87CFEA]/20 group-hover:ring-[#6FBF4A]/40 transition-all duration-700 group-hover:scale-105">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Badge de position - Plus élégant */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20">
                      <div className={`px-5 py-2.5 bg-gradient-to-r ${member.color} text-white text-xs font-bold rounded-full shadow-xl flex items-center space-x-2`}>
                        <span className="w-4 h-4 flex items-center justify-center">
                          {member.icon}
                        </span>
                        <span>{member.position}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 pt-8 text-center">
                  <h3 className="text-xl font-bold text-[#2F5D2F] mb-1 group-hover:text-[#6FBF4A] transition-colors">
                    {member.name}
                  </h3>
                  
                  <p className="text-[#2C7FB8] font-semibold text-sm mb-3">
                    {member.role}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 text-xs text-[#6E8FA3] mb-4">
                    <FaMapMarkerAlt className="w-3 h-3 text-[#6FBF4A]" />
                    <span>{member.location}</span>
                  </div>
                  
                  <p className="text-[#6E8FA3] text-sm leading-relaxed mb-6 line-clamp-3 px-2">
                    {member.bio}
                  </p>
                  
                  {/* Contacts avec design amélioré */}
                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-center justify-center text-xs group/email">
                      <div className="w-6 h-6 bg-[#2C7FB8]/10 rounded-full flex items-center justify-center mr-2 group-hover/email:bg-[#2C7FB8] transition-colors">
                        <FaEnvelope className={`w-3 h-3 text-[#2C7FB8] group-hover/email:text-white transition-colors`} />
                      </div>
                      <a href={`mailto:${member.email}`} className="text-[#6E8FA3] hover:text-[#6FBF4A] transition-colors">
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-center text-xs group/phone">
                      <div className="w-6 h-6 bg-[#6FBF4A]/10 rounded-full flex items-center justify-center mr-2 group-hover/phone:bg-[#6FBF4A] transition-colors">
                        <FaPhone className={`w-3 h-3 text-[#6FBF4A] group-hover/phone:text-white transition-colors`} />
                      </div>
                      <a href={`tel:${member.phone}`} className="text-[#6E8FA3] hover:text-[#6FBF4A] transition-colors">
                        {member.phone}
                      </a>
                    </div>
                  </div>
                  
                  {/* Social avec effets */}
                  <div className="flex justify-center space-x-4 pt-4 border-t border-[#87CFEA]/20">
                    <a 
                      href={member.social.linkedin} 
                      className="w-10 h-10 bg-[#0077B5]/10 rounded-xl flex items-center justify-center hover:bg-[#0077B5] transition-all duration-300 hover:scale-110 group/linkedin"
                    >
                      <FaLinkedin className="w-5 h-5 text-[#0077B5] group-hover/linkedin:text-white transition-colors" />
                    </a>
                    <a 
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 bg-[#87CFEA]/10 rounded-xl flex items-center justify-center hover:bg-[#2C7FB8] transition-all duration-300 hover:scale-110 group/mail"
                    >
                      <FaEnvelope className="w-5 h-5 text-[#2C7FB8] group-hover/mail:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre approche RH - Version simplifiée */}
      <section className="py-24 bg-gradient-to-b from-[#F4F8F9] to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#6FBF4A]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#2C7FB8]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#87CFEA]/20 px-6 py-3 rounded-full border border-[#87CFEA]/30 mb-6">
              <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2 animate-pulse"></span>
              <span className="text-[#2F5D2F] text-sm font-bold uppercase tracking-wider">
                Rejoindre l'aventure
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F5D2F] mb-6">
              Vous souhaitez nous{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#6FBF4A] to-[#2C7FB8] bg-clip-text text-transparent">
                  rejoindre
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#6FBF4A]/20 -z-0 blur-md"></span>
              </span>
              ?
            </h2>
            
            <p className="text-lg text-[#6E8FA3] leading-relaxed max-w-2xl mx-auto mb-10">
              Nous recherchons régulièrement des talents passionnés par le développement durable 
              et l'impact social. Si vous partagez nos valeurs et souhaitez contribuer à notre mission, 
              n'hésitez pas à nous contacter.
            </p>
          </div>
          
          {/* Carte valeurs RH centrée */}
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-[#87CFEA]/30 hover:shadow-2xl transition-all duration-500 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6FBF4A] to-[#4E8B3A] rounded-2xl flex items-center justify-center shadow-lg">
                <FaHandshake className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-[#2F5D2F]">Nos valeurs RH</h3>
                <p className="text-sm text-[#6E8FA3]">Un engagement réciproque</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                'Égalité des chances et non-discrimination',
                'Développement des compétences et formation continue',
                'Environnement de travail inclusif et bienveillant',
                'Engagement bénévole reconnu et valorisé'
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#6FBF4A]/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-[#6FBF4A] rounded-full"></span>
                  </div>
                  <span className="text-sm text-[#6E8FA3]">{item}</span>
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