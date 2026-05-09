import { notFound } from "next/navigation";
import { adminGetBookById } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";
import AdminBookEditClient from "./AdminBookEditClient";

interface AdminBookEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminBookEditPage({
  params,
}: AdminBookEditPageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (!Number.isFinite(bookId)) {
    notFound();
  }

  const token = await requireAccessToken(`/admin/books/${bookId}/edit`);
  const book = await adminGetBookById(bookId, token);

  return <AdminBookEditClient initialBook={book} />;
}