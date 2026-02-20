import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import * as Switch from "@radix-ui/react-switch";
import { Building2, MessageSquare, Calendar, FileText, Package, Plug, Save } from "lucide-react";

export function Settings() {
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your workspace preferences</p>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex gap-2 border-b border-border overflow-x-auto">
          {[
            { id: "workspace", label: "Workspace", icon: Building2 },
            { id: "communication", label: "Communication", icon: MessageSquare },
            { id: "bookings", label: "Booking Types", icon: Calendar },
            { id: "forms", label: "Forms", icon: FileText },
            { id: "inventory", label: "Inventory", icon: Package },
            { id: "integrations", label: "Integrations", icon: Plug },
          ].map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors whitespace-nowrap"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Workspace Tab */}
        <Tabs.Content value="workspace" className="py-6">
          <div className="max-w-2xl space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">General Information</h3>
              <div className="space-y-4">
                <Input label="Business Name" defaultValue="CareOps Services" />
                <Input label="Industry" defaultValue="Home Services" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" defaultValue="+1 (555) 000-0000" />
                  <Input label="Team Size" type="number" defaultValue="12" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Time Zone</label>
                  <select className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>America/New_York (EST)</option>
                    <option>America/Chicago (CST)</option>
                    <option>America/Denver (MST)</option>
                    <option>America/Los_Angeles (PST)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Business Hours</h3>
              <div className="space-y-3">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24">
                      <span className="text-sm text-foreground">{day}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        defaultValue="09:00"
                        className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <span className="text-muted-foreground">to</span>
                      <input
                        type="time"
                        defaultValue="17:00"
                        className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <Switch.Root
                      defaultChecked={day !== "Sunday"}
                      className="w-11 h-6 bg-input rounded-full relative data-[state=checked]:bg-primary transition-colors"
                    >
                      <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
                    </Switch.Root>
                  </div>
                ))}
              </div>
            </div>

            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Tabs.Content>

        {/* Communication Tab */}
        <Tabs.Content value="communication" className="py-6">
          <div className="max-w-2xl space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Email Settings</h3>
              <div className="space-y-4">
                <Input label="Support Email" type="email" defaultValue="support@careops.com" />
                <Input label="Reply-To Email" type="email" defaultValue="noreply@careops.com" />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive email for new bookings</p>
                  </div>
                  <Switch.Root
                    defaultChecked
                    className="w-11 h-6 bg-input rounded-full relative data-[state=checked]:bg-primary transition-colors"
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">SMS Settings</h3>
              <div className="space-y-4">
                <Input label="SMS Phone Number" defaultValue="+1 (555) 000-0000" />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">SMS Reminders</p>
                    <p className="text-xs text-muted-foreground">Send reminders 24h before booking</p>
                  </div>
                  <Switch.Root
                    defaultChecked
                    className="w-11 h-6 bg-input rounded-full relative data-[state=checked]:bg-primary transition-colors"
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Confirmation Messages</p>
                    <p className="text-xs text-muted-foreground">Auto-send booking confirmations</p>
                  </div>
                  <Switch.Root
                    defaultChecked
                    className="w-11 h-6 bg-input rounded-full relative data-[state=checked]:bg-primary transition-colors"
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                </div>
              </div>
            </div>

            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Tabs.Content>

        {/* Booking Types Tab */}
        <Tabs.Content value="bookings" className="py-6">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Configure your service types</p>
              <Button size="sm">Add Service Type</Button>
            </div>

            {[
              { name: "Home Inspection", duration: 120, price: 150 },
              { name: "Plumbing Repair", duration: 60, price: 95 },
              { name: "HVAC Service", duration: 180, price: 200 },
            ].map((service) => (
              <div key={service.name} className="bg-card border border-border rounded-xl p-6">
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Service Name" defaultValue={service.name} />
                  <Input label="Duration (min)" type="number" defaultValue={service.duration} />
                  <Input label="Price ($)" type="number" defaultValue={service.price} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="secondary" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>
            ))}

            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Tabs.Content>

        {/* Forms Tab */}
        <Tabs.Content value="forms" className="py-6">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Manage form templates</p>
              <Button size="sm">Create Template</Button>
            </div>

            {["Pre-Service Questionnaire", "Customer Intake", "Post-Service Feedback"].map((form) => (
              <div key={form} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-foreground">{form}</h4>
                    <p className="text-sm text-muted-foreground mt-1">12 fields • Used 45 times</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Duplicate</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>

        {/* Inventory Tab */}
        <Tabs.Content value="inventory" className="py-6">
          <div className="max-w-2xl space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Inventory Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Low Stock Alerts</p>
                    <p className="text-xs text-muted-foreground">Get notified when items are low</p>
                  </div>
                  <Switch.Root
                    defaultChecked
                    className="w-11 h-6 bg-input rounded-full relative data-[state=checked]:bg-primary transition-colors"
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto-deduct on Booking</p>
                    <p className="text-xs text-muted-foreground">Reduce stock when booking created</p>
                  </div>
                  <Switch.Root
                    defaultChecked
                    className="w-11 h-6 bg-input rounded-full relative data-[state=checked]:bg-primary transition-colors"
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                </div>
                <Input
                  label="Default Low Stock Threshold"
                  type="number"
                  defaultValue="5"
                  placeholder="5"
                />
              </div>
            </div>

            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Tabs.Content>

        {/* Integrations Tab */}
        <Tabs.Content value="integrations" className="py-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm text-muted-foreground mb-4">Connect external services</p>

            {[
              { name: "Google Calendar", description: "Sync bookings with Google Calendar", connected: true },
              { name: "Stripe", description: "Accept payments online", connected: true },
              { name: "Twilio", description: "Send SMS notifications", connected: false },
              { name: "Zapier", description: "Automate workflows", connected: false },
            ].map((integration) => (
              <div key={integration.name} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Plug className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-foreground">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{integration.description}</p>
                    </div>
                  </div>
                  <Button variant={integration.connected ? "secondary" : "primary"} size="sm">
                    {integration.connected ? "Connected" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
