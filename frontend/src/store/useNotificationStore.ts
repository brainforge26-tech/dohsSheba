import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'DELIVERY' | 'PAYMENTS' | 'OFFERS' | 'REFUNDS' | 'SYSTEM' | 'BOOKING';
  link?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Order #ORD-9945 Out for Delivery',
    desc: 'Rider Tariqul Rahman has left the hub with your package.',
    time: '10 mins ago',
    read: false,
    type: 'DELIVERY',
    link: '/dashboard/orders/track?id=ORD-9945',
  },
  {
    id: 'n2',
    title: 'Payment Confirmed (৳1,850)',
    desc: 'Transaction #TRX99482716 processed successfully via bKash.',
    time: '2 hours ago',
    read: false,
    type: 'PAYMENTS',
    link: '/dashboard/orders',
  },
  {
    id: 'n3',
    title: 'Special DOHS Weekend Coupon',
    desc: 'Use coupon code DOHS100 to get ৳100 off on orders above ৳1000!',
    time: '1 day ago',
    read: true,
    type: 'OFFERS',
    link: '/offers',
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: DEFAULT_NOTIFICATIONS,
      addNotification: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              time: 'Just now',
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: 'dohssheba-notifications',
    }
  )
);
