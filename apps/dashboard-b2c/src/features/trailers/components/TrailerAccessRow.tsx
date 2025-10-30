'use client';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Loader2, Users, Calendar, ShieldCheck, Eye, Edit, Shield } from 'lucide-react';
import { RolesWithPermissions, TrailerAccessesWithRole } from '@/features/users/types/user-types';
import RevokeTrailerAccess from './RevokeTrailerAccess';


interface TrailerAccessManagerProps {
	access: TrailerAccessesWithRole[number];
	roles: RolesWithPermissions;
}

export default function TrailerAccessRow({ access, roles }: TrailerAccessManagerProps) {
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [roleId, setRoleId] = useState("")

	useEffect(() => {
		if (access.role.id) {
			setRoleId(access.role.id)
		}
	}, [access])


	const handleUpdateAccessRole = async (accessId: string, roleId: string) => {
		setUpdatingId(accessId);
		setRoleId(roleId)
		try {
			const response = await fetch(`/api/trailers/access/${accessId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ roleId }),
			});
		} catch (error) {
			console.error('Error updating access:', error);
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
				{/* <DeleteTrailerButton trailerId={access.trailerId} /> */}
				{/* <Select */}
				{/* 	value={access.accessType} */}
				{/* 	onValueChange={(value) => handleUpdateAccess(access.id, value)} */}
				{/* 	disabled={updatingId === access.id} */}
				{/* > */}
				{/* 	<SelectTrigger className="w-[130px]"> */}
				{/* 		<SelectValue /> */}
				{/* 	</SelectTrigger> */}
				{/* 	<SelectContent> */}
				{/* 		<SelectItem value="VIEW"> */}
				{/* 			<span className="flex items-center gap-2"> */}
				{/* 				<Eye className="h-4 w-4" /> */}
				{/* 				View */}
				{/* 			</span> */}
				{/* 		</SelectItem> */}
				{/* 		<SelectItem value="EDIT"> */}
				{/* 			<span className="flex items-center gap-2"> */}
				{/* 				<Edit className="h-4 w-4" /> */}
				{/* 				Edit */}
				{/* 			</span> */}
				{/* 		</SelectItem> */}
				{/* 		<SelectItem value="ADMIN"> */}
				{/* 			<span className="flex items-center gap-2"> */}
				{/* 				<Shield className="h-4 w-4" /> */}
				{/* 				Admin */}
				{/* 			</span> */}
				{/* 		</SelectItem> */}
				{/* 	</SelectContent> */}
				{/* </Select> */}
				<RevokeTrailerAccess access={access} />
			</div>
		</div>
	);
}
