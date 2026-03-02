import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh">
      {/* Left — branding panel */}
      <div className="relative hidden overflow-hidden bg-primary px-12 py-10 text-primary-foreground lg:flex lg:flex-1 lg:flex-col lg:justify-between">
        {/* subtle campus-inspired pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%,rgba(255,255,255,.2),transparent 28%),radial-gradient(circle at 85% 15%,rgba(255,255,255,.14),transparent 32%),linear-gradient(135deg,rgba(255,255,255,.08),transparent 55%)",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary-foreground/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 size-80 rounded-full bg-emerald-200/20 blur-3xl" />
        {/* top logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
            <Image
              src="/logo/logo.png"
              alt="EduNest Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold">EduNest</p>
            <p className="text-xs text-primary-foreground/70">
              School Information System
            </p>
          </div>
        </div>

        {/* centre tagline */}
        <div className="relative space-y-4">
          <h1 className="text-4xl font-bold leading-snug">
            Your academic journey,
            <br />
            organized.
          </h1>
          <p className="max-w-sm text-primary-foreground/75 leading-relaxed">
            A modern, friendly campus workspace for students, staff, and
            administrators to manage enrollment, grades, courses, and more.
          </p>
        </div>

        {/* bottom attribution */}
        <p className="relative text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} School Information System
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16 bg-background">
        {/* mobile logo (shown only on small screens) */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <Image
            src="/logo/logo.png"
            alt="EduNest Logo"
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
          <div className="leading-tight">
            <p className="text-base font-semibold">EduNest</p>
            <p className="text-xs text-muted-foreground">
              School Information System
            </p>
          </div>
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
