"use client"
import { SidebarInset } from "@repo/ui/components/ui/sidebar";
import { AppSidebar } from "@repo/ui/components/elements/AppSidebar"
import { ReactNode, useEffect, useState } from "react";
import { getSidebarLinks, sidebarLinks } from "@/lib/sidebar-links";
import { useParams } from "next/navigation";
import { Trailer } from "@repo/db";

interface Props {
	children: ReactNode;
}

export default function CustomSidebarComponent({ children }: Props) {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const [trailer, setTrailer] = useState<Trailer | null>(null)
	console.log("params in sidebar", params)

	useEffect(() => {
		if (params.id) {
			fetchTrailerInfo(params.id as string)
		}
	}, [params])

	async function fetchTrailerInfo(id: string) {
		try {
			setLoading(true)
			const response = await fetch(`/api/trailers/${id}`);
			const result = await response.json()
			console.log(result.trailer)
			setTrailer(result.trailer)

		} catch (err) {
			console.log(err)
		} finally {
			setLoading(false)
		}
	}

	const links = trailer ? getSidebarLinks(trailer.id, trailer.name) : sidebarLinks
	const header = trailer ? trailer.name : "No Trailer"

	return (
		<>
			<AppSidebar data={{ links, header }} />
			<SidebarInset className="flex-1 min-h-0">
				<div className="flex flex-col h-full gap-4 p-4">
					{children}
				</div>
			</SidebarInset>

		</>

	)
}
