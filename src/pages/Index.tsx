import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import StarBackground from '@/components/StarBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import GreetingForm, { FormData } from '@/components/GreetingForm';
import GreetingCard, { GreetingData } from '@/components/GreetingCard';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import SampleGreetingModal from '@/components/SampleGreetingModal';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const IndexContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState<GreetingData | null>(null);
  const [showSample, setShowSample] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      const formElement = document.getElementById('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-greeting', {
        body: {
          name: formData.name,
          branch: formData.branch,
          year: formData.year,
          rollNumber: formData.rollNumber,
          goal: formData.goal,
          language: formData.language,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate greeting');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const generatedGreeting: GreetingData = {
        name: data.greeting.name,
        branch: data.greeting.branch,
        year: data.greeting.year,
        greetingTitle: data.greeting.greetingTitle,
        greetingBody: data.greeting.greetingBody,
        motivationalQuote: data.greeting.motivationalQuote,
      };

      setGreeting(generatedGreeting);
      
      // Scroll to greeting card
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);

      toast({
        title: formData.language === 'EN' ? 'Greeting Generated!' : 'శుభాకాంక్షలు సృష్టించబడ్డాయి!',
        description: formData.language === 'EN' 
          ? 'Your personalized greeting is ready!'
          : 'మీ వ్యక్తిగతీకరించిన శుభాకాంక్షలు సిద్ధంగా ఉన్నాయి!',
      });
    } catch (error) {
      console.error('Error generating greeting:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate greeting. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGreeting = () => {
    setGreeting(null);
    setShowForm(true);
    setTimeout(() => {
      const formElement = document.getElementById('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBackHome = () => {
    setGreeting(null);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      <StarBackground />
      <Navbar />
      
      <main className="relative z-10">
        {greeting ? (
          <div className="pt-24">
            <GreetingCard greeting={greeting} onNewGreeting={handleNewGreeting} onBackHome={handleBackHome} />
          </div>
        ) : (
          <>
            <HeroSection 
              onGetGreeting={scrollToForm}
              onViewSample={() => setShowSample(true)}
            />
            <HowItWorks />
            {showForm && (
              <GreetingForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            )}
            <AboutSection />
          </>
        )}
      </main>

      <Footer />
      
      <SampleGreetingModal 
        isOpen={showSample}
        onClose={() => setShowSample(false)}
      />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
