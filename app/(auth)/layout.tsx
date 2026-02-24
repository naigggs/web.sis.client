import Link from "next/link"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex w-full items-center px-8 py-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/logo.png"
            alt="ADU Portal"
            width={40}
            height={40}
            className="size-9 rounded-full object-contain mr-2"
          />
          <div className="flex flex-col">
            <span className="text-xl font-semibold">SIS Portal</span>
            <p className="text-muted-foreground -mt-1 text-xs">School Information System</p>
          </div>
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
        {children}
      </main>
    </div>
  )
}
