import ViewSentInvitations from "@/features/invitations/components/ViewSentInvitations";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<div className="p-10">
			<ViewSentInvitations trailerId={id} />
		</div>
	)
}
