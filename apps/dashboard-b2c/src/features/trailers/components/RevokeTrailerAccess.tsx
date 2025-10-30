'use client';
import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@repo/ui/components/ui/alert-dialog';
import { Loader2, Users, Calendar, ShieldCheck, Eye, Edit, Shield } from 'lucide-react';
import { RolesWithPermissions, TrailerAccessesWithRole } from '@/features/users/types/user-types';


interface TrailerAccessManagerProps {
	access: TrailerAccessesWithRole[number];
}

export default function RevokeTrailerAccess({ access }: TrailerAccessManagerProps) {
	const [updatingId, setUpdatingId] = useState<string | null>(null);



	const handleRevokeAccess = async (accessId: string) => {
		setUpdatingId(accessId);
		try {
			const response = await fetch(`/api/trailers/access/${accessId}`, {
				method: 'DELETE',
			});
		} catch (error) {
			console.error('Error revoking access:', error);
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive"
					size="sm"
					disabled={updatingId === access.id}
				>
					{updatingId === access.id ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						'Revoke'
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Revoke Access</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to revoke access for {access.user.email}?
						They will no longer be able to access this trailer.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => handleRevokeAccess(access.id)}>
						Revoke
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
