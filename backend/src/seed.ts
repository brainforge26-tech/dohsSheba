import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. Create Users (Admin, Customer, Provider, Seller)
  console.log('👤 Creating users...');
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dohssheba.com' },
    update: {},
    create: {
      name: 'DOHS Sheba Admin',
      email: 'admin@dohssheba.com',
      password: hashedPassword,
      phone: '+8801700000001',
      role: Role.ADMIN,
      isActive: true,
      emailVerified: true,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@dohssheba.com' },
    update: {},
    create: {
      name: 'Tanvir Hossain',
      email: 'customer@dohssheba.com',
      password: hashedPassword,
      phone: '+8801700000002',
      role: Role.CUSTOMER,
      isActive: true,
      emailVerified: true,
      wallet: { create: { balance: 1500 } },
      addresses: {
        create: {
          label: 'Home',
          line1: 'House 42, Road 7',
          area: 'Mohakhali DOHS',
          city: 'Dhaka',
          isDefault: true,
        },
      },
    },
  });

  const provider = await prisma.user.upsert({
    where: { email: 'provider@dohssheba.com' },
    update: {},
    create: {
      name: 'Rafiqul Islam',
      email: 'provider@dohssheba.com',
      password: hashedPassword,
      phone: '+8801700000003',
      role: Role.PROVIDER,
      isActive: true,
      emailVerified: true,
      providerProfile: {
        create: {
          bio: 'Expert electrician with 8 years of experience in DOHS area.',
          experience: 8,
          isVerified: true,
          rating: 4.9,
          totalJobs: 142,
        },
      },
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@dohssheba.com' },
    update: {},
    create: {
      name: 'Green Market DOHS',
      email: 'seller@dohssheba.com',
      password: hashedPassword,
      phone: '+8801700000004',
      role: Role.SELLER,
      isActive: true,
      emailVerified: true,
      sellerProfile: {
        create: {
          shopName: 'DOHS Daily Fresh Express',
          description: '100% Organic, fresh daily groceries delivered in 30 mins.',
          isVerified: true,
          rating: 4.8,
        },
      },
    },
  });

  const rider1 = await prisma.user.upsert({
    where: { email: 'rider@dohssheba.com' },
    update: {},
    create: {
      name: 'Rana Ahmed (Fleet Rider #1)',
      email: 'rider@dohssheba.com',
      password: hashedPassword,
      phone: '+8801700000005',
      role: Role.RIDER,
      isActive: true,
      emailVerified: true,
      riderProfile: {
        create: {
          vehicleType: 'Motorbike',
          vehicleNo: 'Dhaka Metro L-1234',
          isOnline: true,
          isOnDuty: true,
          isAvailable: true,
          rating: 4.9,
          totalTrips: 184,
          totalEarnings: 9200,
        },
      },
    },
  });

  const rider2 = await prisma.user.upsert({
    where: { email: 'rider2@dohssheba.com' },
    update: {},
    create: {
      name: 'Babu Mia (Fleet Rider #2)',
      email: 'rider2@dohssheba.com',
      password: hashedPassword,
      phone: '+8801700000006',
      role: Role.RIDER,
      isActive: true,
      emailVerified: true,
      riderProfile: {
        create: {
          vehicleType: 'Bicycle',
          vehicleNo: 'Dhaka DOHS-88',
          isOnline: true,
          isOnDuty: true,
          isAvailable: true,
          rating: 4.8,
          totalTrips: 96,
          totalEarnings: 4800,
        },
      },
    },
  });

  // 2. Service Categories
  console.log('🛠️ Creating Service Categories...');
  const serviceCategories = [
    { name: 'Electrician', slug: 'electrician', description: 'Wiring, circuit fixing, light installation', icon: 'Zap' },
    { name: 'Plumber', slug: 'plumber', description: 'Pipe leak fix, sanitary fitting, tap installation', icon: 'Wrench' },
    { name: 'House Cleaner', slug: 'house-cleaner', description: 'Deep home cleaning, sofa & carpet cleaning', icon: 'Sparkles' },
    { name: 'AC Repair', slug: 'ac-repair', description: 'AC servicing, gas refill, master cleaning', icon: 'Wind' },
    { name: 'Carpenter', slug: 'carpenter', description: 'Furniture repair, door lock installation, woodworking', icon: 'Hammer' },
    { name: 'Painter', slug: 'painter', description: 'Interior & exterior wall painting, waterproof coating', icon: 'Paintbrush' },
  ];

  for (const cat of serviceCategories) {
    const exists = await prisma.serviceCategory.findFirst({ where: { OR: [{ slug: cat.slug }, { name: cat.name }] } });
    if (!exists) {
      await prisma.serviceCategory.create({ data: cat });
    }
  }

  // 3. Product Categories
  console.log('🛒 Creating Product Categories...');
  const productCategories = [
    { name: 'Groceries', slug: 'groceries', description: 'Rice, oil, spices, daily cooking essentials', icon: 'ShoppingBag' },
    { name: 'Vegetables', slug: 'vegetables', description: 'Fresh farm vegetables delivered daily', icon: 'Carrot' },
    { name: 'Fruits', slug: 'fruits', description: 'Organic fresh fruits', icon: 'Apple' },
    { name: 'Fish & Meat', slug: 'fish-meat', description: 'Fresh river fish and halal chicken/beef', icon: 'Fish' },
    { name: 'Dairy & Eggs', slug: 'dairy', description: 'Milk, butter, fresh farm eggs', icon: 'Milk' },
    { name: 'Snacks & Beverages', slug: 'snacks', description: 'Biscuits, juices, tea, soft drinks', icon: 'Coffee' },
  ];

  for (const cat of productCategories) {
    const exists = await prisma.productCategory.findFirst({ where: { OR: [{ slug: cat.slug }, { name: cat.name }] } });
    if (!exists) {
      await prisma.productCategory.create({ data: cat });
    }
  }

  // 4. Sample Services
  console.log('⚡ Creating Services...');
  const elecCat = await prisma.serviceCategory.findUnique({ where: { slug: 'electrician' } });
  const acCat   = await prisma.serviceCategory.findUnique({ where: { slug: 'ac-repair' } });

  if (elecCat) {
    await prisma.service.create({
      data: {
        providerId: provider.id,
        categoryId: elecCat.id,
        title: 'Emergency Electrical Wiring & Circuit Fix',
        description: 'Complete inspection and repair of short circuits, main switch boxes, and DB boards.',
        price: 500,
        priceUnit: 'hour',
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800'],
        rating: 4.9,
        totalReviews: 38,
      },
    });
  }

  if (acCat) {
    await prisma.service.create({
      data: {
        providerId: provider.id,
        categoryId: acCat.id,
        title: 'Split AC Master Jet Service & Gas Check',
        description: 'High pressure water jet cleaning of indoor and outdoor units + refrigerant leak check.',
        price: 1200,
        priceUnit: 'fixed',
        images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800'],
        rating: 4.8,
        totalReviews: 54,
      },
    });
  }

  // 5. Sample Products
  console.log('🥦 Creating Products...');
  const vegCat = await prisma.productCategory.findUnique({ where: { slug: 'vegetables' } });
  const fruitCat = await prisma.productCategory.findUnique({ where: { slug: 'fruits' } });

  if (vegCat) {
    await prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: vegCat.id,
        name: 'Fresh Organic Tomato (Deshi)',
        slug: 'fresh-organic-tomato-deshi',
        description: 'Farm fresh farm tomatoes, rich in vitamins.',
        price: 80,
        discount: 10,
        unit: 'kg',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800'],
        isFeatured: true,
        rating: 4.7,
        totalReviews: 24,
      },
    });
  }

  if (fruitCat) {
    await prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: fruitCat.id,
        name: 'Green Fresh Mango (Amrapali)',
        slug: 'green-fresh-mango-amrapali',
        description: 'Sweet, juicy, high quality naturally ripened Amrapali mangoes.',
        price: 140,
        discount: 15,
        unit: 'kg',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800'],
        isFeatured: true,
        rating: 4.9,
        totalReviews: 42,
      },
    });
  }

  // 6. Coupons & Banners
  console.log('🎟️ Creating Coupons & Banners...');
  await prisma.coupon.upsert({
    where: { code: 'WELCOME100' },
    update: {},
    create: {
      code: 'WELCOME100',
      description: 'Flat ৳100 off on your first order/booking',
      discountType: 'FIXED',
      discountValue: 100,
      minOrderAmount: 500,
      isActive: true,
    },
  });

  await prisma.banner.create({
    data: {
      title: 'Fastest DOHS Home Service & Grocery Express',
      description: 'Get verified experts or fresh daily groceries delivered to your door in 30 minutes.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200',
      position: 'home',
      isActive: true,
      order: 1,
    },
  });

  // 7. Sample Bookings for Provider
  const sampleService = await prisma.service.findFirst({ where: { providerId: provider.id } });
  const dbAddress = await prisma.address.findFirst();
  if (sampleService && customer && dbAddress) {
    const existingBookings = await prisma.booking.count({ where: { serviceId: sampleService.id } });
    if (existingBookings === 0) {
      await prisma.booking.create({
        data: {
          customerId: customer.id,
          serviceId: sampleService.id,
          addressId: dbAddress.id,
          status: 'PENDING',
          totalAmount: sampleService.price,
          notes: 'Customer requested emergency afternoon visit.',
          scheduledAt: new Date(),
        },
      });
      await prisma.booking.create({
        data: {
          customerId: customer.id,
          serviceId: sampleService.id,
          addressId: dbAddress.id,
          status: 'CONFIRMED',
          totalAmount: sampleService.price,
          notes: 'Regular maintenance schedule.',
          scheduledAt: new Date(Date.now() + 86400000),
        },
      });
    }
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
