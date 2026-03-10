import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className="py-24 px-6 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-deep-green mb-8">Visit Our Sanctuary</h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-sage shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-deep-green mb-1">Location</h4>
                  <p className="text-deep-green/60">123 Botanical Avenue, Green District<br />Nature City, NC 45678</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-sage shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-deep-green mb-1">Opening Hours</h4>
                  <p className="text-deep-green/60">Mon - Fri: 7:00 AM - 8:00 PM<br />Sat - Sun: 8:00 AM - 9:00 PM</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-sage shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-deep-green mb-1">Contact</h4>
                  <p className="text-deep-green/60">+1 (555) 123-4567<br />hello@verdantbrew.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 rounded-3xl bg-deep-green text-cream">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Mail size={20} />
                Join Our Newsletter
              </h4>
              <p className="text-cream/70 mb-6">Stay updated with our seasonal specials and events.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 focus:outline-none focus:border-sage transition-colors"
                />
                <button 
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-sage text-white rounded-full font-semibold hover:bg-sage/90 transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'Joining...' : 'Sign Up'}
                </button>
              </form>
              {status === 'success' && <p className="text-sage text-sm mt-3 font-bold">Welcome to the sanctuary!</p>}
              {status === 'error' && <p className="text-rose-400 text-sm mt-3 font-bold">Something went wrong. Try again?</p>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[500px] rounded-[40px] overflow-hidden shadow-2xl relative grayscale hover:grayscale-0 transition-all duration-700"
          >
            {/* Mock Map using an image */}
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" 
              alt="Map Location" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-sage/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-deep-green text-cream rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <MapPin size={24} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
