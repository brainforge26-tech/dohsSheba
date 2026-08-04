import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── 1. CLEAR ALL DATA ───────────────────────────────────────────────────────
async function clearAll() {
  console.log('🧹 Clearing all database data...');
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.sellerProfile.deleteMany({});
  await prisma.riderProfile.deleteMany({});
  await prisma.providerProfile.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.serviceCategory.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.productCategory.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('   ✓ All data cleared.');
}

// ─── 2. USERS ─────────────────────────────────────────────────────────────────
async function seedUsers() {
  console.log('👤 Seeding users...');
  const pass = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.create({ data: { name: 'Super Admin', email: 'superadmin@dohssheba.com', password: pass, role: Role.SUPER_ADMIN, phone: '+8801700000001', emailVerified: true, isActive: true } });
  const admin      = await prisma.user.create({ data: { name: 'DOHS Admin',  email: 'admin@dohssheba.com',      password: pass, role: Role.ADMIN,       phone: '+8801700000002', emailVerified: true, isActive: true } });
  const seller     = await prisma.user.create({ data: { name: 'Green Market DOHS', email: 'seller@dohssheba.com', password: pass, role: Role.SELLER, phone: '+8801700000003', emailVerified: true, isActive: true } });
  const rider      = await prisma.user.create({ data: { name: 'Rider Akash', email: 'rider@dohssheba.com',      password: pass, role: Role.RIDER,       phone: '+8801700000004', emailVerified: true, isActive: true } });
  const customer   = await prisma.user.create({ data: { name: 'Sharmin Sultana', email: 'customer@dohssheba.com', password: pass, role: Role.CUSTOMER, phone: '+8801800000005', emailVerified: true, isActive: true } });
  const provider   = await prisma.user.create({ data: { name: 'DOHS Home Services', email: 'provider@dohssheba.com', password: pass, role: Role.PROVIDER, phone: '+8801900000006', emailVerified: true, isActive: true } });

  console.log('   ✓ 6 users created.');
  return { superAdmin, admin, seller, rider, customer, provider };
}

// ─── 3. PROFILES ─────────────────────────────────────────────────────────────
async function seedProfiles(seller: any, rider: any, provider: any) {
  await prisma.sellerProfile.create({ data: { userId: seller.id, shopName: 'Green Market DOHS', description: 'Premium Fresh Groceries & Daily Bazaar Supplies', isVerified: true, rating: 4.9 } });
  await prisma.riderProfile.create({ data: { userId: rider.id, vehicleType: 'Motorbike', vehicleNo: 'DHAKA-HA-1234', isOnline: true, isOnDuty: true, isAvailable: true, totalTrips: 0, totalEarnings: 0, rating: 5.0 } });
  await prisma.providerProfile.create({ data: { userId: provider.id, bio: 'Expert DOHS Resident Maintenance Technician', experience: 6, nid: '19922691234500', isVerified: true, rating: 4.9, totalJobs: 0 } });
  console.log('   ✓ Profiles created.');
}

