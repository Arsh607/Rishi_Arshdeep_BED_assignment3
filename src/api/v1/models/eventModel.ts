export type EventCategory = "conference" | "workshop" | "meetup" | "seminar" | "general";
export type EventStatus = "active" | "cancelled" | "completed";

export interface Event {
  id: string; 
  name: string;
  date: string; 
  capacity: number;
  registrationCount: number;
  status: EventStatus;
  category: EventCategory;
  createdAt: string; 
  updatedAt: string; 
}
