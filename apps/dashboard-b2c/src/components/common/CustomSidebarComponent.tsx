"use client"
import { SidebarInset } from "@repo/ui/components/ui/sidebar";
import { AppSidebar } from "@repo/ui/components/elements/AppSidebar"
import { ReactNode, useEffect, useState } from "react";
import { getSidebarLinks, sidebarLinks } from "@/lib/sidebar-links";
import { useParams } from "next/navigation";

interface Props {
	children: ReactNode;
}

export default function CustomSidebarComponent({ children }: Props) {
	const params = useParams()

	const links = getSidebarLinks(params.id as string)

	return (
		<>
			<AppSidebar data={{ links }} />
			<SidebarInset className="flex-1 min-h-0">
				<div className="flex flex-col h-full gap-4 p-4">
					{children}
				</div>
			</SidebarInset>

		</>

	)
}
