import { DataSource } from 'typeorm';
import Invoice, { InvoiceStatus } from '../db/entities/Invoice';
import Payment from '../db/entities/Payment';
import Booking from '../db/entities/Booking';

export async function generateInvoice(dataSource: DataSource, payment: Payment): Promise<Invoice> {
    const invoiceRepo = dataSource.getRepository(Invoice);
    const bookingRepo = dataSource.getRepository(Booking);

    // 1. Fetch full booking details for line items
    const booking = await bookingRepo.findOne({
        where: { id: payment.booking.id },
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
            unitPrice: Number(payment.amount),
            total: Number(payment.amount)
        }
    ];

    // 4. Create Invoice
    const invoice = invoiceRepo.create({
        invoiceNumber,
        booking,
        user: booking.user,
        payment,
        items,
        subtotal: Number(payment.amount),
        tax: 0,
        total: Number(payment.amount),
        currency: payment.currency,
        status: InvoiceStatus.PAID,
        dueDate: new Date(),
        paidAt: new Date()
    });

    return await invoiceRepo.save(invoice);
}
