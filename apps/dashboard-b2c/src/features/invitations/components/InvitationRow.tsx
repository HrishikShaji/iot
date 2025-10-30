"use client"
import { Badge } from '@repo/ui/components/ui/badge';
import { Loader2, Mail, Calendar, Clock } from 'lucide-react';
import { Invitations } from '@/features/users/types/user-types';
import RevokeInvitation from './RevokeInvitation';

interface Props {
	invitation: Invitations[number]
}

const formatDate = (date: string | Date) => {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
};

export default function InvitationRow({ invitation }: Props) {

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
						Sent: {formatDate(invitation.createdAt)}
					</span>
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						Expires: {formatDate(invitation.expiresAt)}
					</span>
				</div>
			</div>
			<div className="flex items-center gap-3">
				{getStatusBadge(invitation.status, invitation.expiresAt)}
				{invitation.status === 'PENDING' && new Date(invitation.expiresAt) > new Date() && (
					<RevokeInvitation invitation={invitation} />
				)}
			</div>
		</div>
	);
}
