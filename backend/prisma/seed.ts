import 'dotenv/config';
import { PrismaClient, Role, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Seeding demo data...\n');

  // ── 1. HASH PASSWORDS ───────────────────────────────────────────────────────
  const superAdminPwd = await bcrypt.hash('SuperAdmin@123', 10);
  const adminPwd = await bcrypt.hash('Admin@123', 10);
  const sellerPwd = await bcrypt.hash('Seller@123', 10);
  const custPwd = await bcrypt.hash('Customer@123', 10);
  const riderPwd = await bcrypt.hash('Rider@123', 10);

  // ── 2. USERS ─────────────────────────────────────────────────────────────────
  console.log('  → Creating users…');

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: { password: superAdminPwd, role: Role.SUPER_ADMIN },
    create: { name: 'Super Administrator', email: 'superadmin@example.com', password: superAdminPwd, role: Role.SUPER_ADMIN, emailVerified: true, isActive: true },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Platform Admin', email: 'admin@example.com', password: adminPwd, role: Role.ADMIN, emailVerified: true, isActive: true },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: { name: 'Fresh Bazaar Seller', email: 'seller@example.com', password: sellerPwd, role: Role.SELLER, emailVerified: true, isActive: true, phone: '01711-000001' },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: { name: 'Sharmin Sultana', email: 'customer@example.com', password: custPwd, role: Role.CUSTOMER, emailVerified: true, isActive: true, phone: '01811-000002' },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: { name: 'Engr. Tanvir Islam', email: 'customer2@example.com', password: custPwd, role: Role.CUSTOMER, emailVerified: true, isActive: true, phone: '01911-000003' },
  });

  const rider1 = await prisma.user.upsert({
    where: { email: 'rider@example.com' },
    update: { password: riderPwd, role: Role.RIDER },
    create: { name: 'Rider Akash (Fleet #04)', email: 'rider@example.com', password: riderPwd, role: Role.RIDER, emailVerified: true, isActive: true, phone: '01711-889900' },
  });

  const rider2 = await prisma.user.upsert({
    where: { email: 'rider2@example.com' },
    update: { password: riderPwd, role: Role.RIDER },
    create: { name: 'Rider Tanvir (Fleet #08)', email: 'rider2@example.com', password: riderPwd, role: Role.RIDER, emailVerified: true, isActive: true, phone: '01811-776655' },
  });

  console.log(`     ✓ ${superAdmin.email}, ${admin.email}, ${seller.email}, ${customer.email}, ${customer2.email}, ${rider1.email}, ${rider2.email}`);

  // ── 3. SELLER PROFILE ────────────────────────────────────────────────────────
  await prisma.sellerProfile.upsert({
    where: { userId: seller.id },
    update: {},
    create: { userId: seller.id, shopName: 'Fresh Bazaar', description: 'DOHS premium grocery seller', isVerified: true, rating: 4.8 },
  });

  // ── 3b. RIDER PROFILES ────────────────────────────────────────────────────────
  await prisma.riderProfile.upsert({
    where: { userId: rider1.id },
    update: {},
    create: {
      userId: rider1.id,
      vehicleType: 'Motorcycle',
      vehicleNo: 'DHK-MA-7744',
      isAvailable: true,
      totalTrips: 47,
      totalEarnings: 2820,
      rating: 4.9,
    },
  });

  await prisma.riderProfile.upsert({
    where: { userId: rider2.id },
    update: {},
    create: {
      userId: rider2.id,
      vehicleType: 'Bicycle',
      vehicleNo: 'BCY-DOHS-08',
      isAvailable: true,
      totalTrips: 31,
      totalEarnings: 1860,
      rating: 4.7,
    },
  });

  // ── 4. ADDRESSES ─────────────────────────────────────────────────────────────
  console.log('  → Creating addresses…');

  const addr1 = await prisma.address.create({
    data: { userId: customer.id, label: 'Home', line1: 'H-12, Road-4, Sector-7', area: 'DOHS Mirpur', city: 'Dhaka', postCode: '1216', isDefault: true },
  });

  const addr2 = await prisma.address.create({
    data: { userId: customer2.id, label: 'Home', line1: 'Q-5, Road-10, Sector-3', area: 'DOHS Dhaka', city: 'Dhaka', postCode: '1206', isDefault: true },
  });

  // ── 5. PRODUCT CATEGORIES ────────────────────────────────────────────────────
  console.log('  → Creating product categories…');

  const categories = await Promise.all([
    prisma.productCategory.upsert({ where: { slug: 'dairy' }, update: {}, create: { name: 'Dairy & Eggs', slug: 'dairy', icon: '🥛', description: 'Fresh milk, eggs, butter and dairy products' } }),
    prisma.productCategory.upsert({ where: { slug: 'fruits' }, update: {}, create: { name: 'Fresh Fruits', slug: 'fruits', icon: '🍎', description: 'Seasonal and imported fruits' } }),
    prisma.productCategory.upsert({ where: { slug: 'vegetables' }, update: {}, create: { name: 'Vegetables', slug: 'vegetables', icon: '🥦', description: 'Farm fresh vegetables' } }),
    prisma.productCategory.upsert({ where: { slug: 'rice' }, update: {}, create: { name: 'Rice & Grains', slug: 'rice', icon: '🌾', description: 'Premium quality rice, flour and grains' } }),
    prisma.productCategory.upsert({ where: { slug: 'fish' }, update: {}, create: { name: 'Fish & Seafood', slug: 'fish', icon: '🐟', description: 'Fresh water and sea fish' } }),
    prisma.productCategory.upsert({ where: { slug: 'meat' }, update: {}, create: { name: 'Poultry & Meat', slug: 'meat', icon: '🍗', description: 'Fresh chicken, beef and mutton' } }),
    prisma.productCategory.upsert({ where: { slug: 'spices' }, update: {}, create: { name: 'Spices & Oils', slug: 'spices', icon: '🧄', description: 'Cooking oil, spices and condiments' } }),
    prisma.productCategory.upsert({ where: { slug: 'snacks' }, update: {}, create: { name: 'Snacks & Beverages', slug: 'snacks', icon: '🧃', description: 'Beverages, biscuits and snacks' } }),
  ]);

  const [dairy, fruits, vegetables, rice, fish, meat, spices] = categories;

  // ── 6. PRODUCTS ──────────────────────────────────────────────────────────────
  console.log('  → Creating products…');

  const productData = [
    { sellerId: seller.id, categoryId: dairy.id, name: 'Organic Full Cream Milk (1L)', slug: 'organic-full-cream-milk-1l', description: 'Fresh organic full cream milk from certified farms. Rich in calcium and vitamins. Pasteurized and safe for all ages.', price: 120, discount: 0, stock: 45, unit: 'bottle', isFeatured: true, isActive: true, images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'] },
    { sellerId: seller.id, categoryId: fruits.id, name: 'Himsagar Mango (per kg)', slug: 'himsagar-mango-per-kg', description: 'Premium Himsagar mangoes from Rajshahi. Naturally ripened, sweet and aromatic. Perfect for eating fresh or making juice.', price: 240, discount: 10, stock: 28, unit: 'kg', isFeatured: true, isActive: true, images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'] },
    { sellerId: seller.id, categoryId: rice.id, name: 'Basmati Rice (5kg Bag)', slug: 'basmati-rice-5kg-bag', description: 'Long grain aged Basmati rice with a delightful aroma. Perfect for biryani, pilaf and everyday cooking.', price: 850, discount: 5, stock: 22, unit: 'bag', isFeatured: false, isActive: true, images: [] },
    { sellerId: seller.id, categoryId: dairy.id, name: 'Deshi Ghee (500g)', slug: 'deshi-ghee-500g', description: 'Traditional pure clarified butter made from cow milk. Rich golden color with authentic desi flavor. No additives.', price: 420, discount: 0, stock: 3, unit: 'jar', isFeatured: false, isActive: true, images: [] },
    { sellerId: seller.id, categoryId: spices.id, name: 'Cold Pressed Mustard Oil (1L)', slug: 'cold-pressed-mustard-oil-1l', description: 'Authentic cold pressed mustard oil for cooking and health. Extracted without heat, retaining all natural nutrients.', price: 180, discount: 0, stock: 5, unit: 'bottle', isFeatured: false, isActive: true, images: [] },
    { sellerId: seller.id, categoryId: meat.id, name: 'Deshi Chicken (per kg)', slug: 'deshi-chicken-per-kg', description: 'Farm fresh country chicken (deshi murgi). Free range, no hormones or antibiotics. Delivered fresh and cleaned.', price: 280, discount: 0, stock: 18, unit: 'kg', isFeatured: false, isActive: true, images: [] },
    { sellerId: seller.id, categoryId: fish.id, name: 'Fresh Hilsa Fish (per kg)', slug: 'fresh-hilsa-fish-per-kg', description: 'Fresh river Hilsa (Ilish) fish from the Padma river. Bangladesh national fish, famous for its unique taste and aroma.', price: 1200, discount: 0, stock: 9, unit: 'kg', isFeatured: true, isActive: true, images: [] },
    { sellerId: seller.id, categoryId: spices.id, name: 'Organic Turmeric Powder (100g)', slug: 'organic-turmeric-powder-100g', description: 'Pure organic turmeric powder. Rich in curcumin for health benefits. Bright yellow color for cooking.', price: 85, discount: 0, stock: 7, unit: 'pack', isFeatured: false, isActive: true, images: [] },
    { sellerId: seller.id, categoryId: dairy.id, name: 'Paneer Fresh (200g)', slug: 'paneer-fresh-200g', description: 'Soft and fresh homemade style paneer cheese. Perfect for curry dishes. Made from pure cow milk.', price: 160, discount: 0, stock: 8, unit: 'pack', isFeatured: false, isActive: true, images: [] },
    { sellerId: seller.id, categoryId: vegetables.id, name: 'Green Chili (250g)', slug: 'green-chili-250g', description: 'Fresh green chili peppers. Medium to hot spice level. Perfect for everyday Bangladeshi cooking.', price: 45, discount: 0, stock: 30, unit: 'pack', isFeatured: false, isActive: true, images: [] },
    { sellerId: seller.id, categoryId: spices.id, name: 'Soyabean Oil (2L)', slug: 'soyabean-oil-2l', description: 'Premium refined soyabean cooking oil. Light, clear and healthy. Ideal for frying, cooking and baking.', price: 320, discount: 8, stock: 0, unit: 'bottle', isFeatured: false, isActive: true, images: [] },
    { sellerId: seller.id, categoryId: dairy.id, name: 'Taaza Full Cream Milk Pouch', slug: 'taaza-full-cream-milk-pouch', description: 'Taaza brand full cream milk pouch. Fresh daily delivery. UHT processed for longer shelf life.', price: 65, discount: 0, stock: 60, unit: 'pouch', isFeatured: false, isActive: false, images: [] },
  ];

  const products: any[] = [];
  for (const data of productData) {
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (!existing) {
      const p = await prisma.product.create({ data });
      products.push(p);
    } else {
      products.push(existing);
    }
  }

  console.log(`     ✓ ${products.length} products created`);

  // ── 7. ORDERS ────────────────────────────────────────────────────────────────
  console.log('  → Orders skipped for real user placement.');

  // ── 8. REVIEWS ───────────────────────────────────────────────────────────────
  console.log('  → Creating reviews…');

  const reviewDefs = [
    { userId: customer.id, productId: products[0].id, rating: 5, comment: 'Very fresh and thick milk! Will order again. Best quality in DOHS.' },
    { userId: customer2.id, productId: products[1].id, rating: 5, comment: 'Sweetest mangoes I have had in years. Pure Rajshahi quality.' },
    { userId: customer.id, productId: products[4].id, rating: 4, comment: 'Great quality, delivered on time. Will order again.' },
    { userId: customer2.id, productId: products[3].id, rating: 5, comment: 'Authentic Deshi Ghee. Reminds me of my grandmothers cooking.' },
    { userId: customer.id, productId: products[6].id, rating: 5, comment: 'Freshest Hilsa I ever had delivered at home. Amazing quality.' },
    { userId: customer2.id, productId: products[2].id, rating: 4, comment: 'Good quality Basmati. Made perfect biryani. Will reorder.' },
  ];

  for (const rd of reviewDefs) {
    const existing = await prisma.review.findFirst({ where: { userId: rd.userId, productId: rd.productId } });
    if (!existing) {
      await prisma.review.create({ data: rd });
    }
  }

  // Update product ratings
  for (const p of products) {
    const reviews = await prisma.review.findMany({ where: { productId: p.id } });
    if (reviews.length > 0) {
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      await prisma.product.update({ where: { id: p.id }, data: { rating: avg, totalReviews: reviews.length } });
    }
  }

  console.log(`     ✓ ${reviewDefs.length} reviews created`);

  // ── 9. WALLET ────────────────────────────────────────────────────────────────
  console.log('  → Creating wallets…');

  const sellerWallet = await prisma.wallet.upsert({
    where: { userId: seller.id },
    update: {},
    create: { userId: seller.id, balance: 42500 },
  });

  await prisma.transaction.createMany({
    data: [
      { walletId: sellerWallet.id, type: 'CREDIT', amount: 18340, description: 'Order earnings — July 28' },
      { walletId: sellerWallet.id, type: 'CREDIT', amount: 24160, description: 'Order earnings — July 27' },
      { walletId: sellerWallet.id, type: 'DEBIT', amount: 5000, description: 'Withdrawal — bKash' },
    ],
    skipDuplicates: true,
  });

  // ── 10. NOTIFICATIONS ────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { userId: seller.id, title: 'New Order Received', message: 'You have a new order. Check your order list.', type: 'ORDER', link: '/seller/dashboard/orders' },
      { userId: seller.id, title: 'Low Stock Alert', message: 'Deshi Ghee has only 3 units left.', type: 'STOCK', link: '/seller/dashboard/inventory' },
      { userId: seller.id, title: 'Payment Settled', message: '৳18,340 credited to your wallet.', type: 'PAYMENT', link: '/seller/dashboard/finance/wallet' },
      { userId: seller.id, title: 'New Review Received', message: 'Organic Milk received a 5-star review.', type: 'REVIEW', link: '/seller/dashboard/reviews' },
    ],
    skipDuplicates: true,
  });

  // ── 11. COUPONS ──────────────────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'FRESH10' },
    update: {},
    create: { code: 'FRESH10', description: '10% off on all groceries', discountType: 'PERCENTAGE', discountValue: 10, minOrderAmount: 200, maxUses: 100, isActive: true, expiresAt: new Date('2026-12-31') },
  });

  await prisma.coupon.upsert({
    where: { code: 'DOHS50' },
    update: {},
    create: { code: 'DOHS50', description: '৳50 flat discount', discountType: 'FLAT', discountValue: 50, minOrderAmount: 300, maxUses: 50, isActive: true, expiresAt: new Date('2026-12-31') },
  });

  console.log('\n✅  Seeding complete!\n');
  console.log('  Demo Credentials:');
  console.log('  ─────────────────────────────────────────');
  console.log('  Super Admin  │ superadmin@example.com │ SuperAdmin@123');
  console.log('  Admin        │ admin@example.com      │ Admin@123');
  console.log('  Seller       │ seller@example.com     │ Seller@123');
  console.log('  Customer     │ customer@example.com   │ Customer@123');
  console.log('  Rider        │ rider@example.com      │ Rider@123');
  console.log('  ─────────────────────────────────────────\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());
