const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create public/images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// List of required images with their dimensions and text
const images = [
  { name: 'hero-bg.jpg', width: 1920, height: 1080, text: 'Hero Background' },
  { name: 'rings-category.jpg', width: 800, height: 600, text: 'Rings' },
  { name: 'necklaces-category.jpg', width: 800, height: 600, text: 'Necklaces' },
  { name: 'earrings-category.jpg', width: 800, height: 600, text: 'Earrings' },
  { name: 'bracelets-category.jpg', width: 800, height: 600, text: 'Bracelets' },
  { name: 'diamond-ring.jpg', width: 600, height: 800, text: 'Diamond Ring' },
  { name: 'gold-necklace.jpg', width: 600, height: 800, text: 'Gold Necklace' },
  { name: 'pearl-earrings.jpg', width: 600, height: 800, text: 'Pearl Earrings' },
  { name: 'special-offer.jpg', width: 1200, height: 628, text: 'Special Offer' }
];

// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Generate each image
images.forEach(({ name, width, height, text }) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, getRandomColor());
  gradient.addColorStop(1, getRandomColor());
  
  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calculate font size based on canvas size
  const fontSize = Math.min(width, height) * 0.1;
  ctx.font = `bold ${fontSize}px Arial`;
  
  // Add text shadow for better visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Draw text in the center
  ctx.fillText(text, width / 2, height / 2);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
  fs.writeFileSync(path.join(imagesDir, name), buffer);
  
  console.log(`Created ${name} (${width}x${height})`);
});

console.log('\nAll images have been generated in the public/images directory.');
