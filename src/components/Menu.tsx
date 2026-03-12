import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MENU_DATA = {
  Coffee: [
    { name: "Cappuccino", price: "OMR 1.500", desc: "Classic Italian espresso with velvety steamed milk foam." },
    { name: "Iced Americano", price: "OMR 1.200", desc: "Bold espresso shots over ice, smooth and refreshing." },
    { name: "Mocha", price: "OMR 1.800", desc: "Rich espresso blended with chocolate and steamed milk." },
    { name: "Omani Coffee", price: "OMR 1.000", desc: "Traditional aromatic Omani coffee with cardamom and saffron." },
    { name: "Latte", price: "OMR 1.600", desc: "Smooth espresso with creamy steamed milk." },
    { name: "Cold Brew", price: "OMR 1.800", desc: "Slow-steeped for 12 hours for a smooth, bold flavour." },
  ],
  Food: [
    { name: "Healthy Chicken Sandwich", price: "OMR 2.500", desc: "Grilled chicken with fresh greens and house sauce on toasted bread." },
    { name: "Shakshuka", price: "OMR 2.800", desc: "Rich, flavorful eggs poached in spiced tomato sauce. A crowd favourite." },
    { name: "Halloumi Croissant", price: "OMR 2.200", desc: "Flaky buttery croissant filled with grilled halloumi cheese." },
    { name: "Croissant", price: "OMR 1.500", desc: "Classic golden, flaky French croissant baked fresh daily." },
  ],
  Desserts: [
    { name: "Dates Cake", price: "OMR 1.800", desc: "Moist, rich cake made with Omani dates — a local favourite." },
    { name: "San Sebastian Cheesecake", price: "OMR 2.500", desc: "Creamy burnt Basque cheesecake with a caramelised top." },
  ],
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof MENU_DATA>("Coffee");

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-deep-green mb-4">Our Menu</h2>
          <p className="text-deep-green/60 max-w-2xl mx-auto">
            Crafted with care — from our rich espresso to our hearty bites and sweet treats.
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
