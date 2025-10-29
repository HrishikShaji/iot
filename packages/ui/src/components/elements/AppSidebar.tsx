"use client"
import * as React from "react"
import Link from "next/link"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "../ui/sidebar"
import { usePathname } from "next/navigation"
import { ChevronRight, LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible"

// Define the link type
type NavLink = {
	title: string
	href?: string
	icon?: string
	children?: NavLink[]
}

type SidebarData = {
	links: NavLink[];
	header?: string;
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	data: SidebarData
}

export function AppSidebar({ data = { links: [] }, ...props }: AppSidebarProps) {
	const pathname = usePathname()

	// Recursive function to render nested children
	const renderNestedLinks = (navLinks: NavLink[], depth: number = 0): React.ReactNode => {
		return navLinks.map((link, index) => {
			const isActive = pathname === link.href
			const hasChildren = link.children && link.children.length > 0

			// Get the icon component dynamically
			const IconComponent = link.icon
				? (LucideIcons[link.icon as keyof typeof LucideIcons] as LucideIcon)
				: null

			if (hasChildren) {
				// For top-level items (depth 0), use SidebarMenuItem
				if (depth === 0) {
					return (
						<Collapsible key={index} asChild defaultOpen={false}>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={link.title}>
										{IconComponent && <IconComponent className="w-4 h-4" />}
										<span>{link.title}</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{renderNestedLinks(link.children, depth + 1)}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					)
				}

				// For nested items (depth > 0), use SidebarMenuSubItem
				return (
					<Collapsible key={index} asChild defaultOpen={false}>
						<SidebarMenuSubItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuSubButton>
									{IconComponent && <IconComponent className="w-4 h-4" />}
									<span>{link.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuSubButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub className={`ml-${depth * 2}`}>
									{renderNestedLinks(link.children, depth + 1)}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuSubItem>
					</Collapsible>
				)
			}

			// Leaf nodes (no children)
			if (depth === 0) {
				return (
					<SidebarMenuItem key={index}>
						<SidebarMenuButton asChild tooltip={link.title} isActive={isActive}>
							<Link href={link.href || "#"}>
								{IconComponent && <IconComponent className="w-4 h-4" />}
								<span>{link.title}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)
			}

			return (
				<SidebarMenuSubItem key={index}>
					<SidebarMenuSubButton
						asChild
						isActive={isActive}
					>
						<Link href={link.href || "#"}>
							{IconComponent && <IconComponent className="w-4 h-4" />}
							<span>{link.title}</span>
						</Link>
					</SidebarMenuSubButton>
				</SidebarMenuSubItem>
			)
		})
	}

	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					{data.header ?
						<div className="border-1 p-2 rounded-md">
							{data.header}
						</div>
						: null}
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>{renderNestedLinks(data.links)}</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				{/* You can add footer content here */}
			</SidebarFooter>
		</Sidebar>
	)
}
