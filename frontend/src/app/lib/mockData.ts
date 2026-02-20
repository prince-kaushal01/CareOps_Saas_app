// Mock data for the CareOps application

export const mockBookings = [
  {
    id: 1,
    customer: "Sarah Johnson",
    service: "Home Inspection",
    date: "2026-02-13",
    time: "10:00 AM",
    duration: "2h",
    status: "confirmed",
    location: "123 Main St, Springfield",
    customerEmail: "sarah.j@email.com",
    customerPhone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    customer: "Mike Peters",
    service: "Plumbing Repair",
    date: "2026-02-13",
    time: "2:00 PM",
    duration: "1h",
    status: "pending",
    location: "456 Oak Ave, Springfield",
    customerEmail: "mike.p@email.com",
    customerPhone: "+1 (555) 234-5678",
  },
  {
    id: 3,
    customer: "Emily Chen",
    service: "HVAC Service",
    date: "2026-02-14",
    time: "9:00 AM",
    duration: "3h",
    status: "confirmed",
    location: "789 Pine Rd, Springfield",
    customerEmail: "emily.c@email.com",
    customerPhone: "+1 (555) 345-6789",
  },
];

export const mockContacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    lastInteraction: "2 hours ago",
    bookingsCount: 5,
    tags: ["VIP", "Regular"],
    totalRevenue: 2450,
  },
  {
    id: 2,
    name: "Mike Peters",
    email: "mike.p@email.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    lastInteraction: "1 day ago",
    bookingsCount: 3,
    tags: ["New"],
    totalRevenue: 895,
  },
];

export const mockForms = [
  {
    id: 1,
    name: "Pre-Service Questionnaire",
    customer: "Sarah Johnson",
    booking: "Home Inspection - Feb 13",
    status: "completed",
    progress: 100,
    submittedAt: "2 hours ago",
    fields: 12,
    completedFields: 12,
  },
  {
    id: 2,
    name: "Customer Intake Form",
    customer: "Mike Peters",
    booking: "Plumbing Repair - Feb 13",
    status: "pending",
    progress: 60,
    submittedAt: null,
    fields: 10,
    completedFields: 6,
  },
];

export const mockInventory = [
  {
    id: 1,
    name: "Safety Gloves",
    category: "Safety Equipment",
    available: 15,
    threshold: 10,
    status: "normal",
    usagePerBooking: 2,
    lastRestocked: "3 days ago",
  },
  {
    id: 2,
    name: "Cleaning Solution",
    category: "Supplies",
    available: 5,
    threshold: 8,
    status: "low",
    usagePerBooking: 1,
    lastRestocked: "1 week ago",
  },
  {
    id: 3,
    name: "HVAC Filters",
    category: "Parts",
    available: 2,
    threshold: 5,
    status: "critical",
    usagePerBooking: 1,
    lastRestocked: "2 weeks ago",
  },
];

export const mockStaff = [
  {
    id: 1,
    name: "John Doe",
    email: "john@careops.com",
    role: "Admin",
    permissions: ["All Access", "User Management", "Settings"],
    status: "active",
    joinedDate: "Jan 2025",
    lastActive: "Just now",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@careops.com",
    role: "Technician",
    permissions: ["Bookings", "Inbox", "Forms"],
    status: "active",
    joinedDate: "Feb 2025",
    lastActive: "2 hours ago",
  },
];

export const mockConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    lastMessage: "Thanks! Looking forward to the appointment.",
    time: "2m ago",
    unread: 0,
    status: "active",
  },
  {
    id: 2,
    name: "Mike Peters",
    lastMessage: "Can we reschedule to next week?",
    time: "15m ago",
    unread: 2,
    status: "active",
  },
];

export const mockMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    text: "Hi! I'd like to schedule a home inspection.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    text: "Hello Sarah! I'd be happy to help. What dates work for you?",
    time: "10:32 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    text: "How about this Friday at 2 PM?",
    time: "10:35 AM",
    isMe: false,
  },
];
