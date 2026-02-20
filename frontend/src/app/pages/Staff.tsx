import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Mail,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/StatusBadge";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "../components/Input";
import { api } from "../lib/api";

/* ---------------- TYPES ---------------- */

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinedDate?: string;
  lastActive?: string;
  permissions?: string[];
};

/* ---------------- COMPONENT ---------------- */

export function Staff() {
  const [staff, setStaff] = useState<
    StaffMember[]
  >([]);
  const [loading, setLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [showInviteDialog, setShowInviteDialog] =
    useState(false);

  /* ---------------- LOAD STAFF ---------------- */

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await api.getStaff();
      setStaff(data || []);
    } catch (err) {
      console.error(
        "Failed to load staff:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading staff...
      </div>
    );
  }

  /* ---------------- DERIVED ---------------- */

  const filteredStaff = staff.filter(
    (s) =>
      s.name
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        ) ||
      s.email
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
  );

  const activeCount = staff.filter(
    (s) => s.status === "active"
  ).length;

  const inactiveCount = staff.filter(
    (s) => s.status === "inactive"
  ).length;

  const roles = [
    ...new Set(
      staff.map((s) => s.role)
    ),
  ];

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">
            Staff
          </h1>
          <p className="text-muted-foreground">
            Manage your team members
          </p>
        </div>

        <Button
          onClick={() =>
            setShowInviteDialog(true)
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Invite Team Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          label="Total Staff"
          value={staff.length}
          icon={UserCheck}
        />

        <StatCard
          label="Active"
          value={activeCount}
          icon={UserCheck}
        />

        <StatCard
          label="Inactive"
          value={inactiveCount}
          icon={UserX}
        />

        <StatCard
          label="Roles"
          value={roles.length}
          icon={Shield}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />

        <input
          type="text"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(
              e.target.value
            )
          }
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Staff Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-card border rounded-xl p-6"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="font-semibold">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {member.email}
                </p>
              </div>

              <StatusBadge
                status={
                  member.status as any
                }
              />
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <b>Role:</b>{" "}
                {member.role}
              </p>

              <p>
                <b>Joined:</b>{" "}
                {member.joinedDate ||
                  "-"}
              </p>

              <p>
                <b>Last Active:</b>{" "}
                {member.lastActive ||
                  "-"}
              </p>
            </div>

            {/* Permissions */}
            <div className="flex flex-wrap gap-1 mt-3">
              {member.permissions?.map(
                (p) => (
                  <span
                    key={p}
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                  >
                    {p}
                  </span>
                )
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                size="sm"
              >
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Dialog */}
      <Dialog.Root
        open={showInviteDialog}
        onOpenChange={
          setShowInviteDialog
        }
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />

          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Invite Team Member
            </Dialog.Title>

            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
              />

              <Input label="Name" />

              <Button
                onClick={() =>
                  setShowInviteDialog(
                    false
                  )
                }
                className="w-full"
              >
                Send Invite
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({
  label,
  value,
  icon: Icon,
}: any) {
  return (
    <div className="bg-card border rounded-xl p-6 flex justify-between">
      <div>
        <p className="text-sm text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-semibold">
          {value}
        </p>
      </div>

      <Icon className="h-5 w-5 text-primary" />
    </div>
  );
}
