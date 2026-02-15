import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Sparkles, Music, Lock, Unlock, Camera, Phone, Video, Smile, Star, Gift, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Burmese translations - Updated with user's text
const translations = {
  hero: {
    title: 'Happy Valentine\'s Day',
    subtitle: 'မမအတွက်မောင့်ရဲ့အထူးချစ်သက်လက်ဆောင်',
    message: 'Wait နေအုံး 🤭🤭 ဒီစာတွေမဖတ်ခင် ဘေးမှာ ချောင်းဆိုးပျောက်ဆေး အရင်ယူထားလိုက်မလား မောင့်ရဲ့ပျားရည်လိုချိုမြတဲ့အချစ်တွေကြောင့် တော်ကြာလေ မောင့်မမက ချောင်းတွေဆိုးကုန်မှာဆိုးလို့ပါ🙂‍↔️',
    name: 'ပြီးတော့ တောင်းပန်ပါတယ်မမရယ် Valentine dayမှာ သူများတွေလို luxury brandတွေမဝယ်ပေးနိုင်သေးပေမဲ့ မောင်တတ်နိုင်တဲ့အချစ်တွေပါတဲ့ဒါလေးလက်ဆောင်ပေးမယ်နော်...',
    scrollHint: 'မောင့်အချစ်တွေကို တဖြည်းဖြည်းချင်းဆွဲကြည့်နော်🙂‍↔️🙂‍↔️'
  },
  ourStory: {
    title: 'အိပ်မက်လေးများ',
    subtitle: 'မောင်တို့ရဲ့ ဗီဒီယိုခေါ်ဆိုမှုလေးများ',
    moments: [
      { caption: 'ပထမဆုံးဗီဒီယိုခေါ်ဆိုမှုတွေထဲကတစ်ခု', icon: Phone },
      { caption: 'ဟာသပြောစဉ်', icon: Smile },
      { caption: 'ရယ်မောနေတဲ့အချိန်', icon: Video },
      { caption: 'ချစ်စရာအခိုက်အတန့်', icon: Heart },
      { caption: 'အတူရှိတဲ့ည', icon: Star },
      { caption: 'အထူးနေ့', icon: Gift },
      { caption: 'အမြဲချစ်တယ်', icon: Music },
      { caption: 'အတူရှိခြင်း', icon: Camera }
    ]
  },
  gallery: {
    title: 'မှတ်မိနေမယ့်ပုံလေးများ',
    subtitle: 'မောင်တို့ရဲ့ အလှဆုံးအခိုက်အတန့်များ'
  },
  letter: {
    title: 'မမအတွက် မောင့်အချစ်စာ',
    subtitle: 'သော့လေးကို နှိပ်ပြီး ဖွင့်ကြည့်ပါ 💝',
    content: `မောင့်အသက်ရေ...

လက်ဆောင်တွေများများစားစားမပေးနိုင်ပေမဲ့ မောင့်အကြင်နာတွေပါတဲ့ အကြင်နာစကားလေးတွေပါးလိုက်ပါရစေနော်။ ဘာမှမတည်မြဲတဲ့အနိစ္စတရားရှိတဲ့ ဒီကမ္ဘာမှာ မောင့်အချစ် မောင့်မေတ္တာတွေဟာ ဒီသံသရာမှာဆုံတွေ့မိတဲ့ မမပေါ် လွန်ဆန်လို့ချစ်ပေးပါ့မယ်။ ဒါဟာမောင့်လက်ဆောင်ပါ။

အမြဲတမ်းချစ်တဲ့...
မောင့်ရဲ့ နှလုံးသားလေးနဲ့ ❤️`
  },
  valentine: {
    title: 'မောင့် Valentine ဖြစ်ပေးမလား?',
    yesButton: 'လက်ခံပါတယ်ရှင် ❤️',
    noButton: 'လက်မခံနိုင်ဘူးကွာ'
  },
  celebration: {
    title: 'ဟုတ်ကဲ့! ❤️',
    message: 'မမက မောင့်ရဲ့ Valentine ပါ! ဟီး နှလုံးသားထဲကဆန္ဒတွေအတိုင်းဆက်ချစ်ကြရအောင်နော် အရမ်းချစ်တယ်! 💕'
  }
};

