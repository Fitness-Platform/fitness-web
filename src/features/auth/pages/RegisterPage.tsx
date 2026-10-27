import AuthLayout from '../components/AuthLayout'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account" description="Start your journey with Daniela." alternative="Already have an account?" linkText="Sign in" linkTo="/login">
      <RegisterForm />
    </AuthLayout>
  )
}
