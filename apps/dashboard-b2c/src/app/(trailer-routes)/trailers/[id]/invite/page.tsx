import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer"
import InviteUserForm from "@/features/invitations/components/InviteUserForm"
import { notFound } from "next/navigation"
import { auth } from "../../../../../../auth"
import { fetchUsersForInvitation } from "@/features/invitations/lib/fetchUsersForInvitation"
import { fetchRolesForInvitation } from "@/features/invitations/lib/fetchRolesForInvitation"


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const session = await auth()

	if (!session?.user) {
		return notFound()
	}

	const users = await fetchUsersForInvitation(session.user.id)
	const roles = await fetchRolesForInvitation("B2C")

	return (
		<TrailerLayoutContainer links={[]} trailerId={id} currentPage="invite">
			<InviteUserForm roles={roles} users={users} trailerId={id} />
		</TrailerLayoutContainer>
	)
}
