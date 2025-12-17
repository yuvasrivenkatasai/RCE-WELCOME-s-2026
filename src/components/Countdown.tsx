import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('January 1, 2026 00:00:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="glass-card-strong w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-2 pulse-glow">
        <span className="text-3xl sm:text-4xl font-display font-bold gradient-text">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto text-center">
        <p className="text-sm sm:text-base text-cyan-400/90 font-medium tracking-widest uppercase mb-3 animate-pulse">
          A special experience for RCE students is counting down.
        </p>
        <h2 className="text-2xl sm:text-3xl font-display font-semibold mb-8 gradient-text-violet">
          {t.countdown.title}
        </h2>
        <div className="flex justify-center gap-4 sm:gap-6">
          <TimeUnit value={timeLeft.days} label={t.countdown.days} />
          <div className="flex items-center text-2xl text-primary font-bold self-start mt-8">:</div>
          <TimeUnit value={timeLeft.hours} label={t.countdown.hours} />
          <div className="flex items-center text-2xl text-primary font-bold self-start mt-8">:</div>
          <TimeUnit value={timeLeft.minutes} label={t.countdown.minutes} />
          <div className="flex items-center text-2xl text-primary font-bold self-start mt-8">:</div>
          <TimeUnit value={timeLeft.seconds} label={t.countdown.seconds} />
        </div>
      </div>
    </div>
  );
};

export default Countdown;
