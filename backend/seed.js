const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

dotenv.config();

const users = [
  {
    name: 'Bloom Admin',
    email: 'admin@blushandbloom.com',
    password: 'adminpassword123',
    phone: '9876543210',
    dateOfBirth: new Date('1990-05-12'),
    gender: 'Female',
    role: 'admin',
    addresses: [
      {
        fullName: 'Bloom HQ',
        phone: '9876543210',
        line1: '12 Fashion Boulevard',
        line2: 'Sector 5',
        landmark: 'Near Design Square',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        type: 'Work',
        isDefault: true
      }
    ]
  },
  {
    name: 'Sathwika D',
    email: 'sathwika@example.com',
    password: 'userpassword123',
    phone: '9999988888',
    dateOfBirth: new Date('2000-06-15'),
    gender: 'Female',
    role: 'user',
    addresses: [
      {
        fullName: 'Sathwika D',
        phone: '9999988888',
        line1: '404 Rose Villa',
        line2: 'Marathahalli',
        landmark: 'Behind Shell Bunk',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560037',
        type: 'Home',
        isDefault: true
      }
    ]
  }
];

const coupons = [
  {
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    minOrder: 500,
    maxUses: 100,
    expiry: new Date('2030-12-31'),
    isActive: true
  },
  {
    code: 'BLOOM20',
    discount: 20,
    type: 'percentage',
    minOrder: 1000,
    maxUses: 50,
    expiry: new Date('2030-12-31'),
    isActive: true
  },
  {
    code: 'FESTIVE300',
    discount: 300,
    type: 'flat',
    minOrder: 1500,
    maxUses: 200,
    expiry: new Date('2030-12-31'),
    isActive: true
  }
];

