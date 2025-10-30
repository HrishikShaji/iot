import { Button } from "@repo/ui/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@repo/ui/components/ui/alert-dialog";
import { Loader2 } from "@repo/ui/icons";
import { Invitations } from '@/features/users/types/user-types';
import { useState } from "react"

interface Props {
	invitation: Invitations[number]
}

export default function RevokeInvitation({ invitation }: Props) {
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

	return (
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

	)
}
