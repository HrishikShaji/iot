'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Users, Calendar, ShieldCheck, Eye, Edit, Shield } from 'lucide-react';
import { Role } from '@repo/db';

interface TrailerAccess {
	id: string;
	accessType: string;
	grantedAt: string;
	user: {
		id: string;
		email: string;
	};
	role: {
		id: string;
		name: string;
		description: string;
	}
}

interface TrailerAccessManagerProps {
	access: TrailerAccess;
	roles: Role[];
}

export default function TrailerAccessRow({ access, roles }: TrailerAccessManagerProps) {
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [roleId, setRoleId] = useState("")

	useEffect(() => {
		if (access.role.id) {
			setRoleId(access.role.id)
		}
	}, [access])

	const handleUpdateAccess = async (accessId: string, newAccessType: string) => {
		setUpdatingId(accessId);
		try {
			const response = await fetch(`/api/trailers/access/${accessId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ accessType: newAccessType }),
			});
		} catch (error) {
			console.error('Error updating access:', error);
		} finally {
			setUpdatingId(null);
		}
	};

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
		<div
			key={access.id}
			className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
		>
			<div className="flex-1 space-y-1">
				<p className="font-medium">{access.user.email}</p>
				<p className="text-sm text-muted-foreground flex items-center gap-1">
					<Calendar className="h-3 w-3" />
					Access granted: {new Date(access.grantedAt).toLocaleDateString()}
				</p>
			</div>
			<div className="flex items-center gap-3 mr-2">
				<Select
					value={roleId}
					onValueChange={(value) => setRoleId(value)}
				>
					<SelectTrigger id="role">
						<SelectValue placeholder="Select role" />
					</SelectTrigger>
					<SelectContent>
						{roles.map((role) => (
							<SelectItem key={role.id} value={role.id}>
								{role.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-3">
				<Select
					value={access.accessType}
					onValueChange={(value) => handleUpdateAccess(access.id, value)}
					disabled={updatingId === access.id}
				>
					<SelectTrigger className="w-[130px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="VIEW">
							<span className="flex items-center gap-2">
								<Eye className="h-4 w-4" />
								View
							</span>
						</SelectItem>
						<SelectItem value="EDIT">
							<span className="flex items-center gap-2">
								<Edit className="h-4 w-4" />
								Edit
							</span>
						</SelectItem>
						<SelectItem value="ADMIN">
							<span className="flex items-center gap-2">
								<Shield className="h-4 w-4" />
								Admin
							</span>
						</SelectItem>
					</SelectContent>
				</Select>

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
			</div>
		</div>
	);
}
