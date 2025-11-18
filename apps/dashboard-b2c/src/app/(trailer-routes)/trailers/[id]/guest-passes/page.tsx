import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer"
import { notFound } from "next/navigation"
import { auth } from "../../../../../../auth"
import { fetchTrailer } from "@/features/trailers/lib/fetchTrailer"
import InviteGuestForm from "@/features/trailers/components/InviteGuestForm"
import { fetchUsersForInvitation } from "@/features/invitations/lib/fetchUsersForInvitation"
import fetchRoleByName from "@/features/users/lib/fetchRoleByName"
import { fetchTrailerAccess } from "@/features/trailers/lib/fetchTrailerAccess"


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const session = await auth()

	if (!session?.user) {
		return notFound()
	}


	const users = await fetchUsersForInvitation(session.user.id)
	const role = await fetchRoleByName({ context: "B2C", name: "guest" })
	const trailer = await fetchTrailer({ userId: session.user.id, trailerId: id })
	const trailerAccess = await fetchTrailerAccess({ userId: session.user.id, trailerId: id })


	if (!trailer) {
		return notFound()
	}


	if (!role) {
		return notFound()
	}

	if (!trailerAccess) {
		return notFound()
	}

	return (
		<TrailerLayoutContainer links={[]} trailerId={id} currentPage="guest-passes">
			<InviteGuestForm
				trailerAccessRoleId={trailerAccess.roleId}
				users={users}
				trailerId={id}
				trailerName={trailer.name}
				role={role}
			/>
		</TrailerLayoutContainer>
	)
}
