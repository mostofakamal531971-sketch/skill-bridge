export type  Review  ={
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  bookingId: string;
  student: {
    name: string;
    profileAvater: string | null;
  };
}
