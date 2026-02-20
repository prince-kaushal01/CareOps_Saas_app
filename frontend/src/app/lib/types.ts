// Type definitions for CareOps application

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
export type ContactStatus = "active" | "inactive";
export type FormStatus = "pending" | "completed" | "overdue";
export type InventoryStatus = "normal" | "low" | "critical";
export type StaffStatus = "active" | "inactive";

export interface Booking {
  id: number;
  customer: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  status: BookingStatus;
  location: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: ContactStatus;
  lastInteraction: string;
  bookingsCount: number;
  tags: string[];
  totalRevenue?: number;
}

export interface Form {
  id: number;
  name: string;
  customer: string;
  booking: string;
  status: FormStatus;
  progress: number;
  submittedAt: string | null;
  fields: number;
  completedFields: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  available: number;
  threshold: number;
  status: InventoryStatus;
  usagePerBooking: number;
  lastRestocked: string;
}

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: StaffStatus;
  joinedDate: string;
  lastActive: string;
}

export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: string;
}

export interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}
