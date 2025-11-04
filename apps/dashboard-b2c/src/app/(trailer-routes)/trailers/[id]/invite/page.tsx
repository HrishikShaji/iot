import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer"
import InviteUserForm from "@/features/invitations/components/InviteUserForm"
import { notFound } from "next/navigation"
import { auth } from "../../../../../../auth"
import { fetchUsersForInvitation } from "@/features/invitations/lib/fetchUsersForInvitation"
import { fetchRolesForInvitation } from "@/features/invitations/lib/fetchRolesForInvitation"
import { fetchTrailer } from "@/features/trailers/lib/fetchTrailer"
import { fetchTrailerAccess } from "@/features/trailers/lib/fetchTrailerAccess"


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const session = await auth()

	if (!session?.user) {
		return notFound()
	}

	const users = await fetchUsersForInvitation(session.user.id)
	const roles = await fetchRolesForInvitation("B2C")
	const trailer = await fetchTrailer({ userId: session.user.id, trailerId: id })
	const trailerAccess = await fetchTrailerAccess({ userId: session.user.id, trailerId: id })

	if (!trailer || !trailerAccess) {
		console.log("trailer", trailer)
		console.log("trailer access", trailerAccess)
		return notFound()
	}

	return (
		<TrailerLayoutContainer links={[]} trailerId={id} currentPage="invite">
			<InviteUserForm
				roles={roles}
				users={users}
				trailerId={id}
				trailerName={trailer.name}
				trailerAccessRoleId={trailerAccess.roleId}
			/>
		</TrailerLayoutContainer>
	)
}
