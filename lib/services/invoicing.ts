import { DataSource } from 'typeorm';
import Invoice, { InvoiceStatus } from '../db/entities/Invoice';
import Payment from '../db/entities/Payment';
import Booking from '../db/entities/Booking';

interface InvoiceGenerationOptions {
    bookingId?: string;
    amount?: number;
}

export async function generateInvoice(
    dataSource: DataSource,
    payment: Payment,
    options: InvoiceGenerationOptions = {}
): Promise<Invoice> {
    const invoiceRepo = dataSource.getRepository(Invoice);
    const bookingRepo = dataSource.getRepository(Booking);
    const targetBookingId = options.bookingId || payment.booking.id;
    const paymentAmount = Number(options.amount ?? payment.amount);

    // 1. Fetch full booking details for line items
    const booking = await bookingRepo.findOne({
        where: { id: targetBookingId },
        relations: ['site', 'unitType', 'user']
    });

    if (!booking) throw new Error("Booking not found for invoice generation");

    // 2. Generate Invoice Number
    const count = await invoiceRepo.count();
    const year = new Date().getFullYear();
    const invoiceNumber = `INV-${year}-${(count + 1).toString().padStart(5, '0')}`;

    // 3. Prepare Line Items for Incremental Payment
    // Since it's an installment, the invoice describes the 'Payment Installment'
    const items = [
        {
            description: `Payment Installment for Storage Unit: ${booking.unitType.name} at ${booking.site.name}`,
            qty: 1,
            unitPrice: paymentAmount,
            total: paymentAmount
        }
    ];

    // 4. Create Invoice
    const invoice = invoiceRepo.create({
        invoiceNumber,
        booking,
        user: booking.user,
        payment,
        items,
        subtotal: paymentAmount,
        tax: 0,
        total: paymentAmount,
        currency: payment.currency,
        status: InvoiceStatus.PAID,
        dueDate: new Date(),
        paidAt: new Date()
    });

    return await invoiceRepo.save(invoice);
}
