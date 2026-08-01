import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── 1. CLEAR ALL BUSINESS TRANSACTION DATA ──────────────────────────────────
async function clearBusinessData() {
  console.log('🧹 Clearing all previous business transaction data...');

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
  await prisma.user.deleteMany({});

  console.log('   ✓ Business history cleared cleanly (0 Orders, 0 Cart Items, 0 Payments, 0 Missions).');
}

// ─── 2. SEED ROLE AUTHENTICATION ACCOUNTS ────────────────────────────────────
async function seedUsers() {
  console.log('👤 Seeding role authentication accounts...');

  const defaultPassword = await bcrypt.hash('password123', 10);
  const legacyPassword  = await bcrypt.hash('SuperAdmin@123', 10);

  // SUPER ADMIN
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@dohssheba.com' },
    update: { password: defaultPassword, role: Role.SUPER_ADMIN, isActive: true },
    create: {
      name: 'Super Administrator',
      email: 'superadmin@dohssheba.com',
      password: defaultPassword,
      role: Role.SUPER_ADMIN,
      phone: '+8801700000001',
      emailVerified: true,
      isActive: true,
    },
  });
  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: { password: legacyPassword, role: Role.SUPER_ADMIN, isActive: true },
    create: {
      name: 'Super Administrator',
      email: 'superadmin@example.com',
      password: legacyPassword,
      role: Role.SUPER_ADMIN,
      phone: '+8801700000011',
      emailVerified: true,
      isActive: true,
    },
  });

  // ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dohssheba.com' },
    update: { password: defaultPassword, role: Role.ADMIN, isActive: true },
    create: {
      name: 'DOHS Operations Admin',
      email: 'admin@dohssheba.com',
      password: defaultPassword,
      role: Role.ADMIN,
      phone: '+8801700000002',
      emailVerified: true,
      isActive: true,
    },
  });
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { password: defaultPassword, role: Role.ADMIN, isActive: true },
    create: {
      name: 'DOHS Operations Admin',
      email: 'admin@example.com',
      password: defaultPassword,
      role: Role.ADMIN,
      phone: '+8801700000012',
      emailVerified: true,
      isActive: true,
    },
  });

  // SELLER
  const seller = await prisma.user.upsert({
    where: { email: 'seller@dohssheba.com' },
    update: { password: defaultPassword, role: Role.SELLER, isActive: true },
    create: {
      name: 'Green Market DOHS Owner',
      email: 'seller@dohssheba.com',
      password: defaultPassword,
      role: Role.SELLER,
      phone: '+8801700000003',
      emailVerified: true,
      isActive: true,
    },
  });
  await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: { password: defaultPassword, role: Role.SELLER, isActive: true },
    create: {
      name: 'Green Market DOHS Owner',
      email: 'seller@example.com',
      password: defaultPassword,
      role: Role.SELLER,
      phone: '+8801700000013',
      emailVerified: true,
      isActive: true,
    },
  });

  // RIDER
  const rider = await prisma.user.upsert({
    where: { email: 'rider@dohssheba.com' },
    update: { password: defaultPassword, role: Role.RIDER, isActive: true },
    create: {
      name: 'Rider Akash (Fleet #04)',
      email: 'rider@dohssheba.com',
      password: defaultPassword,
      role: Role.RIDER,
      phone: '+8801700000004',
      emailVerified: true,
      isActive: true,
    },
  });
  await prisma.user.upsert({
    where: { email: 'rider@example.com' },
    update: { password: defaultPassword, role: Role.RIDER, isActive: true },
    create: {
      name: 'Rider Akash (Fleet #04)',
      email: 'rider@example.com',
      password: defaultPassword,
      role: Role.RIDER,
      phone: '+8801700000014',
      emailVerified: true,
      isActive: true,
    },
  });

  // CUSTOMER
  const customer = await prisma.user.upsert({
    where: { email: 'customer@dohssheba.com' },
    update: { password: defaultPassword, role: Role.CUSTOMER, isActive: true },
    create: {
      name: 'Sharmin Sultana',
      email: 'customer@dohssheba.com',
      password: defaultPassword,
      role: Role.CUSTOMER,
      phone: '+8801800000005',
      emailVerified: true,
      isActive: true,
    },
  });
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: { password: defaultPassword, role: Role.CUSTOMER, isActive: true },
    create: {
      name: 'Sharmin Sultana',
      email: 'customer@example.com',
      password: defaultPassword,
      role: Role.CUSTOMER,
      phone: '+8801800000015',
      emailVerified: true,
      isActive: true,
    },
  });

  // PROVIDER
  const provider = await prisma.user.upsert({
    where: { email: 'provider@dohssheba.com' },
    update: { password: defaultPassword, role: Role.PROVIDER, isActive: true },
    create: {
      name: 'DOHS Home Services Master',
      email: 'provider@dohssheba.com',
      password: defaultPassword,
      role: Role.PROVIDER,
      phone: '+8801900000006',
      emailVerified: true,
      isActive: true,
    },
  });

  console.log('   ✓ 6 Role Accounts Created: SUPER_ADMIN, ADMIN, SELLER, RIDER, CUSTOMER, PROVIDER');
  return { superAdmin, admin, seller, rider, customer, provider };
}

