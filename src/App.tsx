import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/sections/HeroSection';
import { MemorySection } from '@/sections/MemorySection';
import { FeaturesSection } from '@/sections/FeaturesSection';
import { SelfHostedSection } from '@/sections/SelfHostedSection';
import { CTASection } from '@/sections/CTASection';
import { FooterSection } from '@/sections/FooterSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Smooth scroll behavior
    ScrollTrigger.defaults({
      markers: false,
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div className="relative bg-dark min-h-screen">
      <Navigation />
      
      <main className="relative">
        {/* Hero Section with chat demo */}
        <HeroSection />
        
        {/* Memory visualization section */}
        <MemorySection />
        
        {/* Features grid */}
        <FeaturesSection />
        
        {/* Self-hosted / Docker section */}
        <SelfHostedSection />
        
        {/* Final CTA */}
        <CTASection />
        
        {/* Footer */}
        <FooterSection />
      </main>
    </div>
  );
}

export default App;
