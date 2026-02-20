// src/app/lib/api.ts

// 🔧 CHANGE THIS LINE to match your backend URL
const API_URL = "http://localhost:8000";
// For production: const API_URL = "https://your-backend-url.com";

// Helper functions
const getAuthToken = () => localStorage.getItem("access_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

// Main API object
export const api = {
  // ========== AUTHENTICATION ==========
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to get user");
    return res.json();
  },

  // ========== BOOKINGS ==========
  getBookings: async () => {
    const res = await fetch(`${API_URL}/bookings`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  createBooking: async (bookingData: any) => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error("Failed to create booking");
    return res.json();
  },

  updateBooking: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update booking");
    return res.json();
  },

  deleteBooking: async (id: string) => {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete booking");
    return res.json();
  },

  // ========== CONTACTS ==========
  getContacts: async () => {
    const res = await fetch(`${API_URL}/contacts`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch contacts");
    return res.json();
  },

  createContact: async (contactData: any) => {
    const res = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(contactData),
    });
    if (!res.ok) throw new Error("Failed to create contact");
    return res.json();
  },

  updateContact: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/contacts/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update contact");
    return res.json();
  },

  deleteContact: async (id: string) => {
    const res = await fetch(`${API_URL}/contacts/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete contact");
    return res.json();
  },

  // ========== INVENTORY ==========
  getInventory: async () => {
    const res = await fetch(`${API_URL}/inventory`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch inventory");
    return res.json();
  },

  getInventoryAlerts: async () => {
    const res = await fetch(`${API_URL}/inventory/alerts`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch alerts");
    return res.json();
  },

  async createInventoryItem(data: {
  name: string;
  category: string;
  available: number;
  threshold: number;
  usage_per_booking?: number;
}) {
  const res = await fetch(`${API_URL}/inventory`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create item");
  }

  return res.json();
},

  updateInventoryItem: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/inventory/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update item");
    return res.json();
  },

  // ========== STAFF ==========
  getStaff: async () => {
    const res = await fetch(`${API_URL}/staff`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch staff");
    return res.json();
  },

  createStaff: async (staffData: any) => {
    const res = await fetch(`${API_URL}/staff`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(staffData),
    });
    if (!res.ok) throw new Error("Failed to create staff");
    return res.json();
  },

  updateStaff: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/staff/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update staff");
    return res.json();
  },

  // ========== FORMS ==========
  getForms: async () => {
    const res = await fetch(`${API_URL}/forms`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch forms");
    return res.json();
  },

  // async getForms() {
  //   const res = await fetch("/api/forms");
  //   return res.json();
  // },

  async createForm(data: {
    name: string;
    customer_name?: string;
    booking_id?: string;
  }) {
    const res = await fetch(`${API_URL}/forms`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Failed to create form");
    }

    return res.json();
  },
  updateForm: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/forms/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update form");
    return res.json();
  },

  // ========== ANALYTICS ==========
  getDashboardStats: async () => {
    const res = await fetch(`${API_URL}/analytics/dashboard`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },

  getRevenueStats: async () => {
    const res = await fetch(`${API_URL}/analytics/revenue`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch revenue");
    return res.json();
  },
  // ========== INBOX / MESSAGES ==========

  getConversations: async () => {
    const res = await fetch(`${API_URL}/inbox/conversations`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return res.json();
  },

  getMessages: async (conversationId: string) => {
    const res = await fetch(
      `${API_URL}/inbox/messages/${conversationId}`,
      {
        headers: authHeaders(),
      }
    );
    if (!res.ok) throw new Error("Failed to fetch messages");
    return res.json();
  },

  sendMessage: async (data: {
    conversationId: string;
    text: string;
  }) => {
    const res = await fetch(`${API_URL}/inbox/messages`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        conversation_id: data.conversationId,
        text: data.text,
      }),
    });

    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  },

};