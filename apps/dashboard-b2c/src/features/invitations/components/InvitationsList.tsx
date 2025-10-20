'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Mail, Calendar, Clock } from 'lucide-react';

interface Invitation {
	id: string;
	email: string;
	status: string;
	createdAt: string;
	expiresAt: string;
}

export default function InvitationsList() {
	const [invitations, setInvitations] = useState<Invitation[]>([]);
	const [loading, setLoading] = useState(true);
	const [revoking, setRevoking] = useState<string | null>(null);

	useEffect(() => {
		fetchInvitations();
	}, []);

	const fetchInvitations = async () => {
		try {
			const response = await fetch('/api/invitations');
			const data = await response.json();
			setInvitations(data.invitations || []);
		} catch (error) {
			console.error('Error fetching invitations:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleRevoke = async (id: string) => {
		setRevoking(id);
		try {
			const response = await fetch(`/api/invitations/${id}/revoke`, {
				method: 'POST',
			});
			if (response.ok) {
				await fetchInvitations();
			}
		} catch (error) {
			console.error('Error revoking invitation:', error);
		} finally {
			setRevoking(null);
		}
	};

	const getStatusBadge = (status: string, expiresAt: string) => {
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

	if (loading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					<span className="ml-2 text-muted-foreground">Loading invitations...</span>
				</CardContent>
			</Card>
		);
	}

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
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
