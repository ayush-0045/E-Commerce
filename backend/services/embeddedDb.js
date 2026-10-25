import Datastore from '@seald-io/nedb';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import 'colors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '..', 'data');

export const db = {
  users: new Datastore({ filename: path.join(dataDir, 'users.db'), autoload: true }),
  products: new Datastore({ filename: path.join(dataDir, 'products.db'), autoload: true }),
  orders: new Datastore({ filename: path.join(dataDir, 'orders.db'), autoload: true }),
};

// Initial Seed Data with Real Indian Jewelry Pricing & Specifications
export const seedInitialData = async () => {
  const productCount = await db.products.countAsync({});
  if (productCount === 0) {
    console.log('Seeding initial authentic Indian jewelry catalog into database...'.yellow);

    const initialProducts = [
      {
        name: 'Sapphire Halo Solitaire Ring',
        price: 108000,
        originalPrice: 125000,
        sku: 'GAH-RNG-001',
        weight: 4.2,
        metalType: 'Gold',
        metalPurity: '18K',
        gemstoneType: 'Sapphire',
        gemstoneWeight: 1.25,
        hallmarkCertified: true,
        certificationAgency: 'BIS Hallmark',
        category: 'Rings',
        collections: ['New Arrivals', 'Trending'],
        stock: 12,
        sold: 5,
        ratings: 4.8,
        numOfReviews: 14,
        description: 'Exquisite oval natural blue sapphire framed with brilliant round-cut diamonds, mounted on an 18K hallmarked gold band.',
        images: [
          { url: '/images/products/sapphire-halo-ring.jpg', isPrimary: true, public_id: 'prod_1' }
        ],
        availableSizes: ['10', '12', '14', '16', '18'],
        createdAt: new Date(),
      },
      {
        name: 'Platinum Diamond Solitaire Ring',
        price: 292000,
        originalPrice: 320000,
        sku: 'GAH-RNG-002',
        weight: 5.5,
        metalType: 'Platinum',
        metalPurity: '92.5',
        gemstoneType: 'Diamond',
        gemstoneWeight: 1.00,
        hallmarkCertified: true,
        certificationAgency: 'IGI Certified',
        category: 'Rings',
        collections: ['Limited Edition', 'Best Sellers'],
        stock: 8,
        sold: 9,
        ratings: 4.9,
        numOfReviews: 28,
        description: 'Rare 950 purity platinum solitaire ring carrying an eye-clean 1.00 carat diamond in an elevated prong setting.',
        images: [
          { url: '/images/products/platinum-diamond-ring.jpg', isPrimary: true, public_id: 'prod_2' }
        ],
        availableSizes: ['12', '14', '16', '18'],
        createdAt: new Date(),
      },
      {
        name: 'Royal Heritage Gold Necklace',
        price: 133000,
        originalPrice: 149000,
        sku: 'GAH-NCK-001',
        weight: 18.5,
        metalType: 'Gold',
        metalPurity: '22K',
        gemstoneType: 'None',
        hallmarkCertified: true,
        certificationAgency: 'BIS Hallmark 916',
        category: 'Necklaces',
        collections: ['New Arrivals', 'Trending'],
        stock: 6,
        sold: 14,
        ratings: 4.7,
        numOfReviews: 19,
        description: 'Authentic 22K (916) pure gold necklace crafted by master goldsmiths featuring delicate floral filigree and hand-cut detailing.',
        images: [
          { url: '/images/necklaces-category.jpg', isPrimary: true, public_id: 'prod_3' }
        ],
        createdAt: new Date(),
      },
      {
        name: 'Ruby & Rose Gold Pendant Necklace',
        price: 100000,
        originalPrice: 115000,
        sku: 'GAH-NCK-002',
        weight: 6.8,
        metalType: 'Gold',
        metalPurity: '18K',
        gemstoneType: 'Ruby',
        gemstoneWeight: 2.10,
        hallmarkCertified: true,
        certificationAgency: 'BIS Hallmark',
        category: 'Necklaces',
        collections: ['Trending'],
        stock: 10,
        sold: 7,
        ratings: 4.8,
        numOfReviews: 11,
        description: 'Vibrant natural pigeon-blood ruby cabochon pendant enclosed in warm 18K rose gold accented with pavé diamonds.',
        images: [
          { url: '/images/products/ruby-pendant-necklace.jpg', isPrimary: true, public_id: 'prod_4' }
        ],
        createdAt: new Date(),
      },
      {
        name: 'Emerald Cut Diamond Stud Earrings',
        price: 83000,
        originalPrice: 95000,
        sku: 'GAH-EAR-001',
        weight: 5.2,
        metalType: 'Gold',
        metalPurity: '18K',
        gemstoneType: 'Emerald',
        gemstoneWeight: 1.60,
        hallmarkCertified: true,
        certificationAgency: 'BIS Hallmark',
        category: 'Earrings',
        collections: ['Best Sellers'],
        stock: 15,
        sold: 22,
        ratings: 4.9,
        numOfReviews: 34,
        description: 'Pairs of emerald-cut natural green gemstones encased in solid 18K yellow gold bezels with secure screw-back clasps.',
        images: [
          { url: '/images/emerald-earrings.jpg', isPrimary: true, public_id: 'prod_5' }
        ],
        createdAt: new Date(),
      },
      {
        name: 'Diamond Tennis Bracelet',
        price: 215000,
        originalPrice: 240000,
        sku: 'GAH-BRC-001',
        weight: 12.0,
        metalType: 'Gold',
        metalPurity: '18K',
        gemstoneType: 'Diamond',
        gemstoneWeight: 2.50,
        hallmarkCertified: true,
        certificationAgency: 'SGL Certified',
        category: 'Bracelets',
        collections: ['Limited Edition'],
        stock: 5,
        sold: 3,
        ratings: 5.0,
        numOfReviews: 8,
        description: 'Endless strand of round brilliant diamonds with double safety lock clasp in lustrous 18K gold.',
        images: [
          { url: '/images/diamond-tennis-bracelet-gold.jpg', isPrimary: true, public_id: 'prod_6' }
        ],
        createdAt: new Date(),
      },
    ];

    for (const prod of initialProducts) {
      await db.products.insertAsync(prod);
    }
    console.log(`✅ Seeded ${initialProducts.length} authentic products with BIS hallmarked specs and INR pricing.`.green);
  }

  // Seed default admin and test user if none exist
  const userCount = await db.users.countAsync({});
  if (userCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@12345', salt);
    const userPasswordHash = await bcrypt.hash('User@12345', salt);

    await db.users.insertAsync({
      name: 'Store Administrator',
      email: 'admin@gahanajewelry.com',
      password: adminPasswordHash,
      role: 'admin',
      createdAt: new Date(),
    });

    await db.users.insertAsync({
      name: 'Ayush Customer',
      email: 'ayush@example.com',
      password: userPasswordHash,
      role: 'user',
      createdAt: new Date(),
    });

    console.log('✅ Seeded default accounts: admin@gahanajewelry.com / Admin@12345 and ayush@example.com / User@12345'.green);
  }
};
