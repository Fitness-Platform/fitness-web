import { LogOut, UserRound } from 'lucide-react'
import { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuthSession } from '../../auth/hooks/useAuthSession'
import { useLogoutMutation } from '../../auth/hooks/useLogoutMutation'

function getDesktopLinkClassName({
  isActive,
}: {
  isActive: boolean
}) {
  return isActive
    ? 'text-sm text-foreground'
    : 'text-sm text-muted-foreground transition hover:text-foreground'
}

function MemberHeader() {
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const logoutMutation = useLogoutMutation()

  const accountButton = useRef<HTMLButtonElement>(null)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync()

      setIsAccountMenuOpen(false)
      navigate('/login')
    } catch {
      // Mutation state renders the error feedback below.
    }
  }

  return (
    <header className="relative border-b border-border bg-background">
      <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[40px_1fr_40px] items-center px-5 sm:px-8 lg:h-20 lg:grid-cols-[auto_1fr_auto] lg:px-10">
        {/* Mobile balance spacer */}
        <div
          className="h-10 w-10 lg:hidden"
          aria-hidden="true"
        />

        {/* Brand */}
        <div className="text-center lg:text-left">
          <p className="text-sm font-normal uppercase tracking-[0.28em] sm:text-base">
            Daniela Brito
          </p>

          <p className="mt-0.5 hidden text-[8px] font-normal uppercase tracking-[0.2em] text-muted-foreground sm:block">
            Strength for what's next
          </p>
        </div>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center justify-self-center gap-8 lg:flex"
          aria-label="Member navigation"
        >
          <NavLink
            to="/app"
            end
            className={getDesktopLinkClassName}
          >
            Home
          </NavLink>

          <NavLink
            to="/app/programs"
            className={getDesktopLinkClassName}
          >
            Programs
          </NavLink>
        </nav>

        {/* Account */}
        <div className="relative justify-self-end" onKeyDown={(event) => {
          if (event.key === 'Escape' && isAccountMenuOpen) {
            setIsAccountMenuOpen(false)
            accountButton.current?.focus()
          }
        }}>
          <button
            ref={accountButton}
            type="button"
            onClick={() =>
              setIsAccountMenuOpen((current) => !current)
            }
            className="flex h-10 w-10 items-center justify-end"
            aria-label="Open account menu"
            aria-expanded={isAccountMenuOpen}
            aria-haspopup="menu"
          >
            <UserRound
              className="h-5 w-5"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>

          {isAccountMenuOpen && (
            <div
              className="absolute right-0 top-12 z-50 w-64 border border-border bg-background p-4 shadow-sm"
              role="menu"
            >
              <div className="border-b border-border pb-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Account
                </p>

                <p className="mt-2 truncate text-sm text-foreground">
                  {user?.email}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="mt-3 flex w-full items-center gap-2 py-2 text-left text-sm text-foreground transition hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                role="menuitem"
              >
                <LogOut
                  className="h-4 w-4"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                {logoutMutation.isPending
                  ? 'Signing out...'
                  : 'Sign out'}
              </button>

              {logoutMutation.isError && (
                <p
                  role="alert"
                  className="mt-2 text-xs text-red-700"
                >
                  Unable to sign out.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default MemberHeader