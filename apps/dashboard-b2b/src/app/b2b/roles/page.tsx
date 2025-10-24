'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Key, Users, Loader2 } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/ui/card';
import { Permission, Role } from '@/types/form-types';
import CreateRole from '@/features/roles/components/CreateRole';
import RolesTable from '@/features/roles/components/RolesTable';


export default function Page() {
	const [roles, setRoles] = useState<Role[]>([]);
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [pageLoading, setPageLoading] = useState(true);


	// Fetch roles and permissions on mount
	useEffect(() => {
		fetchRoles();
		fetchPermissions();
	}, []);

	const fetchRoles = async () => {
		try {
			const response = await fetch(`/api/roles?context=B2B`);
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
			setPageLoading(false);
		}
	};

	const fetchPermissions = async () => {
		try {
			const response = await fetch('/api/permissions?context=B2B');
			if (!response.ok) throw new Error('Failed to fetch permissions');
			const data = await response.json();
			setPermissions(data);
		} catch (error) {
			// toast({
			// 	title: 'Error',
			// 	description: 'Failed to fetch permissions',
			// 	variant: 'destructive',
			// });
		}
	};


	if (pageLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="h-full p-8 ">
			<div className="max-w-7xl mx-auto h-full">
				<div className="mb-8">
					<h1 className="text-3xl font-bold  flex items-center gap-2">
						<Shield className="w-8 h-8" />
						B2B Role Management
					</h1>
					<p className="text-muted-foreground mt-2">Manage user roles</p>
				</div>
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Roles</CardTitle>
								<CardDescription>Manage user roles and assign permissions</CardDescription>
							</div>
							<CreateRole
								context='B2B'
								fetchRoles={fetchRoles}
							/>
						</div>
					</CardHeader>
					<CardContent>
						<RolesTable
							permissions={permissions}
							roles={roles}
							fetchRoles={fetchRoles}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 
