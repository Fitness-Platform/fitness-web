import {
  Dumbbell,
  Home,
  MessagesSquare,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

function getNavLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    'flex flex-col items-center justify-center gap-1 transition',
    isActive
      ? 'text-foreground'
      : 'text-muted-foreground hover:text-foreground',
  ].join(' ')
}

function MemberNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background lg:hidden"
      aria-label="Member navigation"
    >
      <div className="grid h-[72px] grid-cols-4">
        <NavLink
          to="/app"
          end
          className={getNavLinkClassName}
        >
          <Home
            className="h-5 w-5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <span className="text-[10px]">Home</span>
        </NavLink>

        <NavLink
          to="/app/programs"
          className={getNavLinkClassName}
        >
          <Dumbbell
            className="h-5 w-5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <span className="text-[10px]">Programs</span>
        </NavLink>

        <NavLink
          to="/app/groups"
          className={getNavLinkClassName}
        >
          <Users
            className="h-5 w-5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <span className="text-[10px]">Groups</span>
        </NavLink>

        <NavLink
          to="/app/coaching"
          className={getNavLinkClassName}
        >
          <MessagesSquare
            className="h-5 w-5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <span className="text-[10px]">Coaching</span>
        </NavLink>
      </div>
    </nav>
  )
}

export default MemberNavigation