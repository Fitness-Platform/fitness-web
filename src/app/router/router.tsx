import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../../features/auth/pages/LoginPage";
import RootPage from "../../routes/RootPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import AdminRoute from "../../features/auth/components/AdminRoute";
import ProtectedRoute from "../../features/auth/components/ProtectedRoute";
import MemberLayout from "../../features/member/layouts/MemberLayout";
import MemberCoachingPage from "../../features/member/pages/MemberCoachingPage";
import MemberGroupsPage from "../../features/member/pages/MemberGroupsPage";
import MemberHomePage from "../../features/member/pages/MemberHomePage";
import MemberProgramsPage from "../../features/member/pages/MemberProgramsPage";
import MemberProgramOverviewPage from "../../features/member/pages/MemberProgramOverviewPage";
import MemberWeekOverviewPage from "../../features/member/pages/MemberWeekOverviewPage";
import MemberWorkoutPage from "../../features/member/pages/MemberWorkoutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MemberLayout />,
        children: [
          {
            index: true,
            element: <MemberHomePage />,
          },
          {
            path: "programs",
            element: <MemberProgramsPage />,
          },
          {
            path: "programs/:programId",
            element: <MemberProgramOverviewPage />,
          },
          {
            path: "groups",
            element: <MemberGroupsPage />,
          },
          {
            path: "coaching",
            element: <MemberCoachingPage />,
          },
          {
            path: "programs/:programId/weeks/:weekId",
            element: <MemberWeekOverviewPage />,
          },
          {
            path: "programs/:programId/weeks/:weekId/workouts/:programWeekWorkoutId",
            element: <MemberWorkoutPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        index: true,
        element: <p>Admin area</p>,
      },
    ],
  },
]);