// All photos (8 old + 5 new)
const allPhotos = [
  { src: '/images/photo1.jpg', caption: 'ပထမဆုံးဗီဒီယိုခေါ်ဆိုမှုတွေထဲကတစ်ခု' },
  { src: '/images/photo2.jpg', caption: 'ဟာသပြောစဉ်' },
  { src: '/images/photo3.jpg', caption: 'ရယ်မောနေတဲ့အချိန်' },
  { src: '/images/photo4.jpg', caption: 'ချစ်စရာအခိုက်အတန့်' },
  { src: '/images/photo5.jpg', caption: 'အတူရှိတဲ့ည' },
  { src: '/images/photo6.jpg', caption: 'အထူးနေ့' },
  { src: '/images/photo7.jpg', caption: 'အမြဲချစ်တယ်' },
  { src: '/images/photo8.jpg', caption: 'အတူရှိခြင်း' },
  { src: '/images/new1.jpg', caption: 'အိပ်ယာထဲက ဗီဒီယိုခေါ်ဆိုမှု' },
  { src: '/images/new2.jpg', caption: 'လှပတဲ့နောက်ခံနဲ့' },
  { src: '/images/new3.jpg', caption: 'ညအိပ်ယာထဲမှာ' },
  { src: '/images/new4.jpg', caption: 'ချစ်စရာအခိုက်အတန့်တစ်ခု' },
  { src: '/images/new5.jpg', caption: 'ရယ်မောနေတဲ့အချိန်' },
];

