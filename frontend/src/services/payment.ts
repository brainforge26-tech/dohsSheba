export type PaymentMethodType = 'bkash' | 'nagad' | 'card' | 'cod';

export interface ProcessPaymentParams {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  customerPhone?: string;
}

export class PaymentService {
  static async processPayment(params: ProcessPaymentParams): Promise<{
    transactionId: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    paymentMethod: PaymentMethodType;
    gatewayUrl?: string;
  }> {
    if (params.paymentMethod === 'cod') {
      return {
        transactionId: 'TXN_COD_' + Date.now(),
        status: 'SUCCESS',
        paymentMethod: 'cod',
      };
    }

    if (params.paymentMethod === 'bkash' || params.paymentMethod === 'nagad') {
      return {
        transactionId: 'TXN_MFS_' + Math.floor(1000000 + Math.random() * 9000000),
        status: 'SUCCESS',
        paymentMethod: params.paymentMethod,
        gatewayUrl: `https://sandbox.sslcommerz.com/gwprocess/v4/api.php?method=${params.paymentMethod}`,
      };
    }

    return {
      transactionId: 'TXN_CARD_' + Date.now(),
      status: 'SUCCESS',
      paymentMethod: 'card',
      gatewayUrl: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
    };
  }
}
