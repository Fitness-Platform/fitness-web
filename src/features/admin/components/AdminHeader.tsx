import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthSession } from "../../auth/hooks/useAuthSession";
import { useLogoutMutation } from "../../auth/hooks/useLogoutMutation";

type AdminHeaderProps = {
  onOpenMenu: () => void;
};

function AdminHeader({ onOpenMenu }: AdminHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuthSession();
  const logoutMutation = useLogoutMutation();

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const pageTitle = location.pathname.startsWith("/admin/purchases")
  ? "Purchases"
  : location.pathname.startsWith("/admin/clients-access")
  ? "Clients & Access"
  : location.pathname.startsWith("/admin/programs")
  ? "Programs"
  : location.pathname.startsWith("/admin/workouts")
    ? "Workouts"
    : "Dashboard";

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      setIsAccountOpen(false);
      navigate("/login");
    } catch {
      // The mutation error is displayed inside the account menu.
    }
  }

  return (
    <header className="relative z-30 border-b border-border bg-background">
      <div className="grid h-[72px] grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-2 px-5 sm:px-8 lg:flex lg:justify-between lg:px-10">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-10 w-10 items-center justify-start lg:hidden"
          aria-label="Open admin navigation"
        >
          <Menu className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
        </button>

        <div className="min-w-0 text-center lg:text-left">
          <p className="text-[11px] uppercase tracking-[0.22em] text-foreground lg:hidden">
            Daniela Brito
          </p>

          <p className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:block">
            {pageTitle}
          </p>

          <p className="mt-0.5 text-[7px] uppercase tracking-[0.15em] text-muted-foreground lg:hidden">
            Strength for what's next
          </p>
        </div>

        <div className="relative justify-self-end lg:ml-auto">
          <button
            type="button"
            onClick={() => setIsAccountOpen((open) => !open)}
            aria-label="Open administrator account menu"
            aria-expanded={isAccountOpen}
            aria-haspopup="menu"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark"
          >
            <span className="hidden text-right lg:block">
              <span className="block text-xs font-medium text-foreground">
                Daniela Brito
              </span>

              <span className="mt-0.5 block text-[10px] text-muted-foreground">
                Administrator
              </span>
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary-dark">
              DB
            </span>
          </button>

          {isAccountOpen && (
            <div
              className="absolute right-0 top-12 z-40 w-64 border border-border bg-background p-4 shadow-sm"
              role="menu"
            >
              <p className="text-sm font-medium text-foreground">
                Daniela Brito
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Administrator
              </p>

              {user?.email && (
                <p className="mt-3 break-all border-t border-border pt-3 text-xs text-muted-foreground">
                  {user.email}
                </p>
              )}

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="mt-3 flex min-h-10 w-full items-center gap-2 border-t border-border pt-3 text-left text-sm text-foreground transition hover:text-primary-dark disabled:opacity-50"
              >
                <LogOut
                  className="h-4 w-4"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                {logoutMutation.isPending ? "Signing out..." : "Sign out"}
              </button>

              {logoutMutation.isError && (
                <p role="alert" className="mt-2 text-xs text-red-700">
                  Unable to sign out. Please try again.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
