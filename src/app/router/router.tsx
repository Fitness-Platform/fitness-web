import AdminClientsAccessPage from "../../features/admin/pages/AdminClientsAccessPage";
import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../../features/auth/pages/ResetPasswordPage';
import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../../features/auth/pages/LoginPage";
import RootPage from "../../routes/RootPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import AdminRoute from "../../features/auth/components/AdminRoute";
import ProtectedRoute from "../../features/auth/components/ProtectedRoute";
import AdminLayout from "../../features/admin/layouts/AdminLayout";
import AdminDashboardPage from "../../features/admin/pages/AdminDashboardPage";
import MemberLayout from "../../features/member/layouts/MemberLayout";
import MemberCoachingPage from "../../features/member/pages/MemberCoachingPage";
import MemberGroupsPage from "../../features/member/pages/MemberGroupsPage";
import MemberHomePage from "../../features/member/pages/MemberHomePage";
import MemberProgramsPage from "../../features/member/pages/MemberProgramsPage";
import MemberProgramOverviewPage from "../../features/member/pages/MemberProgramOverviewPage";
import MemberWeekOverviewPage from "../../features/member/pages/MemberWeekOverviewPage";
import MemberWorkoutPage from "../../features/member/pages/MemberWorkoutPage";
import AdminProgramsPage from "../../features/admin/pages/AdminProgramsPage";
import AdminProgramDetailPage from "../../features/admin/pages/AdminProgramDetailPage";
import AdminWorkoutsPage from "../../features/admin/pages/AdminWorkoutsPage";
import AdminWorkoutDetailPage from "../../features/admin/pages/AdminWorkoutDetailPage";
import AdminExercisesPage from "../../features/admin/pages/AdminExercisesPage";
import AdminExerciseDetailPage from "../../features/admin/pages/AdminExerciseDetailPage";

export const router = createBrowserRouter([
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
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
          { index: true, element: <MemberHomePage /> },
          { path: "programs", element: <MemberProgramsPage /> },
          {
            path: "programs/:programId",
            element: <MemberProgramOverviewPage />,
          },
          { path: "groups", element: <MemberGroupsPage /> },
          { path: "coaching", element: <MemberCoachingPage /> },
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
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: "clients-access",
            element: <AdminClientsAccessPage />,
          },
          {
            path: "programs",
            element: <AdminProgramsPage />,
          },
          {
            path: "programs",
            element: <AdminProgramsPage />,
          },
          {
            path: "programs/:programId",
            element: <AdminProgramDetailPage />,
          },
          {
            path: "workouts",
            element: <AdminWorkoutsPage />,
          },
          {
            path: "workouts",
            element: <AdminWorkoutsPage />,
          },
          {
            path: "workouts/:workoutId",
            element: <AdminWorkoutDetailPage />,
          },
          {
            path: "exercises",
            element: <AdminExercisesPage />,
          },
          {
            path: "exercises/:exerciseId",
            element: <AdminExerciseDetailPage />,
          },
        ],
      },
    ],
  },
]);
