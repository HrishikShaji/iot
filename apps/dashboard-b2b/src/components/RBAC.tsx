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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Permission, Role } from '@/types/form-types';
import CreateRole from '@/features/roles/components/CreateRole';
import RolesTable from '@/features/roles/components/RolesTable';
import CreatePermission from '@/features/permissions/components/CreatePermission';
import PermissionsTable from '@/features/permissions/components/PermissionsTable';


export default function RBAC() {
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
			const response = await fetch('/api/roles');
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
			const response = await fetch('/api/permissions');
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
						Role & Permission Management
					</h1>
					<p className="text-muted-foreground mt-2">Manage user roles and their associated permissions</p>
				</div>

				<Tabs defaultValue="roles" className="space-y-6">
					<TabsList className="grid w-full max-w-md grid-cols-2">
						<TabsTrigger value="roles" className="flex items-center gap-2">
							<Users className="w-4 h-4" />
							Roles
						</TabsTrigger>
						<TabsTrigger value="permissions" className="flex items-center gap-2">
							<Key className="w-4 h-4" />
							Permissions
						</TabsTrigger>
					</TabsList>

					<TabsContent value="roles" className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Roles</CardTitle>
										<CardDescription>Manage user roles and assign permissions</CardDescription>
									</div>
									<CreateRole
										fetchRoles={fetchRoles}
										context='B2C'
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
					</TabsContent>

					<TabsContent value="permissions" className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Permissions</CardTitle>
										<CardDescription>Manage system permissions and access controls</CardDescription>
									</div>
									<CreatePermission
										fetchPermissions={fetchPermissions}
										context='B2C'
									/>
								</div>
							</CardHeader>
							<CardContent>
								<PermissionsTable
									permissions={permissions}
									fetchPermissions={fetchPermissions}
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
} 
