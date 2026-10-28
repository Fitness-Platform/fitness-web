import { useLocation } from 'react-router-dom'
import { authDestination, programReturnTo } from '../../public/utils/programDestination'
import AuthLayout from '../components/AuthLayout'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  const returnTo = programReturnTo(useLocation().search)
  return (
    <AuthLayout title="Welcome back" description="Sign in to access your programs and workouts." alternative="New here?" linkText="Create an account" linkTo={authDestination('/register', returnTo)}>
      <LoginForm />
    </AuthLayout>
  )
}
