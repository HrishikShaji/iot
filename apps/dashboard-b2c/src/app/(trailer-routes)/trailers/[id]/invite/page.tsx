import InviteUserForm from "@/features/invitations/components/InviteUserForm"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="p-10">
			<InviteUserForm trailerId={id} />
		</div>
	)
}
