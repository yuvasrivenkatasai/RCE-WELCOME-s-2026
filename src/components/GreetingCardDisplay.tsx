import React from 'react';
import rceLogo from '@/assets/rce-logo.avif';
import { useLanguage } from '@/contexts/LanguageContext';

export interface GreetingDisplayData {
  name: string;
  branch: string;
  year: string;
  greetingTitle: string;
  greetingBody: string;
  motivationalQuote: string;
}

interface GreetingCardDisplayProps {
  greeting: GreetingDisplayData;
  scale?: number;
  className?: string;
}

const GreetingCardDisplay = React.forwardRef<HTMLDivElement, GreetingCardDisplayProps>(
  ({ greeting, scale = 1, className = '' }, ref) => {
    const { t } = useLanguage();
    
    const scaleStyle = scale !== 1 ? {
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
    } : {};

    return (
      <div
        ref={ref}
        className={`relative p-2 rounded-3xl overflow-visible ${className}`}
        style={{ 
          background: 'linear-gradient(135deg, hsl(45, 90%, 55%) 0%, hsl(35, 85%, 50%) 25%, hsl(280, 70%, 50%) 50%, hsl(200, 80%, 50%) 75%, hsl(45, 90%, 55%) 100%)',
          ...scaleStyle,
        }}
      >
        {/* Inner card */}
        <div
          className="relative p-8 sm:p-12 rounded-2xl overflow-visible"
          style={{ 
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(15, 15, 35, 0.99) 100%)',
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-10 h-10 border-l-2 border-t-2 border-gold-light/60 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-10 h-10 border-r-2 border-t-2 border-gold-light/60 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-10 h-10 border-l-2 border-b-2 border-gold-light/60 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-10 h-10 border-r-2 border-b-2 border-gold-light/60 rounded-br-lg" />
          
          {/* Corner stars */}
          <div className="absolute top-5 left-5 text-gold-light text-xl">✦</div>
          <div className="absolute top-5 right-5 text-gold-light text-xl">✦</div>
          <div className="absolute bottom-5 left-5 text-gold-light text-xl">✦</div>
          <div className="absolute bottom-5 right-5 text-gold-light text-xl">✦</div>
          
          {/* Firework sparkles scattered around */}
          <div className="absolute top-12 left-12 text-primary/70 text-sm">✨</div>
          <div className="absolute top-16 right-16 text-violet/70 text-lg">✴</div>
          <div className="absolute top-24 left-8 text-gold-light/60 text-xs">⭐</div>
          <div className="absolute bottom-24 right-10 text-cyan/60 text-sm">✨</div>
          <div className="absolute bottom-16 left-16 text-primary/60 text-lg">✴</div>
          <div className="absolute bottom-12 right-20 text-gold-light/50 text-xs">⭐</div>
          <div className="absolute top-1/3 left-6 text-violet/50 text-sm">✦</div>
          <div className="absolute top-1/2 right-6 text-gold-light/40 text-sm">✦</div>
          <div className="absolute bottom-1/3 left-10 text-cyan/50 text-xs">✨</div>
          <div className="absolute top-20 right-8 text-primary/50 text-xs">⭐</div>
          
          {/* Firework burst decorations */}
          <div className="absolute top-8 left-1/4 flex gap-0.5">
            <div className="w-1 h-1 bg-gold-light/60 rounded-full" />
            <div className="w-0.5 h-0.5 bg-gold-light/40 rounded-full mt-1" />
            <div className="w-0.5 h-0.5 bg-gold-light/40 rounded-full" />
          </div>
          <div className="absolute top-10 right-1/4 flex gap-0.5">
            <div className="w-0.5 h-0.5 bg-violet/50 rounded-full" />
            <div className="w-1 h-1 bg-violet/70 rounded-full" />
            <div className="w-0.5 h-0.5 bg-violet/40 rounded-full mt-1" />
          </div>
          <div className="absolute bottom-10 left-1/3 flex gap-0.5">
            <div className="w-0.5 h-0.5 bg-primary/50 rounded-full mt-1" />
            <div className="w-1 h-1 bg-primary/60 rounded-full" />
            <div className="w-0.5 h-0.5 bg-primary/40 rounded-full" />
          </div>
          <div className="absolute bottom-8 right-1/3 flex gap-0.5">
            <div className="w-0.5 h-0.5 bg-cyan/40 rounded-full" />
            <div className="w-0.5 h-0.5 bg-cyan/50 rounded-full mt-1" />
            <div className="w-1 h-1 bg-cyan/60 rounded-full" />
          </div>
          
          {/* Background glow decorations */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          <div className="absolute bottom-8 left-8 w-28 h-28 bg-violet/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gold-light/10 rounded-full blur-3xl" />
          
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
          <div className="relative glass-card p-6 mb-8 border border-gold-light/20">
            <div className="text-4xl text-gold-light/40 font-serif absolute -top-2 left-4">"</div>
            <p className="text-center text-foreground italic text-lg pl-8 pr-8">
              {greeting.motivationalQuote}
            </p>
            <div className="text-4xl text-gold-light/40 font-serif absolute -bottom-6 right-4">"</div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t.greeting.footer}
            </p>
            <p className="text-xs text-gold-light/50">✨ Happy New Year 2026 ✨</p>
          </div>
        </div>
      </div>
    );
  }
);

GreetingCardDisplay.displayName = 'GreetingCardDisplay';

export default GreetingCardDisplay;
