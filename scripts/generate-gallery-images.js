import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');
const OUTPUT_FILE = path.resolve('src/data/gallery-images.ts');
const ALLOWED_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png'];

function formatAltText(basename) {
  return basename
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

async function generateGalleryImageFile() {
  const entries = await fs.promises.readdir(PUBLIC_DIR);
  const images = entries
    .filter((entry) => ALLOWED_EXTENSIONS.includes(path.extname(entry).toLowerCase()))
    .sort()
    .map((file) => {
      const basename = path.basename(file, path.extname(file));
      const altText = formatAltText(basename);
      return `  { src: "/${file}", alt: ${JSON.stringify(altText)} }`;
    });

  const fileContent = `export type GalleryImage = {
  src: string;
  alt: string;
};

export const GALLERY_IMAGES: GalleryImage[] = [
${images.join(',\n')}
];

`;

  await fs.promises.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.promises.writeFile(OUTPUT_FILE, fileContent);
}

generateGalleryImageFile().catch((error) => {
  console.error('Failed to generate gallery images file:', error);
  process.exitCode = 1;
});
