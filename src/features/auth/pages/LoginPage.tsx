import AuthLayout from '../components/AuthLayout'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" description="Sign in to access your programs and workouts." alternative="New here?" linkText="Create an account" linkTo="/register">
      <LoginForm />
    </AuthLayout>
  )
}
