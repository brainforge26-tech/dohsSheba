'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore, Language } from '@/store/useLanguageStore';

export const DICTIONARY = {
  // Navigation & Header
  home: { EN: 'Home', BN: 'হোম' },
  categories: { EN: 'Categories', BN: 'ক্যাটাগরি' },
  allCategories: { EN: 'All Categories', BN: 'সব ক্যাটাগরি' },
  promotions: { EN: 'Promotions', BN: 'প্রমোশন' },
  ideasForBreakfast: { EN: 'Ideas For Breakfast', BN: 'ব্রেকফাস্ট আইডিয়া' },
  dashboard: { EN: 'Dashboard', BN: 'ড্যাশবোর্ড' },
  customerWorkspace: { EN: 'Customer Workspace', BN: 'কাস্টমার ড্যাশবোর্ড' },
  homeServices: { EN: 'Home Services', BN: 'হোম সার্ভিস' },
  shopping: { EN: 'Shopping Market', BN: 'শপিং মার্কেট' },
  myOrders: { EN: 'My Orders', BN: 'আমার অর্ডার' },
  trackOrder: { EN: 'Track Order', BN: 'অর্ডার ট্র্যাকিং' },
  offersCoupons: { EN: 'Offers & Coupons', BN: 'অফার ও কুপন' },
  buyAgain: { EN: 'Buy Again', BN: 'পুনরায় কিনুন' },
  cart: { EN: 'Cart', BN: 'কার্ট' },
  shoppingCart: { EN: 'Your Shopping Cart', BN: 'আপনার শপিং কার্ট' },
  wishlist: { EN: 'Wishlist', BN: 'উইশলিস্ট' },
  recentlyViewed: { EN: 'Recently Viewed', BN: 'সম্প্রতি দেখা পণ্য' },
  refunds: { EN: 'Return & Refunds', BN: 'রিটার্ন ও রিফান্ড' },
  reviews: { EN: 'Reviews & Ratings', BN: 'রিভিউ ও রেটিং' },
  messages: { EN: 'Inbox Messages', BN: 'ইনবক্স মেসেজ' },
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
  quickActions: { EN: 'Quick Actions', BN: 'দ্রুত অ্যাকশন' },
  recentActivities: { EN: 'Recent Activities', BN: 'সাম্প্রতিক কার্যক্রম' },
  buyAgainEssentials: { EN: 'Buy Again Essentials', BN: 'নিত্যপ্রয়োজনীয় পণ্য' },
  exploreAll: { EN: 'Explore All', BN: 'সব দেখুন' },
  viewAll: { EN: 'View All', BN: 'সব দেখুন' },

  // Search & Filters
  searchPlaceholder: {
    EN: 'Search Electrician, AC Repair, Fresh Fruits, Rice...',
    BN: 'সার্চ ইলেকট্রিশিয়ান, এসি রিপেয়ার, তাজা ফল, চাল...',
  },
  allMarket: { EN: 'All Market', BN: 'সব মার্কেট' },
  groceries: { EN: 'Groceries', BN: 'গ্রোসারি' },
  services: { EN: 'Home Services', BN: 'হোম সার্ভিস' },
  searchModalTitle: { EN: 'Search DOHS Sheba', BN: 'ডিএইচএস সেবা সার্চ' },

  // Stats & Dashboard
  totalOrders: { EN: 'Total Orders', BN: 'মোট অর্ডার' },
  activeOrders: { EN: 'Active Orders', BN: 'চলতি অর্ডার' },
  completedOrders: { EN: 'Completed Orders', BN: 'সম্পন্ন অর্ডার' },
  cancelledOrders: { EN: 'Cancelled Orders', BN: 'বাতিল অর্ডার' },
  wishlistItems: { EN: 'Wishlist Items', BN: 'উইশলিস্ট পণ্য' },
  cartItems: { EN: 'Cart Items', BN: 'কার্ট পণ্য' },
  rewardPoints: { EN: 'Reward Points', BN: 'রিওয়ার্ড পয়েন্ট' },
  totalSpending: { EN: 'Total Spending', BN: 'মোট খরচ' },

  // Greetings & User
  goodMorning: { EN: 'Good morning', BN: 'শুভ সকাল' },
  goodAfternoon: { EN: 'Good afternoon', BN: 'শুভ অপরাহ্ন' },
  goodEvening: { EN: 'Good evening', BN: 'শুভ সন্ধ্যা' },
  welcomeMessage: {
    EN: 'Welcome to your customer workspace. Track active orders, re-order daily essentials, and check your rewards!',
    BN: 'আপনার কাস্টমার ড্যাশবোর্ডে স্বাগতম। আপনার অর্ডার ট্র্যাক করুন, প্রয়োজনীয় পণ্য পুনরায় অর্ডার করুন এবং রিওয়ার্ড চেক করুন।',
  },
  residentMember: { EN: 'Marketplace Resident Member', BN: 'মার্কেটপ্লেস রেসিডেন্ট মেম্বার' },
  goldMember: { EN: 'GOLD LOYALTY MEMBER', BN: 'গোল্ড লয়ালটি মেম্বার' },

  // Checkout & Cart
  checkout: { EN: 'Checkout', BN: 'চেকআউট' },
  guestCheckout: { EN: 'Guest Express Checkout', BN: 'গেস্ট এক্সপ্রেস চেকআউট' },
  proceedToCheckout: { EN: 'Proceed to Checkout', BN: 'চেকআউট করুন' },
  deliveryAddress: { EN: 'Delivery Address', BN: 'ডেলিভারি ঠিকানা' },
  paymentMethod: { EN: 'Payment Method', BN: 'পেমেন্ট মেথড' },
  subtotal: { EN: 'Subtotal', BN: 'সাবটোটাল' },
  deliveryFee: { EN: 'Delivery Fee', BN: 'ডেলিভারি চার্জ' },
  freeDelivery: { EN: 'FREE Delivery', BN: 'ফ্রি ডেলিভারি' },
  totalAmount: { EN: 'Total Amount', BN: 'সর্বমোট' },
  placeOrder: { EN: 'Place Order Now', BN: 'অর্ডার সম্পন্ন করুন' },
  orderSuccess: { EN: 'Order Placed Successfully!', BN: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' },

  // Auth & Account
  login: { EN: 'Login', BN: 'লগইন' },
  register: { EN: 'Register', BN: 'রেজিস্ট্রেশন' },
  account: { EN: 'Account', BN: 'অ্যাকাউন্ট' },
  signOut: { EN: 'Sign Out', BN: 'লগআউট' },
  phone: { EN: 'Phone Number', BN: 'ফোন নম্বর' },
  password: { EN: 'Password', BN: 'পাসওয়ার্ড' },

  // Language Labels
  english: { EN: 'English', BN: 'ইংরেজি' },
  bangla: { EN: 'বাংলা', BN: 'বাংলা' },
};

export type TranslationKey = keyof typeof DICTIONARY;

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBn = language === 'BN';

  const t = (key: TranslationKey, fallback?: string): string => {
    const entry = DICTIONARY[key];
    if (entry) {
      return entry[language] || entry.EN || fallback || String(key);
    }
    return fallback || String(key);
  };

  return { t, isBn, language, setLanguage, toggleLanguage, mounted };
}
