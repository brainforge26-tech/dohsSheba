import { BookingDetails, ServiceItem } from '@/types/service';
import { FEATURED_SERVICES } from '@/constants/services';

export class BookingService {
  static async createBooking(details: Omit<BookingDetails, 'totalPrice'>): Promise<{
    bookingNo: string;
    totalPrice: number;
    status: string;
  }> {
    const service = FEATURED_SERVICES.find((s) => s.id === details.serviceId) || FEATURED_SERVICES[0];
    const addonsTotal = (details.selectedAddons || []).reduce((sum, a) => sum + a.price, 0);
    const totalPrice = service.price + addonsTotal;

    const bookingNo = '#DOHS-BS-' + Math.floor(1000 + Math.random() * 9000);

    return {
      bookingNo,
      totalPrice,
      status: 'ACCEPTED',
    };
  }

  static async getBookingsByCustomer(customerId: string) {
    return [
      {
        id: '#DOHS-BS-8891',
        serviceTitle: 'AC Jet Cleaning & Master Servicing',
        providerName: 'Apex Climate Care Ltd.',
        date: 'Today, 3:00 PM - 5:00 PM',
        status: 'ACCEPTED',
        totalPrice: 1200,
        address: 'House 42, Road 7, DOHS Mohakhali, Dhaka',
      },
    ];
  }

  static async getBookingsByProvider(providerId: string) {
    return [
      {
        id: '#DOHS-BS-8891',
        serviceTitle: 'AC Jet Cleaning & Master Servicing',
        customerName: 'Lt Col (Retd) Tariq Ahmed',
        phone: '+880 1711-223344',
        time: 'Today, 3:00 PM',
        location: 'House 42, Road 7, Mohakhali DOHS',
        totalPrice: 1200,
        status: 'PENDING',
      },
    ];
  }
}
