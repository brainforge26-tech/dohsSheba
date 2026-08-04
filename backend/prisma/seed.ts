import 'dotenv/config';
import { PrismaClient, Role, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── 1. CLEAR ALL EXISTING DATA ───────────────────────────────────────────────
async function clearAll() {
  console.log('🧹 Resetting database & clearing all existing data...');
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
  console.log('   ✓ Database reset complete.');
}

// ─── 2. USERS ─────────────────────────────────────────────────────────────────
async function seedUsers() {
  console.log('👤 Seeding core system users...');
  const pass = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.create({
    data: { name: 'Super Admin', email: 'superadmin@dohssheba.com', password: pass, role: Role.SUPER_ADMIN, phone: '+8801700000001', emailVerified: true, isActive: true }
  });
  const admin = await prisma.user.create({
    data: { name: 'DOHS Admin', email: 'admin@dohssheba.com', password: pass, role: Role.ADMIN, phone: '+8801700000002', emailVerified: true, isActive: true }
  });
  const seller = await prisma.user.create({
    data: { name: 'Green Market DOHS', email: 'seller@dohssheba.com', password: pass, role: Role.SELLER, phone: '+8801700000003', emailVerified: true, isActive: true }
  });
  const rider = await prisma.user.create({
    data: { name: 'Rider Akash', email: 'rider@dohssheba.com', password: pass, role: Role.RIDER, phone: '+8801700000004', emailVerified: true, isActive: true }
  });
  const customer = await prisma.user.create({
    data: { name: 'Sharmin Sultana', email: 'customer@dohssheba.com', password: pass, role: Role.CUSTOMER, phone: '+8801800000005', emailVerified: true, isActive: true }
  });
  const provider = await prisma.user.create({
    data: { name: 'DOHS Home Services', email: 'provider@dohssheba.com', password: pass, role: Role.PROVIDER, phone: '+8801900000006', emailVerified: true, isActive: true }
  });

  console.log('   ✓ 6 core users created with password: password123');
  return { superAdmin, admin, seller, rider, customer, provider };
}

// ─── 3. PROFILES ─────────────────────────────────────────────────────────────
async function seedProfiles(seller: any, rider: any, provider: any) {
  console.log('📋 Seeding seller, rider, and provider profiles...');
  const sellerProf = await prisma.sellerProfile.create({
    data: {
      userId: seller.id,
      shopName: 'Green Market DOHS',
      description: 'Premium Fresh Groceries & Daily Bazaar Supplies in Mohakhali DOHS',
      isVerified: true,
      rating: 4.9,
    }
  });

  const riderProf = await prisma.riderProfile.create({
    data: {
      userId: rider.id,
      vehicleType: 'Motorbike',
      vehicleNo: 'DHAKA-METRO-HA-1234',
      isOnline: true,
      isOnDuty: true,
      isAvailable: true,
      totalTrips: 24,
      totalEarnings: 3200,
      rating: 4.95,
    }
  });

  const providerProf = await prisma.providerProfile.create({
    data: {
      userId: provider.id,
      bio: 'Expert DOHS Resident Maintenance Technician & AC Specialist',
      experience: 6,
      nid: '19922691234500',
      isVerified: true,
      rating: 4.9,
      totalJobs: 18,
    }
  });

  console.log('   ✓ Profiles seeded.');
  return { sellerProf, riderProf, providerProf };
}

// ─── 4. BRANDS ───────────────────────────────────────────────────────────────
async function seedBrands() {
  console.log('🏷️ Seeding brands...');
  const brandsData = [
    { name: 'Pran',         slug: 'pran',         logo: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=100' },
    { name: 'Aarong Dairy', slug: 'aarong-dairy', logo: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100' },
    { name: 'ACI Foods',    slug: 'aci-foods',    logo: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=100' },
    { name: 'Fresh (BD)',   slug: 'fresh-bd',     logo: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=100' },
    { name: 'Ruchi',        slug: 'ruchi',        logo: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100' },
    { name: 'Bashundhara',  slug: 'bashundhara',  logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100' },
    { name: 'Olympic',      slug: 'olympic',      logo: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100' },
    { name: 'Nestle',       slug: 'nestle',       logo: 'https://images.unsplash.com/photo-1619831025282-b011fbd8c41f?w=100' },
    { name: 'Igloo',        slug: 'igloo',        logo: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=100' },
    { name: 'Square',       slug: 'square',       logo: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=100' },
  ];

  const created: any[] = [];
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: { ...b, isActive: true } });
    created.push(brand);
  }
  console.log(`   ✓ ${created.length} brands created.`);
  return created;
}

// ─── 5. CATEGORIES & SUB-CATEGORIES ──────────────────────────────────────────
async function seedCategories() {
  console.log('📂 Seeding parent categories and subcategories...');

  const parentCats = [
    { name: 'Vegetables & Fruits',   slug: 'vegetables-fruits',  image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80', description: 'Fresh seasonal vegetables and fruits' },
    { name: 'Meat & Poultry',         slug: 'meat-poultry',       image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&auto=format&fit=crop&q=80', description: 'Fresh chicken, beef, and mutton' },
    { name: 'Seafood & Fish',         slug: 'seafood-fish',       image: 'https://images.unsplash.com/photo-1534942519507-769d4679447d?w=400&auto=format&fit=crop&q=80', description: 'Fresh hilsa, rui, catfish & seafood' },
    { name: 'Dairy & Eggs',           slug: 'dairy-eggs',         image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80', description: 'Milk, yogurt, butter, cheese & eggs' },
    { name: 'Rice & Grains',          slug: 'rice-grains',        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80', description: 'Basmati, Chinigura, Miniket & lentils' },
    { name: 'Oils & Spices',          slug: 'oils-spices',        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80', description: 'Mustard oil, soybean oil & mixed spices' },
    { name: 'Bakery & Snacks',        slug: 'bakery-snacks',      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80', description: 'Bread, biscuits, chips & crackers' },
    { name: 'Beverages & Juices',     slug: 'beverages-juices',   image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80', description: 'Juice, water, soft drinks & tea' },
  ];

  const parentMap = new Map<string, any>();
  for (const c of parentCats) {
    const parent = await prisma.productCategory.create({ data: { ...c, isActive: true } });
    parentMap.set(c.slug, parent);
  }

  // Subcategories
  const subCats = [
    { parentSlug: 'vegetables-fruits', name: 'Fresh Leafy Vegetables', slug: 'leafy-vegetables', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
    { parentSlug: 'meat-poultry',       name: 'Deshi Broiler & Sonali Chicken', slug: 'poultry-chicken', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400' },
    { parentSlug: 'dairy-eggs',         name: 'Pasteurized Milk & Yogurt', slug: 'milk-yogurt', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400' },
  ];

  for (const sub of subCats) {
    const parent = parentMap.get(sub.parentSlug);
    if (parent) {
      await prisma.productCategory.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          image: sub.image,
          parentId: parent.id,
          isActive: true,
        }
      });
    }
  }

  const allCats = await prisma.productCategory.findMany({ include: { children: true } });
  console.log(`   ✓ ${allCats.length} total categories & subcategories created.`);
  return allCats;
}

// ─── 6. PRODUCTS (WITH EXTENDED FIELDS & MULTI-IMAGES) ──────────────────────
async function seedProducts(seller: any, catList: any[], brandList: any[]) {
  console.log('🛒 Seeding products with multi-image gallery & extended metadata...');

  const catId = (slug: string) => catList.find((c) => c.slug === slug)?.id || catList[0].id;
  const brandId = (name: string) => brandList.find((b) => b.name === name)?.id || null;

  const rawProducts = [
    {
      name: 'Fresh Red Tomatoes (1 kg)',
      slug: 'fresh-red-tomatoes-1kg',
      categorySlug: 'vegetables-fruits',
      brandName: 'Fresh (BD)',
      price: 65,
      salePrice: 60,
      costPrice: 45,
      discount: 7,
      stock: 300,
      unit: 'kg',
      sku: 'VEG-TOM-001',
      barcode: '8901234567001',
      weight: 1.0,
      isFeatured: true,
      isFlashSale: true,
      images: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      ],
      description: 'Farm-fresh juicy red tomatoes, perfect for curries and salads. Direct from Bogura farms.',
      metaTitle: 'Buy Fresh Red Tomatoes Online | DOHS Sheba',
      metaDescription: 'Order fresh juicy red tomatoes in Savar/Mohakhali DOHS with 45-minute doorstep delivery.',
    },
    {
      name: 'Sweet Honey Mango Himsagar (1 kg)',
      slug: 'sweet-honey-mango-himsagar-1kg',
      categorySlug: 'vegetables-fruits',
      brandName: 'Fresh (BD)',
      price: 130,
      salePrice: 105,
      costPrice: 80,
      discount: 19,
      stock: 80,
      unit: 'kg',
      sku: 'FRU-MNG-002',
      barcode: '8901234567002',
      weight: 1.0,
      isFeatured: true,
      isFlashSale: true,
      images: [
        'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600&auto=format&fit=crop&q=80',
      ],
      description: 'Premium Himsagar mangoes from Rajshahi — sweet, fragrant, and 100% formalin-free.',
      metaTitle: 'Rajshahi Himsagar Mango | DOHS Sheba Bazaar',
      metaDescription: 'Fresh organic Himsagar mangoes delivered directly to your doorstep in DOHS.',
    },
    {
      name: 'Fresh Deshi Broiler Chicken (Cleaned & Cut)',
      slug: 'fresh-deshi-broiler-chicken-cleaned',
      categorySlug: 'meat-poultry',
      brandName: 'Green Market DOHS',
      price: 210,
      salePrice: 199,
      costPrice: 160,
      discount: 5,
      stock: 150,
      unit: 'kg',
      sku: 'MEA-CHK-003',
      barcode: '8901234567003',
      weight: 1.0,
      isFeatured: true,
      isFlashSale: true,
      images: [
        'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80',
      ],
      description: 'Fresh DOHS bazaar broiler chicken, professionally cleaned, skinless, and cut into curry pieces.',
      metaTitle: 'Cleaned Broiler Chicken Online DOHS',
      metaDescription: 'Order fresh halal broiler chicken cleaned and cut for instant cooking.',
    },
    {
      name: 'Aarong Dairy Pasteurized Milk (1L)',
      slug: 'aarong-dairy-pasteurized-milk-1l',
      categorySlug: 'dairy-eggs',
      brandName: 'Aarong Dairy',
      price: 90,
      salePrice: 90,
      costPrice: 75,
      discount: 0,
      stock: 200,
      unit: 'liter',
      sku: 'DAI-MLK-004',
      barcode: '8901234567004',
      weight: 1.0,
      isFeatured: true,
      isFlashSale: false,
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
      ],
      description: 'Rich, creamy pasteurized full cream milk — fresh from Aarong Dairy farms.',
      metaTitle: 'Aarong Full Cream Milk 1L | DOHS Sheba',
      metaDescription: 'Fresh pasteurized milk from Aarong Dairy delivered to your DOHS home.',
    },
    {
      name: 'Nazirshail Premium Aromatic Rice (5 kg)',
      slug: 'nazirshail-premium-rice-5kg',
      categorySlug: 'rice-grains',
      brandName: 'Fresh (BD)',
      price: 410,
      salePrice: 390,
      costPrice: 330,
      discount: 5,
      stock: 100,
      unit: '5 kg bag',
      sku: 'RIC-NAZ-005',
      barcode: '8901234567005',
      weight: 5.0,
      isFeatured: true,
      isFlashSale: false,
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop&q=80',
      ],
      description: 'Long-grain premium Nazirshail rice, non-sticky and aromatic for daily household meals.',
      metaTitle: 'Nazirshail Rice 5kg Pack | DOHS Sheba',
      metaDescription: 'Buy premium long grain Nazirshail rice online with fast doorstep delivery.',
    },
    {
      name: 'Pure Premium Mustard Oil (1 Liter)',
      slug: 'pure-premium-mustard-oil-1l',
      categorySlug: 'oils-spices',
      brandName: 'Ruchi',
      price: 240,
      salePrice: 210,
      costPrice: 170,
      discount: 12,
      stock: 90,
      unit: 'liter bottle',
      sku: 'OIL-MUS-006',
      barcode: '8901234567006',
      weight: 1.0,
      isFeatured: false,
      isFlashSale: true,
      images: [
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80',
      ],
      description: 'Cold-pressed traditional mustard oil in a sealed bottle with authentic aroma.',
      metaTitle: 'Cold Pressed Mustard Oil 1L | DOHS Sheba',
      metaDescription: 'Authentic pure mustard oil for delicious Bengali cooking.',
    },
  ];

  const createdProds: any[] = [];
  for (const p of rawProducts) {
    const prod = await prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: catId(p.categorySlug),
        brandId: brandId(p.brandName),
        brandName: p.brandName,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        costPrice: p.costPrice,
        discount: p.discount,
        stock: p.stock,
        unit: p.unit,
        sku: p.sku,
        barcode: p.barcode,
        weight: p.weight,
        isActive: true,
        isFeatured: p.isFeatured,
        isFlashSale: p.isFlashSale,
        rating: 4.8,
        totalReviews: 12,
        images: p.images,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
      }
    });
    createdProds.push(prod);
  }

  // Link related products
  const firstId = createdProds[0]?.id;
  const secondId = createdProds[1]?.id;
  if (firstId && secondId) {
    await prisma.product.update({
      where: { id: firstId },
      data: { relatedProductIds: [secondId] }
    });
  }

  console.log(`   ✓ ${createdProds.length} products created with full metadata.`);
  return createdProds;
}

// ─── 7. COUPONS & ADDRESSES ──────────────────────────────────────────────────
async function seedCouponsAndAddresses(customer: any, seller: any) {
  console.log('🎟️ Seeding coupons and addresses...');
  const coupon1 = await prisma.coupon.create({
    data: {
      code: 'DOHS10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 200,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    }
  });

  const coupon2 = await prisma.coupon.create({
    data: {
      code: 'WELCOME50',
      discountType: 'FIXED',
      discountValue: 50,
      minOrderAmount: 300,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    }
  });

  const customerAddr = await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Home',
      line1: 'House #42, Road #05, Block C',
      area: 'Mohakhali DOHS',
      city: 'Dhaka',
      postCode: '1206',
      isDefault: true,
    }
  });

  const sellerAddr = await prisma.address.create({
    data: {
      userId: seller.id,
      label: 'Shop Storefront',
      line1: 'Shop #12, DOHS Central Market',
      area: 'Mohakhali DOHS',
      city: 'Dhaka',
      postCode: '1206',
      isDefault: true,
    }
  });

  console.log('   ✓ Coupons & Addresses seeded.');
  return { coupon1, coupon2, customerAddr, sellerAddr };
}

// ─── 8. ORDERS & DISPATCH LIFECYCLE ──────────────────────────────────────────
async function seedOrders(customer: any, rider: any, customerAddr: any, products: any[]) {
  console.log('📦 Seeding active orders across dispatch lifecycle...');
  const p1 = products[0];
  const p2 = products[1];

  if (!p1) return;

  // Order 1: Pending (Needs seller & rider assignment)
  const order1 = await prisma.order.create({
    data: {
      customerId: customer.id,
      addressId: customerAddr.id,
      customerPhone: customerAddr.phone,
      subtotal: p1.price,
      deliveryFee: 50,
      discount: 0,
      totalAmount: p1.price + 50,
      status: OrderStatus.PENDING,
      items: {
        create: [
          { productId: p1.id, quantity: 1, price: p1.price }
        ]
      },
      payment: {
        create: {
          amount: p1.price + 50,
          method: PaymentMethod.CASH,
          status: PaymentStatus.PENDING,
        }
      }
    }
  });

  // Order 2: Ready for Rider (Seller accepted)
  const order2 = await prisma.order.create({
    data: {
      customerId: customer.id,
      addressId: customerAddr.id,
      customerPhone: customerAddr.phone,
      subtotal: p1.price * 2,
      deliveryFee: 0,
      discount: 0,
      totalAmount: p1.price * 2,
      status: OrderStatus.READY_FOR_RIDER,
      items: {
        create: [
          { productId: p1.id, quantity: 2, price: p1.price }
        ]
      },
      payment: {
        create: {
          amount: p1.price * 2,
          method: PaymentMethod.CASH,
          status: PaymentStatus.PENDING,
        }
      }
    }
  });

  // Order 3: Rider Assigned & Delivered
  if (p2) {
    await prisma.order.create({
      data: {
        customerId: customer.id,
        riderId: rider.id,
        assignedRiderId: rider.id,
        addressId: customerAddr.id,
        customerPhone: customerAddr.phone,
        subtotal: p2.price,
        deliveryFee: 50,
        discount: 10,
        totalAmount: p2.price + 40,
        status: OrderStatus.DELIVERED,
        items: {
          create: [
            { productId: p2.id, quantity: 1, price: p2.price }
          ]
        },
        payment: {
          create: {
            amount: p2.price + 40,
            method: PaymentMethod.CASH,
            status: PaymentStatus.PAID,
          }
        }
      }
    });
  }

  console.log('   ✓ Sample orders seeded across lifecycle statuses.');
}

// ─── MAIN RUNNER ─────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Running Full Project Audit & Database Reset Seed...');
  console.log('='.repeat(60));

  await clearAll();
  const users = await seedUsers();
  await seedProfiles(users.seller, users.rider, users.provider);
  const brands = await seedBrands();
  const categories = await seedCategories();
  const products = await seedProducts(users.seller, categories, brands);
  const { customerAddr } = await seedCouponsAndAddresses(users.customer, users.seller);
  await seedOrders(users.customer, users.rider, customerAddr, products);

  console.log('='.repeat(60));
  console.log('✅ Seed completed successfully with zero errors!');
  console.log(`   Admin: admin@dohssheba.com (Password: password123)`);
  console.log(`   Seller: seller@dohssheba.com (Password: password123)`);
  console.log(`   Rider: rider@dohssheba.com (Password: password123)`);
  console.log(`   Customer: customer@dohssheba.com (Password: password123)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
