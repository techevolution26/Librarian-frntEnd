import { notFound } from "next/navigation";
import { getBookById } from "@/lib/api";
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

  const book = await getBookById(bookId);

  return <AdminBookEditClient initialBook={book} />;
}