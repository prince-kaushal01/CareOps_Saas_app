import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/StatusBadge";
import * as Progress from "@radix-ui/react-progress";
import { api } from "../lib/api";

/* ---------------- TYPES ---------------- */

type FormItem = {
  id: string;
  name: string;
  customer?: string;
  booking?: string;
  status: "completed" | "pending" | "overdue";
  completedFields?: number;
  fields?: number;
  submittedAt?: string;
  progress?: number;
};

type FormTemplate = {
  id: string;
  name: string;
  usage: number;
};

/* ---------------- COMPONENT ---------------- */

export function Forms() {
  const [forms, setForms] = useState<
    FormItem[]
  >([]);

  const [templates, setTemplates] =
    useState<FormTemplate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [newForm, setNewForm] = useState({
  name: "",
  customerName: "",
  bookingId: "",
});
  const handleCreateForm = async () => {
    try {
      await api.createForm(newForm);

      setShowCreate(false);

      setNewForm({
        name: "",
        customerName: "",
        bookingId: "",
      });

      loadForms(); // refresh list
    } catch (err) {
      console.error("Create form failed:", err);
    }
  };
  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);

      const [formsData, templateData] =
        await Promise.all([
          api.getForms(),
          api.getFormTemplates?.() ??
          [],
        ]);

      setForms(formsData || []);
      setTemplates(templateData || []);
    } catch (err) {
      console.error(
        "Failed to load forms:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading forms...
      </div>
    );
  }

  /* ---------------- FILTER ---------------- */

  const filteredForms = forms.filter(
    (f) =>
      f.name
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        ) ||
      f.customer
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
  );

  const completedCount =
    forms.filter(
      (f) => f.status === "completed"
    ).length;

  const pendingCount =
    forms.filter(
      (f) => f.status === "pending"
    ).length;

  const overdueCount =
    forms.filter(
      (f) => f.status === "overdue"
    ).length;

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">
            Forms
          </h1>
          <p className="text-muted-foreground">
            Track form submissions
          </p>
        </div>

        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          label="Total"
          value={forms.length}
        />
        <StatCard
          label="Completed"
          value={completedCount}
        />
        <StatCard
          label="Pending"
          value={pendingCount}
        />
        <StatCard
          label="Overdue"
          value={overdueCount}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />

        <input
          type="text"
          placeholder="Search forms..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(
              e.target.value
            )
          }
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Forms List */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {filteredForms.map((form) => {
            const progress =
              form.progress ?? 0;

            return (
              <div
                key={form.id}
                className="bg-card border rounded-xl p-6"
              >
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">
                      {form.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {form.customer} •{" "}
                      {form.booking}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <StatusBadge
                      status={
                        form.status as any
                      }
                    />

                    {form.status ===
                      "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                  </div>
                </div>

                {/* Progress */}
                <Progress.Root className="h-2 bg-secondary rounded-full overflow-hidden">
                  <Progress.Indicator
                    className="h-full"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </Progress.Root>
              </div>
            );
          })}
        </div>

        {/* Templates Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">
              Templates
            </h3>

            <div className="space-y-3">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between p-3 border rounded-lg"
                >
                  <span>{t.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {t.usage} uses
                  </span>
                </div>
              ))}

              {templates.length ===
                0 && (
                  <p className="text-sm text-muted-foreground">
                    No templates
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
      {showCreate && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
      <h2 className="text-lg font-semibold">
        Create New Form
      </h2>

      {/* Name */}
      <input
        type="text"
        placeholder="Form Name"
        value={newForm.name}
        onChange={(e) =>
          setNewForm({
            ...newForm,
            name: e.target.value,
          })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Customer */}
      <input
        type="text"
        placeholder="Customer"
        value={newForm.customerName}
        onChange={(e) =>
          setNewForm({
            ...newForm,
            customerName: e.target.value,
          })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Booking */}
      <input
        type="text"
        placeholder="Booking"
        value={newForm.bookingId}
        onChange={(e) =>
          setNewForm({
            ...newForm,
            bookingId: e.target.value,
          })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          onClick={() =>
            setShowCreate(false)
          }
        >
          Cancel
        </Button>

        <Button onClick={handleCreateForm}>
          Create
        </Button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({
  label,
  value,
}: any) {
  return (
    <div className="bg-card border rounded-xl p-6">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}
