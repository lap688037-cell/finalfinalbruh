import { motion } from 'motion/react';
import { Coffee, ArrowRight } from 'lucide-react';

export default function Hero({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 text-sage font-medium text-sm mb-6">
            <Coffee size={16} />
            <span>Muscat's Favourite Coffee Stop</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-deep-green leading-tight mb-6">
            Fresh Coffee.<br />
            <span className="text-sage">Calm Moments.</span>
          </h1>
          <p className="text-base md:text-xl text-deep-green/70 mb-10 max-w-lg mx-auto lg:mx-0">
            Tucked away on Al Hadiqa Street in Muscat, Chook Cafe is your go-to spot for rich espresso, 
            hearty bites, and a relaxed atmosphere you'll want to come back to.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button 
              onClick={onBookClick}
              className="px-7 py-4 bg-deep-green text-cream rounded-full font-semibold hover:bg-deep-green/90 transition-all flex items-center gap-2 group shadow-lg shadow-deep-green/20"
            >
              Book a Table
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="#about"
              className="px-7 py-4 border-2 border-deep-green text-deep-green rounded-full font-semibold hover:bg-deep-green hover:text-cream transition-all text-center"
            >
              Our Story
            </a>
          </div>
        </motion.div>
        
        <div className="relative h-[500px] lg:h-[700px] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-96 h-96 bg-sage/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
