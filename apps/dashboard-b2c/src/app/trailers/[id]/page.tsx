import { notFound } from 'next/navigation';
import { auth } from '../../../../auth';
import { prisma } from '@repo/db';
import TrailerAccessManager from '@/features/trailers/components/TrailerAccessManager';

export default async function TrailerPage({ params }: { params: { id: string } }) {
	const session = await auth();

	if (!session?.user) {
		return notFound();
	}

	// Check if user owns this trailer or has access to it
	const trailer = await prisma.trailer.findUnique({
		where: { id: params.id },
		include: {
			user: true,
			sharedWith: {
				where: { userId: session.user.id },
			},
		},
	});

	if (!trailer) {
		return notFound();
	}

	const isOwner = trailer.userId === session.user.id;
	const hasAccess = trailer.sharedWith.length > 0;

	if (!isOwner && !hasAccess) {
		return notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8">{trailer.name}</h1>

			<div className="grid gap-8">
				{/* Trailer content */}
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-4">Trailer Details</h2>
					<p>Owner: {trailer.user.email}</p>
					{/* Add more trailer details */}
				</div>

				{/* Only show access manager if user is the owner */}
				{isOwner && <TrailerAccessManager trailerId={params.id} />}
			</div>
		</div>
	);
}
