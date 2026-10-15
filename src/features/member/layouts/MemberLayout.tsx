import { Outlet } from 'react-router-dom'

import MemberHeader from '../components/MemberHeader'
import MemberNavigation from '../components/MemberNavigation'

function MemberLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MemberHeader />

      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-6 sm:px-8 lg:px-10 lg:pb-10 lg:pt-8">
        <Outlet />
      </main>

      <MemberNavigation />
    </div>
  )
}

export default MemberLayout