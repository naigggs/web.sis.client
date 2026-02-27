import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh">
      {/* Left — branding panel */}
      <div className="relative hidden lg:flex lg:flex-1 flex-col justify-between bg-primary px-12 py-10 text-primary-foreground overflow-hidden">
        {/* subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.3) 39px,rgba(255,255,255,.3) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.3) 39px,rgba(255,255,255,.3) 40px)",
          }}
        />
        {/* top logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
            <Image
              src="/logo/logo.png"
              alt="SIS Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold">SIS Portal</p>
            <p className="text-xs text-primary-foreground/70">
              School Information System
            </p>
          </div>
        </div>

        {/* centre tagline */}
        <div className="relative space-y-4">
          <h1 className="text-4xl font-bold leading-snug">
            Manage academics
            <br />
            with confidence.
          </h1>
          <p className="max-w-sm text-primary-foreground/75 leading-relaxed">
            A unified portal for students, staff, and administrators to track
            enrollment, grades, courses, and more — all in one place.
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
            alt="SIS Logo"
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
          <div className="leading-tight">
            <p className="text-base font-semibold">SIS Portal</p>
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
