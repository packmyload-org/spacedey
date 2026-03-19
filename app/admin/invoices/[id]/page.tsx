import InvoiceDetailsPage from '@/components/admin/InvoiceDetailsPage';

export default async function AdminInvoiceDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <InvoiceDetailsPage invoiceId={id} />;
}