// ─── 3. SEED ROLE PROFILES ───────────────────────────────────────────────────
async function seedProfiles(seller: any, rider: any, provider: any) {
  console.log('📝 Seeding role profiles...');

  // Seller Profile
  await prisma.sellerProfile.upsert({
    where: { userId: seller.id },
    update: { shopName: 'Green Market DOHS', isVerified: true },
    create: {
      userId: seller.id,
      shopName: 'Green Market DOHS',
      description: 'DOHS Central Supermarket - Premium Fresh Groceries & Daily Bazaar Supplies',
      isVerified: true,
      rating: 4.9,
    },
  });

  // Rider Profile (Available & Online by Default)
  await prisma.riderProfile.upsert({
    where: { userId: rider.id },
    update: {
      isOnline: true,
      isOnDuty: true,
      isAvailable: true,
      vehicleType: 'Motorbike',
      vehicleNo: 'DHAKA-METRO-HA-1234',
    },
    create: {
      userId: rider.id,
      vehicleType: 'Motorbike',
      vehicleNo: 'DHAKA-METRO-HA-1234',
      isOnline: true,
      isOnDuty: true,
      isAvailable: true,
      totalTrips: 0,
      totalEarnings: 0,
      rating: 5.0,
    },
  });

  // Provider Profile
  await prisma.providerProfile.upsert({
    where: { userId: provider.id },
    update: { isVerified: true },
    create: {
      userId: provider.id,
      bio: 'Expert DOHS Resident Plumbing, Electrical & Appliance Maintenance Technician',
      experience: 6,
      nid: '1992269123450011',
      isVerified: true,
      rating: 4.9,
      totalJobs: 0,
    },
  });

  console.log('   ✓ Role Profiles Attached (Seller, Rider, Provider)');
}

// ─── 4. SEED PRODUCT CATEGORIES ──────────────────────────────────────────────
async function seedCategories() {
  console.log('🏷️  Seeding product categories...');

  const categories = [
    { name: 'Fresh Meat & Poultry', slug: 'meat-poultry', description: 'Fresh local bazaar chicken, beef, & mutton' },
    { name: 'Dairy & Eggs',        slug: 'dairy-eggs',   description: 'Organic milk, butter, cheese, and fresh farm eggs' },
    { name: 'Fruits & Vegetables', slug: 'fruits-veg',   description: 'Fresh organic greens, seasonal fruits, & vegetables' },
    { name: 'Rice & Grains',       slug: 'rice-grains',  description: 'Premium Nazirshail, Miniket, & Chinigura rice' },
    { name: 'Edible Oils & Spices', slug: 'oils-spices', description: 'Pure mustard oil, soybean oil, & aromatic spices' },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const created = await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: true,
      },
    });
    createdCategories.push(created);
  }

  console.log(`   ✓ ${createdCategories.length} Product Categories Available`);
  return createdCategories;
}

