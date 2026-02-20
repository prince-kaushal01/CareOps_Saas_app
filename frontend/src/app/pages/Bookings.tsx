import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/StatusBadge";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "../components/Input";
import { api } from "../lib/api";

/* ---------------- TYPES ---------------- */

type Booking = {
  id: string;
  customer: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  status: string;
  location: string;
};

/* ---------------- COMPONENT ---------------- */

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [showCreateDialog, setShowCreateDialog] =
    useState(false);
  const [formData, setFormData] = useState({
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  service: "",
  date: "",
  time: "",
  duration: "",
  location: "",
  notes: "",
});
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleCreateBooking = async () => {
  try {
    await api.createBooking(formData);

    setShowCreateDialog(false);

    // reset form
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      service: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      notes: "",
    });

    await loadBookings();
  } catch (err) {
    console.error("Create failed:", err);
    alert("Failed to create booking");
  }
};



  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
      setBookings(data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this booking?")) return;

    try {
      await api.deleteBooking(id);
      await loadBookings();
    } catch {
      alert("Failed to delete booking");
    }
  };

  if (loading) {
    return <div className="p-8">Loading bookings...</div>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">
            Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage appointments and schedules
          </p>
        </div>

        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={view === "list" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
          >
            List
          </Button>

          <Button
            variant={view === "calendar" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            Calendar
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {view === "calendar" && (
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Calendar
            </h3>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm">
                Today
              </Button>
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Calendar view coming from API data.
          </p>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="grid gap-4">
          {bookings.length === 0 && (
            <p className="text-muted-foreground">
              No bookings found
            </p>
          )}

          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() =>
                setSelectedBooking(booking)
              }
              className="bg-card border rounded-xl p-5 cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">
                    {booking.customer}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {booking.service}
                  </p>

                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(
                        booking.date
                      ).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {booking.time}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {booking.location}
                    </span>
                  </div>
                </div>

                <StatusBadge
                  status={booking.status as any}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog.Root
        open={!!selectedBooking}
        onOpenChange={(open) =>
          !open && setSelectedBooking(null)
        }
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />

          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-xl p-6 w-full max-w-lg">
            {selectedBooking && (
              <>
                <Dialog.Title className="text-xl font-semibold mb-4">
                  Booking Details
                </Dialog.Title>

                <div className="space-y-2">
                  <p>
                    <b>Customer:</b>{" "}
                    {selectedBooking.customer}
                  </p>
                  <p>
                    <b>Service:</b>{" "}
                    {selectedBooking.service}
                  </p>
                  <p>
                    <b>Date:</b>{" "}
                    {selectedBooking.date}
                  </p>
                  <p>
                    <b>Time:</b>{" "}
                    {selectedBooking.time}
                  </p>
                  <p>
                    <b>Location:</b>{" "}
                    {selectedBooking.location}
                  </p>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDelete(
                        selectedBooking.id
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {/* ---------------- CREATE BOOKING DIALOG ---------------- */}

<Dialog.Root
  open={showCreateDialog}
  onOpenChange={setShowCreateDialog}
>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />

    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <Dialog.Title className="text-xl font-semibold mb-4">
        New Booking
      </Dialog.Title>

      <div className="space-y-3">
        <Input
          name="customer_name"
          placeholder="Customer Name"
          value={formData.customer_name}
          onChange={handleChange}
        />

        <Input
          name="customer_email"
          placeholder="Customer Email"
          value={formData.customer_email}
          onChange={handleChange}
        />

        <Input
          name="customer_phone"
          placeholder="Customer Phone"
          value={formData.customer_phone}
          onChange={handleChange}
        />

        <Input
          name="service"
          placeholder="Service"
          value={formData.service}
          onChange={handleChange}
        />

        <Input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />

        <Input
          name="time"
          placeholder="Time (10:00 AM)"
          value={formData.time}
          onChange={handleChange}
        />

        <Input
          name="duration"
          placeholder="Duration (60 min)"
          value={formData.duration}
          onChange={handleChange}
        />

        <Input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />

        <Input
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2 mt-6">
        <Button
          variant="secondary"
          onClick={() =>
            setShowCreateDialog(false)
          }
        >
          Cancel
        </Button>

        <Button onClick={handleCreateBooking}>
          Create Booking
        </Button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

    </div>
  );
}
