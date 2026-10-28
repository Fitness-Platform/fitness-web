import { useLocation } from 'react-router-dom'
import { authDestination, programReturnTo } from '../../public/utils/programDestination'
import AuthLayout from '../components/AuthLayout'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  const returnTo = programReturnTo(useLocation().search)
  return (
    <AuthLayout title="Create your account" description="Start your journey with Daniela." alternative="Already have an account?" linkText="Sign in" linkTo={authDestination('/login', returnTo)}>
      <RegisterForm />
    </AuthLayout>
  )
}
