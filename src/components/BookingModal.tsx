import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, Clock, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState('');

  // Date limits — today to 3 months ahead
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Opening hours: 8am–9pm
  const minTime = '08:00';
  const maxTime = '21:00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guests: Number(formData.guests)
        })
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateGoogleCalendarUrl = () => {
    const { name, date, time, guests } = formData;
    const startDateTime = `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00Z`;
    const endHour = (parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0');
    const endDateTime = `${date.replace(/-/g, '')}T${endHour}${time.split(':')[1]}00Z`;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Verdant Brew Reservation — ${name}`,
      details: `Table for ${guests} guests at Verdant Brew Cafe.`,
      location: '123 Botanical Avenue, Green District, Nature City',
      dates: `${startDateTime}/${endDateTime}`
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setError('');
      setFormData({ name: '', email: '', date: '', time: '', guests: '2' });
    }, 300);
  };

  const inputClass = "w-full bg-white border border-sage/20 rounded-2xl px-4 py-3 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/10 transition-all text-deep-green placeholder:text-deep-green/30";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-deep-green/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-cream rounded-[40px] shadow-2xl overflow-hidden"
          >
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-deep-green/5 flex items-center justify-center text-deep-green hover:bg-deep-green/10 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10">
              {step === 1 ? (
                <>
                  <h2 className="text-3xl font-bold text-deep-green mb-1">Book a Table</h2>
                  <p className="text-deep-green/50 mb-7 text-sm">Reservations available daily, 8:00 AM – 9:00 PM</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name & Email */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={inputClass}
                          placeholder="Jane Smith"
                          maxLength={60}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest ml-1">Email</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={inputClass}
                          placeholder="jane@email.com"
                        />
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest ml-1">Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sage pointer-events-none" size={16} />
                          <input
                            required
                            type="date"
                            value={formData.date}
                            min={today}
                            max={maxDateStr}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest ml-1">Time</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-sage pointer-events-none" size={16} />
                          <input
                            required
                            type="time"
                            value={formData.time}
                            min={minTime}
                            max={maxTime}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest ml-1">Party Size</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-sage pointer-events-none" size={16} />
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className={`${inputClass} pl-10 appearance-none cursor-pointer`}
                        >
                          {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sage">▾</div>
                      </div>
                      <p className="text-[10px] text-deep-green/30 ml-1">For parties larger than 5, please call us directly.</p>
                    </div>

                    {/* Error message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-4 py-3 text-sm"
                      >
                        <AlertCircle size={16} className="shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full py-4 bg-deep-green text-cream rounded-2xl font-bold text-base hover:bg-deep-green/90 active:scale-[0.98] transition-all shadow-xl shadow-deep-green/20 disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : 'Confirm Reservation'}
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div className="w-20 h-20 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-deep-green mb-2">You're Booked!</h2>
                  <p className="text-deep-green/60 mb-2">Your table is reserved for</p>
                  <p className="text-deep-green font-bold text-lg mb-1">{formData.date} at {formData.time}</p>
                  <p className="text-deep-green/50 text-sm mb-8">{formData.guests} {Number(formData.guests) === 1 ? 'guest' : 'guests'} · {formData.name}</p>

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
                      onClick={handleClose}
                      className="w-full py-4 bg-deep-green/5 text-deep-green rounded-2xl font-bold hover:bg-deep-green/10 transition-all"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
