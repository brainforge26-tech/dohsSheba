'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore, Language } from '@/store/useLanguageStore';

export const DICTIONARY = {
  // Common Nav & Buttons
  dashboard: { EN: 'Dashboard', BN: 'ড্যাশবোর্ড' },
  customerWorkspace: { EN: 'Customer Workspace', BN: 'কাস্টমার ওয়ার্কস্পেস' },
  homeServices: { EN: 'Home Services', BN: 'হোম সার্ভিসসমূহ' },
  shopping: { EN: 'Shopping', BN: 'শপিং' },
  myOrders: { EN: 'My Orders', BN: 'আমার অর্ডারসমূহ' },
  trackOrder: { EN: 'Track Order', BN: 'অর্ডার ট্র্যাক করুন' },
  buyAgain: { EN: 'Buy Again', BN: 'পুনরায় কিনুন' },
  cart: { EN: 'Shopping Cart', BN: 'শপিং কার্ট' },
  wishlist: { EN: 'Wishlist', BN: 'উইশলিস্ট' },
  recentlyViewed: { EN: 'Recently Viewed', BN: 'সম্প্রতি দেখা পণ্য' },
  refunds: { EN: 'Return & Refunds', BN: 'রিটার্ন ও রিফান্ড' },
  reviews: { EN: 'Reviews & Ratings', BN: 'রিভিউ ও রেটিং' },
  messages: { EN: 'Inbox Messages', BN: 'মেসেজ ইনবক্স' },
  notifications: { EN: 'Notifications', BN: 'নোটিফিকেশন' },
  savedAddresses: { EN: 'Saved Addresses', BN: 'সংরক্ষিত ঠিকানা' },
  paymentHistory: { EN: 'Payment History', BN: 'পেমেন্ট হিস্ট্রি' },
  couponsRewards: { EN: 'Coupons & Rewards', BN: 'কুপন ও রিওয়ার্ড' },
  profileSettings: { EN: 'Profile Settings', BN: 'প্রোফাইল সেটিংস' },
  security: { EN: 'Security', BN: 'সিকিউরিটি' },
  support: { EN: 'Support Tickets', BN: 'সহায়তা টিকেট' },
  continueShopping: { EN: 'Continue Shopping', BN: 'কেনাকাটা চালিয়ে যান' },
  contactSupport: { EN: 'Contact Support', BN: 'সাপোর্টে যোগাযোগ করুন' },
  reorder: { EN: 'Reorder', BN: 'পুনরায় অর্ডার' },
  quickActions: { EN: 'Quick Actions', BN: 'দ্রুত একশন' },
  recentActivities: { EN: 'Recent Activities', BN: 'সাম্প্রতিক কার্যক্রম' },
  buyAgainEssentials: { EN: 'Buy Again Essentials', BN: 'নিত্যপ্রয়োজনীয় পণ্য' },
  exploreAll: { EN: 'Explore All', BN: 'সব দেখুন' },
  viewAll: { EN: 'View All', BN: 'সব দেখুন' },

  // Stats
  totalOrders: { EN: 'Total Orders', BN: 'মোট অর্ডার' },
  activeOrders: { EN: 'Active Orders', BN: 'চলতি অর্ডার' },
  completedOrders: { EN: 'Completed Orders', BN: 'সম্পন্ন অর্ডার' },
  cancelledOrders: { EN: 'Cancelled Orders', BN: 'বাতিল অর্ডার' },
  wishlistItems: { EN: 'Wishlist Items', BN: 'উইশলিস্ট পণ্য' },
  cartItems: { EN: 'Cart Items', BN: 'কার্ট পণ্য' },
  rewardPoints: { EN: 'Reward Points', BN: 'রিওয়ার্ড পয়েন্ট' },
  totalSpending: { EN: 'Total Spending', BN: 'মোট খরচ' },

  // Greetings
  goodMorning: { EN: 'Good morning', BN: 'শুভ সকাল' },
  goodAfternoon: { EN: 'Good afternoon', BN: 'শুভ অপরাহ্ন' },
  goodEvening: { EN: 'Good evening', BN: 'শুভ সন্ধ্যা' },
  welcomeMessage: {
    EN: 'Welcome to your customer workspace. Track active orders, re-order your daily essentials, and check your rewards!',
    BN: 'আপনার কাস্টমার ড্যাশবোর্ডে স্বাগতম। আপনার অর্ডার ট্র্যাক করুন, প্রয়োজনীয় পণ্য পুনরায় অর্ডার করুন এবং রিওয়ার্ড চেক করুন।',
  },
  residentMember: { EN: 'Marketplace Resident Member', BN: 'মার্কেটপ্লেস রেসিডেন্ট মেম্বার' },
  goldMember: { EN: 'GOLD LOYALTY MEMBER', BN: 'গোল্ড লয়ালটি মেম্বার' },

  // Language & Actions
  english: { EN: 'English', BN: 'ইংরেজি' },
  bangla: { EN: 'বাংলা', BN: 'বাংলা' },
  signOut: { EN: 'Sign Out', BN: 'লগআউট' },
};

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBn = !mounted || language !== 'EN';

  const t = (key: keyof typeof DICTIONARY): string => {
    if (!mounted) {
      return DICTIONARY[key]?.BN || DICTIONARY[key]?.EN || String(key);
    }
    const langKey = language === 'EN' ? 'EN' : 'BN';
    return DICTIONARY[key]?.[langKey] || DICTIONARY[key]?.BN || String(key);
  };

  return { t, isBn, language, setLanguage, toggleLanguage, mounted };
}