// ─── 5. SEED DEMO PRODUCTS ───────────────────────────────────────────────────
async function seedProducts(seller: any, categories: any[]) {
  console.log('🛒 Seeding demo product catalog...');

  const catMap = new Map(categories.map((c) => [c.slug, c.id]));

  const demoProducts = [
    {
      name: 'Fresh Deshi Broiler Chicken (Cleaned & Cut)',
      slug: 'fresh-deshi-broiler-chicken',
      categorySlug: 'meat-poultry',
      price: 210,
      discount: 5,
      unit: 'kg',
      stock: 150,
      description: 'Fresh local DOHS bazaar broiler chicken, cleaned and cut into pieces ready for cooking.',
      images: ['https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=600'],
    },
    {
      name: 'Farm Fresh Organic Eggs (12 Pcs)',
      slug: 'farm-fresh-organic-eggs-12',
      categorySlug: 'dairy-eggs',
      price: 145,
      discount: 0,
      unit: 'dozen',
      stock: 200,
      description: 'Healthy, nutrient-dense organic brown eggs collected daily from local poultry farms.',
      images: ['https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600'],
    },
    {
      name: 'Aarong Dairy Pure Pasteurized Liquid Milk (1L)',
      slug: 'aarong-dairy-pure-liquid-milk-1l',
      categorySlug: 'dairy-eggs',
      price: 90,
      discount: 0,
      unit: 'liter',
      stock: 120,
      description: 'Pure, fresh pasteurized whole milk guaranteed rich in calcium and vitamins.',
      images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600'],
    },
    {
      name: 'Sonali Chicken Whole (Cleaned)',
      slug: 'sonali-chicken-whole-cleaned',
      categorySlug: 'meat-poultry',
      price: 320,
      discount: 10,
      unit: 'kg',
      stock: 80,
      description: 'Tender and flavorful Sonali chicken, skinless, dressed and freshly prepared.',
      images: ['https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=600'],
    },
    {
      name: 'Fresh Red Tomatoes (1kg)',
      slug: 'fresh-red-tomatoes-1kg',
      categorySlug: 'fruits-veg',
      price: 80,
      discount: 0,
      unit: 'kg',
      stock: 300,
      description: 'Juicy, naturally ripened farm tomatoes essential for curry and fresh salad.',
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600'],
    },
    {
      name: 'Ruchi Cold Pressed Mustard Oil (1L)',
      slug: 'ruchi-cold-pressed-mustard-oil-1l',
      categorySlug: 'oils-spices',
      price: 340,
      discount: 5,
      unit: 'liter',
      stock: 90,
      description: 'Traditional pungent cold pressed mustard oil for rich Bangladeshi culinary taste.',
      images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600'],
    },
    {
      name: 'Chinigura Aromatic Polao Rice (5kg)',
      slug: 'chinigura-aromatic-polao-rice-5kg',
      categorySlug: 'rice-grains',
      price: 650,
      discount: 8,
      unit: 'bag',
      stock: 60,
      description: 'Premium aromatic long-grain Chinigura rice for biryani, polao, and festive dishes.',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600'],
    },
  ];

  for (const prod of demoProducts) {
    const categoryId = catMap.get(prod.categorySlug) || categories[0].id;
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        price: prod.price,
        stock: prod.stock,
        sellerId: seller.id,
        categoryId,
      },
      create: {
        sellerId: seller.id,
        categoryId,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        discount: prod.discount,
        images: prod.images,
        stock: prod.stock,
        unit: prod.unit,
        isActive: true,
        isFeatured: true,
        rating: 4.9,
      },
    });
  }

  console.log(`   ✓ ${demoProducts.length} Demo Products Available in Catalog`);
}

// ─── MAIN EXECUTION ──────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Starting Clean Production Seed...');
  console.log('==================================================');

  await clearBusinessData();
  const users = await seedUsers();
  await seedProfiles(users.seller, users.rider, users.provider);
  const categories = await seedCategories();
  await seedProducts(users.seller, categories);

  console.log('==================================================');
  console.log('✅ Clean Production Seed Completed Successfully!');
  console.log('   0 Orders | 0 Cart Items | 0 Payments | 0 Missions');
  console.log('   Catalog & Authentication Accounts Ready.');
}

main()
  .catch((e) => {
    console.error('❌ Seed script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
