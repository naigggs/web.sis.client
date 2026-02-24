"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") ?? "/dashboard"

  const [loginMethod, setLoginMethod] = React.useState<"email" | "phone">("email")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [showOTP, setShowOTP] = React.useState(false)
  const [otpValue, setOtpValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSwitchMethod = () => {
    setLoginMethod(loginMethod === "email" ? "phone" : "email")
    setShowOTP(false)
    setError(null)
    setOtpValue("")
  }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (loginMethod === "email") {
      // Email + password: login directly, no OTP step
      setIsLoading(true)
      try {
        await signIn({ email, password })
        router.push(redirectTo)
      } catch (err: any) {
        setError(err?.message ?? "Login failed. Please check your credentials.")
      } finally {
        setIsLoading(false)
      }
    } else {
      // Phone: show OTP step
      setShowOTP(true)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await signIn({ phoneNumber, otp: otpValue })
      router.push(redirectTo)
    } catch (err: any) {
      setError(err?.message ?? "Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {!showOTP ? (
        <form onSubmit={handleContinue}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground text-sm">
                Log in to your account with your email or phone number.
              </p>
            </div>

            {loginMethod === "email" && (
              <>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </Field>
                {email.length > 0 && (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </Field>
                )}
              </>
            )}

            {loginMethod === "phone" && (
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </Field>
            )}

            {error && <p className="text-destructive text-center text-sm">{error}</p>}

            <Field>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Please wait…" : "Continue"}
              </Button>
            </Field>

            <div className="-mt-4 text-center">
              <Button
                type="button"
                variant="link"
                className="underline"
                onClick={handleSwitchMethod}
              >
                {loginMethod === "email" ? "Login via phone number" : "Login via email"}
              </Button>
            </div>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </FieldGroup>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-lg font-semibold">Verify Code</h2>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit code sent to <strong>{phoneNumber}</strong>.
              </p>
            </div>

            <div className="flex justify-center py-2">
              <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && <p className="text-destructive text-center text-sm">{error}</p>}

            <Field>
              <Button type="submit" className="w-full" disabled={isLoading || otpValue.length < 6}>
                {isLoading ? "Verifying…" : "Verify & Continue"}
              </Button>
            </Field>

            <div className="-mt-4 flex flex-col items-center gap-1">
              <Button type="button" variant="link" className="text-xs underline">
                Resend code
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground text-xs"
                onClick={() => {
                  setShowOTP(false)
                  setOtpValue("")
                  setError(null)
                }}
              >
                Change phone number
              </Button>
            </div>
          </FieldGroup>
        </form>
      )}
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our <span className="font-bold">Terms of Service</span>{" "}
        and <span className="font-bold">Privacy Policy</span>.
      </FieldDescription>
    </div>
  )
}
