// src/pages/public/About.tsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaLeaf, 
  FaHandsHelping, 
  FaUsers, 
  FaTree, 
  FaSeedling,
  FaGraduationCap,
  FaHandshake,
  FaArrowRight,
  FaQuoteLeft,
  FaQuoteRight,
  FaGlobeAfrica,
  FaSpinner
} from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import missionService from '../../services/missionService';
import projetService from '../../services/projetService';
import partenaireService from '../../services/partenaireService';
import regionService from '../../services/regionService';

// Interface pour le contenu multilingue
interface Content {
  fr: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
    };
    histoire: {
      badge: string;
      title: string;
      titleHighlight: string;
      paragraphs: string[];
      quote: string;
    };
    valeurs: {
      title: string;
      items: {
        title: string;
        description: string;
        icon: any;
        color: string;
      }[];
      motto: string;
    };
    approche: {
      badge: string;
      title: string;
      titleHighlight: string;
      subtitle: string;
      items: {
        title: string;
        description: string;
        icon: any;
        color: string;
      }[];
    };
    impact: {
      title: string;
      subtitle: string;
      stats: {
        missions: string;
        regions: string;
        beneficiaries: string;
        partners: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
    loading: string;
  };
  en: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
    };
    histoire: {
      badge: string;
      title: string;
      titleHighlight: string;
      paragraphs: string[];
      quote: string;
    };
    valeurs: {
      title: string;
      items: {
        title: string;
        description: string;
        icon: any;
        color: string;
      }[];
      motto: string;
    };
    approche: {
      badge: string;
      title: string;
      titleHighlight: string;
      subtitle: string;
      items: {
        title: string;
        description: string;
        icon: any;
        color: string;
      }[];
    };
    impact: {
      title: string;
      subtitle: string;
      stats: {
        missions: string;
        regions: string;
        beneficiaries: string;
        partners: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
    loading: string;
  };
}

