"use client"

import Image from "next/image"

import { Badge, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui"

export function LogoSidebar() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent"
        >
          <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
            <Image
              src="/logo/logo-aduportal.png"
              alt="ADU Portal Logo"
              width={32}
              height={32}
              className="size-10"
            />
          </div>
          <div className="flex flex-col text-left text-sm leading-tight">
            <div className="flex flex-row items-center gap-2">
              <span className="truncate font-bold">Portal</span>
              <Badge variant="outline" className="h-4.5 px-1.5 text-[0.6rem] font-medium uppercase">
                Plus
              </Badge>
            </div>
            <div className="text-muted-foreground text-xs">
              <span className="truncate">Accessory Dwelling Unit</span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
