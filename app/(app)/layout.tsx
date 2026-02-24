import { SidebarProvider } from "@/providers/sidebar-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { SidebarInset } from "@/components/ui";
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
import { SiteHeader } from "@/components/layouts/sidebar/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ReactQueryProvider>
  );
}
