'use client';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Loader2, Users, Calendar, ShieldCheck, Eye, Edit, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { RolesWithPermissions, TrailerAccessesWithRole } from '@/features/users/types/user-types';
import RevokeTrailerAccess from './RevokeTrailerAccess';

interface TrailerAccessManagerProps {
	access: TrailerAccessesWithRole[number];
	roles: RolesWithPermissions;
	trailerAccessRoleId: string;
}

export default function TrailerAccessRow({ access, roles, trailerAccessRoleId }: TrailerAccessManagerProps) {
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [roleId, setRoleId] = useState("");

	useEffect(() => {
		if (access.role.id) {
			setRoleId(access.role.id);
		}
	}, [access]);

	const handleUpdateAccessRole = async (accessId: string, newRoleId: string) => {
		setUpdatingId(accessId);
		setRoleId(newRoleId);

		try {
			const response = await fetch(`/api/trailers/access/${accessId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ roleId: newRoleId, trailerAccessRoleId }),
			});
			const data = await response.json();

			if (!response.ok) {
				toast.error(data.error || 'Failed to update role', {
					description: 'Please try again or contact support if the problem persists.',
				});
				return;
			}

			const roleName = roles.find(role => role.id === newRoleId)?.name || 'role';
			toast.success('Access updated', {
				description: `Successfully updated ${access.user.email}'s role to ${roleName}`,
			});
		} catch (error) {
			console.error('Error updating access:', error);
			toast.error('Failed to update access', {
				description: error instanceof Error ? error.message : 'An unexpected error occurred',
			});
			// Revert role selection on error
			setRoleId(access.role.id);
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
				<div className="text-sm text-muted-foreground flex items-center gap-1">
					<Calendar className="h-3 w-3" />
					Access granted: {new Date(access.grantedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit'
					})}
				</div>
			</div>
			<div className="flex items-center gap-3 mr-2">
				<Select
					value={roleId}
					onValueChange={(value) => handleUpdateAccessRole(access.id, value)}
					disabled={updatingId === access.id}
				>
					<SelectTrigger id="role" className="w-[160px]">
						{updatingId === access.id ? (
							<div className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>Updating...</span>
							</div>
						) : (
							<SelectValue placeholder="Select role" />
						)}
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
				{/* <RevokeTrailerAccess access={access} /> */}
			</div>
		</div>
	);
}
