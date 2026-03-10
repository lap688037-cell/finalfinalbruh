import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MENU_DATA = {
  Coffee: [
    { name: "Signature Sage Latte", price: "$6.50", desc: "Espresso with steamed milk and a hint of organic sage syrup." },
    { name: "Forest Cold Brew", price: "$5.75", desc: "12-hour steep with notes of pine and dark chocolate." },
    { name: "Oat Milk Flat White", price: "$5.25", desc: "Smooth espresso with creamy oat micro-foam." },
    { name: "Verdant Espresso", price: "$3.50", desc: "Our house blend with a bright, floral finish." },
  ],
  Tea: [
    { name: "Wildflower Matcha", price: "$6.25", desc: "Ceremonial grade matcha with edible flower petals." },
    { name: "Herbal Zen Blend", price: "$4.50", desc: "Chamomile, lemongrass, and fresh mint leaves." },
    { name: "Smoky Earl Grey", price: "$4.75", desc: "Traditional bergamot with a hint of lapsang souchong." },
  ],
  Pastries: [
    { name: "Pistachio Croissant", price: "$5.50", desc: "Flaky layers filled with house-made pistachio cream." },
    { name: "Lavender Scone", price: "$4.25", desc: "Buttery scone with dried lavender and lemon glaze." },
    { name: "Matcha Muffin", price: "$4.75", desc: "Soft muffin with white chocolate chunks and matcha." },
  ],
  Desserts: [
    { name: "Basque Cheesecake", price: "$8.00", desc: "Creamy, burnt-top cheesecake with berry compote." },
    { name: "Dark Chocolate Tart", price: "$7.50", desc: "70% cocoa with a sea salt and hazelnut crust." },
  ]
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof MENU_DATA>("Coffee");

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-deep-green mb-4">Artisan Menu</h2>
          <p className="text-deep-green/60 max-w-2xl mx-auto">
            Carefully crafted beverages and treats made with the finest seasonal ingredients.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {Object.keys(MENU_DATA).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as keyof typeof MENU_DATA)}
              className={`px-8 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
                activeCategory === category 
                ? "bg-deep-green text-cream shadow-lg" 
                : "bg-white text-deep-green/60 hover:bg-sage/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            {MENU_DATA[activeCategory].map((item, index) => (
              <motion.div
                key={`${activeCategory}-${item.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-sage/10 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-deep-green group-hover:text-sage transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-lg font-semibold text-sage">{item.price}</span>
                </div>
                <p className="text-deep-green/60 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
