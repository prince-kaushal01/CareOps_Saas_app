import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/StatusBadge";
import { api } from "../lib/api";

/* ---------------- TYPES ---------------- */

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  lastInteraction?: string;
  bookingsCount?: number;
  tags?: string[];
};

/* ---------------- COMPONENT ---------------- */

export function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] =
    useState("");
  const [selectedContact, setSelectedContact] =
    useState<Contact | null>(null);
  const [showCreateDialog, setShowCreateDialog] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateContact = async () => {
    try {
      await api.createContact(formData);

      setShowCreateDialog(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
      });

      await loadContacts();
    } catch (err) {
      console.error("Create failed:", err);
      alert("Failed to create contact");
    }
  };

  /* ---------------- LOAD CONTACTS ---------------- */

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await api.getContacts();
      setContacts(data || []);
    } catch (err) {
      console.error(
        "Failed to load contacts:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading contacts...
      </div>
    );
  }

  /* ---------------- SEARCH FILTER ---------------- */

  const filteredContacts = contacts.filter(
    (c) =>
      c.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">
            Contacts
          </h1>
          <p className="text-muted-foreground">
            Manage your customer relationships
          </p>
        </div>

        <Button
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>

      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Table */}
        <div className="col-span-12 lg:col-span-8 bg-card border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs">
                  Bookings
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredContacts.map(
                (contact) => (
                  <tr
                    key={contact.id}
                    onClick={() =>
                      setSelectedContact(
                        contact
                      )
                    }
                    className="cursor-pointer hover:bg-accent"
                  >
                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary text-sm">
                            {contact.name
                              ?.split(" ")
                              .map(
                                (n) => n[0]
                              )
                              .join("")}
                          </span>
                        </div>

                        <div>
                          <p className="font-medium">
                            {contact.name}
                          </p>

                          <div className="flex gap-1 mt-1">
                            {contact.tags?.map(
                              (tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded"
                                >
                                  {tag}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {contact.email}
                    </td>

                    <td className="px-6 py-4">
                      {contact.phone}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={
                          contact.status as any
                        }
                      />
                    </td>

                    <td className="px-6 py-4">
                      {
                        contact.bookingsCount
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Details Panel */}
        <div className="col-span-12 lg:col-span-4">
          {selectedContact ? (
            <div className="bg-card border rounded-xl p-6">
              <div className="flex justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {
                    selectedContact.name
                  }
                </h3>

                <button
                  onClick={() =>
                    setSelectedContact(
                      null
                    )
                  }
                >
                  <X />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <p>
                  <Mail className="inline h-4 w-4 mr-2" />
                  {
                    selectedContact.email
                  }
                </p>

                <p>
                  <Phone className="inline h-4 w-4 mr-2" />
                  {
                    selectedContact.phone
                  }
                </p>

                <p>
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Last interaction:{" "}
                  {
                    selectedContact.lastInteraction
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-xl p-6 text-center">
              Select a contact
            </div>
          )}
        </div>
      </div>
      {/* ---------------- CREATE CONTACT DIALOG ---------------- */}

      <Dialog.Root
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />

          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Add Contact
            </Dialog.Title>

            <div className="space-y-3">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />

              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
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

              <Button onClick={handleCreateContact}>
                Create Contact
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
