import { Suspense } from "react"
import { LoginForm } from "@/components/pages/login/_form/login-form"

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
