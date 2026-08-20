"use client"

import { ChevronsUpDown, LogOut } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({ user }: { user: { email: string } }) {
  const { isMobile } = useSidebar()
  const initial = user.email.slice(0, 1).toUpperCase() || "?"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              >
                <Avatar size="sm" className="rounded-lg">
                  <AvatarFallback className="rounded-lg bg-[rgba(128,21,232,0.10)] text-xs font-semibold text-[var(--purple-primary)]">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-ink-heading">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1.5 py-1.5 text-left text-sm">
                  <Avatar size="sm" className="rounded-lg">
                    <AvatarFallback className="rounded-lg bg-[rgba(128,21,232,0.10)] text-xs font-semibold text-[var(--purple-primary)]">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-ink-heading">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/*
              A real navigation, not a <Link>: /internal/auth/signout is a route
              handler (src/app/internal/auth/signout/route.ts) whose GET clears
              the Supabase session and redirects. next/link would try to treat
              it as a page. The rule only fires because the /internal/[...unknown]
              catch-all makes every /internal/* path look like a page to it.
            */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <DropdownMenuItem render={<a href="/internal/auth/signout" />}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
