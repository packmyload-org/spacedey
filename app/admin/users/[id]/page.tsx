import UserEditorPage from '@/components/admin/UserEditorPage';

export default async function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <UserEditorPage userId={id} />;
}
