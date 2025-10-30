'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@repo/ui/components/ui/alert-dialog';
import { Loader2, Mail, Calendar, Clock } from 'lucide-react';
import { Invitation } from '@repo/db';
import { InboxInvitations } from '../lib/fetchInbox';
import { Truck } from "@repo/ui/icons"

interface Props {
	invitations: InboxInvitations
}

export default function Inbox({ invitations }: Props) {
	const [acceptLoading, setAcceptLoading] = useState(false);
	const [rejectLoading, setRejectLoading] = useState(false);
	const [revoking, setRevoking] = useState<string | null>(null);


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


	return (
		<div>
			<div className="border-b border-border ">
				<div className="mx-auto max-w-5xl px-6 py-6 ">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="flex items-start gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
								<Truck className="h-7 w-7 text-primary-foreground" />
							</div>
							<div className="space-y-2">
								<h1 className="text-2xl  font-medium tracking-tight text-foreground ">
									Trailer Invitations
								</h1>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-16">
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
			</div>
		</div>
	);
}
