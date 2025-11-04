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
import { Truck } from "@repo/ui/icons"


interface TrailerAccessManagerProps {
	trailerId: string;
	trailerName: string;
	trailerAccessRoleId: string;
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
	const modifiedAccesses = accesses.filter((acc) => acc.userId !== user.id)

	const roles = await fetchRoles("B2C");

	return { accesses: modifiedAccesses, roles }

}

export default async function TrailerUsers({ trailerId, trailerName, trailerAccessRoleId }: TrailerAccessManagerProps) {
	const { accesses, roles } = await fetchData(trailerId)

	return (
		<>
			<div className="border-b border-border ">
				<div className="mx-auto max-w-5xl px-6 py-6 ">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="flex items-start gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
								<Truck className="h-7 w-7 text-primary-foreground" />
							</div>
							<div className="space-y-2">
								<h1 className="text-2xl  font-medium tracking-tight text-foreground ">
									{`Users with access to ${trailerName}`}
								</h1>
								<p className="text-base text-muted-foreground">ID: {trailerId}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto max-w-5xl flex flex-col gap-2 px-6 py-8 lg:px-8 lg:py-16">
				{accesses.length === 0 ? (
					<div className="text-center py-8">
						<Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
						<p className="text-muted-foreground">No users have access yet</p>
					</div>
				) : (
					<div className="space-y-3">
						{accesses.map((access) => (
							<TrailerAccessRow trailerAccessRoleId={trailerAccessRoleId} key={access.id} access={access} roles={roles} />
						))}
					</div>
				)}
			</div>
		</>
	);
}
