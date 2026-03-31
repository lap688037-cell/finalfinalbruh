import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, Clock, CheckCircle2, ExternalLink } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '2'
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || 'Server returned an invalid response');
      }

      if (response.ok) {
        setStep(2);
      } else {
        setError(result.error || 'Booking failed');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Booking failed', error);
    } finally {
      setLoading(false);
    }
  };

  const generateGoogleCalendarUrl = () => {
    const { name, date, time, guests } = formData;
    const startDateTime = `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00Z`;
    // End time 1 hour later
    const endHour = (parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0');
    const endDateTime = `${date.replace(/-/g, '')}T${endHour}${time.split(':')[1]}00Z`;
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Verdant Brew Reservation - ${name}`,
      details: `Table for ${guests} guests at Verdant Brew Cafe.`,
      location: '123 Botanical Avenue, Green District, Nature City',
      dates: `${startDateTime}/${endDateTime}`
    });
    
    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-deep-green/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-cream rounded-[40px] shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-deep-green/5 flex items-center justify-center text-deep-green hover:bg-deep-green/10 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-10">
              {step === 1 ? (
                <>
                  <h2 className="text-3xl font-bold text-deep-green mb-2">Book a Table</h2>
                  <p className="text-deep-green/60 mb-8">Join us for a calming coffee experience.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-deep-green/40 uppercase tracking-widest ml-1">Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-white border border-sage/20 rounded-2xl px-4 py-3 focus:outline-none focus:border-sage transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-deep-green/40 uppercase tracking-widest ml-1">Email</label>
                        <input 
                          required
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-white border border-sage/20 rounded-2xl px-4 py-3 focus:outline-none focus:border-sage transition-colors"
                          placeholder="Email address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-deep-green/40 uppercase tracking-widest ml-1">Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" size={18} />
                          <input 
                            required
                            type="date" 
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full bg-white border border-sage/20 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-sage transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-deep-green/40 uppercase tracking-widest ml-1">Time</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" size={18} />
                          <input 
                            required
                            type="time" 
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                            className="w-full bg-white border border-sage/20 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-sage transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-deep-green/40 uppercase tracking-widest ml-1">Guests</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" size={18} />
                        <select 
                          value={formData.guests}
                          onChange={(e) => setFormData({...formData, guests: e.target.value})}
                          className="w-full bg-white border border-sage/20 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-sage transition-colors appearance-none"
                        >
                          {[1,2,3,4,5,6,7,8].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button 
                      disabled={loading}
                      type="submit"
                      className="w-full py-4 bg-deep-green text-cream rounded-2xl font-bold text-lg hover:bg-deep-green/90 transition-all shadow-xl shadow-deep-green/20 disabled:opacity-50 mt-4"
                    >
                      {loading ? 'Processing...' : 'Confirm Reservation'}
                    </button>
                    {error && (
                      <p className="text-rose-500 text-sm font-bold text-center mt-2">{error}</p>
                    )}
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-deep-green mb-2">Reservation Confirmed!</h2>
                  <p className="text-deep-green/60 mb-8">We've saved your table and sent a confirmation email to {formData.email}. See you soon at Verdant Brew.</p>
                  
                  <div className="space-y-3">
                    <a 
                      href={generateGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-sage text-white rounded-2xl font-bold hover:bg-sage/90 transition-all shadow-lg"
                    >
                      <ExternalLink size={18} />
                      Add to Google Calendar
                    </a>
                    <button 
                      onClick={onClose}
                      className="w-full py-4 bg-deep-green/5 text-deep-green rounded-2xl font-bold hover:bg-deep-green/10 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
