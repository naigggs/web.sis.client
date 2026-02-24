"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconChevronRight } from "@tabler/icons-react"

import { useSidebar } from "@/hooks/use-sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui"

export function NavMain({
  items,
}: {
  items: {
    title?: string
    items: {
      title: string
      url: string
      icon?: React.ElementType
      isActive?: boolean
      items?: {
        title: string
        url: string
      }[]
    }[]
  }[]
}) {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <>
      {items.map((group, index) => (
        <React.Fragment key={group.title ?? index}>
          {index > 0 && state === "collapsed" && <SidebarSeparator />}
          <SidebarGroup>
            {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = item.url === pathname || pathname.startsWith(`${item.url}/`)
                const isGroupActive = item.items?.some(
                  (subItem) => pathname === subItem.url || pathname.startsWith(`${subItem.url}/`),
                )

                return item.items && item.items.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isGroupActive || item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isGroupActive}
                          className="data-[active=true]:bg-black data-[active=true]:text-white"
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={
                                  subItem.url === pathname || pathname.startsWith(`${subItem.url}/`)
                                }
                                className="data-[active=true]:bg-black data-[active=true]:text-white"
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="data-[active=true]:bg-black data-[active=true]:text-white"
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </React.Fragment>
      ))}
    </>
  )
}
