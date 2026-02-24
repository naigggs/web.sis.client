"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui"

export function NavProjects({
  projects,
}: {
  projects: {
    title?: string
    items: {
      name: string
      url: string
      icon: React.ElementType
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <React.Fragment>
      {projects.map((group, index) => (
        <SidebarGroup key={group.title ?? index} className="group-data-[collapsible=icon]:hidden">
          {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="data-[active=true]:text-muted data-[active=true]:bg-sidebar-foreground h-fit"
                >
                  <Link href={item.url} className="flex flex-col items-start">
                    <div className="flex flex-row gap-2 leading-none">
                      <item.icon />
                      <span className="line-clamp-1 font-medium">{item.name}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </React.Fragment>
  )
}
