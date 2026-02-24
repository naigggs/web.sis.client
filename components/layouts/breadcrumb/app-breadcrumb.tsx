"use client"

import { usePathname } from "next/navigation"

import { navMainSidebar } from "@/data/nav/nav-main-sidebar"
import { navProjects } from "@/data/nav/nav-projects"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui"

export function AppBreadcrumb() {
  const pathname = usePathname()

  let currentGroup
  let currentItem

  for (const group of navMainSidebar) {
    const item = group.items.find(
      (item) => pathname === item.url || pathname.startsWith(`${item.url}/`),
    )
    if (item) {
      currentGroup = group
      currentItem = item
      break
    }

    for (const subItem of group.items) {
      if ((subItem as any).items && Array.isArray((subItem as any).items)) {
        const nestedItem = (subItem as any).items.find(
          (i: { url: string; title: string }) =>
            pathname === i.url || pathname.startsWith(`${i.url}/`),
        )
        if (nestedItem) {
          currentGroup = group
          currentItem = nestedItem
          break
        }
      }
    }
  }

  if (!currentItem) {
    return null
  }

  const allProjects = navProjects.flatMap((group) => group.items)
  // Find project that matches the start of the current path
  const project = allProjects.find((p) => pathname.startsWith(p.url))
  const isBlueprint = pathname.endsWith("/blueprint")

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {currentGroup?.title && (
          <>
            <BreadcrumbItem className="hidden md:block">
              <span className="text-muted-foreground font-medium">{currentGroup.title}</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbLink href={currentItem.url}>{currentItem.title}</BreadcrumbLink>
        </BreadcrumbItem>
        {project && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isBlueprint ? (
                <BreadcrumbLink href={project.url}>{project.name}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{project.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {isBlueprint && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Blueprint</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
