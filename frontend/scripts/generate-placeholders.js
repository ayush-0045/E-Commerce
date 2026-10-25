const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create public/images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// List of required images
const images = [
  'hero-bg.jpg',
  'rings-category.jpg',
  'necklaces-category.jpg',
  'earrings-category.jpg',
  'bracelets-category.jpg',
  'diamond-ring.jpg',
  'gold-necklace.jpg',
  'pearl-earrings.jpg',
  'special-offer.jpg'
];

// Generate each image
images.forEach((filename, index) => {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `hsl(${index * 40 % 360}, 70%, 80%)`);
  gradient.addColorStop(1, `hsl(${(index * 40 + 60) % 360}, 70%, 50%)`);
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  
  // Add text
  const text = filename.replace(/-/g, ' ').replace(/\.\w+$/, '');
  context.fillStyle = '#fff';
  context.font = 'bold 48px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Add text shadow
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 10;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;
  
  context.fillText(text, width / 2, height / 2);
  
  // Save as JPEG
  const out = fs.createWriteStream(path.join(imagesDir, filename));
  const stream = canvas.createJPEGStream({
    quality: 0.8,
    chromaSubsampling: false
  });
  
  stream.pipe(out);
  
  out.on('finish', () => {
    console.log(`Generated ${filename}`);
  });
});
