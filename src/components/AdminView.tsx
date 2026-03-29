import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, Mail, User, Check, X } from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  created_at: string;
}

export default function AdminView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error: any) {
      console.error('Failed to fetch bookings', error);
      alert('Error loading bookings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to update status');
      }
      fetchBookings();
    } catch (error: any) {
      console.error('Failed to update status', error);
      alert('Error updating status: ' + error.message);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    try {
      const response = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to delete booking');
      }
      fetchBookings();
    } catch (error: any) {
      console.error('Failed to delete booking', error);
      alert('Error deleting booking: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold text-deep-green mb-2">Admin Dashboard</h1>
            <p className="text-deep-green/60 text-lg">Manage your cafe reservations and guest list.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-sage/10">
            <span className="text-sm font-bold text-deep-green/40 uppercase tracking-widest block">Total Bookings</span>
            <span className="text-2xl font-bold text-sage">{bookings.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={booking.id}
                className={`bg-white p-6 rounded-3xl shadow-sm border border-sage/10 flex flex-wrap items-center justify-between gap-8 hover:shadow-md transition-shadow ${booking.status === 'cancelled' ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-sage/10 text-sage rounded-2xl flex items-center justify-center shrink-0">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-deep-green">{booking.name}</h3>
                      {booking.status === 'confirmed' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full">Confirmed</span>}
                      {booking.status === 'cancelled' && <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded-full">Cancelled</span>}
                    </div>
                    <div className="flex items-center gap-2 text-deep-green/60 text-sm">
                      <Mail size={14} />
                      {booking.email}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-8">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-sage" size={20} />
                    <div>
                      <span className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest block">Date</span>
                      <span className="font-bold text-deep-green">{booking.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-sage" size={20} />
                    <div>
                      <span className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest block">Time</span>
                      <span className="font-bold text-deep-green">{booking.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="text-sage" size={20} />
                    <div>
                      <span className="text-[10px] font-bold text-deep-green/40 uppercase tracking-widest block">Guests</span>
                      <span className="font-bold text-deep-green">{booking.guests}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
                    <button 
                      onClick={() => updateStatus(booking.id, 'confirmed')}
                      className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                      title="Confirm Booking"
                    >
                      <Check size={20} />
                    </button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button 
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                      className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                      title="Cancel Booking"
                    >
                      <X size={20} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteBooking(booking.id)}
                    className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    title="Delete Permanently"
                  >
                    <X size={20} className="rotate-45" />
                  </button>
                </div>
              </motion.div>
            ))}

            {bookings.length === 0 && (
              <div className="text-center py-24 bg-white/50 rounded-[40px] border-2 border-dashed border-sage/20">
                <Calendar className="mx-auto text-sage/30 mb-4" size={48} />
                <h3 className="text-xl font-bold text-deep-green/40">No bookings yet</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
