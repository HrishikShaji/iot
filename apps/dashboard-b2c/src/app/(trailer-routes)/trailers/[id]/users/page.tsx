import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer"
import TrailerUsers from "@/features/trailers/components/TrailerUsers"
import { auth } from "../../../../../../auth"
import { notFound } from "next/navigation"
import { fetchTrailer } from "@/features/trailers/lib/fetchTrailer"
import { fetchTrailerAccess } from "@/features/trailers/lib/fetchTrailerAccess"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const session = await auth()

	if (!session) {
		return notFound()
	}

	const trailer = await fetchTrailer({ userId: session.user.id, trailerId: id })
	const trailerAccess = await fetchTrailerAccess({ userId: session.user.id, trailerId: id })

	if (!trailer || !trailerAccess) {
		return notFound()
	}

	return (
		<TrailerLayoutContainer links={[]} trailerId={id} currentPage="users">
			<TrailerUsers trailerAccessRoleId={trailerAccess.roleId} trailerId={id} trailerName={trailer.name} />
		</TrailerLayoutContainer>
	)
}
