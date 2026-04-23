import {
  getAcceptedConnections,
  getCircle,
  getCircleBooks,
  getCircleMembers,
  getCircleProgress,
  getSelectableLibraryBooks,
} from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";
import CirclePageClient from "./CirclePageClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CirclePage({ params }: Props) {
  const { id } = await params;
  const circleId = Number(id);
  const token = await requireAccessToken(`/circles/${circleId}`);

  const [
    circle,
    members,
    books,
    progress,
    acceptedConnections,
    selectableBooks,
  ] = await Promise.all([
    getCircle(circleId, token),
    getCircleMembers(circleId, token),
    getCircleBooks(circleId, token),
    getCircleProgress(circleId, token),
    getAcceptedConnections(token),
    getSelectableLibraryBooks(token),
  ]);

  return (
    <CirclePageClient
      circle={circle}
      members={members}
      books={books}
      progress={progress}
      acceptedConnections={acceptedConnections}
      selectableBooks={selectableBooks}
    />
  );
}