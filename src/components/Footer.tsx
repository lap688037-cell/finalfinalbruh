import { Instagram, Coffee } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-cream border-t border-sage/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-deep-green text-cream rounded-2xl flex items-center justify-center">
              <Coffee size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-deep-green leading-none">Chook Cafe</h3>
              <p className="text-xs font-medium text-sage uppercase tracking-widest mt-1">Al Hadiqa St, Muscat</p>
            </div>
          </div>

          <nav className="flex gap-8 text-sm font-semibold text-deep-green/60">
            <a href="#" className="hover:text-sage transition-colors">Home</a>
            <a href="#menu" className="hover:text-sage transition-colors">Menu</a>
            <a href="#about" className="hover:text-sage transition-colors">About</a>
            <a href="#contact" className="hover:text-sage transition-colors">Contact</a>
          </nav>

          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/chook_cafe/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Chook Cafe on Instagram"
              className="w-10 h-10 rounded-full bg-white border border-sage/10 flex items-center justify-center text-deep-green hover:bg-sage hover:text-white transition-all shadow-sm"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-sage/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-deep-green/40 uppercase tracking-widest">
          <p>© 2026 Chook Cafe, Muscat. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-sage transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sage transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
