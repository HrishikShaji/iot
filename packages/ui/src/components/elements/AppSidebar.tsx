"use client"

import * as React from "react"
import {
	BookOpen,
	Bot,
	Command,
	Frame,
	LifeBuoy,
	Map,
	PieChart,
	Send,
	Settings2,
	SquareTerminal,
} from "lucide-react"

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../ui/sidebar"
import { usePathname } from "next/navigation"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname()

	if (pathname === "/auth/login" || pathname === "/auth/register") {
		return null
	}
	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
			</SidebarContent>
			<SidebarFooter>
			</SidebarFooter>
		</Sidebar>
	)
}
