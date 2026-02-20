import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/Dashboard";
import { Inbox } from "./pages/Inbox";
import { Bookings } from "./pages/Bookings";
import { Contacts } from "./pages/Contacts";
import { Forms } from "./pages/Forms";
import { Inventory } from "./pages/Inventory";
import { Staff } from "./pages/Staff";
import { Settings } from "./pages/Settings";
import { Onboarding } from "./pages/Onboarding";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { index: true, Component: Login },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/app",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "dashboard", Component: Dashboard },
      { path: "inbox", Component: Inbox },
      { path: "bookings", Component: Bookings },
      { path: "contacts", Component: Contacts },
      { path: "forms", Component: Forms },
      { path: "inventory", Component: Inventory },
      { path: "staff", Component: Staff },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);