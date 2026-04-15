
import { getProfile } from "@/features/auth/services";
import ReviewDashboard from "@/features/review/ReviewDashboard";
import { getTutorReviews } from "@/features/tutor/services";




const ReviewPage = async () => {
  // const userData = await getProfile();
  // const tutorId = userData?.user?.data?.tutorProfile?.id;
  // const reviewsRes = tutorId ? await getTutorReviews(tutorId) : null;
  // const list = Array.isArray(reviewsRes?.data) ? reviewsRes.data : [];

  return <div>
    tutor reviews page - building 
     {/* <ReviewDashboard reviews={list} />; */}
  </div>
};









export default ReviewPage;
