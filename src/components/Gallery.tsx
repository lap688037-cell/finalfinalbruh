import { motion } from 'motion/react';

const GALLERY_IMAGES = [
  { src: "/chook-coffee.webp", alt: "Latte art at Chook Cafe" },
  { src: "/chook-burger.webp", alt: "Chook Cafe burger and fries" },
  { src: "/chook-cheesecake.webp", alt: "San Sebastian cheesecake and coffee" },
  { src: "/chook-croissant.webp", alt: "Croissant sandwich at Chook Cafe" },
  { src: "/chook-chicken.webp", alt: "Healthy chicken plate at Chook Cafe" },
  { src: "/chook-meat.webp", alt: "Meat dish at Chook Cafe" },
];

export default function Gallery() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-deep-green mb-4">Aesthetic Moments</h2>
          <p className="text-deep-green/60 max-w-2xl mx-auto">
            A glimpse into Chook Cafe. Come visit us on Al Hadiqa Street, Muscat.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img 
                src={img.src}
                alt={img.alt}
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-sage/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
