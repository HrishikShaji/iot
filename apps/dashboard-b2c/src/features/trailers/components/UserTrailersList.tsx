'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Loader2, Truck, User, Calendar, Eye } from 'lucide-react';
import { DeleteTrailerButton } from '@/features/permissions/components/DeleteTrailerButton';
import { useSession } from 'next-auth/react';

interface SharedTrailer {
	id: string;
	name: string;
	createdAt: string;
	user: {
		email: string;
		id: string;
		role: {
			id: string;
			name: string;
			description: string;
		}
	}
}

export default function UserTrailersList() {
	const [sharedTrailers, setSharedTrailers] = useState<SharedTrailer[]>([]);
	const [loading, setLoading] = useState(true);
	const { data } = useSession()

	useEffect(() => {
		fetchSharedTrailers();
	}, []);

	const fetchSharedTrailers = async () => {
		try {
			const response = await fetch('/api/trailers');
			const data = await response.json();
			setSharedTrailers(data.trailers || []);
			console.log(data.trailers)
		} catch (error) {
			console.error('Error fetching shared trailers:', error);
		} finally {
			setLoading(false);
		}
	};

	const getAccessBadge = (accessType: string) => {
		const variants = {
			VIEW: { variant: 'secondary' as const, label: 'View' },
			EDIT: { variant: 'default' as const, label: 'Edit' },
			ADMIN: { variant: 'default' as const, label: 'Admin' },
		};

		const config = variants[accessType as keyof typeof variants] || { variant: 'outline' as const, label: accessType };

		return (
			<Badge variant={config.variant} className={accessType === 'ADMIN' ? 'bg-purple-600' : ''}>
				{config.label}
			</Badge>
		);
	};

	if (loading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					<span className="ml-2 text-muted-foreground">Loading  trailers...</span>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Trailers</CardTitle>
			</CardHeader>
			<CardContent>
				{sharedTrailers.length === 0 ? (
					<div className="text-center py-8">
						<Truck className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
						<p className="text-muted-foreground">No trailers with you yet</p>
					</div>
				) : (
					<div className="space-y-3">
						{sharedTrailers.map((sharedTrailer) => (
							<div
								key={sharedTrailer.id}
								className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
							>
								<div className="flex-1 space-y-1">
									<div className="flex items-center gap-2">
										<Truck className="h-4 w-4 text-muted-foreground" />
										<h3 className="font-medium">{sharedTrailer.name}</h3>
									</div>
									<div className="space-y-0.5 text-sm text-muted-foreground">
										<p className="flex items-center gap-1">
											<User className="h-3 w-3" />
											Owner: {sharedTrailer.user.email}
										</p>
										<p className="flex items-center gap-1">
											<Calendar className="h-3 w-3" />
											Created At: {new Date(sharedTrailer.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<DeleteTrailerButton trailerId={sharedTrailer.id} />
									<Badge>{sharedTrailer.user.role.name}</Badge>
									{/* {getAccessBadge(sharedTrailer.accessType)} */}
									<Button asChild>
										<a href={`/trailers/${sharedTrailer.id}`}>
											<Eye className="h-4 w-4 mr-2" />
											View
										</a>
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
