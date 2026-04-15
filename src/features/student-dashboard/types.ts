export type updateProfilePayload = {
    name?:string;
    email?:string;
    profileAvater?:string;
    location?:string;
    phoneNumber?:string;
  
}
export type Status = "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  status: Status;
  avatar: string;
  amount: string;
}