// ─── 4. BRANDS ───────────────────────────────────────────────────────────────
async function seedBrands() {
  console.log('🏷️  Seeding brands...');
  const brands = [
    { name: 'Pran',        slug: 'pran',        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Pran_logo.svg/200px-Pran_logo.svg.png' },
    { name: 'Aarong Dairy',slug: 'aarong-dairy', logo: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100' },
    { name: 'ACI Foods',   slug: 'aci-foods',   logo: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=100' },
    { name: 'Fresh (BD)',  slug: 'fresh-bd',    logo: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=100' },
    { name: 'Ruchi',       slug: 'ruchi',       logo: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100' },
    { name: 'Bashundhara', slug: 'bashundhara', logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100' },
    { name: 'Olympic',     slug: 'olympic',     logo: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100' },
    { name: 'Nestle',      slug: 'nestle',      logo: 'https://images.unsplash.com/photo-1619831025282-b011fbd8c41f?w=100' },
    { name: 'Igloo',       slug: 'igloo',       logo: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=100' },
    { name: 'Square',      slug: 'square',      logo: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=100' },
  ];

  const created: any[] = [];
  for (const b of brands) {
    const brand = await prisma.brand.create({ data: b });
    created.push(brand);
  }
  console.log(`   ✓ ${created.length} brands created.`);
  return created;
}

// ─── 5. PRODUCT CATEGORIES ───────────────────────────────────────────────────
async function seedProductCategories() {
  console.log('📦 Seeding product categories...');
  const cats = [
    { name: 'Vegetables & Fruits',   slug: 'vegetables-fruits',  image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80', description: 'Fresh seasonal vegetables and fruits' },
    { name: 'Meat & Poultry',         slug: 'meat-poultry',       image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&auto=format&fit=crop&q=80', description: 'Fresh chicken, beef, and mutton' },
    { name: 'Seafood & Fish',         slug: 'seafood-fish',       image: 'https://images.unsplash.com/photo-1534942519507-769d4679447d?w=400&auto=format&fit=crop&q=80', description: 'Fresh hilsa, rui, catfish & seafood' },
    { name: 'Dairy & Eggs',           slug: 'dairy-eggs',         image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80', description: 'Milk, yogurt, butter, cheese & eggs' },
    { name: 'Rice & Grains',          slug: 'rice-grains',        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80', description: 'Basmati, Chinigura, Miniket & lentils' },
    { name: 'Oils & Spices',          slug: 'oils-spices',        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80', description: 'Mustard oil, soybean oil & mixed spices' },
    { name: 'Bakery & Snacks',        slug: 'bakery-snacks',      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80', description: 'Bread, biscuits, chips & crackers' },
    { name: 'Beverages & Juices',     slug: 'beverages-juices',   image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80', description: 'Juice, water, soft drinks & tea' },
    { name: 'Household Essentials',   slug: 'household-essentials',image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80', description: 'Cleaning, hygiene & household supplies' },
    { name: 'Health & Beauty',        slug: 'health-beauty',      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80', description: 'Skincare, haircare & personal hygiene' },
    { name: 'Mother & Baby',          slug: 'mother-baby',        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=80', description: 'Baby food, diapers & maternity products' },
    { name: 'Frozen Foods',           slug: 'frozen-foods',       image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&auto=format&fit=crop&q=80', description: 'Frozen chicken nuggets, samosas & snacks' },
  ];

  const created: any[] = [];
  for (const c of cats) {
    const cat = await prisma.productCategory.create({ data: { ...c, isActive: true } });
    created.push(cat);
  }
  console.log(`   ✓ ${created.length} product categories created.`);
  return created;
}

// ─── 6. SERVICE CATEGORIES ───────────────────────────────────────────────────
async function seedServiceCategories() {
  console.log('🔧 Seeding service categories...');
  const cats = [
    { name: 'AC Service & Repair',    slug: 'ac-service',       image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80', description: 'AC installation, repair and servicing' },
    { name: 'Electrician',            slug: 'electrician',      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&auto=format&fit=crop&q=80', description: 'Wiring, switches, fans & electrical fixes' },
    { name: 'Plumbing',               slug: 'plumber',          image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80', description: 'Pipe leaks, bathroom fittings & water tank' },
    { name: 'House Deep Cleaning',    slug: 'cleaner',          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80', description: 'Full home deep cleaning service' },
    { name: 'Pest Control',           slug: 'pest-control',     image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400&auto=format&fit=crop&q=80', description: 'Cockroach, rat & mosquito control treatment' },
    { name: 'Appliance Repair',       slug: 'appliance-repair', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&auto=format&fit=crop&q=80', description: 'Fridge, washing machine & microwave repair' },
    { name: 'Furniture & Carpenter',  slug: 'carpenter',        image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&auto=format&fit=crop&q=80', description: 'Furniture assembly, repair & custom work' },
    { name: 'House Painting',         slug: 'painting',         image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&auto=format&fit=crop&q=80', description: 'Interior & exterior painting services' },
    { name: 'CCTV & Security',        slug: 'cctv-security',    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&auto=format&fit=crop&q=80', description: 'CCTV installation, DVR & security systems' },
    { name: 'Water Heater & Gas',     slug: 'water-heater',     image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&auto=format&fit=crop&q=80', description: 'Geyser installation, gas line & burner repair' },
  ];

  for (const c of cats) {
    await prisma.serviceCategory.create({ data: { ...c, isActive: true } });
  }
  console.log(`   ✓ ${cats.length} service categories created.`);
}

// ─── 7. PRODUCTS ─────────────────────────────────────────────────────────────
async function seedProducts(seller: any, catList: any[], brandList: any[]) {
  console.log('🛒 Seeding products...');

  const cat = (slug: string) => catList.find((c) => c.slug === slug)?.id || catList[0].id;
  const brand = (name: string) => brandList.find((b) => b.name === name)?.id || null;

  const products = [
    // ── Vegetables & Fruits ──
    { name: 'Fresh Red Tomatoes', slug: 'fresh-red-tomatoes', categorySlug: 'vegetables-fruits', price: 65, discount: 0, stock: 300, unit: '1 kg', isFeatured: false, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'], description: 'Farm-fresh juicy red tomatoes, perfect for curries and salads.' },
    { name: 'Sweet Honey Mango (Himsagar)', slug: 'sweet-honey-mango-himsagar', categorySlug: 'vegetables-fruits', price: 130, discount: 19, stock: 80, unit: '1 kg', isFeatured: true, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80'], description: 'Premium Himsagar mangoes from Rajshahi — sweet, fragrant, and juicy.' },
    { name: 'Fresh Green Spinach (Palak)', slug: 'fresh-green-spinach', categorySlug: 'vegetables-fruits', price: 30, discount: 0, stock: 200, unit: '500g bunch', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80'], description: 'Crispy green spinach leaves, freshly harvested from local farms.' },
    { name: 'Local Yellow Banana Comb', slug: 'local-yellow-banana', categorySlug: 'vegetables-fruits', price: 60, discount: 0, stock: 150, unit: '1 dozen', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80'], description: 'Sweet ripe local bananas, rich in potassium and fiber.' },
    { name: 'Mixed Seasonal Vegetables Pack', slug: 'mixed-seasonal-vegetables', categorySlug: 'vegetables-fruits', price: 95, discount: 5, stock: 100, unit: '1 kg mix', isFeatured: true, isFlashSale: false, images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80'], description: 'Assorted fresh seasonal veggies — potato, brinjal, ladies finger & more.' },

    // ── Meat & Poultry ──
    { name: 'Fresh Deshi Broiler Chicken (Cleaned)', slug: 'fresh-broiler-chicken-cleaned', categorySlug: 'meat-poultry', price: 210, discount: 5, stock: 150, unit: '1 kg', isFeatured: true, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80'], description: 'Fresh DOHS bazaar broiler chicken, cleaned and cut for cooking.' },
    { name: 'Beef Bone-In Chunks (Halal)', slug: 'beef-bone-in-halal', categorySlug: 'meat-poultry', price: 780, discount: 0, stock: 60, unit: '1 kg', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80'], description: 'Premium halal certified beef bone-in chunks for rich curry and broth.' },
    { name: 'Mutton (Khashi) Boneless', slug: 'mutton-khashi-boneless', categorySlug: 'meat-poultry', price: 1100, discount: 8, stock: 40, unit: '1 kg', isFeatured: true, isFlashSale: false, images: ['https://images.unsplash.com/photo-1544025162-d76538829fd9?w=600&auto=format&fit=crop&q=80'], description: 'Tender boneless mutton from locally raised khashi goat — perfect for biryani.' },

    // ── Seafood & Fish ──
    { name: 'Fresh Hilsa Fish (Ilish)', slug: 'fresh-hilsa-fish-ilish', categorySlug: 'seafood-fish', price: 1200, discount: 0, stock: 30, unit: '1 kg', isFeatured: true, isFlashSale: false, images: ['https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=80'], description: 'Freshly caught Padma hilsa — the king of Bangladeshi fish.' },
    { name: 'Rui Fish (Medium Size)', slug: 'rui-fish-medium', categorySlug: 'seafood-fish', price: 280, discount: 10, stock: 80, unit: '1 kg', isFeatured: false, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1621631186600-a2ef4caafc6b?w=600&auto=format&fit=crop&q=80'], description: 'Fresh pond-raised rui fish — mild flavored and great for everyday cooking.' },
    { name: 'Shrimp (Chingri) Large', slug: 'shrimp-chingri-large', categorySlug: 'seafood-fish', price: 650, discount: 0, stock: 50, unit: '500g', isFeatured: true, isFlashSale: false, images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&auto=format&fit=crop&q=80'], description: 'Fresh large tiger shrimp — perfect for bhuna, malai curry & grilling.' },

    // ── Dairy & Eggs ──
    { name: 'Aarong Dairy Pasteurized Full Cream Milk', slug: 'aarong-dairy-full-cream-milk', categorySlug: 'dairy-eggs', price: 90, discount: 0, stock: 200, unit: '1 liter', isFeatured: true, isFlashSale: false, images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'], description: 'Rich, creamy pasteurized full cream milk — fresh from Aarong Dairy.' },
    { name: 'Farm Fresh Brown Eggs (12 pcs)', slug: 'farm-fresh-brown-eggs-12', categorySlug: 'dairy-eggs', price: 145, discount: 0, stock: 300, unit: '1 dozen', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80'], description: 'Nutritious brown eggs collected daily from free-range poultry farms.' },
    { name: 'Mishti Doi (Sweet Yogurt) 400g', slug: 'mishti-doi-sweet-yogurt-400g', categorySlug: 'dairy-eggs', price: 120, discount: 0, stock: 80, unit: '400g', isFeatured: false, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80'], description: 'Authentic Bangladeshi mishti doi — creamy, sweet and perfectly set.' },
    { name: 'Pure Deshi Ghee', slug: 'pure-deshi-ghee-500g', categorySlug: 'dairy-eggs', price: 420, discount: 0, stock: 60, unit: '500g', isFeatured: true, isFlashSale: false, images: ['https://images.unsplash.com/photo-1631116900855-3f3a0df15e39?w=600&auto=format&fit=crop&q=80'], description: 'Pure clarified butter ghee from deshi cow milk — rich aroma and flavor.' },

    // ── Rice & Grains ──
    { name: 'Nazirshail Premium Aromatic Rice', slug: 'nazirshail-premium-aromatic-rice', categorySlug: 'rice-grains', price: 82, discount: 5, stock: 100, unit: '1 kg (Pack)', isFeatured: false, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'], description: 'Premium Nazirshail rice — aromatic, long grain and perfect for everyday meals.' },
    { name: 'Chinigura Polao Rice (5kg Bag)', slug: 'chinigura-polao-rice-5kg', categorySlug: 'rice-grains', price: 650, discount: 8, stock: 60, unit: '5 kg bag', isFeatured: true, isFlashSale: false, images: ['https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop&q=80'], description: 'Premium small-grain Chinigura rice — the best for biryani and polao.' },
    { name: 'Masoor Dal (Red Lentil)', slug: 'masoor-dal-red-lentil-1kg', categorySlug: 'rice-grains', price: 130, discount: 0, stock: 150, unit: '1 kg', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=600&auto=format&fit=crop&q=80'], description: 'Premium quality red lentil — quick-cooking and packed with protein.' },

    // ── Oils & Spices ──
    { name: 'Pure Premium Mustard Oil (Shorisha)', slug: 'pure-premium-mustard-oil', categorySlug: 'oils-spices', price: 240, discount: 14, stock: 90, unit: '1 Liter (Glass Bottle)', isFeatured: false, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'], description: 'Cold-pressed premium mustard oil in glass bottle — traditional and pungent.' },
    { name: 'Soybean Oil (Fortune Brand)', slug: 'soybean-oil-fortune-2l', categorySlug: 'oils-spices', price: 320, discount: 0, stock: 120, unit: '2 liter bottle', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80'], description: 'Light refined soybean oil — ideal for deep frying and everyday cooking.' },
    { name: 'Mixed Spice Pack (Biriyani Masala)', slug: 'biriyani-masala-mixed-spice', categorySlug: 'oils-spices', price: 85, discount: 0, stock: 200, unit: '100g pack', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'], description: 'Fragrant blend of whole spices — the secret to perfect biryani.' },

    // ── Bakery & Snacks ──
    { name: 'Olympic Gold Sandwich Biscuit', slug: 'olympic-gold-sandwich-biscuit', categorySlug: 'bakery-snacks', price: 35, discount: 0, stock: 500, unit: 'pack 150g', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80'], description: 'Crispy, creamy-filled sandwich biscuits — favorite snack for the whole family.' },
    { name: 'Pran Chanachur (Spicy Mix)', slug: 'pran-chanachur-spicy-mix', categorySlug: 'bakery-snacks', price: 55, discount: 0, stock: 300, unit: '200g pack', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80'], description: 'Classic Pran chanachur — crunchy, spicy and a beloved BD snack.' },
    { name: 'Bread Loaf (White Sandwich Bread)', slug: 'white-sandwich-bread-loaf', categorySlug: 'bakery-snacks', price: 60, discount: 0, stock: 100, unit: 'loaf 400g', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'], description: 'Soft, fresh white sandwich bread — great for breakfast and snacks.' },

    // ── Beverages ──
    { name: 'Tetley Premium Black Tea (200g)', slug: 'tetley-premium-black-tea-200g', categorySlug: 'beverages-juices', price: 160, discount: 0, stock: 200, unit: '200g pack', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'], description: 'Premium quality Assam black tea — rich in flavor and aroma.' },
    { name: 'Pran Mango Juice Drink (1 liter)', slug: 'pran-mango-juice-1l', categorySlug: 'beverages-juices', price: 80, discount: 5, stock: 250, unit: '1 liter pack', isFeatured: false, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80'], description: 'Refreshing Pran mango juice — taste of real mango goodness.' },
    { name: 'Mineral Water 1.5L Bottle', slug: 'mineral-water-1-5l', categorySlug: 'beverages-juices', price: 30, discount: 0, stock: 400, unit: '1.5 liter', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1534951009808-766178b47a4f?w=600&auto=format&fit=crop&q=80'], description: 'Pure mineral drinking water from natural underground source.' },

    // ── Household ──
    { name: 'Dettol Antiseptic Liquid (250ml)', slug: 'dettol-antiseptic-liquid-250ml', categorySlug: 'household-essentials', price: 120, discount: 0, stock: 150, unit: '250ml bottle', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1584467735871-8e7d32a8af28?w=600&auto=format&fit=crop&q=80'], description: 'Original Dettol antiseptic liquid — protect yourself from germs and infection.' },
    { name: 'Surf Excel Detergent Powder (2kg)', slug: 'surf-excel-detergent-2kg', categorySlug: 'household-essentials', price: 280, discount: 10, stock: 100, unit: '2 kg pack', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80'], description: 'Powerful stain-fighting Surf Excel powder for brilliant white clothes.' },

    // ── Health & Beauty ──
    { name: 'Vaseline Intensive Care Body Lotion (400ml)', slug: 'vaseline-body-lotion-400ml', categorySlug: 'health-beauty', price: 320, discount: 15, stock: 80, unit: '400ml bottle', isFeatured: true, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'], description: 'Deep moisturizing Vaseline body lotion — 10x more moisturized skin.' },
    { name: 'Dove Soap Beauty Bar (3 Pack)', slug: 'dove-soap-beauty-bar-3pack', categorySlug: 'health-beauty', price: 185, discount: 0, stock: 150, unit: '3 bars', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1531804026606-7027e1d7c1e3?w=600&auto=format&fit=crop&q=80'], description: 'Gentle Dove moisturizing soap bar — 1/4 moisturizing cream for softer skin.' },

    // ── Frozen Foods ──
    { name: 'Chicken Nuggets (Frozen) 500g', slug: 'chicken-nuggets-frozen-500g', categorySlug: 'frozen-foods', price: 350, discount: 12, stock: 80, unit: '500g pack', isFeatured: false, isFlashSale: true,  images: ['https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80'], description: 'Crispy, golden chicken nuggets — kids favorite quick snack.' },
    { name: 'Vegetable Samosa (Frozen 20pcs)', slug: 'vegetable-samosa-frozen-20pcs', categorySlug: 'frozen-foods', price: 220, discount: 0, stock: 60, unit: '20 pieces', isFeatured: false, isFlashSale: false, images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80'], description: 'Ready-to-fry crispy vegetable samosas — perfect party snack.' },
  ];

  let count = 0;
  for (const p of products) {
    const categoryId = catList.find((c) => c.slug === p.categorySlug)?.id || catList[0].id;
    await prisma.product.create({
      data: {
        sellerId:    seller.id,
        categoryId,
        name:        p.name,
        slug:        p.slug,
        description: p.description,
        price:       p.price,
        discount:    p.discount,
        images:      p.images,
        stock:       p.stock,
        unit:        p.unit,
        isActive:    true,
        isFeatured:  p.isFeatured,
        isFlashSale: p.isFlashSale,
        rating:      Number((4.3 + Math.random() * 0.7).toFixed(1)),
        totalReviews: Math.floor(Math.random() * 50) + 5,
      },
    });
    count++;
  }
  console.log(`   ✓ ${count} products created.`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Starting Full Comprehensive Seed...');
  console.log('='.repeat(55));

  await clearAll();
  const users = await seedUsers();
  await seedProfiles(users.seller, users.rider, users.provider);
  const brands = await seedBrands();
  const productCats = await seedProductCategories();
  await seedServiceCategories();
  await seedProducts(users.seller, productCats, brands);

  console.log('='.repeat(55));
  console.log('✅ Seed completed!');
  console.log(`   Users: 6 | Brands: ${brands.length} | Product Categories: ${productCats.length}`);
  console.log(`   Service Categories: 10 | Products: 32`);
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
