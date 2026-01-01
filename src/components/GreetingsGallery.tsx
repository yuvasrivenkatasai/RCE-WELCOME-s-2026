import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, Loader2, Eye, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import GreetingCardDisplay, { GreetingDisplayData } from './GreetingCardDisplay';

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

const ITEMS_PER_PAGE = 9;

const GalleryCard = ({ 
  greeting, 
  onView 
}: { 
  greeting: GreetingRecord;
  onView: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const greetingData: GreetingDisplayData = {
    name: greeting.name,
    branch: greeting.branch,
    year: greeting.year,
    greetingTitle: greeting.greeting_title,
    greetingBody: greeting.greeting_body,
    motivationalQuote: greeting.motivational_quote,
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

      {/* Scaled Card Container */}
      <div 
        className="transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary/20 origin-top"
        style={{ 
          transform: 'scale(0.55)',
          transformOrigin: 'top center',
          marginBottom: '-45%',
        }}
      >
        <GreetingCardDisplay 
          ref={cardRef}
          greeting={greetingData}
        />
      </div>

      {/* Hover Overlay with Buttons */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-2xl" style={{ marginBottom: '-45%' }}>
        <div className="flex gap-3">
          <Button
            onClick={onView}
            variant="outline"
            className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gradient-to-r from-primary to-gold-light text-primary-foreground shadow-lg"
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
    </div>
  );
};

const GreetingsGallery = ({ onGenerateGreeting }: GreetingsGalleryProps) => {
  const [greetings, setGreetings] = useState<GreetingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedGreeting, setSelectedGreeting] = useState<GreetingRecord | null>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const [isModalDownloading, setIsModalDownloading] = useState(false);

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

  const handleModalDownload = async () => {
    if (!modalCardRef.current || isModalDownloading || !selectedGreeting) return;

    setIsModalDownloading(true);
    try {
      const canvas = await html2canvas(modalCardRef.current, {
        backgroundColor: '#0a0a1a',
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `RCEE_Greeting_2026_${selectedGreeting.name.replace(/\s+/g, '_')}.png`;
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
      setIsModalDownloading(false);
    }
  };

  // Empty state
  if (!isLoading && greetings.length === 0) {
    return (
      <section id="greetings-gallery" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-4">
              Greeting Gallery
            </h2>
            <p className="text-muted-foreground text-lg">
              Every greeting created so far — a growing memory wall of RCE.
            </p>
          </div>

          <div className="glass-card p-12 text-center max-w-md mx-auto">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-gold-light animate-pulse" />
            <h3 className="text-xl font-display font-bold text-foreground mb-3">
              No greetings yet — be the first to create one 🎉
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
    <>
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
              Greeting Gallery
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every greeting created so far — a growing memory wall of RCE.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {greetings.map((greeting, index) => (
                  <div
                    key={greeting.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <GalleryCard 
                      greeting={greeting} 
                      onView={() => setSelectedGreeting(greeting)}
                    />
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

      {/* Full-size Modal */}
      {selectedGreeting && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-auto"
          onClick={() => setSelectedGreeting(null)}
        >
          <div 
            className="relative max-w-3xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedGreeting(null)}
              className="absolute -top-2 -right-2 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Full-size Card */}
            <GreetingCardDisplay
              ref={modalCardRef}
              greeting={{
                name: selectedGreeting.name,
                branch: selectedGreeting.branch,
                year: selectedGreeting.year,
                greetingTitle: selectedGreeting.greeting_title,
                greetingBody: selectedGreeting.greeting_body,
                motivationalQuote: selectedGreeting.motivational_quote,
              }}
            />

            {/* Download Button */}
            <div className="text-center mt-6">
              <Button
                onClick={handleModalDownload}
                disabled={isModalDownloading}
                className="bg-gradient-to-r from-primary to-gold-light text-primary-foreground shadow-lg hover:shadow-xl"
              >
                {isModalDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Full Size
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GreetingsGallery;
