import { LoginForm } from "@/components/login-form"

export default function HomePage() {
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <LoginForm />
    </div>
  )
}
