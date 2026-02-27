"use client";

import * as React from "react";
import { toast } from "sonner";
import { IconLoader2, IconShieldLock, IconUser } from "@tabler/icons-react";

import { useAuth } from "@/hooks/use-auth";
import { usePatchUser } from "@/hooks/api/user/use-patch-user";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  Input,
  Separator,
} from "@/components/ui";

export default function AccountPage() {
  const { user } = useAuth();
  const { mutate: patchUser, isPending } = usePatchUser();

  const [email, setEmail] = React.useState(user?.email ?? "");
  const [passwords, setPasswords] = React.useState({
    password: "",
    confirmPassword: "",
  });

  // Keep email in sync if user loads after mount
  React.useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  const handleEmailSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }
    patchUser(
      { userId: user.id, payload: { email: email.trim() } },
      {
        onSuccess: () => toast.success("Email updated successfully."),
        onError: () => toast.error("Failed to update email."),
      },
    );
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!passwords.password) {
      toast.error("Password cannot be empty.");
      return;
    }
    if (passwords.password !== passwords.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    patchUser(
      { userId: user.id, payload: { password: passwords.password } },
      {
        onSuccess: () => {
          toast.success("Password updated successfully.");
          setPasswords({ password: "", confirmPassword: "" });
        },
        onError: () => toast.error("Failed to update password."),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Account</h1>
          {user?.role && (
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your account credentials.
        </p>
      </div>

      {/* Email */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <IconUser className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>Email Address</CardTitle>
            <CardDescription>Update your login email address.</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <form onSubmit={handleEmailSave} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="acct-email">Email</FieldLabel>
              <Input
                id="acct-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </Field>
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={isPending || email === user?.email}
              >
                {isPending && <IconLoader2 className="h-4 w-4 animate-spin" />}
                Save Email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <IconShieldLock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your account password.</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="acct-password">New Password</FieldLabel>
              <Input
                id="acct-password"
                type="password"
                value={passwords.password}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="acct-confirm">Confirm Password</FieldLabel>
              <Input
                id="acct-confirm"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
            </Field>
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !passwords.password}
              >
                {isPending && <IconLoader2 className="h-4 w-4 animate-spin" />}
                Save Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
