'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Mail, Calendar, Clock } from 'lucide-react';
import { Invitation } from '@repo/db';


export default function Inbox() {
	const [invitations, setInvitations] = useState<Invitation[]>([]);
	const [loading, setLoading] = useState(true);
	const [acceptLoading, setAcceptLoading] = useState(false);
	const [rejectLoading, setRejectLoading] = useState(false);
	const [revoking, setRevoking] = useState<string | null>(null);

	useEffect(() => {
		fetchInvitations();
	}, []);

	const fetchInvitations = async () => {
		try {
			const response = await fetch('/api/inbox');
			const data = await response.json();
			setInvitations(data.invitations || []);
		} catch (error) {
			console.error('Error fetching invitations:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAccept = async (invitationToken: string, roleId: string) => {
		try {
			setAcceptLoading(true)
			console.log("sending:", invitationToken, "roleId:", roleId)
			const response = await fetch('/api/inbox/accept', {
				method: "POST",
				body: JSON.stringify({ invitationToken, roleId })
			});
			const data = await response.json();
			console.log(data)
			// setInvitations(data.invitations || []);
		} catch (error) {
			console.error('Error accepting invitation:', error);
		} finally {
			setAcceptLoading(false);
		}

	}
	const handleReject = async (invitationToken: string, roleId: string) => {
		try {
			setRejectLoading(true)
			const response = await fetch('/api/inbox/reject', {
				method: "POST",
				body: JSON.stringify({ invitationToken, roleId })
			});
			const data = await response.json();
			console.log(data)
			// setInvitations(data.invitations || []);
		} catch (error) {
			console.error('Error rejecting invitation:', error);
		} finally {
			setRejectLoading(false);
		}

	}

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

	console.log("invitations:", invitations)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Invitations</CardTitle>
			</CardHeader>
			<CardContent>
				{invitations.length === 0 ? (
					<div className="text-center py-8">
						<Mail className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
						<p className="text-muted-foreground">No invitations received yet</p>
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
										<p className="font-medium">{(invitation as any).inviter.email}</p>
									</div>
									<div className='flex gap-2'>
										<Badge>{(invitation as any).role.name}</Badge>
										<Badge>{(invitation as any).trailer.name}</Badge>
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
									{invitation.status === "PENDING" ?
										<>
											<Button
												onClick={() => handleAccept(invitation.token, invitation.roleId)}>
												{acceptLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : "Accept"}
											</Button>
											<Button onClick={() => handleReject(invitation.token, invitation.roleId)}>
												{rejectLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : "Reject"}
											</Button>
										</>
										: null
									}
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
