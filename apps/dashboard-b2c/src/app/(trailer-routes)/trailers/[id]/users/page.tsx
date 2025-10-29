import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs"
import TrailerUsers from "@/features/trailers/components/TrailerUsers"
import { prisma } from "@repo/db"


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	return (
		<div>
			<TrailerBreadCrumbs links={[]} id={id} currentPage="users" />
			<TrailerUsers trailerId={id} />
		</div>
	)
}
