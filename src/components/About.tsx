import { motion } from 'motion/react';

export default function About() {
  return (
    <section className="py-24 px-6 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000" 
                alt="Chook Cafe Interior" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-sage rounded-3xl -z-10 hidden md:block" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-deep-green">
              Our Story: A Breath of <span className="text-sage">Fresh Air</span>
            </h2>
            <div className="space-y-6 text-lg text-deep-green/70">
              <p>
                Chook Cafe was born from a love of good coffee and warm hospitality. Nestled on Al Hadiqa Street in the heart of Muscat, we've created a space where every visit feels like a break from the everyday.
              </p>
              <p>
                From our rich, carefully brewed espresso to our Healthy Chicken Sandwich and indulgent Dates Cake, every item on our menu is made with care. We believe great food and great coffee should be accessible to everyone.
              </p>
              <p>
                Whether you're stopping by for a quick drive-through coffee or settling in for a long afternoon, Chook Cafe is your home away from home in Muscat.
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-bold text-sage mb-1">4.6★</h4>
                <p className="text-sm font-medium text-deep-green/60 uppercase tracking-wider">172 Reviews</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-sage mb-1">OMR 2–4</h4>
                <p className="text-sm font-medium text-deep-green/60 uppercase tracking-wider">Per Person</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
