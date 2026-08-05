import { redirect } from 'next/navigation';

export default async function ShoppingCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  redirect(`/category/${encodeURIComponent(category)}`);
}
