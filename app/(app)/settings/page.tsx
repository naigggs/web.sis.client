"use client";

import * as React from "react";
import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react";

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

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) ?? "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
  localStorage.setItem("theme", theme);
}

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
  const [theme, setTheme] = React.useState<Theme>("system");

  React.useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const handleThemeChange = (next: Theme) => {
    setTheme(next);
    applyTheme(next);
  };

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
                  onClick={() => handleThemeChange(value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                    "hover:bg-muted cursor-pointer",
                    theme === value
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