const products = [
  // 1. Little Blooms (0-6)
  {
    name: 'Petal Soft Toddler Frock',
    description: 'A delicate 100% organic cotton frock featuring custom hand-embroidered rose buds, a soft inner lining, and a rear zipper for ease of wear. Perfect for your baby bloom\'s sensitive skin.',
    category: 'Dresses',
    ageGroup: 'Little Blooms',
    ageMin: 0,
    ageMax: 6,
    price: 899,
    mrp: 1299,
    images: [
      'https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
    sizes: ['6-12M', '12-18M', '2-3Y', '4-5Y'],
    stock: 25,
    fabric: '100% Organic Cotton',
    occasion: 'Casual',
    washCare: 'Gentle Machine Wash inside out, line dry',
    isFeatured: true
  },
  {
    name: 'Forest Friends Romper Set',
    description: 'An adorable pack of two organic knit cotton rompers featuring playful woodland prints, nickel-free snaps along the inseam, and stretchable envelope shoulders.',
    category: 'Rompers',
    ageGroup: 'Little Blooms',
    ageMin: 0,
    ageMax: 3,
    price: 699,
    mrp: 999,
    images: ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80',
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
    stock: 40,
    fabric: 'Knit Cotton Blend',
    occasion: 'Playwear',
    washCare: 'Machine Wash Cold, tumble dry low',
    isSale: true
  },
  {
    name: 'Tiny Dapper Linen Suit',
    description: 'An elegant linen waist-coat, white shirt, and matching shorts set for the little gentleman. Ideal for birthday parties, weddings, or family portraits.',
    category: 'Sets',
    ageGroup: 'Little Blooms',
    ageMin: 2,
    ageMax: 6,
    price: 1499,
    mrp: 1999,
    images: ['https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
    sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    stock: 15,
    fabric: 'Pure Premium Linen',
    occasion: 'Formal',
    washCare: 'Dry Clean Recommended or hand wash cold'
  },
  {
    name: 'Sunny Meadow Dungaree Set',
    description: 'Classic yellow corduroy dungarees paired with a soft floral cotton full-sleeve top. Adjustable button straps allow for room to grow.',
    category: 'Sets',
    ageGroup: 'Little Blooms',
    ageMin: 1,
    ageMax: 5,
    price: 1100,
    mrp: 1499,
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80',
    sizes: ['12-18M', '2-3Y', '3-4Y', '4-5Y'],
    stock: 20,
    fabric: 'Corduroy and Cotton',
    occasion: 'Outing',
    washCare: 'Wash with similar colors, warm iron'
  },

  // 2. Tween Style (7-12)
  {
    name: 'Daydreamer Smocked Dress',
    description: 'A charming empire-line cotton dress with an intricately smocked bodice, flutter sleeves, and a tiered A-line skirt in a vibrant meadow pattern.',
    category: 'Dresses',
    ageGroup: 'Tween Style',
    ageMin: 7,
    ageMax: 12,
    price: 1299,
    mrp: 1799,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    sizes: ['7-8Y', '9-10Y', '11-12Y'],
    stock: 18,
    fabric: '100% Breathable Cotton',
    occasion: 'Festive',
    washCare: 'Hand wash separately, dry in shade',
    isFeatured: true
  },
  {
    name: 'Bold Stripes Athleisure Hoodie',
    description: 'Mid-weight French terry pullover with contrast-colored stripes across the front, matching ribbed hem/cuffs, and a double-lined cozy hood.',
    category: 'Outerwear',
    ageGroup: 'Tween Style',
    ageMin: 7,
    ageMax: 12,
    price: 999,
    mrp: 1499,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    sizes: ['7-8Y', '9-10Y', '11-12Y'],
    stock: 30,
    fabric: '80% Cotton, 20% Polyester French Terry',
    occasion: 'Sporty',
    washCare: 'Machine Wash Warm, iron on reverse'
  },
  {
    name: 'Chambray Classic Utility Shirt',
    description: 'A versatile washed chambray button-down featuring dual chest pockets, contrast marble buttons, and rolled-up tabs for sleeves.',
    category: 'Shirts',
    ageGroup: 'Tween Style',
    ageMin: 7,
    ageMax: 12,
    price: 799,
    mrp: 1199,
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80',
    sizes: ['7-8Y', '9-10Y', '11-12Y'],
    stock: 22,
    fabric: 'Lightweight Denim Chambray',
    occasion: 'Casual',
    washCare: 'Cold water wash, tumble dry low'
  },
  {
    name: 'Weekend Wanderer Cargo Joggers',
    description: 'Comfy cotton jogger pants with elasticated waistband, drawstring adjusters, dual snap-button side cargo pockets, and tapered cuffs.',
    category: 'Bottoms',
    ageGroup: 'Tween Style',
    ageMin: 8,
    ageMax: 12,
    price: 899,
    mrp: 1299,
    images: ['https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=600&q=80',
    sizes: ['8Y', '10Y', '12Y'],
    stock: 16,
    fabric: 'Cotton Twill Blend',
    occasion: 'Casual',
    washCare: 'Gentle cycle wash, warm iron'
  },

  // 3. Teen Edit (13-17)
  {
    name: 'Urban Edge Denim Trucker Jacket',
    description: 'Distressed classic fit light-wash denim jacket with custom metal shank buttons, dual slant pockets, and adjustable waist tabs. A street-smart staple.',
    category: 'Outerwear',
    ageGroup: 'Teen Edit',
    ageMin: 13,
    ageMax: 17,
    price: 1799,
    mrp: 2499,
    images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L'],
    stock: 12,
    fabric: 'Heavyweight Cotton Denim',
    occasion: 'Streetwear',
    washCare: 'Wash cold inside out, color may bleed slightly',
    isFeatured: true
  },
  {
    name: 'Neon Rebel Graphic Tee',
    description: 'Heavyweight organic cotton jersey knit tee in an oversized retro drop-shoulder fit, with a high-density puff print graphic detail on the front.',
    category: 'Tops',
    ageGroup: 'Teen Edit',
    ageMin: 13,
    ageMax: 17,
    price: 699,
    mrp: 999,
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 35,
    fabric: '100% Super-combed Cotton',
    occasion: 'Casual',
    washCare: 'Iron inside out, do not bleach',
    isSale: true
  },
  {
    name: 'Midnight Floral Skater Skirt',
    description: 'High-waisted skater skirt with a flat front panel and elastic back waistband. Designed with an ultra-feminine ditsy floral print and a soft inner slip.',
    category: 'Bottoms',
    ageGroup: 'Teen Edit',
    ageMin: 13,
    ageMax: 17,
    price: 849,
    mrp: 1199,
    images: ['https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=600&q=80',
    sizes: ['XS', 'S', 'M'],
    stock: 20,
    fabric: 'Viscose Rayon Crepe',
    occasion: 'Partywear',
    washCare: 'Hand wash with mild detergent, line dry'
  },
  {
    name: 'Cyberpunk Varsity Jacket',
    description: 'Faux-leather sleeves paired with a wool-blend body, featuring high-quality contrast rib-knit collar and cuffs, and secure metal press buttons.',
    category: 'Outerwear',
    ageGroup: 'Teen Edit',
    ageMin: 14,
    ageMax: 17,
    price: 2499,
    mrp: 3499,
    images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L'],
    stock: 8,
    fabric: 'Wool Blend and Faux Leather',
    occasion: 'Winterwear',
    washCare: 'Dry clean only'
  },

  // 4. Young Women (18-25)
  {
    name: 'Boho Sunset Maxi Dress',
    description: 'Flowy georgette tiered maxi dress featuring a deep V-neckline, self-tie lace shoulder straps, and a gorgeous warm floral gradient pattern.',
    category: 'Dresses',
    ageGroup: 'Young Women',
    ageMin: 18,
    ageMax: 25,
    price: 1999,
    mrp: 2999,
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 14,
    fabric: 'Premium Poly-Georgette with Liners',
    occasion: 'Brunch',
    washCare: 'Machine wash delicate, hang dry',
    isFeatured: true
  },
  {
    name: 'Washed Lilac Corset Top',
    description: 'Chic corset-inspired bustier top with flexible structural boning, sweetheart neck, and a breathable smocked back panel with a metallic zip.',
    category: 'Tops',
    ageGroup: 'Young Women',
    ageMin: 18,
    ageMax: 25,
    price: 1199,
    mrp: 1799,
    images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 22,
    fabric: 'Cotton Sateen Stretch',
    occasion: 'Night Out',
    washCare: 'Hand wash cold, dry flat',
    isSale: true
  },
  {
    name: 'Ripped High-Waist Boyfriend Jeans',
    description: 'Authentic rigid cotton denim in a classic boyfriend slouchy silhouette, featuring heavily distressed knees and fraying hems for a lived-in feel.',
    category: 'Bottoms',
    ageGroup: 'Young Women',
    ageMin: 18,
    ageMax: 25,
    price: 1699,
    mrp: 2399,
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    sizes: ['26', '28', '30', '32'],
    stock: 18,
    fabric: '100% Rigid Denim Cotton',
    occasion: 'Streetwear',
    washCare: 'Machine wash inside out with cold water'
  },
  {
    name: 'Pastel Knit Cardigan Wrap',
    description: 'Loose-knit open cardigan in a dreamy candy pastel stripe pattern, with dropped armholes, ribbed edges, and cozy wrap-around styling.',
    category: 'Outerwear',
    ageGroup: 'Young Women',
    ageMin: 18,
    ageMax: 25,
    price: 1499,
    mrp: 2199,
    images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L'],
    stock: 10,
    fabric: 'Soft Acrylic Knit yarn',
    occasion: 'Winterwear',
    washCare: 'Hand wash cold, reshape and dry flat'
  },

  // 5. Modern Women (26-35)
  {
    name: 'Luxe Crimson Wrap Dress',
    description: 'An iconic wrap dress in luxurious crepe fabric, featuring long cuffs, an adjustable side-tie sash, and a fluid silhouette. A day-to-night workwear miracle.',
    category: 'Dresses',
    ageGroup: 'Modern Women',
    ageMin: 26,
    ageMax: 35,
    price: 2499,
    mrp: 3499,
    images: ['https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    fabric: 'Heavy Crepe Satin',
    occasion: 'Office/Formal',
    washCare: 'Gentle dry clean recommended',
    isFeatured: true
  },
  {
    name: 'Ivory Soft Pleated Blouse',
    description: 'Refined ivory shirt with soft vertical micro-pleats on the front bib, classic stand collar, concealed button placket, and single-button cuffs.',
    category: 'Tops',
    ageGroup: 'Modern Women',
    ageMin: 26,
    ageMax: 35,
    price: 1399,
    mrp: 1999,
    images: ['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25,
    fabric: 'Polyester Chiffon',
    occasion: 'Workwear',
    washCare: 'Cold water wash in mesh bag, iron low'
  },
  {
    name: 'Empowerment Power Blazer',
    description: 'Double-breasted tailored blazer in deep emerald with dark horn buttons, peak lapels, side flap pockets, and fully structured shoulder pads.',
    category: 'Outerwear',
    ageGroup: 'Modern Women',
    ageMin: 26,
    ageMax: 35,
    price: 2899,
    mrp: 3999,
    images: ['https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 12,
    fabric: 'Premium Polyester Viscose Suiting',
    occasion: 'Business Formal',
    washCare: 'Professional Dry Clean only'
  },
  {
    name: 'Classic Navy Tapered Trousers',
    description: 'High-waisted trousers with an elegant front pleat, hook-and-bar closure, side slip pockets, and a clean ankle-skimming tapered fit.',
    category: 'Bottoms',
    ageGroup: 'Modern Women',
    ageMin: 26,
    ageMax: 35,
    price: 1599,
    mrp: 2199,
    images: ['https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
    sizes: ['28', '30', '32', '34'],
    stock: 20,
    fabric: 'Stretch Twill Crepe',
    occasion: 'Office/Formal',
    washCare: 'Machine wash cold with like colors'
  },

  // 6. Elegant Women (36-50)
  {
    name: 'Royal Silk Midi Dress',
    description: 'A masterpiece midi-length dress crafted from natural mulberry silk in a rich emerald green. Exquisite side drapery and a mock neck define this look.',
    category: 'Dresses',
    ageGroup: 'Elegant Women',
    ageMin: 36,
    ageMax: 50,
    price: 3499,
    mrp: 4999,
    images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL', '2XL'],
    stock: 8,
    fabric: '100% Mulberry Silk',
    occasion: 'Evening Wear',
    washCare: 'Dry clean only, do not steam directly',
    isFeatured: true
  },
  {
    name: 'Classic Sand Trench Coat',
    description: 'Double-breasted iconic utility coat featuring button storm flaps, adjustable wrist straps, tortoiseshell details, and a detachable buckle belt.',
    category: 'Outerwear',
    ageGroup: 'Elegant Women',
    ageMin: 36,
    ageMax: 50,
    price: 3999,
    mrp: 5999,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 10,
    fabric: 'Water-resistant Cotton Gabardine',
    occasion: 'Travel/Outerwear',
    washCare: 'Professional cleaning recommended',
    isSale: true
  },
  {
    name: 'Floral Lace Embroidered Top',
    description: 'Soft knit rayon top featuring fine hand-cut lace inserts at the shoulders and yoke. Three-quarter sleeves and a relaxed fit make it easy to style.',
    category: 'Tops',
    ageGroup: 'Elegant Women',
    ageMin: 36,
    ageMax: 50,
    price: 1499,
    mrp: 2199,
    images: ['https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL', '2XL'],
    stock: 20,
    fabric: 'Rayon Knit with Nylon Lace',
    occasion: 'Semi-Formal',
    washCare: 'Dry flat, hand wash cold'
  },
  {
    name: 'Pure Indigo Palazzo Pants',
    description: 'Flowy wide-leg palazzos hand-dyed in authentic indigo vat, with side concealed pockets and a flat comfortable elasticated rear waist.',
    category: 'Bottoms',
    ageGroup: 'Elegant Women',
    ageMin: 36,
    ageMax: 50,
    price: 1299,
    mrp: 1799,
    images: ['https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL', '2XL'],
    stock: 15,
    fabric: '100% Liva Rayon',
    occasion: 'Ethic Casual',
    washCare: 'Wash separately in cold water, plant dye may run'
  },

  // 7. Timeless Grace (50+)
  {
    name: 'Organic Linen Classic Kurta',
    description: 'Comfort-fit pristine linen kurta with split neckline, elegant three-quarter sleeves, side slits, and intricate silver thread work around the neck.',
    category: 'Ethnic',
    ageGroup: 'Timeless Grace',
    ageMin: 50,
    ageMax: 100,
    price: 1899,
    mrp: 2499,
    images: ['https://images.unsplash.com/photo-1552664688-cf412ec27db2?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1552664688-cf412ec27db2?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],
    stock: 14,
    fabric: 'Pure Flax Organic Linen',
    occasion: 'Ethic/Festive',
    washCare: 'Hand wash cold, iron while damp',
    isFeatured: true
  },
  {
    name: 'Soft Pashmina Floral Shawl',
    description: 'Exquisite, light-as-air authentic Pashmina wool shawl woven by Kashmiri artisans, boasting soft floral kani motifs along the border.',
    category: 'Ethnic',
    ageGroup: 'Timeless Grace',
    ageMin: 50,
    ageMax: 100,
    price: 3499,
    mrp: 4999,
    images: ['https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=600&q=80',
    sizes: ['Free Size'],
    stock: 10,
    fabric: '100% Pashmina Wool',
    occasion: 'Festive',
    washCare: 'Strictly dry clean only'
  },
  {
    name: 'Linen Button-down Comfort Shirt',
    description: 'Relaxed fit tunic-style shirt with rounded hem, split sleeves, and custom coconut shell button detail. Incredibly soft after every wash.',
    category: 'Shirts',
    ageGroup: 'Timeless Grace',
    ageMin: 50,
    ageMax: 100,
    price: 1299,
    mrp: 1899,
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL', '2XL'],
    stock: 20,
    fabric: 'Washed Linen-Cotton Blend',
    occasion: 'Casual',
    washCare: 'Machine wash warm, iron while damp'
  },
  {
    name: 'Comfort Knit Draped Cardigan',
    description: 'An open-front cocoon style cardigan knit with fine mercerized cotton threads, creating a drape that suits every body type while keeping you warm.',
    category: 'Outerwear',
    ageGroup: 'Timeless Grace',
    ageMin: 50,
    ageMax: 100,
    price: 1699,
    mrp: 2399,
    images: ['https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL', '2XL'],
    stock: 18,
    fabric: 'Mercerized Cotton Knit',
    occasion: 'Casual/Travel',
    washCare: 'Wash cold inside out, dry flat in shade'
  },

  // 8. Editorial Favorites / Specials
  {
    name: 'Blush & Bloom Signature Midi',
    description: 'Our house-special editorial midi dress with abstract watercolor hand-painted prints. Featuring a puff shoulder, dynamic smocked waist, and side leg slit.',
    category: 'Dresses',
    ageGroup: 'Young Women',
    ageMin: 18,
    ageMax: 35,
    price: 2999,
    mrp: 3999,
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L'],
    stock: 12,
    fabric: 'Mulberry Silk Crepe',
    occasion: 'Special Occasion',
    washCare: 'Professional dry clean only',
    isFeatured: true
  },
  {
    name: 'Elysian Meadow Spring Gown',
    description: 'Fairy-tale off-the-shoulder evening gown with layered tulle, embroidered pastel vines, and a sweetheart neckline. Designed for memorable spring evenings.',
    category: 'Dresses',
    ageGroup: 'Young Women',
    ageMin: 18,
    ageMax: 30,
    price: 4999,
    mrp: 6999,
    images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'],
    hoverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 5,
    fabric: 'Nylon Tulle with Silk Liners',
    occasion: 'Gala/Party',
    washCare: 'Dry Clean Only',
    isSale: true
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing collections
    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    // Create Users (password hashing runs in pre-save hook)
    console.log('Seeding users...');
    for (const u of users) {
      await User.create(u);
    }
    console.log('Users seeded successfully!');

    // Create Coupons
    console.log('Seeding coupons...');
    await Coupon.insertMany(coupons);
    console.log('Coupons seeded successfully!');

    // Create Products (Pre-save hook computes discount/average rating)
    console.log('Seeding 30 products...');
    for (const prod of products) {
      // Add a couple of dummy reviews to featured items to make it look premium
      if (prod.isFeatured) {
        // Find user ID for seeding reviews
        const reviewer = await User.findOne({ role: 'user' });
        prod.reviews = [
          {
            user: reviewer._id,
            reviewerName: reviewer.name,
            reviewerAge: 25,
            reviewerCity: 'Bengaluru',
            rating: 5,
            comment: 'Absolutely love the fabric quality! It is extremely soft and matches the description perfectly.',
            helpful: 4,
            notHelpful: 0,
            date: new Date('2026-05-10')
          },
          {
            user: reviewer._id,
            reviewerName: 'Priya Sharma',
            reviewerAge: 28,
            reviewerCity: 'Mumbai',
            rating: 4,
            comment: 'Very premium fit and feels luxury. The sizing runs slightly large, but it looks gorgeous.',
            helpful: 2,
            notHelpful: 0,
            date: new Date('2026-06-01')
          }
        ];
      }
      
      const newProduct = new Product(prod);
      await newProduct.save();
    }
    console.log('30 products seeded successfully!');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
