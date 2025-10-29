import { notFound } from 'next/navigation';
import { prisma } from '@repo/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Separator } from '@repo/ui/components/ui/separator';
import { Truck, User, Calendar, Shield } from 'lucide-react';
import { auth } from '../../../../../auth';
import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';
import TrailerBreadCrumbs from '@/components/common/TrailerBreadCrumbs';
import TrailerLayoutContainer from '@/components/common/TrailerLayoutContainer';

export default async function TrailerPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const session = await auth();
	if (!session?.user) {
		return notFound();
	}

	// Check if user owns this trailer or has access to it
	const trailer = await prisma.trailer.findUnique({
		where: { id: id },
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

	// Get user's access type if not owner
	const userAccess = hasAccess ? trailer.sharedWith[0] : null;


	return (
		<TrailerLayoutContainer links={[]} trailerId={id}>
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<Truck className="h-8 w-8 text-primary" />
					<h1 className="text-3xl font-bold">{trailer.name}</h1>
				</div>
				{isOwner ? (
					<Badge variant="default" className="flex items-center gap-1">
						<Shield className="h-3 w-3" />
						Owner
					</Badge>
				) : userAccess ? (
					<Badge variant="secondary" className="flex items-center gap-1">
						<Shield className="h-3 w-3" />
						{userAccess.accessType}
					</Badge>
				) : null}
			</div>

			<div className="grid gap-6">
				{/* Trailer Details */}
				<Card>
					<CardHeader>
						<CardTitle>Trailer Details</CardTitle>
						<CardDescription>
							{isOwner ? 'You own this trailer' : 'This trailer is shared with you'}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-2 text-sm">
							<User className="h-4 w-4 text-muted-foreground" />
							<span className="text-muted-foreground">Owner:</span>
							<span className="font-medium">{trailer.user.email}</span>
						</div>

						<Separator />

						<div className="flex items-center gap-2 text-sm">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span className="text-muted-foreground">Created:</span>
							<span className="font-medium">
								{new Date(trailer.createdAt).toLocaleDateString()}
							</span>
						</div>

						{trailer.updatedAt && (
							<div className="flex items-center gap-2 text-sm">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">Last Updated:</span>
								<span className="font-medium">
									{new Date(trailer.updatedAt).toLocaleDateString()}
								</span>
							</div>
						)}

					</CardContent>
				</Card>
			</div>
		</TrailerLayoutContainer >
	);
}
