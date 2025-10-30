import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";
import ViewSentInvitations from "@/features/invitations/components/ViewSentInvitations";
import { fetchTrailer } from "@/features/trailers/lib/fetchTrailer";
import { auth } from "../../../../../../auth";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	const session = await auth()

	if (!session) {
		return notFound()
	}

	const trailer = await fetchTrailer({ trailerId: id, userId: session.user.id })

	if (!trailer) {
		return notFound()
	}

	return (
		<TrailerLayoutContainer trailerId={id} links={[]} currentPage="sent-invitations">
			<ViewSentInvitations trailerId={id} trailerName={trailer.name} />
		</TrailerLayoutContainer>
	)
}
