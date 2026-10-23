const fs = require('fs');
const path = require('path');
const https = require('https');

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

// Function to download image
function downloadImage({ name, width, height, text }) {
  const url = `https://placehold.co/${width}x${height}/4f46e5/ffffff?text=${encodeURIComponent(text)}`;
  const filePath = path.join(imagesDir, name);
  
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${name}`);
      });
    } else {
      console.error(`Failed to download ${name}: ${response.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${name}:`, err.message);
  });
}

// Download all images
console.log('Downloading placeholder images...');
images.forEach(downloadImage);
console.log('Image download complete!');
