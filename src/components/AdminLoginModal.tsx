import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onSuccess();
      onClose();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-deep-green/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-cream rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
          >
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-deep-green text-cream rounded-2xl flex items-center justify-center shadow-lg shadow-deep-green/20">
                  <ShieldCheck size={28} />
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-deep-green hover:bg-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-deep-green mb-2">Admin Access</h2>
                <p className="text-deep-green/60">Please enter your credentials to access the dashboard.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-deep-green/40 uppercase tracking-[0.2em] ml-1">
                    Security Key
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-deep-green/30">
                      <Lock size={18} />
                    </div>
                    <input 
                      autoFocus
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-6 py-4 bg-white border-2 rounded-2xl outline-none transition-all font-mono tracking-widest ${
                        error ? 'border-rose-500/50 bg-rose-50' : 'border-transparent focus:border-sage/30'
                      }`}
                    />
                  </div>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-rose-500 text-xs font-bold mt-2 ml-1"
                    >
                      <AlertCircle size={14} />
                      Access Denied. Please try again.
                    </motion.div>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-deep-green text-cream rounded-2xl font-bold text-lg hover:bg-deep-green/90 transition-all shadow-xl shadow-deep-green/20"
                >
                  Unlock Dashboard
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
