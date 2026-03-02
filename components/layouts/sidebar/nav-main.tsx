"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui";
import { type NavMainItem } from "@/data/sidebar/data";

const GROUP_LABELS: Record<NavMainItem["group"], string> = {
  overview: "Overview",
  academic: "Academic",
  management: "Management",
  personal: "Personal",
};

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = usePathname();

  function isActive(url: string) {
    return pathname === url || pathname.startsWith(url + "/");
  }

  return (
    <>
      {(Object.keys(GROUP_LABELS) as NavMainItem["group"][]).map((group) => {
        const groupItems = items.filter((item) => item.group === group);
        if (!groupItems.length) return null;

        return (
          <SidebarGroup key={group}>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider">
              {GROUP_LABELS[group]}
            </SidebarGroupLabel>
            <SidebarMenu>
              {groupItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <Collapsible key={item.title} asChild defaultOpen={active}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className={
                          active
                            ? "border-l-2 border-primary bg-primary/10 pl-[calc(var(--spacing)*2-2px)]"
                            : ""
                        }
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.items?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRight />
                              <span className="sr-only">Toggle</span>
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                  >
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </>
  );
}
