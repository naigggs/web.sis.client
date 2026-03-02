"use client";

import * as React from "react";
import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react";
import { useTheme } from "next-themes";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <IconSun className="h-5 w-5" /> },
  { value: "dark", label: "Dark", icon: <IconMoon className="h-5 w-5" /> },
  {
    value: "system",
    label: "System",
    icon: <IconDeviceDesktop className="h-5 w-5" />,
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme as Theme) ?? "system";

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Customize your application preferences.
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Choose how the application looks for you.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Theme</p>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  disabled={!mounted}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                    "hover:bg-muted cursor-pointer",
                    currentTheme === value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
