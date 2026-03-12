import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Coffee, Menu as MenuIcon, X, LayoutDashboard } from 'lucide-react';
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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
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
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-sage origin-left z-50" style={{ scaleX }} />

      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 py-4 ${
        isScrolled ? 'bg-cream/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-deep-green text-cream rounded-xl flex items-center justify-center">
              <Coffee size={20} />
            </div>
            <span className="text-xl font-bold text-deep-green tracking-tight">Chook Cafe</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-deep-green/70">
            <a href="#" className="hover:text-sage transition-colors">Home</a>
            <a href="#menu" className="hover:text-sage transition-colors">Menu</a>
            <a href="#about" className="hover:text-sage transition-colors">About</a>
            <a href="#contact" className="hover:text-sage transition-colors">Contact</a>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="px-6 py-2.5 bg-deep-green text-cream rounded-full hover:bg-deep-green/90 transition-all shadow-md shadow-deep-green/10"
            >
              Book a Table
            </button>
          </div>

          <button 
            className="md:hidden text-deep-green"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </nav>

      <motion.div 
        initial={false}
        animate={isMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        className={`fixed inset-0 z-30 bg-cream flex flex-col items-center justify-center gap-8 md:hidden pointer-events-none ${isMenuOpen ? 'pointer-events-auto' : ''}`}
      >
        <a href="#" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-deep-green">Home</a>
        <a href="#menu" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-deep-green">Menu</a>
        <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-deep-green">About</a>
        <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-deep-green">Contact</a>
        <button 
          onClick={() => {
            setIsMenuOpen(false);
            setIsBookingOpen(true);
          }}
          className="px-10 py-4 bg-deep-green text-cream rounded-full text-xl font-bold"
        >
          Book a Table
        </button>
      </motion.div>

      <button 
        onClick={() => setIsAdmin(true)}
        className="fixed bottom-8 right-8 z-30 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-deep-green/20 hover:text-deep-green/60 transition-all"
      >
        <LayoutDashboard size={20} />
      </button>

      <ThreeCanvas />

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
    </div>
  );
}
