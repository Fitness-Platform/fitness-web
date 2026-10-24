import {
  BookOpen,
  Dumbbell,
  LayoutDashboard,
  ListChecks,
  ShoppingBag,
  UsersRound,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

type AdminSidebarProps = {
  isMobileOpen: boolean;
  onClose: () => void;
};

const items = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Programs",
    to: "/admin/programs",
    icon: BookOpen,
  },
  {
    label: "Workouts",
    to: "/admin/workouts",
    icon: Dumbbell,
  },
  {
    label: "Exercises",
    icon: ListChecks,
  },
  {
    label: "Clients & Access",
    icon: UsersRound,
  },
  {
    label: "Purchases",
    icon: ShoppingBag,
  },
];

function SidebarContent({ onClose }: { onClose: () => void }) {
  const location = useLocation();

  return (
    <>
      <div className="border-b border-border px-6 py-8">
        <p className="text-xl font-medium uppercase leading-[1.05] tracking-[0.23em] text-foreground">
          Daniela
          <br />
          Brito
        </p>

        <p className="mt-2 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
          Strength for what's next
        </p>
      </div>

      <nav
        className="flex flex-col gap-1 px-3 py-6"
        aria-label="Admin navigation"
      >
        {items.map(({ label, icon: Icon, ...item }) => {
          if ("to" in item && item.to) {
            const isDashboardActive =
              label === "Dashboard" &&
              (location.pathname === "/admin" ||
                location.pathname === "/admin/");

            return (
              <NavLink
                key={label}
                to={item.to}
                end
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex min-h-11 items-center gap-3 px-4 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark",
                    isDashboardActive || isActive
                      ? "bg-primary-dark font-medium text-background"
                      : "text-muted-foreground hover:bg-border/30 hover:text-foreground",
                  ].join(" ")
                }
              >
                <Icon
                  className="h-[17px] w-[17px] shrink-0"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />

                <span>{label}</span>
              </NavLink>
            );
          }

          return (
            <div
              key={label}
              className="flex min-h-11 cursor-not-allowed items-center gap-3 px-4 text-sm text-muted-foreground/65"
              title="Available in a future task"
              aria-disabled="true"
            >
              <Icon
                className="h-[17px] w-[17px] shrink-0"
                strokeWidth={1.6}
                aria-hidden="true"
              />

              <span>{label}</span>

              <span className="ml-auto text-[9px] uppercase tracking-wider">
                Soon
              </span>
            </div>
          );
        })}
      </nav>
    </>
  );
}

function AdminSidebar({ isMobileOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-border bg-background lg:flex">
        <SidebarContent onClose={onClose} />
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-foreground/35"
            aria-label="Close admin navigation"
          />

          <aside className="relative flex h-full w-[min(18rem,85vw)] flex-col overflow-y-auto border-r border-border bg-background shadow-lg">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-5 flex h-10 w-10 items-center justify-center text-foreground"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
            </button>

            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
