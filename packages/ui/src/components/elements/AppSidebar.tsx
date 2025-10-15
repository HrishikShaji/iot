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

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	links?: NavLink[]
}

export function AppSidebar({ links = [], ...props }: AppSidebarProps) {
	const pathname = usePathname()

	if (pathname === "/auth/login" || pathname === "/auth/register") {
		return null
	}

	const renderLinks = (navLinks: NavLink[]) => {
		return navLinks.map((link, index) => {
			const isActive = pathname === link.href
			const hasChildren = link.children && link.children.length > 0

			// Get the icon component dynamically
			const IconComponent = link.icon
				? (LucideIcons[link.icon as keyof typeof LucideIcons] as LucideIcon)
				: null

			if (hasChildren) {
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
									{link.children?.map((child, childIndex) => {
										const ChildIconComponent = child.icon
											? (LucideIcons[child.icon as keyof typeof LucideIcons] as LucideIcon)
											: null
										return (
											<SidebarMenuSubItem key={childIndex}>
												<SidebarMenuSubButton
													asChild
													isActive={pathname === child.href}
												>
													<Link href={child.href || "#"}>
														{ChildIconComponent && <ChildIconComponent className="w-4 h-4" />}
														<span>{child.title}</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										)
									})}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				)
			}

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
		})
	}

	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					{/* You can add header content here */}
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>{renderLinks(links)}</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				{/* You can add footer content here */}
			</SidebarFooter>
		</Sidebar>
	)
}
