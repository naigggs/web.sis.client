"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui";
import { data, type NavRole } from "@/data/sidebar/data";
import { useAuth } from "@/hooks/use-auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const filteredNav = React.useMemo(() => {
    if (!user) return [];
    return data.navMain.filter((item) =>
      item.roles.includes(user.role as NavRole),
    );
  }, [user]);

  const navUser = React.useMemo(() => {
    if (!user) return data.user;
    const namePart = user.email.split("@")[0] ?? user.email;
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    return {
      name: displayName,
      email: user.email,
      avatar: "/avatars/shadcn.jpg",
    };
  }, [user]);

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                  <Image
                    src="/logo/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">SIS</span>
                  <span className="truncate text-xs">
                    School Information System
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNav} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
