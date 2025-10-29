import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";
import ViewSentInvitations from "@/features/invitations/components/ViewSentInvitations";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<TrailerLayoutContainer trailerId={id} links={[]} currentPage="sent-invitations">
			<ViewSentInvitations trailerId={id} />
		</TrailerLayoutContainer>
	)
}
