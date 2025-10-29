import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer"
import InviteUserForm from "@/features/invitations/components/InviteUserForm"


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<TrailerLayoutContainer links={[]} trailerId={id} currentPage="invite">
			<InviteUserForm trailerId={id} />
		</TrailerLayoutContainer>
	)
}
