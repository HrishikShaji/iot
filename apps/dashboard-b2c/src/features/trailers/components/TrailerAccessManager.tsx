'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@repo/ui/components/ui/alert-dialog';
import { Loader2, Users, Calendar, ShieldCheck, Eye, Edit, Shield } from 'lucide-react';
import { Role } from '@repo/db';
import TrailerAccessRow from './TrailerAccessRow';

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
	};
	trailerId: string;
}

interface TrailerAccessManagerProps {
	trailerId: string;
}

export default function TrailerAccessManager({ trailerId }: TrailerAccessManagerProps) {
	const [accesses, setAccesses] = useState<TrailerAccess[]>([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [roles, setRoles] = useState<Role[]>([])
	const [rolesLoading, setRolesLoading] = useState(false)
	const [roleId, setRoleId] = useState("")


	useEffect(() => {
		fetchAccesses();
		fetchRoles()
	}, [trailerId]);


	const fetchRoles = async () => {
		console.log("this ran")
		try {
			setRolesLoading(true)
			const response = await fetch('/api/roles?context=B2C');
			if (!response.ok) throw new Error('Failed to fetch roles');
			const data = await response.json();
			setRoles(data);
		} catch (error) {
			// toast({
			// 	title: 'Error',
			// 	description: 'Failed to fetch roles',
			// 	variant: 'destructive',
			// });
		} finally {
			setRolesLoading(false)
		}
	};

	const fetchAccesses = async () => {
		try {
			const response = await fetch(`/api/trailers/${trailerId}/access`);
			const data = await response.json();
			console.log("Trailer accesses:", data.accesses)
			setAccesses(data.accesses || []);
		} catch (error) {
			console.error('Error fetching accesses:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateAccess = async (accessId: string, newAccessType: string) => {
		setUpdatingId(accessId);
		try {
			const response = await fetch(`/api/trailers/access/${accessId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ accessType: newAccessType }),
			});
			if (response.ok) {
				await fetchAccesses();
			}
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
			if (response.ok) {
				await fetchAccesses();
			}
		} catch (error) {
			console.error('Error revoking access:', error);
		} finally {
			setUpdatingId(null);
		}
	};

	const getAccessIcon = (accessType: string) => {
		const icons = {
			VIEW: <Eye className="h-3 w-3" />,
			EDIT: <Edit className="h-3 w-3" />,
			ADMIN: <Shield className="h-3 w-3" />,
		};
		return icons[accessType as keyof typeof icons] || null;
	};

	if (loading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					<span className="ml-2 text-muted-foreground">Loading access list...</span>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ShieldCheck className="h-5 w-5" />
					Users with Access
				</CardTitle>
			</CardHeader>
			<CardContent>
				{accesses.length === 0 ? (
					<div className="text-center py-8">
						<Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
						<p className="text-muted-foreground">No users have access yet</p>
					</div>
				) : (
					<div className="space-y-3">
						{accesses.map((access) => (
							<TrailerAccessRow key={access.id} access={access} roles={roles} />
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
