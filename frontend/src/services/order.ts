import { CartItem } from '@/types/shopping';

export interface CreateOrderParams {
  customerId: string;
  items: CartItem[];
  address: string;
  phone: string;
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'cod';
  couponCode?: string;
}

export class OrderService {
  static async createOrder(params: CreateOrderParams) {
    const subtotal = params.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let discount = 0;
    if (params.couponCode?.toUpperCase() === 'DOHS20') {
      discount = Math.round(subtotal * 0.2);
    }

    const deliveryFee = subtotal > 500 ? 0 : 50;
    const totalAmount = Math.max(0, subtotal - discount + deliveryFee);
    const orderNo = '#DOHS-ORD-' + Math.floor(1000 + Math.random() * 9000);

    return {
      orderNo,
      subtotal,
      discount,
      deliveryFee,
      totalAmount,
      status: 'PROCESSING',
      estimatedDelivery: '45 Minutes (Express DOHS)',
    };
  }

  static async getOrdersByCustomer(customerId: string) {
    return [
      {
        orderNo: '#DOHS-ORD-9942',
        date: 'Today, 11:20 AM',
        itemsCount: 3,
        totalAmount: 515,
        status: 'DELIVERED',
      },
    ];
  }
}
