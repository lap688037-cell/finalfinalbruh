import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const FEATURED_DRINKS = [
  {
    name: "Emerald Matcha Latte",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=600",
    color: "bg-emerald-50"
  },
  {
    name: "Golden Honey Latte",
    tag: "Seasonal",
    image: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=600",
    color: "bg-amber-50"
  },
  {
    name: "Midnight Cold Brew",
    tag: "Artisan",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600",
    color: "bg-stone-100"
  }
];

export default function Featured() {
  return (
    <section className="py-24 px-6 bg-deep-green text-cream overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Signature Creations</h2>
            <p className="text-cream/60 max-w-md">
              Experience our most beloved drinks, crafted with precision and passion.
            </p>
          </div>
          <button className="px-8 py-4 bg-sage text-white rounded-full font-semibold hover:bg-sage/90 transition-all">
            Explore All Drinks
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURED_DRINKS.map((drink, index) => (
            <motion.div
              key={drink.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative group cursor-pointer"
            >
              <div className={`aspect-[3/4] rounded-[40px] overflow-hidden relative ${drink.color}`}>
                <img 
                  src={drink.image} 
                  alt={drink.name}
                  className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-green/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Star size={12} fill="currentColor" />
                    {drink.tag}
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-2xl font-bold mb-2">{drink.name}</h3>
                  <div className="w-12 h-1 bg-sage rounded-full group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