// Texte multilingue
const content: Content = {
  fr: {
    hero: {
      badge: 'QUI SOMMES-NOUS',
      title: 'Vision pour des Actions Intégrées et Fondées sur la Nature',
      subtitle: 'Mobilisation Intégrée pour la Résilience et l\'Autonomie des communautés locales à Madagascar'
    },
    histoire: {
      badge: 'NOTRE HISTOIRE',
      title: 'L\'origine de',
      titleHighlight: 'VINA',
      paragraphs: [
        "Fondée en Mars 2026, VINA -- Vision Integrated and Nature-based Action est née de la volonté commune de jeunes experts multidisciplinaires engagés dans le développement local durable.",
        "Composée de profils variés (ingénieurs agronomes spécialisés en environnement et foresterie, industrie agroalimentaire, élevage et agriculture, ainsi qu'un expert en management et communication), l'association s'appuie sur une collaboration initiée dès 2017.",
        "Pendant près d'une décennie, ses membres ont conduit diverses actions de terrain de manière informelle, en accompagnant les communautés locales dans leurs initiatives de développement. Convaincue que toute transformation durable commence par l'implication active des populations, VINA formalise aujourd'hui son engagement à travers une structure légale, inclusive et tournée vers l'impact à long terme."
      ],
      quote: "Nous plaçons les communautés locales au centre de la conception, de la mise en œuvre et du suivi des actions de développement, en reconnaissant leur rôle fondamental en tant qu'actrices de leur propre développement."
    },
    valeurs: {
      title: 'Nos valeurs fondamentales',
      items: [
        {
          title: 'Inclusivité',
          description: 'Équité — Participation — Diversité — Empowerment',
          icon: FaUsers,
          color: 'text-olive-nature'
        },
        {
          title: 'Collaboration',
          description: 'Partenariat — Co-création — Synergie — Confiance',
          icon: FaHandsHelping,
          color: 'text-water-blue'
        },
        {
          title: 'Responsabilité',
          description: 'Éthique — Transparence — Engagement — Impact mesurable',
          icon: FaGlobeAfrica,
          color: 'text-earth-brown'
        },
        {
          title: 'Innovation',
          description: 'Créativité — Adaptation — Solutions durables — Résilience',
          icon: FaLeaf,
          color: 'text-olive-nature'
        }
      ],
      motto: 'Notre devise : Ensemble pour un développement durable et inclusif'
    },
    approche: {
      badge: 'NOTRE APPROCHE',
      title: 'Une vision',
      titleHighlight: 'multisectorielle',
      subtitle: 'Nous intervenons sur plusieurs fronts pour un impact global et durable',
      items: [
        {
          title: 'Développement économique',
          description: 'Agriculture durable, élevage résilient, sécurité alimentaire, activités génératrices de revenus et entrepreneuriat local.',
          icon: FaSeedling,
          color: 'text-olive-nature'
        },
        {
          title: 'Environnement',
          description: 'Gestion durable des ressources naturelles, restauration des paysages, lutte contre la déforestation et adaptation au changement climatique.',
          icon: FaTree,
          color: 'text-water-blue'
        },
        {
          title: 'Social',
          description: 'Éducation, santé, eau potable, assainissement, protection sociale et autonomisation des jeunes et des femmes.',
          icon: FaGraduationCap,
          color: 'text-earth-brown'
        },
        {
          title: 'Gouvernance',
          description: 'Gouvernance locale inclusive et transparente, collaboration avec les collectivités territoriales, participation citoyenne.',
          icon: FaHandshake,
          color: 'text-sun-gold'
        }
      ]
    },
    impact: {
      title: 'Notre impact en chiffres',
      subtitle: 'Depuis notre création, nous œuvrons sans relâche pour un changement durable',
      stats: {
        missions: 'Missions actives',
        regions: 'Régions',
        beneficiaries: 'Bénéficiaires',
        partners: 'Partenaires'
      }
    },
    cta: {
      title: 'Rejoignez-nous dans cette mission',
      subtitle: 'Que vous soyez un partenaire potentiel, un bénévole ou simplement intéressé par notre travail, nous serions ravis d\'échanger avec vous.',
      button: 'Notre équipe'
    },
    loading: 'Chargement...'
  },
  en: {
    hero: {
      badge: 'ABOUT US',
      title: 'Vision for Integrated and Nature-based Actions',
      subtitle: 'Integrated Mobilization for Resilience and Autonomy of local communities in Madagascar'
    },
    histoire: {
      badge: 'OUR STORY',
      title: 'The origin of',
      titleHighlight: 'VINA',
      paragraphs: [
        "Founded in March 2026, VINA -- Vision Integrated and Nature-based Action was born out of a shared desire among young multidisciplinary experts committed to sustainable local development.",
        "Composed of a diverse range of profiles (agricultural engineers specializing in the environment and forestry, the agri-food industry, livestock farming, and agriculture, as well as an expert in management and communication), the association builds on a collaboration that began in 2017.",
        "For nearly a decade, its members have carried out various informal field activities, supporting local communities in their development initiatives. Convinced that all sustainable transformation begins with the active involvement of local populations, VINA is now formalizing its commitment through a legal structure that is inclusive and focused on long-term impact."
      ],
      quote: "We place local communities at the center of the design, implementation and monitoring of development actions, recognizing their fundamental role as actors of their own development."
    },
    valeurs: {
      title: 'Our core values',
      items: [
        {
          title: 'Inclusivity',
          description: 'Equity — Participation — Diversity — Empowerment',
          icon: FaUsers,
          color: 'text-olive-nature'
        },
        {
          title: 'Collaboration',
          description: 'Partnership — Co-creation — Synergy — Trust',
          icon: FaHandsHelping,
          color: 'text-water-blue'
        },
        {
          title: 'Responsibility',
          description: 'Ethics — Transparency — Commitment — Measurable impact',
          icon: FaGlobeAfrica,
          color: 'text-earth-brown'
        },
        {
          title: 'Innovation',
          description: 'Creativity — Adaptation — Sustainable solutions — Resilience',
          icon: FaLeaf,
          color: 'text-olive-nature'
        }
      ],
      motto: 'Our motto: Together for sustainable and inclusive development'
    },
    approche: {
      badge: 'OUR APPROACH',
      title: 'A',
      titleHighlight: 'multisectoral',
      subtitle: 'We work on several fronts for a global and sustainable impact',
      items: [
        {
          title: 'Economic development',
          description: 'Sustainable agriculture, resilient livestock, food security, income-generating activities and local entrepreneurship.',
          icon: FaSeedling,
          color: 'text-olive-nature'
        },
        {
          title: 'Environment',
          description: 'Sustainable management of natural resources, landscape restoration, fight against deforestation and adaptation to climate change.',
          icon: FaTree,
          color: 'text-water-blue'
        },
        {
          title: 'Social',
          description: 'Education, health, drinking water, sanitation, social protection and empowerment of youth and women.',
          icon: FaGraduationCap,
          color: 'text-earth-brown'
        },
        {
          title: 'Governance',
          description: 'Inclusive and transparent local governance, collaboration with local authorities, citizen participation.',
          icon: FaHandshake,
          color: 'text-sun-gold'
        }
      ]
    },
    impact: {
      title: 'Our impact in numbers',
      subtitle: 'Since our creation, we have been working tirelessly for sustainable change',
      stats: {
        missions: 'Active missions',
        regions: 'Regions',
        beneficiaries: 'Beneficiaries',
        partners: 'Partners'
      }
    },
    cta: {
      title: 'Join us in this mission',
      subtitle: 'Whether you are a potential partner, a volunteer or simply interested in our work, we would be delighted to hear from you.',
      button: 'Our team'
    },
    loading: 'Loading...'
  }
};

