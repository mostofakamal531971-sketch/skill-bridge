import { StringToBoolean } from "class-variance-authority/types";

export type Category = {
  id: string;
  name: string;
  subjects: string[];
}

export type TutorListItem = {
  id: string;
  name: string;
  avgRating:number
  email: string;
  profileAvater: string | null;
  role: string;
    location: string;
  phoneNumber: number;
  status: string;
  createdAt: string;
  tutorProfile: {
    hourlyRate: number;
    subjects: string[];
    category: string;
    experience: string;
    bookings:{
      review:{
        rating:number
      }
    }[]

  };
}
export type tutorProfileType = {
  name: string;
  email: string;
  profileAvater: string
  location: string;
  phoneNumber: string;
  tutorProfile: {
    bio: string;
    category: string;
    categoryId: string;
    hourlyRate: number;
    subjects: string[];
    experience: string;

  }
}

export type updateTutorProfilePayload = {
  user: { name: string ;  location: string;
  phoneNumber: string;}
  bio: string;
  category: string;
  experience: string;
  categoryId: string;
  hourlyRate: number;
  subjects: string[];
}
export type StudentBooking = {
  id: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  dateTime: string;      // ISO string
  createdAt: string;     // ISO string
  student:{
    name:string;
    profileAvater:string
  }
  availability: {
    date: string;        // ISO string
    startTime: string;   // "10:00"
    endTime: string;     // "11:00"
  };

  tutor: {
    hourlyRate: number;
    subjects: string[];
    category: string;
    id: string
    user: {
      id: string;
      name: string;
      profileAvater: string | null;
    };
  };

  review: {
    rating: number;
    comment: string;
  } | null;
};


export type addAvailabilityPayload = {
  date: Date;
  startTime: string | undefined;
  endTime: string | undefined;
}
