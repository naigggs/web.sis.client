"use client"

import * as React from "react"

import { navMainSidebar } from "@/data/nav/nav-main-sidebar"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui"
import { NavMain } from "@/components/layouts/sidebar/nav/nav-main"
import { NavUser } from "@/components/layouts/sidebar/nav/nav-user"
import { LogoSidebar } from "@/components/layouts/sidebar/logo-sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoSidebar />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainSidebar} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
