'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Key, Users, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@repo/ui/components/ui/dialog';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@repo/ui/components/ui/select';
import { Badge } from '@repo/ui/components/ui/badge';

interface Role {
	id: string;
	name: string;
	description: string;
	userCount: number;
	permissionCount: number;
	permissions?: Permission[];
}

interface Permission {
	id: string;
	action: string;
	resource: string;
	scope: string;
	description: string;
	roleCount?: number;
}

export default function RBAC() {
	const [roles, setRoles] = useState<Role[]>([]);
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
	const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
	const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
	const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);

	const [roleForm, setRoleForm] = useState({ name: '', description: '' });
	const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);


	// Fetch roles and permissions on mount
	useEffect(() => {
		fetchRoles();
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


	const handleCreateRole = async () => {
		if (!roleForm.name) {
			// toast({
			// 	title: 'Validation Error',
			// 	description: 'Role name is required',
			// 	variant: 'destructive',
			// });
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/roles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: roleForm.name,
					description: roleForm.description,
					permissionIds: [],
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to create role');
			}

			// toast({
			// 	title: 'Success',
			// 	description: 'Role created successfully',
			// });

			setRoleForm({ name: '', description: '' });
			setIsRoleDialogOpen(false);
			fetchRoles();
		} catch (error: any) {
			// toast({
			// 	title: 'Error',
			// 	description: error.message,
			// 	variant: 'destructive',
			// });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateRole = async () => {
		if (!selectedRole || !roleForm.name) return;

		setLoading(true);
		try {
			const response = await fetch(`/api/roles/${selectedRole.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: roleForm.name,
					description: roleForm.description,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to update role');
			}

			// toast({
			// 	title: 'Success',
			// 	description: 'Role updated successfully',
			// });

			setRoleForm({ name: '', description: '' });
			setSelectedRole(null);
			setIsRoleDialogOpen(false);
			fetchRoles();
		} catch (error: any) {
			// toast({
			// 	title: 'Error',
			// 	description: error.message,
			// 	variant: 'destructive',
			// });
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteRole = async (roleId: string) => {
		if (!confirm('Are you sure you want to delete this role?')) return;

		setLoading(true);
		try {
			const response = await fetch(`/api/roles/${roleId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to delete role');
			}

			// toast({
			// 	title: 'Success',
			// 	description: 'Role deleted successfully',
			// });

			fetchRoles();
		} catch (error: any) {
			// toast({
			// 	title: 'Error',
			// 	description: error.message,
			// 	variant: 'destructive',
			// });
		} finally {
			setLoading(false);
		}
	};



	const handleAssignPermissions = async () => {
		if (!selectedRole) return;

		setLoading(true);
		try {
			const response = await fetch(`/api/roles/${selectedRole.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: selectedRole.name,
					description: selectedRole.description,
					permissionIds: selectedPermissionIds,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to assign permissions');
			}

			// toast({
			// 	title: 'Success',
			// 	description: 'Permissions assigned successfully',
			// });

			setIsAssignDialogOpen(false);
			fetchRoles();
		} catch (error: any) {
			// toast({
			// 	title: 'Error',
			// 	description: error.message,
			// 	variant: 'destructive',
			// });
		} finally {
			setLoading(false);
		}
	};

	const openEditRole = (role: Role) => {
		setSelectedRole(role);
		setRoleForm({ name: role.name, description: role.description });
		setIsRoleDialogOpen(true);
	};


	const openAssignDialog = (role: Role) => {
		setSelectedRole(role);
		const permIds = role.permissions?.map(p => p.id) || [];
		setSelectedPermissionIds(permIds);
		setIsAssignDialogOpen(true);
	};

	const togglePermission = (permissionId: string) => {
		setSelectedPermissionIds(prev =>
			prev.includes(permissionId)
				? prev.filter(id => id !== permissionId)
				: [...prev, permissionId]
		);
	};

	if (pageLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<Shield className="w-8 h-8" />
						Role & Permission Management
					</h1>
					<p className="text-gray-600 mt-2">Manage user roles and their associated permissions</p>
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
									<Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
										<DialogTrigger asChild>
											<Button
												onClick={() => {
													setSelectedRole(null);
													setRoleForm({ name: '', description: '' });
												}}
											>
												<Plus className="w-4 h-4 mr-2" />
												Create Role
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>{selectedRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
												<DialogDescription>
													{selectedRole ? 'Update role details' : 'Add a new role to the system'}
												</DialogDescription>
											</DialogHeader>
											<div className="space-y-4 py-4">
												<div className="space-y-2">
													<Label htmlFor="role-name">Role name</Label>
													<Input
														id="role-name"
														placeholder="e.g.,admin,team"
														value={roleForm.name}
														onChange={(e) =>
															setRoleForm({ ...roleForm, name: e.target.value })
														}
													/>
													<Label htmlFor="role-description">Description</Label>
													<Textarea
														id="role-description"
														placeholder="Describe the role..."
														value={roleForm.description}
														onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
													/>
												</div>
											</div>
											<DialogFooter>
												<Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
													Cancel
												</Button>
												<Button onClick={selectedRole ? handleUpdateRole : handleCreateRole} disabled={loading}>
													{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
													{selectedRole ? 'Update' : 'Create'}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							</CardHeader>
							<CardContent>
								<div className="rounded-md border">
									<div className="overflow-x-auto">
										<table className="w-full">
											<thead className="bg-gray-50">
												<tr className="border-b">
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role Name</th>
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Users</th>
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Permissions</th>
													<th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
												</tr>
											</thead>
											<tbody>
												{roles.map((role) => (
													<tr key={role.id} className="border-b hover:bg-gray-50">
														<td className="px-4 py-3 font-medium">{role.name}</td>
														<td className="px-4 py-3 text-gray-600">{role.description}</td>
														<td className="px-4 py-3">
															<Badge variant="secondary">{role.userCount} users</Badge>
														</td>
														<td className="px-4 py-3">
															<Badge variant="outline">{role.permissionCount} permissions</Badge>
														</td>
														<td className="px-4 py-3 text-right">
															<div className="flex justify-end gap-2">
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => openAssignDialog(role)}
																	title="Manage Permissions"
																>
																	<Key className="w-4 h-4" />
																</Button>
																<Button variant="ghost" size="sm" onClick={() => openEditRole(role)} title="Edit Role">
																	<Edit className="w-4 h-4" />
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => handleDeleteRole(role.id)}
																	title="Delete Role"
																	disabled={loading}
																>
																	<Trash2 className="w-4 h-4 text-red-500" />
																</Button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</CardContent>
						</Card>

						<Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Manage Permissions for {selectedRole?.name}</DialogTitle>
									<DialogDescription>Select permissions to assign to this role</DialogDescription>
								</DialogHeader>
								<div className="max-h-96 overflow-y-auto space-y-2 py-4">
									{permissions.map((permission) => (
										<div
											key={permission.id}
											className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
										>
											<Checkbox
												id={`perm-${permission.id}`}
												checked={selectedPermissionIds.includes(permission.id)}
												onCheckedChange={() => togglePermission(permission.id)}
											/>
											<div className="flex-1">
												<label htmlFor={`perm-${permission.id}`} className="text-sm font-medium cursor-pointer">
													{permission.action}:{permission.resource}
												</label>
												<div className="flex gap-2 mt-1">
													<Badge variant="outline" className="text-xs">
														{permission.scope}
													</Badge>
													{permission.description && (
														<span className="text-xs text-gray-600">{permission.description}</span>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
								<DialogFooter>
									<Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
										Cancel
									</Button>
									<Button onClick={handleAssignPermissions} disabled={loading}>
										{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
										Save Permissions
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
} 
