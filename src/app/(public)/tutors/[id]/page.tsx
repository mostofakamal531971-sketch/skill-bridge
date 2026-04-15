import { getProfile } from "@/features/auth/services";
import PublicTutorProfile from "@/features/public-pages/TutorProfileDetails";

const API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default async function TutorPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
 

  

  return (
    <div>
      tutor profile page
      {/* <PublicTutorProfile data={data} student={userInfo} /> */}
    </div>
  );
}
