import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs"
import InviteUserForm from "@/features/invitations/components/InviteUserForm"
import { prisma } from "@repo/db"


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="p-10">
			<TrailerBreadCrumbs id={id} links={[]} currentPage="invite" />
			<InviteUserForm trailerId={id} />
		</div>
	)
}
