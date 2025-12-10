import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Download, Link, QrCode, RefreshCw, Home, X, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { launchConfetti, launchSchoolPride } from './Fireworks';
import Fireworks from './Fireworks';
import rceLogo from '@/assets/rce-logo.avif';
import { QRCodeSVG } from 'qrcode.react';

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
        backgroundColor: null,
        scale: 2,
        useCORS: true,
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

  const shareText = `🎉 Happy New Year 2026! Check out my personalized greeting from Ramachandra College of Engineering! ✨`;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't support direct URL sharing, so we copy the link and notify user
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    toast({
      title: 'Ready for Instagram!',
      description: 'Link copied! Open Instagram and paste in your story or post.',
    });
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

        {/* Card */}
        <div
          ref={cardRef}
          className="glass-card-strong p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet/20 rounded-full blur-3xl" />
          
          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <img src={rceLogo} alt="RCE Logo" className="w-8 h-8 rounded-full object-contain bg-white/20" />
              <span className="text-sm text-primary font-medium">Ramachandra College of Engineering</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
              {greeting.greetingTitle}
            </h2>
            
            <p className="text-muted-foreground">
              {greeting.branch} – {greeting.year} Year Student
            </p>
          </div>

          {/* Main Message */}
          <div className="relative mb-8 text-center">
            <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">
              {greeting.greetingBody}
            </p>
          </div>

          {/* Motivational Quote */}
          <div className="relative glass-card p-6 mb-8">
            <div className="text-4xl text-primary/30 font-serif absolute -top-2 left-4">"</div>
            <p className="text-center text-foreground italic text-lg pl-8 pr-8">
              {greeting.motivationalQuote}
            </p>
            <div className="text-4xl text-primary/30 font-serif absolute -bottom-6 right-4">"</div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            {t.greeting.footer}
          </p>
        </div>

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

        {/* Social Media Share Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <p className="w-full text-center text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            Share on Social Media
          </p>
          
          <Button
            onClick={handleWhatsAppShare}
            size="sm"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </Button>
          
          <Button
            onClick={handleFacebookShare}
            size="sm"
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </Button>
          
          <Button
            onClick={handleInstagramShare}
            size="sm"
            className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </Button>
          
          <Button
            onClick={handleLinkedInShare}
            size="sm"
            className="bg-[#0A66C2] hover:bg-[#095196] text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
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
