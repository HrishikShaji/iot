"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@repo/ui/components/ui/alert-dialog';
import { Loader2, Mail, Calendar, Clock } from 'lucide-react';
import { prisma } from '@repo/db';
import { Invitations } from '@/features/users/types/user-types';

interface Props {
	invitation: Invitations[number]
}


export default function InvitationRow({ invitation }: Props) {
	const [revoking, setRevoking] = useState<string | null>(null);



	const handleRevoke = async (id: string) => {
		setRevoking(id);
		try {
			const response = await fetch(`/api/invitations/${id}/revoke`, {
				method: 'POST',
			});
		} catch (error) {
			console.error('Error revoking invitation:', error);
		} finally {
			setRevoking(null);
		}
	};

	const getStatusBadge = (status: string, expiresAt: string | Date) => {
		const isExpired = new Date(expiresAt) < new Date();
		const actualStatus = isExpired ? 'EXPIRED' : status;

		const variants = {
			PENDING: 'secondary',
			ACCEPTED: 'default',
			EXPIRED: 'outline',
		} as const;

		return (
			<Badge variant={variants[actualStatus as keyof typeof variants] || 'outline'}>
				{actualStatus}
			</Badge>
		);
	};


	return (
		<div
			key={invitation.id}
			className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
		>
			<div className="flex-1 space-y-1">
				<div className="flex items-center gap-2">
					<Mail className="h-4 w-4 text-muted-foreground" />
					<p className="font-medium">{invitation.email}</p>
				</div>
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<span className="flex items-center gap-1">
						<Calendar className="h-3 w-3" />
						Sent: {new Date(invitation.createdAt).toLocaleDateString()}
					</span>
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
					</span>
				</div>
			</div>
			<div className="flex items-center gap-3">
				{getStatusBadge(invitation.status, invitation.expiresAt)}
				{invitation.status === 'PENDING' && new Date(invitation.expiresAt) > new Date() && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="destructive"
								size="sm"
								disabled={revoking === invitation.id}
							>
								{revoking === invitation.id ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									'Revoke'
								)}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to revoke the invitation for {invitation.email}?
									They will no longer be able to accept this invitation.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={() => handleRevoke(invitation.id)}>
									Revoke
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
			</div>
		</div>
	);
}
