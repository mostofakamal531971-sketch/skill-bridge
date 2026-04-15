import BookingClientView from "@/features/student-dashboard/components/booking-client-view";
import { getBookingDetails } from "@/features/student-dashboard/services";


export default async function BookingDetailPage({ params }: { params: { id: string } }) {

  const { id } = await params;
  
  const booking = await getBookingDetails(id);
console.log(booking);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-medium text-zinc-500">Booking not found</h1>
      </div>
    );
  }

  return <BookingClientView booking={booking} />;
}