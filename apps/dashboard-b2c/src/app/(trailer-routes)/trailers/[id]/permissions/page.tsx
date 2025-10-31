import { notFound } from 'next/navigation';
import TrailerLayoutContainer from '@/components/common/TrailerLayoutContainer';
import { auth } from '../../../../../../auth';
import { fetchPermissions } from '@/features/permissions/lib/fetchPermissions';
import UserTrailerPermissions from '@/features/permissions/components/UserTrailerPermissions';


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const session = await auth();

	if (!session?.user) {
		return notFound();
	}

	const trailerAccess = await fetchPermissions({ trailerId: id, userId: session.user.id })

	if (!trailerAccess) {
		return notFound()
	}

	console.log(trailerAccess)
	return (
		<TrailerLayoutContainer links={[{ label: "Home", href: "/" }]} trailerId={id} currentPage='permissions'>
			<UserTrailerPermissions
				trailerName={trailerAccess.trailer.name}
				trailerId={trailerAccess.trailer.id}
				trailerAccess={trailerAccess}
			/>
		</TrailerLayoutContainer >
	);
}
