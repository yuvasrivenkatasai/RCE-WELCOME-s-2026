import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import rceLogo from '@/assets/rce-logo.avif';

interface GreetingRecord {
  id: string;
  name: string;
  branch: string;
  year: string;
  greeting_title: string;
  greeting_body: string;
  motivational_quote: string;
  created_at: string;
}

interface GreetingsGalleryProps {
  onGenerateGreeting: () => void;
}

const ITEMS_PER_PAGE = 8;

const GalleryCard = ({ greeting }: { greeting: GreetingRecord }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Get first name only for privacy
  const displayName = greeting.name.split(' ')[0];

  // Truncate greeting body to 2-3 lines
  const truncatedBody = greeting.greeting_body.length > 120 
    ? greeting.greeting_body.substring(0, 120) + '...' 
    : greeting.greeting_body;

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a1a',
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `RCEE_Greeting_2026_${greeting.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: 'Downloaded!',
        description: 'Greeting card saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Could not download the card.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="group relative animate-fade-in">
      {/* RCEE 2026 Badge */}
      <div className="absolute -top-3 left-4 z-20 px-3 py-1 bg-gradient-to-r from-primary to-gold-light rounded-full text-xs font-semibold text-primary-foreground shadow-lg">
        RCEE 2026
      </div>

      {/* Card Container */}
      <div
        ref={cardRef}
        className="relative p-[2px] rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary/20"
        style={{ 
          background: 'linear-gradient(135deg, hsl(45, 90%, 55%) 0%, hsl(280, 70%, 50%) 50%, hsl(200, 80%, 50%) 100%)',
        }}
      >
        {/* Inner Card */}
        <div
          className="relative p-5 rounded-2xl min-h-[280px] flex flex-col"
          style={{ 
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(15, 15, 35, 0.99) 100%)',
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-6 h-6 border-l border-t border-gold-light/40 rounded-tl" />
          <div className="absolute top-2 right-2 w-6 h-6 border-r border-t border-gold-light/40 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-l border-b border-gold-light/40 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-r border-b border-gold-light/40 rounded-br" />

          {/* Background glow */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-primary/15 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-14 h-14 bg-gold-light/10 rounded-full blur-xl" />

          {/* Header */}
          <div className="text-center mb-3">
            <h3 className="text-lg font-display font-bold bg-gradient-to-r from-primary via-gold-light to-violet bg-clip-text text-transparent">
              Happy New Year 2026
            </h3>
          </div>

          {/* Student Info */}
          <div className="text-center mb-3">
            <p className="text-foreground font-semibold text-base">{displayName}</p>
            <p className="text-muted-foreground text-xs">
              {greeting.branch} – {greeting.year} Year
            </p>
          </div>

          {/* Greeting Preview */}
          <div className="flex-1 mb-3">
            <p className="text-sm text-foreground/80 leading-relaxed text-center line-clamp-3">
              {truncatedBody}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center pt-2 border-t border-white/10">
            <div className="flex items-center justify-center gap-2">
              <img src={rceLogo} alt="RCE" className="w-5 h-5 rounded-full object-contain bg-white/20" />
              <span className="text-xs text-gold-light/60">Ramachandra College of Engineering</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded-2xl">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-gradient-to-r from-primary to-gold-light text-primary-foreground shadow-lg hover:shadow-xl"
          size="sm"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Download
        </Button>
      </div>
    </div>
  );
};

const GreetingsGallery = ({ onGenerateGreeting }: GreetingsGalleryProps) => {
  const [greetings, setGreetings] = useState<GreetingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchGreetings = async (pageNum: number, append: boolean = false) => {
    try {
      const from = pageNum * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('greetings')
        .select('id, name, branch, year, greeting_title, greeting_body, motivational_quote, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        if (append) {
          setGreetings(prev => [...prev, ...data]);
        } else {
          setGreetings(data);
        }
        
        // Check if there are more items
        if (count !== null) {
          setHasMore((pageNum + 1) * ITEMS_PER_PAGE < count);
        } else {
          setHasMore(data.length === ITEMS_PER_PAGE);
        }
      }
    } catch (error) {
      console.error('Error fetching greetings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load greetings.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      await fetchGreetings(0);
      setIsLoading(false);
    };
    loadInitial();
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    await fetchGreetings(nextPage, true);
    setPage(nextPage);
    setIsLoadingMore(false);
  };

  // Empty state
  if (!isLoading && greetings.length === 0) {
    return (
      <section id="greetings-gallery" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-4">
              Greetings Created So Far
            </h2>
            <p className="text-muted-foreground text-lg">
              A glimpse of wishes shared by the RCE community
            </p>
          </div>

          <div className="glass-card p-12 text-center max-w-md mx-auto">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-gold-light animate-pulse" />
            <h3 className="text-xl font-display font-bold text-foreground mb-3">
              Be the first to create a New Year greeting from RCE 🎉
            </h3>
            <p className="text-muted-foreground mb-6">
              Start the celebration and inspire others!
            </p>
            <Button
              onClick={onGenerateGreeting}
              className="bg-gradient-to-r from-primary to-gold-light text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Your Greeting
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="greetings-gallery" className="py-20 px-4 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-light/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-gold-light" />
            <span className="text-sm text-primary font-medium">Community Celebrations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-4">
            Greetings Created So Far
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A glimpse of wishes shared by the RCE community
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {greetings.map((greeting, index) => (
                <div
                  key={greeting.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <GalleryCard greeting={greeting} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary px-8 py-3"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Greetings'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default GreetingsGallery;
