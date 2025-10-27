import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@repo/ui/components/ui/alert-dialog';
import { Loader2, Mail, Calendar, Clock } from 'lucide-react';
import { auth } from '../../../../auth';
import { prisma } from '@repo/db';
import fetchInvitations from '@/features/users/lib/fetchInvitations';
import InvitationRow from './InvitationRow';

interface Props {
	trailerId: string;
}

async function fetchData(trailerId: string) {
	const session = await auth()
	if (!session) {
		throw new Error("No session")
	}
	const user = session.user;

	if (!user) {
		throw new Error("No user")
	}

	const invitations = await fetchInvitations({ userId: user.id, trailerId })
	return invitations

}

export default async function ViewSentInvitations({ trailerId }: Props) {
	const invitations = await fetchData(trailerId)
	return (
		<Card>
			<CardHeader>
				<CardTitle>Sent Invitations</CardTitle>
			</CardHeader>
			<CardContent>
				{invitations.length === 0 ? (
					<div className="text-center py-8">
						<Mail className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
						<p className="text-muted-foreground">No invitations sent yet</p>
					</div>
				) : (
					<div className="space-y-3">
						{invitations.map((invitation) => (
							<InvitationRow invitation={invitation} key={invitation.id} />
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
