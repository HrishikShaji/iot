'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Key, Users, Loader2 } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Permission, Role } from '@/types/form-types';
import CreatePermission from '@/features/permissions/components/CreatePermission';
import PermissionsTable from '@/features/permissions/components/PermissionsTable';


export default function Page() {
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [pageLoading, setPageLoading] = useState(true);


	// Fetch roles and permissions on mount
	useEffect(() => {
		fetchPermissions();
	}, []);


	const fetchPermissions = async () => {
		try {
			const response = await fetch('/api/permissions?context=B2C');
			if (!response.ok) throw new Error('Failed to fetch permissions');
			const data = await response.json();
			setPermissions(data);
		} catch (error) {
			// toast({
			// 	title: 'Error',
			// 	description: 'Failed to fetch permissions',
			// 	variant: 'destructive',
			// });
		} finally {
			setPageLoading(false)
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
						B2C Permission Management
					</h1>
					<p className="text-muted-foreground mt-2">Manage user  permissions</p>
				</div>

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
			</div>
		</div>
	);
} 
