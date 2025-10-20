"use client"

import TrailerAccessManager from "@/features/trailers/components/TrailerAccessManager"
import { useSession } from "next-auth/react"

export default function Page() {
	const { status, data } = useSession()
	console.log(data)
	if (!data?.user?.trailer?.id) {
		return <div>No trailer</div>
	}
	return (
		<div>
			<TrailerAccessManager trailerId={data.user.trailer.id} />
		</div>
	)
}
