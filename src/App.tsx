import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Coffee, LayoutDashboard, X } from 'lucide-react';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Featured from './components/Featured';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ThreeCanvas from './components/ThreeCanvas';
import BookingModal from './components/BookingModal';
import AdminView from './components/AdminView';
import AdminLoginModal from './components/AdminLoginModal';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminClick = () => {
    setIsAdminLoginOpen(true);
  };

  if (isAdmin) {
    return (
      <>
        <button 
          onClick={() => setIsAdmin(false)}
          className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-deep-green text-cream rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <X size={18} />
          Exit Admin
        </button>
        <AdminView />
      </>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-sage origin-left z-50" style={{ scaleX }} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 py-4 ${
        isScrolled ? 'bg-cream/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-deep-green text-cream rounded-xl flex items-center justify-center">
              <Coffee size={20} />
            </div>
            <span className="text-xl font-bold text-deep-green tracking-tight">Verdant Brew</span>
          </div>
        </div>
      </nav>

      {/* Admin Toggle (Hidden in plain sight) */}
      <button 
        onClick={handleAdminClick}
        className="fixed bottom-8 right-8 z-30 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-deep-green/20 hover:text-deep-green/60 transition-all"
      >
        <LayoutDashboard size={20} />
      </button>

      {/* 3D Background */}
      <ThreeCanvas />

      {/* Content */}
      <main>
        <Hero onBookClick={() => setIsBookingOpen(true)} />
        <div id="about"><About /></div>
        <div id="menu"><Menu /></div>
        <Featured />
        <Gallery />
        <div id="contact"><Contact /></div>
      </main>

      <Footer />

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />

      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdmin(true)}
      />
    </div>
  );
}
