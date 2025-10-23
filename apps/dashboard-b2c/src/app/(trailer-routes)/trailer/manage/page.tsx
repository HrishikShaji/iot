"use client"

import { DeleteTrailerButton } from "@/features/permissions/components/DeleteTrailerButton"
import TrailerAccessManager from "@/features/trailers/components/TrailerAccessManager"
import { useSession } from "next-auth/react"

export default function Page() {
	const { status, data } = useSession()
	console.log(data)
	return (
		<div>
			<TrailerAccessManager trailerId="" />
		</div>
	)
}
