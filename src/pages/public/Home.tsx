// src/pages/public/Home.tsx
import HeroSection from '../../components/sections/HeroSection';
import MissionSection from '../../components/sections/MissionSection';
import ProjectsSection from '../../components/sections/ProjectsSection';
import TestimonialSection from '../../components/sections/TestimonialSection';
import PartenaireSection from '../../components/sections/PartenaireSection';
import ActualiteSection from '../../components/sections/ActualiteSection';
export default function Home() {
  return (
    <div>
       
      <section id="hero">
        <HeroSection />
      </section>
      <section id="missions">
        <MissionSection />
      </section>
      <section id="projects">
        <ProjectsSection />
      </section>
      <section id="testimonials">
        <TestimonialSection />
      </section>
      <section id="partners">
        <PartenaireSection />
      </section>
      <section id="actualites">
        <ActualiteSection />
      </section>
      <section id="contact">
        {/* Si tu as une section contact */}
      </section>
    </div>
  );
}