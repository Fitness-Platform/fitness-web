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
    label: "Workout Library",
    to: "/admin/workouts",
    icon: Dumbbell,
  },
  {
    label: "Exercise Library",
    to: "/admin/exercises",
    icon: ListChecks,
  },
  {
    label: "Clients & Access",
    to: "/admin/clients-access",
    icon: UsersRound,
  },
  {
    label: "Purchases",
    to: "/admin/purchases",
    icon: ShoppingBag,
  },
];

function SidebarContent({ onClose }: { onClose: () => void }) {
  const location = useLocation();

  return (
    <>
      <div className="border-b border-white/10 px-6 py-8">
        <p className="text-xl font-medium uppercase leading-[1.05] tracking-[0.23em] text-[#F7F5F0]">
          Daniela
          <br />
          Brito
        </p>

        <p className="mt-2 text-[8px] uppercase tracking-[0.18em] text-[#F7F5F0]/70">
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
                end={item.to === "/admin"}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex min-h-11 items-center gap-3 rounded-[5px] border-l-2 px-4 text-sm transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7F5F0]",
                    isDashboardActive || isActive
                      ? "border-[#F7F5F0]/80 bg-[var(--admin-navigation-active)] font-semibold text-[#F7F5F0]"
                      : "border-transparent text-[#F7F5F0]/85 hover:bg-white/10 hover:text-[#F7F5F0]",
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
            </div>
          );
        })}
      </nav>
      <div className="mx-5 mt-auto flex items-center gap-3 border-t border-white/15 py-6 text-[#F7F5F0]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F7F5F0] text-xs font-semibold text-[var(--admin-navigation)]">
          DB
        </span>
        <div>
          <p className="text-sm font-medium">Daniela Brito</p>
          <p className="mt-1 text-xs text-[#F7F5F0]/70">Administrator</p>
        </div>
      </div>
    </>
  );
}

function AdminSidebar({ isMobileOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-[var(--admin-navigation)] lg:flex">
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

          <aside className="relative flex h-full w-[min(18rem,85vw)] flex-col overflow-y-auto border-r border-white/10 bg-[var(--admin-navigation)] shadow-lg">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-5 flex h-10 w-10 items-center justify-center text-[#F7F5F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F7F5F0]"
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