// Floating Heart Component
const FloatingHeart = ({ delay, size, left }: { delay: number; size: number; left: number }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      left: `${left}%`,
      animation: `floatUp ${12 + Math.random() * 8}s linear infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    <Heart
      className="text-pink-500 fill-pink-600"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        opacity: 0.4 + Math.random() * 0.4,
        filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))',
      }}
    />
  </div>
);

// Sparkle Component
const Sparkle = ({ delay, size, left, top }: { delay: number; size: number; left: number; top: number }) => (
  <div
    className="absolute animate-sparkle pointer-events-none"
    style={{
      left: `${left}%`,
      top: `${top}%`,
      animationDelay: `${delay}s`,
    }}
  >
    <Sparkles
      className="text-purple-400"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))',
      }}
    />
  </div>
);

// Photo Card Component
const PhotoCard = ({ src, caption, index }: { src: string; caption: string; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 80);
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`photo-frame-glow transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
    >
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative group">
          <img
            src={src}
            alt={caption}
            className="w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-center font-medium text-sm">{caption}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memory Timeline Component
const MemoryTimeline = () => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(8).fill(false));
  const timelineRef = useRef<HTMLDivElement>(null);

  const photos = allPhotos.slice(0, 8);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          photos.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * 120);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={timelineRef} className="relative">
      {/* Timeline Line */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-pink-500 transform -translate-x-1/2 rounded-full opacity-50" />
      
      <div className="space-y-16 md:space-y-20">
        {photos.map((photo, index) => {
          const isLeft = index % 2 === 0;
          const Icon = translations.ourStory.moments[index]?.icon || Heart;
          
          return (
            <div
              key={index}
              className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 transition-all duration-700 ${
                visibleItems[index] 
                  ? 'opacity-100 translate-x-0' 
                  : `opacity-0 ${isLeft ? '-translate-x-16' : 'translate-x-16'}`
              }`}
            >
              {/* Content */}
              <div className={`flex-1 ${isLeft ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16 md:order-2'}`}>
                <div className="glass-card rounded-2xl p-5 inline-flex items-center gap-4">
                  <div className={`flex items-center gap-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-pink-200 font-medium">{photo.caption}</span>
                  </div>
                </div>
              </div>
              
              {/* Center Heart */}
              <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full items-center justify-center shadow-lg shadow-pink-500/50 z-10 animate-heartbeat">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              
              {/* Photo */}
              <div className={`flex-1 ${isLeft ? 'md:order-2 md:pl-16' : 'md:pr-16'}`}>
                <div className="photo-frame-glow max-w-sm mx-auto">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-72 md:h-80 object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Love Letter Component - Heart Lock Design
const LoveLetter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (letterRef.current) {
      observer.observe(letterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={letterRef}
      className={`flex flex-col items-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Heart Lock Button */}
      <div 
        className={`heart-lock relative cursor-pointer ${isOpen ? 'unlocked' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative w-40 h-40 md:w-48 md:h-48">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-30 blur-2xl animate-pulse" />
          
          {/* Heart button */}
          <div className="relative w-full h-full bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/50 animate-neon-pulse">
            {isOpen ? (
              <Unlock className="w-16 h-16 md:w-20 md:h-20 text-white" />
            ) : (
              <Lock className="w-16 h-16 md:w-20 md:h-20 text-white" />
            )}
          </div>
          
          {/* Floating hearts around */}
          <Heart className="absolute -top-2 -right-2 w-8 h-8 text-pink-400 fill-pink-400 animate-float" style={{ animationDelay: '0.2s' }} />
          <Heart className="absolute -bottom-2 -left-2 w-6 h-6 text-purple-400 fill-purple-400 animate-float" style={{ animationDelay: '0.5s' }} />
          <Heart className="absolute top-1/2 -right-4 w-5 h-5 text-pink-300 fill-pink-300 animate-float" style={{ animationDelay: '0.8s' }} />
        </div>
        
        {/* Instructions */}
        {!isOpen && (
          <p className="text-center text-pink-300 mt-6 animate-bounce-soft font-medium">
            {translations.letter.subtitle}
          </p>
        )}
      </div>

      {/* Love Letter Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="love-letter-modal max-w-lg max-h-[80vh] overflow-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-3">
                <Heart className="w-8 h-8 text-pink-400 fill-pink-400 animate-heartbeat" />
                <span className="text-2xl md:text-3xl gradient-text-pink font-bold">
                  {translations.letter.title}
                </span>
                <Heart className="w-8 h-8 text-pink-400 fill-pink-400 animate-heartbeat" style={{ animationDelay: '0.3s' }} />
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 px-4">
            <div className="relative">
              {/* Decorative corners */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-pink-400 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-pink-400 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-pink-400 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-pink-400 rounded-br-lg" />
              
              {/* Letter content */}
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 rounded-2xl p-6 md:p-8 border border-pink-500/30">
                <pre className="whitespace-pre-wrap font-sans text-pink-100 text-base md:text-lg leading-relaxed">
                  {translations.letter.content}
                </pre>
              </div>
            </div>
            
            {/* Footer decoration */}
            <div className="flex justify-center gap-4 mt-6">
              <Heart className="w-6 h-6 text-pink-400 fill-pink-400 animate-pulse" />
              <Sparkles className="w-6 h-6 text-purple-400 animate-sparkle" />
              <Heart className="w-6 h-6 text-pink-400 fill-pink-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Valentine Question Component
const ValentineQuestion = () => {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const moveNoButton = useCallback(() => {
    const maxX = 180;
    const maxY = 120;
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;
    setNoButtonPosition({ x: newX, y: newY });
  }, []);

  const handleYes = () => {
    setShowCelebration(true);
    toast.success('မမက မောင့်ရဲ့ Valentine ပါ! ❤️', {
      duration: 5000,
      icon: <Heart className="text-pink-500 fill-pink-500" />,
    });
  };

  return (
    <div
      ref={sectionRef}
      className={`flex flex-col items-center justify-center min-h-[50vh] transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="text-center mb-12">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse" />
          <Heart className="relative w-24 h-24 md:w-32 md:h-32 text-pink-500 fill-pink-500 animate-heartbeat" />
          <Sparkles className="absolute -top-6 -right-6 w-10 h-10 text-purple-400 animate-sparkle" />
          <Sparkles className="absolute -bottom-4 -left-6 w-8 h-8 text-pink-400 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold gradient-text-pink mb-4">
          {translations.valentine.title}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-center justify-center relative">
        <Button
          size="lg"
          className="btn-heart-glow text-white text-xl md:text-2xl px-12 md:px-16 py-8 md:py-10 rounded-full shadow-2xl"
          onClick={handleYes}
        >
          <Heart className="w-8 h-8 mr-3 fill-white animate-heartbeat" />
          {translations.valentine.yesButton}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="btn-no-escape border-2 border-purple-400 text-purple-300 hover:bg-purple-900/30 text-lg px-8 py-6 rounded-full font-medium"
          style={{
            transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
          }}
          onMouseEnter={moveNoButton}
          onClick={moveNoButton}
        >
          {translations.valentine.noButton}
        </Button>
      </div>

      {/* Celebration Dialog */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="love-letter-modal max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl md:text-4xl font-bold gradient-text-pink">
              {translations.celebration.title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl opacity-50 animate-pulse" />
              <Heart className="relative w-32 h-32 md:w-40 md:h-40 text-pink-500 fill-pink-500 animate-heartbeat mx-auto" />
              <Sparkles className="absolute -top-6 -right-6 w-12 h-12 text-yellow-400 animate-sparkle" />
              <Sparkles className="absolute -bottom-4 -left-6 w-10 h-10 text-purple-400 animate-sparkle" style={{ animationDelay: '0.5s' }} />
              <Star className="absolute top-0 -left-10 w-10 h-10 text-pink-400 animate-sparkle" style={{ animationDelay: '0.3s' }} />
            </div>
            <p className="text-xl md:text-2xl text-pink-200 font-medium leading-relaxed">
              {translations.celebration.message}
            </p>
            <div className="mt-8 flex justify-center gap-6">
              <Gift className="w-10 h-10 text-pink-400 animate-bounce-soft" />
              <Star className="w-10 h-10 text-yellow-400 animate-bounce-soft" style={{ animationDelay: '0.2s' }} />
              <Music className="w-10 h-10 text-purple-400 animate-bounce-soft" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Confetti Component
const Confetti = () => {
  const [confetti, setConfetti] = useState<Array<{ id: number; color: string; left: number; delay: number }>>([]);

  useEffect(() => {
    const colors = ['#ec4899', '#a855f7', '#f472b6', '#db2777', '#9333ea', '#fbbf24', '#f87171'];
    const newConfetti = Array.from({ length: 70 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${c.left}%`,
            backgroundColor: c.color,
            animation: `confetti-fall ${7 + Math.random() * 6}s linear infinite`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Main App Component
function App() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-romance-gradient relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Glow orbs */}
        <div className="glow-orb w-96 h-96 -top-20 -left-20" />
        <div className="glow-orb w-80 h-80 top-1/3 -right-20" />
        <div className="glow-orb w-72 h-72 bottom-20 left-1/4" />
        <div className="glow-orb w-64 h-64 top-2/3 right-1/4" />
        
        {/* Floating Hearts */}
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingHeart
            key={i}
            delay={i * 0.3}
            size={10 + Math.random() * 20}
            left={Math.random() * 100}
          />
        ))}
        
        {/* Sparkles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <Sparkle
            key={i}
            delay={i * 0.2}
            size={6 + Math.random() * 12}
            left={Math.random() * 100}
            top={Math.random() * 100}
          />
        ))}
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4 py-12">
        <div className="text-center z-10 max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="mb-8 animate-fade-in-up">
            <Sparkles className="w-10 h-10 text-pink-400 mx-auto mb-4 animate-sparkle" />
            <h1 className="text-5xl md:text-8xl font-bold gradient-text-pink mb-4">
              {translations.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-pink-300 font-medium">
              {translations.hero.subtitle}
            </p>
          </div>

          {/* Funny Message */}
          <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-pink-100 text-lg md:text-xl leading-relaxed">
              {translations.hero.message}
            </p>
          </div>

          {/* Featured Photo */}
          <div className="relative mb-8 animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-3xl opacity-40 blur-2xl animate-pulse" />
              <div className="relative glass-card rounded-3xl p-4">
                <img
                  src="/images/photo5.jpg"
                  alt="Our moment"
                  className="w-56 h-72 md:w-72 md:h-96 object-cover rounded-2xl"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-full shadow-xl">
                  <p className="text-white font-medium whitespace-nowrap">{translations.hero.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce-soft mt-12">
            <div className="flex flex-col items-center text-pink-400">
              <span className="text-lg mb-2 font-medium">{translations.hero.scrollHint}</span>
              <ArrowDown className="w-8 h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline Section */}
      <section className="py-24 px-4 md:px-8 lg:px-16 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full mb-6">
              <Video className="w-6 h-6 text-pink-400" />
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-heartbeat" />
              <Phone className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold gradient-text-pink mb-4">
              {translations.ourStory.title}
            </h2>
            <p className="text-xl text-pink-300">{translations.ourStory.subtitle}</p>
          </div>

          <MemoryTimeline />
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-24 px-4 md:px-8 lg:px-16 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Camera className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-bounce-soft" />
            <h2 className="text-4xl md:text-5xl font-bold gradient-text-purple mb-4">
              {translations.gallery.title}
            </h2>
            <p className="text-xl text-pink-300">{translations.gallery.subtitle}</p>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allPhotos.map((photo, index) => (
              <PhotoCard key={index} src={photo.src} caption={photo.caption} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Love Letter Section */}
      <section className="py-24 px-4 md:px-8 lg:px-16 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Lock className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-bounce-soft" />
            <h2 className="text-4xl md:text-5xl font-bold gradient-text-pink mb-4">
              {translations.letter.title}
            </h2>
          </div>

          <LoveLetter />
        </div>
      </section>

      {/* Valentine Question Section */}
      <section className="py-24 px-4 md:px-8 lg:px-16 relative">
        <div className="max-w-4xl mx-auto">
          <ValentineQuestion />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center relative">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-6 h-6 fill-pink-500 text-pink-500 animate-heartbeat" />
          <Heart className="w-8 h-8 fill-purple-500 text-purple-500 animate-heartbeat" style={{ animationDelay: '0.2s' }} />
          <Heart className="w-6 h-6 fill-pink-500 text-pink-500 animate-heartbeat" style={{ animationDelay: '0.4s' }} />
        </div>
        <p className="text-pink-300 font-medium text-lg">Made with love for Valentine&apos;s Day 2026</p>
        <p className="text-purple-400 text-sm mt-2">💕 မောင့်အချစ်စာ 💕</p>
      </footer>
    </div>
  );
}

export default App;