export default function About() {
  const { language } = useLanguage();
  const t = content[language];
  
  const [loading, setLoading] = useState(true);
  const [realStats, setRealStats] = useState({
    missions: 0,
    regions: 0,
    beneficiaries: 0,
    partners: 0
  });

  // Charger les données réelles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [missionsData, projetsData, partenairesData, regionsData] = await Promise.all([
          missionService.getAllMissions(),
          projetService.getAllProjets(),
          partenaireService.getAllPartenaires(),
          regionService.getAllRegions()
        ]);

        // Calculer les statistiques réelles
        const totalBeneficiaires = projetsData.reduce((acc, p) => acc + (p.beneficiaires || 0), 0);

        setRealStats({
          missions: missionsData.length,
          regions: regionsData.length,
          beneficiaries: totalBeneficiaires,
          partners: partenairesData.length
        });
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatBeneficiaires = (nb: number) => {
    if (nb >= 1000000) return (nb / 1000000).toFixed(1) + 'M';
    if (nb >= 1000) return (nb / 1000).toFixed(1) + 'k';
    return nb.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm-white to-ultra-light flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-sun-gold animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-olive-nature to-water-blue text-warm-white py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sun-gold/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-soft/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 opacity-10">
            <FaLeaf className="w-64 h-64" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-warm-white/20 px-4 py-2 rounded-full border border-warm-white/30 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-sun-gold rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-warm-white/90 mb-10 max-w-3xl leading-relaxed">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-sun-gold/10 px-4 py-2 rounded-full border border-sun-gold/30 mb-6">
                <span className="w-2 h-2 bg-sun-gold rounded-full mr-2"></span>
                <span className="text-forest-deep text-sm font-medium">{t.histoire.badge}</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-forest-deep mb-8 leading-tight">
                {t.histoire.title} <span className="text-olive-nature">{t.histoire.titleHighlight}</span>
              </h2>
              
              <div className="space-y-6 text-text-secondary leading-relaxed">
                {t.histoire.paragraphs.map((paragraph, index) => (
                  <p key={index} className={index === 0 ? 'text-lg' : ''}>
                    {paragraph}
                  </p>
                ))}
                
                <div className="bg-ultra-light p-6 rounded-2xl border-l-4 border-sun-gold mt-8">
                  <FaQuoteLeft className="w-8 h-8 text-sun-gold/30 mb-2" />
                  <p className="text-forest-deep italic font-medium">
                    {t.histoire.quote}
                  </p>
                  <div className="flex justify-end mt-2">
                    <FaQuoteRight className="w-8 h-8 text-sun-gold/30" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-olive-nature to-water-blue rounded-3xl opacity-10 blur-2xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-border-light">
                <h3 className="text-2xl font-bold text-forest-deep mb-6">{t.valeurs.title}</h3>
                
                <div className="space-y-6">
                  {t.valeurs.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${item.color.replace('text', 'bg')}/20`}>
                          <Icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-forest-deep mb-1">{item.title}</h4>
                          <p className="text-sm text-text-secondary">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-border-light">
                  <p className="text-sm text-text-secondary">
                    <span className="font-bold text-forest-deep">{t.valeurs.motto.split(':')[0]} :</span> {t.valeurs.motto.split(':')[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre approche */}
      <section className="py-24 bg-ultra-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-sun-gold/10 px-4 py-2 rounded-full border border-sun-gold/30 mb-6">
              <span className="w-2 h-2 bg-sun-gold rounded-full mr-2"></span>
              <span className="text-forest-deep text-sm font-medium">{t.approche.badge}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-forest-deep mb-6">
              {t.approche.title} <span className="text-olive-nature">{t.approche.titleHighlight}</span>
            </h2>
            
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              {t.approche.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.approche.items.slice(0, 3).map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-border-light">
                  <div className={`w-16 h-16 ${item.color.replace('text', 'bg')}/20 rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-forest-deep mb-4">{item.title}</h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 grid md:grid-cols-1 max-w-2xl mx-auto">
            {t.approche.items.slice(3, 4).map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-border-light">
                  <div className={`w-16 h-16 ${item.color.replace('text', 'bg')}/20 rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-forest-deep mb-4">{item.title}</h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chiffres clés avec données réelles */}
      <section className="py-20 bg-gradient-to-r from-olive-nature to-water-blue text-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.impact.title}</h2>
            <p className="text-xl text-warm-white/90 max-w-3xl mx-auto">
              {t.impact.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-sun-gold mb-3">{realStats.missions}</div>
              <div className="text-lg font-medium text-warm-white/90">{t.impact.stats.missions}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-sun-gold mb-3">{realStats.regions}</div>
              <div className="text-lg font-medium text-warm-white/90">{t.impact.stats.regions}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-sun-gold mb-3">
                {formatBeneficiaires(realStats.beneficiaries)}+
              </div>
              <div className="text-lg font-medium text-warm-white/90">{t.impact.stats.beneficiaries}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-sun-gold mb-3">{realStats.partners}</div>
              <div className="text-lg font-medium text-warm-white/90">{t.impact.stats.partners}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-ultra-light to-warm-white rounded-3xl p-12 shadow-xl border border-border-light">
            <h3 className="text-3xl md:text-4xl font-bold text-forest-deep mb-6">
              {t.cta.title}
            </h3>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/personnel"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-olive-nature to-forest-deep text-warm-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                {t.cta.button}
                <FaArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}