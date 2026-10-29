import {
  Dumbbell,
  Home,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

const memberLinks = [
  {
    to: '/app',
    label: 'Home',
    icon: Home,
    end: true,
  },
  {
    to: '/app/programs',
    label: 'Programs',
    icon: Dumbbell,
    end: false,
  },
]

function MemberNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Member navigation"
    >
      <div className="grid h-[72px] grid-cols-2">
        {memberLinks.map(
          ({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'relative flex min-w-0 flex-col',
                  'items-center justify-center gap-1',
                  'px-1 pt-1 text-[10px] transition',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-inset',
                  'focus-visible:ring-primary-dark',
                  isActive
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-1 h-0.5 w-6 -translate-x-1/2 bg-primary-dark"
                    />
                  )}

                  <Icon
                    className="h-5 w-5"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ),
        )}
      </div>
    </nav>
  )
}

export default MemberNavigation