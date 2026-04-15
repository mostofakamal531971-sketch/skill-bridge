import { getProfile } from "@/features/auth/services";
import PublicTutorProfile from "@/features/public-pages/TutorProfileDetails";

const API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default async function TutorPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userData = await getProfile();

  const res = await fetch(`${API_BASE}/api/tutors/${id}`, { cache: "no-store" });
  const json = await res.json();
  const data = json?.data ?? json;

  const userInfo = {
    role: userData?.user?.data?.role ?? "GUEST",
    id: userData?.user?.data?.id ?? "NULL",
  };

  return (
    <div>
      <PublicTutorProfile data={data} student={userInfo} />
    </div>
  );
}
