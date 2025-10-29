import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@repo/ui/components/ui/alert-dialog';
import { Loader2, Users, Calendar, ShieldCheck, Eye, Edit, Shield } from 'lucide-react';
import { prisma, Role } from '@repo/db';
import TrailerAccessRow from './TrailerAccessRow';
import { auth } from '../../../../auth';
import fetchTrailerAccesses from '@/features/users/lib/fetchTrailerAccesses';
import fetchRoles from '@/features/users/lib/fetchRoles';


interface TrailerAccessManagerProps {
	trailerId: string;
}

async function fetchData(id: string) {
	const session = await auth()
	if (!session) {
		throw new Error("No session")
	}

	const user = session.user;

	if (!user) {
		throw new Error("No user")
	}

	// Check if user owns this trailer
	const trailer = await prisma.trailer.findUnique({
		where: { id },
	});

	if (!trailer) {
		throw new Error('Trailer not found or unauthorized');
	}

	const accesses = await fetchTrailerAccesses(id)

	const roles = await fetchRoles("B2C");

	return { accesses, roles }

}

export default async function TrailerUsers({ trailerId }: TrailerAccessManagerProps) {
	const { accesses, roles } = await fetchData(trailerId)

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ShieldCheck className="h-5 w-5" />
					Users with Access
				</CardTitle>
			</CardHeader>
			<CardContent>
				{accesses.length === 0 ? (
					<div className="text-center py-8">
						<Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
						<p className="text-muted-foreground">No users have access yet</p>
					</div>
				) : (
					<div className="space-y-3">
						{accesses.map((access) => (
							<TrailerAccessRow key={access.id} access={access} roles={roles} />
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
