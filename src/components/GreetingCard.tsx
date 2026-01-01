import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Download, Link, QrCode, RefreshCw, Home, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { launchConfetti, launchSchoolPride } from './Fireworks';
import Fireworks from './Fireworks';
import rceLogo from '@/assets/rce-logo.avif';
import { QRCodeSVG } from 'qrcode.react';
import GreetingCardDisplay, { GreetingDisplayData } from './GreetingCardDisplay';

export interface GreetingData {
  name: string;
  branch: string;
  year: string;
  greetingTitle: string;
  greetingBody: string;
  motivationalQuote: string;
}

interface GreetingCardProps {
  greeting: GreetingData;
  onNewGreeting: () => void;
  onBackHome: () => void;
}

const GreetingCard = ({ greeting, onNewGreeting, onBackHome }: GreetingCardProps) => {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Generate unique share URL for this greeting
  const shareUrl = `${window.location.origin}?greeting=${encodeURIComponent(greeting.name)}`;

  // Launch fireworks and confetti when greeting card appears
  useEffect(() => {
    // Initial confetti burst
    launchConfetti();
    
    // School pride effect after a short delay
    setTimeout(() => {
      launchSchoolPride();
    }, 500);
    
    // Another confetti burst
    setTimeout(() => {
      launchConfetti();
    }, 2000);
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a1a',
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: cardRef.current.scrollWidth,
        windowHeight: cardRef.current.scrollHeight,
      });
      
      const link = document.createElement('a');
      link.download = `RCE-NewYear-2026-${greeting.name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: 'Downloaded!',
        description: 'Your greeting card has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Could not download the card. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Link Copied!',
      description: 'Share link has been copied to clipboard.',
    });
  };

  const handleShowQR = () => {
    setShowQRModal(true);
  };

  const greetingData: GreetingDisplayData = {
    name: greeting.name,
    branch: greeting.branch,
    year: greeting.year,
    greetingTitle: greeting.greetingTitle,
    greetingBody: greeting.greetingBody,
    motivationalQuote: greeting.motivationalQuote,
  };

  return (
    <section className="py-20 px-4 relative">
      {/* Fireworks component for continuous effect */}
      <Fireworks autoPlay={true} />
      
      {/* Floating celebration particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-celebration-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          >
            <div 
              className={`rounded-full opacity-70 ${i % 3 === 0 ? 'w-3 h-3 animate-sparkle-burst' : 'w-2 h-2'}`}
              style={{
                backgroundColor: ['hsl(var(--primary))', 'hsl(var(--gold-light))', 'hsl(var(--violet))', 'hsl(var(--accent))', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          </div>
        ))}
        
        {/* Firecracker trails */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`trail-${i}`}
            className="absolute animate-firework-trail"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '0',
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div 
              className="w-1 h-8 rounded-full opacity-80"
              style={{
                background: `linear-gradient(to top, transparent, ${['hsl(var(--primary))', 'hsl(var(--gold-light))', '#FF6B6B', '#FFD93D'][Math.floor(Math.random() * 4)]})`,
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="container mx-auto max-w-3xl relative z-10">

        {/* Card - Using shared component */}
        <GreetingCardDisplay ref={cardRef} greeting={greetingData} />

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button
            onClick={handleDownload}
            className="btn-glow bg-gradient-to-r from-primary to-gold-light text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.greeting.download}
          </Button>
          
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            <Link className="w-4 h-4 mr-2" />
            {t.greeting.copyLink}
          </Button>
          
          <Button
            onClick={handleShowQR}
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t.greeting.showQR}
          </Button>
        </div>


        {/* Back to Home Button */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button
            onClick={onBackHome}
            variant="outline"
            className="border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <Button
            onClick={onNewGreeting}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.greeting.newGreeting}
          </Button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card-strong p-8 max-w-sm w-full mx-4 relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-display font-bold gradient-text mb-4">
                Scan to Share
              </h3>
              
              <div className="bg-white p-4 rounded-2xl inline-block mb-4">
                <QRCodeSVG 
                  value={shareUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: rceLogo,
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code to view {greeting.name}'s greeting
              </p>
              
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 hover:bg-white/10"
              >
                <Link className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GreetingCard;
