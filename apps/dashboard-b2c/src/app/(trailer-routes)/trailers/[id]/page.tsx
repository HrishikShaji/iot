import { notFound } from 'next/navigation';
import { auth } from '../../../../../auth';
import TrailerLayoutContainer from '@/components/common/TrailerLayoutContainer';
import { fetchTrailer } from '@/features/trailers/lib/fetchTrailer';
import TrailerInfo from '@/features/trailers/components/TrailerInfo';


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const session = await auth();

	if (!session?.user) {
		return notFound();
	}

	const trailer = await fetchTrailer({ trailerId: id, userId: session.user.id })

	if (!trailer) {
		return notFound();
	}

	const isOwner = trailer.userId === session.user.id;
	const hasAccess = trailer.sharedWith.length > 0;


	if (!isOwner && !hasAccess) {
		return notFound();
	}

	const role = isOwner ? trailer.user.role.name : trailer.sharedWith[0].role.name
	console.log(trailer)

	return (
		<TrailerLayoutContainer links={[]} trailerId={id}>
			<TrailerInfo
				userRole={role}
				trailerId={trailer.id}
				trailerName={trailer.name}
				trailerOwnerEmail={trailer.user.email}
				trailerCreatedAt={trailer.createdAt}
				trailerUpdatedAt={trailer.updatedAt}
			/>
		</TrailerLayoutContainer >
	);
}
