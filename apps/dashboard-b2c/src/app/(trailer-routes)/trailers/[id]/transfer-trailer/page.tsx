import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer"
import { notFound } from "next/navigation"
import { auth } from "../../../../../../auth"
import { fetchTrailer } from "@/features/trailers/lib/fetchTrailer"
import TransferTrailerForm from "@/features/trailers/components/TransferTrailerForm"
import { fetchTrailerAccess } from "@/features/trailers/lib/fetchTrailerAccess"


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const session = await auth()

	if (!session?.user) {
		return notFound()
	}

	const trailer = await fetchTrailer({ userId: session.user.id, trailerId: id })
	const trailerAccess = await fetchTrailerAccess({ userId: session.user.id, trailerId: id })


	if (!trailer || !trailerAccess) {
		return notFound()
	}

	return (
		<TrailerLayoutContainer links={[]} trailerId={id} currentPage="transfer-trailer">
			<TransferTrailerForm
				trailerId={id}
				trailerName={trailer.name}
				trailerAccessRoleId={trailerAccess.roleId}
			/>
		</TrailerLayoutContainer>
	)
}
