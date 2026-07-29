import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface CustomerOrder {
  id: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  seller: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  estDelivery: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

interface OrderState {
  orders: CustomerOrder[];
  addOrder: (order: CustomerOrder) => void;
  updateOrderStatus: (id: string, status: CustomerOrder['status']) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (newOrder) =>
        set((state) => ({
          orders: [newOrder, ...state.orders.filter((o) => o.id !== newOrder.id)],
        })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id.toUpperCase() === id.toUpperCase() ? { ...o, status } : o
          ),
        })),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'dohssheba-customer-orders',
    }
  )
);
