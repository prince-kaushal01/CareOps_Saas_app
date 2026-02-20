import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  AlertTriangle,
  Package as PackageIcon,
  TrendingDown,
} from "lucide-react";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/StatusBadge";
import { cn } from "../lib/utils";
import { api } from "../lib/api";

/* ---------------- TYPES ---------------- */

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  available: number;
  threshold: number;
  status: "ok" | "low" | "critical";
  usagePerBooking?: number;
  lastRestocked?: string;
};

/* ---------------- COMPONENT ---------------- */

export function Inventory() {
  const [items, setItems] = useState<
    InventoryItem[]
  >([]);
  const [alerts, setAlerts] = useState<any>(
    null
  );
  const [loading, setLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    available: 0,
    threshold: 0,
    usage_per_booking: 0,
  });

  const handleCreateItem = async () => {
    try {
      await api.createInventoryItem(newItem);

      setShowCreate(false);

      setNewItem({
        name: "",
        category: "",
        available: 0,
        threshold: 0,
        usage_per_booking: 0,
      });

      loadInventory(); // refresh list
    } catch (err) {
      console.error("Create item failed:", err);
    }
  };
  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);

      const [itemsData, alertsData] =
        await Promise.all([
          api.getInventory(),
          api.getInventoryAlerts(),
        ]);

      setItems(itemsData || []);
      setAlerts(alertsData || null);
    } catch (err) {
      console.error(
        "Failed to load inventory:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading inventory...
      </div>
    );
  }

  /* ---------------- DERIVED DATA ---------------- */

  const filteredItems = items.filter(
    (item) =>
      item.name
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        ) ||
      item.category
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
  );

  const criticalItems = items.filter(
    (i) => i.status === "critical"
  ).length;

  const lowStockItems = items.filter(
    (i) => i.status === "low"
  ).length;

  const categories = [
    ...new Set(
      items.map((i) => i.category)
    ),
  ];

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">
            Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage your resources and supplies
          </p>
        </div>

        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Alert Banner */}
      {(criticalItems > 0 ||
        lowStockItems > 0) && (
          <div className="bg-destructive/10 border rounded-xl p-4 flex gap-3">
            <AlertTriangle className="text-destructive" />

            <div>
              <p className="font-medium text-destructive">
                Stock Alert
              </p>

              <p className="text-sm">
                {criticalItems > 0 &&
                  `${criticalItems} critical items. `}
                {lowStockItems > 0 &&
                  `${lowStockItems} low stock.`}
              </p>
            </div>
          </div>
        )}

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          label="Total Items"
          value={items.length}
          icon={PackageIcon}
        />

        <StatCard
          label="Critical"
          value={criticalItems}
          icon={AlertTriangle}
        />

        <StatCard
          label="Low Stock"
          value={lowStockItems}
          icon={TrendingDown}
        />

        <StatCard
          label="Categories"
          value={categories.length}
          icon={PackageIcon}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />

        <input
          type="text"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(
              e.target.value
            )
          }
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs">
                Available
              </th>
              <th className="px-6 py-3 text-left text-xs">
                Threshold
              </th>
              <th className="px-6 py-3 text-left text-xs">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs">
                Last Restocked
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map(
              (item) => (
                <tr
                  key={item.id}
                  className={cn(
                    "hover:bg-accent",
                    item.status ===
                    "critical" &&
                    "bg-destructive/5",
                    item.status ===
                    "low" &&
                    "bg-warning/5"
                  )}
                >
                  <td className="px-6 py-4">
                    {item.name}
                  </td>

                  <td className="px-6 py-4">
                    {item.category}
                  </td>

                  <td className="px-6 py-4">
                    {item.available}
                  </td>

                  <td className="px-6 py-4">
                    {item.threshold}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge
                      status={
                        item.status as any
                      }
                    />
                  </td>

                  <td className="px-6 py-4">
                    {item.usagePerBooking ||
                      0}
                  </td>

                  <td className="px-6 py-4">
                    {item.lastRestocked ||
                      "-"}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              Add Inventory Item
            </h2>

            {/* Name */}
            <input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* Category */}
            <input
              placeholder="Category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  category: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* Available */}
            <input
              type="number"
              placeholder="Available"
              value={newItem.available}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  available: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* Threshold */}
            <input
              type="number"
              placeholder="Threshold"
              value={newItem.threshold}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  threshold: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* Usage */}
            <input
              type="number"
              placeholder="Usage per booking"
              value={newItem.usage_per_booking}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  usage_per_booking: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreateItem}
                disabled={
                  !newItem.name ||
                  !newItem.category
                }
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SMALL STAT CARD ---------------- */

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
