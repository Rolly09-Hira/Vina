// src/pages/public/About.tsx
import { Link } from 'react-router-dom';
import { 
  FaLeaf, 
  FaHandsHelping, 
  FaUsers, 
  FaTree, 
  FaSeedling,
  FaTint,
  FaGraduationCap,
  FaHandshake,
  FaArrowRight,
  FaQuoteLeft,
  FaQuoteRight,
  FaGlobeAfrica
} from 'react-icons/fa';

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2F5D2F] to-[#2C7FB8] text-white py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6FBF4A]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#87CFEA]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 opacity-10">
            <FaLeaf className="w-64 h-64" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full border border-white/30 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#F2D16B] rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium">QUI SOMMES-NOUS</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Vision for Integrated and Nature-based Actions
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl leading-relaxed">
              Mobilisation Intégrée pour la Résilience et l'Autonomie des communautés locales à Madagascar
            </p>
            
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-[#87CFEA]/20 px-4 py-2 rounded-full border border-[#87CFEA]/30 mb-6">
                <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2"></span>
                <span className="text-[#2F5D2F] text-sm font-medium">NOTRE HISTOIRE</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-[#2F5D2F] mb-8 leading-tight">
                L'origine de <span className="text-[#6FBF4A]">VINA</span>
              </h2>
              
              <div className="space-y-6 text-[#6E8FA3] leading-relaxed">
                <p className="text-lg">
                  L'association VINA trouve son origine dans la prise de conscience d'un groupe de personnes 
                  face aux défis auxquels sont confrontées les communautés locales à Madagascar.
                </p>
                
                <p>
                  Face à la vulnérabilité économique, la pression croissante sur les ressources naturelles 
                  dans un contexte marqué par la dégradation environnementale, ainsi que les difficultés 
                  d'accès aux services sociaux de base, nous avons décidé d'agir.
                </p>
                
                <p>
                  Animés par la volonté de contribuer à un développement local intégré, inclusif et durable, 
                  nous avons adopté une approche participative, inclusive et multisectorielle, inscrite dans 
                  une perspective de long terme.
                </p>
                
                <div className="bg-[#F4F8F9] p-6 rounded-2xl border-l-4 border-[#6FBF4A] mt-8">
                  <FaQuoteLeft className="w-8 h-8 text-[#6FBF4A]/30 mb-2" />
                  <p className="text-[#2F5D2F] italic font-medium">
                    Nous plaçons les communautés locales au centre de la conception, de la mise en œuvre 
                    et du suivi des actions de développement, en reconnaissant leur rôle fondamental 
                    en tant qu'actrices de leur propre développement.
                  </p>
                  <div className="flex justify-end mt-2">
                    <FaQuoteRight className="w-8 h-8 text-[#6FBF4A]/30" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6FBF4A] to-[#2C7FB8] rounded-3xl opacity-10 blur-2xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-[#87CFEA]/30">
                <h3 className="text-2xl font-bold text-[#2F5D2F] mb-6">Nos valeurs fondamentales</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#6FBF4A]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaHandsHelping className="w-6 h-6 text-[#6FBF4A]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2F5D2F] mb-1">Participation</h4>
                      <p className="text-sm text-[#6E8FA3]">Les communautés sont actrices de leur développement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#2C7FB8]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaLeaf className="w-6 h-6 text-[#2C7FB8]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2F5D2F] mb-1">Durabilité</h4>
                      <p className="text-sm text-[#6E8FA3]">Des actions ancrées dans le long terme</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#F2D16B]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaUsers className="w-6 h-6 text-[#6B4F3A]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2F5D2F] mb-1">Inclusion</h4>
                      <p className="text-sm text-[#6E8FA3]">Personne ne reste en arrière</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#87CFEA]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaGlobeAfrica className="w-6 h-6 text-[#2C7FB8]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2F5D2F] mb-1">Transparence</h4>
                      <p className="text-sm text-[#6E8FA3]">Bonne gouvernance et redevabilité</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-[#87CFEA]/20">
                  <p className="text-sm text-[#6E8FA3]">
                    <span className="font-bold text-[#2F5D2F]">Notre devise :</span> Ensemble pour un développement durable et inclusif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre approche */}
      <section className="py-24 bg-[#F4F8F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#87CFEA]/20 px-4 py-2 rounded-full border border-[#87CFEA]/30 mb-6">
              <span className="w-2 h-2 bg-[#6FBF4A] rounded-full mr-2"></span>
              <span className="text-[#2F5D2F] text-sm font-medium">NOTRE APPROCHE</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F5D2F] mb-6">
              Une vision <span className="text-[#6FBF4A]">multisectorielle</span>
            </h2>
            
            <p className="text-xl text-[#6E8FA3] max-w-3xl mx-auto">
              Nous intervenons sur plusieurs fronts pour un impact global et durable
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#87CFEA]/20">
              <div className="w-16 h-16 bg-[#6FBF4A]/20 rounded-2xl flex items-center justify-center mb-6">
                <FaSeedling className="w-8 h-8 text-[#6FBF4A]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2F5D2F] mb-4">Développement économique</h3>
              <p className="text-[#6E8FA3]">
                Agriculture durable, élevage résilient, sécurité alimentaire, activités génératrices de revenus 
                et entrepreneuriat local.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#87CFEA]/20">
              <div className="w-16 h-16 bg-[#2C7FB8]/20 rounded-2xl flex items-center justify-center mb-6">
                <FaTree className="w-8 h-8 text-[#2C7FB8]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2F5D2F] mb-4">Environnement</h3>
              <p className="text-[#6E8FA3]">
                Gestion durable des ressources naturelles, restauration des paysages, lutte contre la déforestation 
                et adaptation au changement climatique.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#87CFEA]/20">
              <div className="w-16 h-16 bg-[#F2D16B]/20 rounded-2xl flex items-center justify-center mb-6">
                <FaGraduationCap className="w-8 h-8 text-[#6B4F3A]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2F5D2F] mb-4">Social</h3>
              <p className="text-[#6E8FA3]">
                Éducation, santé, eau potable, assainissement, protection sociale et autonomisation des jeunes et des femmes.
              </p>
            </div>
          </div>
          
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#87CFEA]/20">
              <div className="w-16 h-16 bg-[#6B4F3A]/20 rounded-2xl flex items-center justify-center mb-6">
                <FaHandshake className="w-8 h-8 text-[#6B4F3A]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2F5D2F] mb-4">Gouvernance</h3>
              <p className="text-[#6E8FA3]">
                Gouvernance locale inclusive et transparente, collaboration avec les collectivités territoriales, 
                participation citoyenne.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#87CFEA]/20">
              <div className="w-16 h-16 bg-[#87CFEA]/20 rounded-2xl flex items-center justify-center mb-6">
                <FaTint className="w-8 h-8 text-[#2C7FB8]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2F5D2F] mb-4">Services de base</h3>
              <p className="text-[#6E8FA3]">
                Accès équitable à l'eau potable, l'assainissement, la santé et l'éducation pour tous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-20 bg-gradient-to-r from-[#2F5D2F] to-[#2C7FB8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Notre impact en chiffres</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Depuis notre création, nous œuvrons sans relâche pour un changement durable
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#F2D16B] mb-3">12</div>
              <div className="text-lg font-medium text-white/90">Missions actives</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#F2D16B] mb-3">8</div>
              <div className="text-lg font-medium text-white/90">Régions</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#F2D16B] mb-3">5000+</div>
              <div className="text-lg font-medium text-white/90">Bénéficiaires</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#F2D16B] mb-3">15+</div>
              <div className="text-lg font-medium text-white/90">Partenaires</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#F4F8F9] to-white rounded-3xl p-12 shadow-xl border border-[#87CFEA]/30">
            <h3 className="text-3xl md:text-4xl font-bold text-[#2F5D2F] mb-6">
              Rejoignez-nous dans cette mission
            </h3>
            <p className="text-lg text-[#6E8FA3] mb-8 max-w-2xl mx-auto">
              Que vous soyez un partenaire potentiel, un bénévole ou simplement intéressé par notre travail, 
              nous serions ravis d'échanger avec vous.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/personnel"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#6FBF4A] to-[#4E8B3A] text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                Notre équipe
                <FaArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}