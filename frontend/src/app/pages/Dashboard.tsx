import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { MetricCard } from "../components/MetricCard";
import { StatusBadge } from "../components/StatusBadge";
import {
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  /* ---------------- SAFE FALLBACKS ---------------- */

  const bookingTrend = stats?.booking_trend || [];
  const completionData = stats?.completion_data || [];
  const alerts = stats?.alerts || [];
  const recentBookings = stats?.recent_bookings || [];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Bookings"
          value={stats?.total_bookings || 0}
          change="+8% from yesterday"
          changeType="increase"
          icon={Calendar}
        />

        <MetricCard
          title="Pending Bookings"
          value={stats?.pending_bookings || 0}
          change="Live data"
          changeType="neutral"
          icon={Clock}
        />

        <MetricCard
          title="Total Revenue"
          value={`$${stats?.total_revenue || 0}`}
          change="Live revenue"
          changeType="increase"
          icon={TrendingUp}
        />

        <MetricCard
          title="Active Staff"
          value={stats?.active_staff || 0}
          change="Currently working"
          changeType="increase"
          icon={CheckCircle}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trend */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            Booking Trend
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#6366f1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            Form Completion
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {completionData.map((entry: any, index: number) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Key Alerts
            </h3>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>

          <div className="space-y-3">
            {alerts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No alerts 🎉
              </p>
            )}

            {alerts.map((alert: any) => (
              <div
                key={alert.id}
                className="p-3 border rounded-lg"
              >
                <p className="font-medium">
                  {alert.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {alert.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Today's Schedule
            </h3>
            <Calendar className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-3">
            {recentBookings.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No bookings today
              </p>
            )}

            {recentBookings.map((booking: any) => (
              <div
                key={booking.id}
                className="flex justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {booking.customer}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.service}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span>{booking.time}</span>
                  <StatusBadge
                    status={booking.status}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
