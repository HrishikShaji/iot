"use client"

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Key, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function RBACAdminDashboard() {
	// Sample data - replace with API calls
	const [roles, setRoles] = useState([
		{ id: '1', name: 'admin', description: 'Full system access', userCount: 2, permissionCount: 12 },
		{ id: '2', name: 'employee', description: 'Employee access', userCount: 45, permissionCount: 5 },
		{ id: '3', name: 'customer', description: 'Customer access', userCount: 230, permissionCount: 3 },
	]);

	const [permissions, setPermissions] = useState([
		{ id: '1', action: 'create', resource: 'users', scope: 'all', description: 'Create users' },
		{ id: '2', action: 'read', resource: 'users', scope: 'all', description: 'Read all users' },
		{ id: '3', action: 'update', resource: 'users', scope: 'own', description: 'Update own user' },
		{ id: '4', action: 'delete', resource: 'users', scope: 'all', description: 'Delete users' },
		{ id: '5', action: 'read', resource: 'profile', scope: 'own', description: 'Read own profile' },
	]);

	const [selectedRole, setSelectedRole] = useState(null);
	const [selectedPermission, setSelectedPermission] = useState(null);
	const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
	const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
	const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
	const [rolePermissions, setRolePermissions] = useState({
		'1': ['1', '2', '3', '4', '5'],
		'2': ['2', '3', '5'],
		'3': ['5'],
	});

	const [roleForm, setRoleForm] = useState({ name: '', description: '' });
	const [permissionForm, setPermissionForm] = useState({
		action: '',
		resource: '',
		scope: 'all',
		description: '',
	});

	const actions = ['create', 'read', 'update', 'delete'];
	const scopes = ['all', 'own', 'department', 'team'];

	const handleCreateRole = () => {
		if (!roleForm.name) return;
		const newRole = {
			id: String(roles.length + 1),
			name: roleForm.name,
			description: roleForm.description,
			userCount: 0,
			permissionCount: 0,
		};
		setRoles([...roles, newRole]);
		setRoleForm({ name: '', description: '' });
		setIsRoleDialogOpen(false);
	};

	const handleUpdateRole = () => {
		if (!selectedRole || !roleForm.name) return;
		setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...roleForm } : r));
		setRoleForm({ name: '', description: '' });
		setSelectedRole(null);
		setIsRoleDialogOpen(false);
	};

	const handleDeleteRole = (roleId) => {
		if (window.confirm('Are you sure you want to delete this role?')) {
			setRoles(roles.filter(r => r.id !== roleId));
			delete rolePermissions[roleId];
		}
	};

	const handleCreatePermission = () => {
		if (!permissionForm.action || !permissionForm.resource) return;
		const newPermission = {
			id: String(permissions.length + 1),
			...permissionForm,
		};
		setPermissions([...permissions, newPermission]);
		setPermissionForm({ action: '', resource: '', scope: 'all', description: '' });
		setIsPermissionDialogOpen(false);
	};

	const handleUpdatePermission = () => {
		if (!selectedPermission || !permissionForm.action || !permissionForm.resource) return;
		setPermissions(permissions.map(p => p.id === selectedPermission.id ? { ...p, ...permissionForm } : p));
		setPermissionForm({ action: '', resource: '', scope: 'all', description: '' });
		setSelectedPermission(null);
		setIsPermissionDialogOpen(false);
	};

	const handleDeletePermission = (permissionId) => {
		if (window.confirm('Are you sure you want to delete this permission?')) {
			setPermissions(permissions.filter(p => p.id !== permissionId));
			Object.keys(rolePermissions).forEach(roleId => {
				rolePermissions[roleId] = rolePermissions[roleId].filter(pid => pid !== permissionId);
			});
		}
	};

	const handleTogglePermission = (roleId, permissionId) => {
		const current = rolePermissions[roleId] || [];
		if (current.includes(permissionId)) {
			setRolePermissions({
				...rolePermissions,
				[roleId]: current.filter(pid => pid !== permissionId),
			});
		} else {
			setRolePermissions({
				...rolePermissions,
				[roleId]: [...current, permissionId],
			});
		}
	};

	const openEditRole = (role) => {
		setSelectedRole(role);
		setRoleForm({ name: role.name, description: role.description });
		setIsRoleDialogOpen(true);
	};

	const openEditPermission = (permission) => {
		setSelectedPermission(permission);
		setPermissionForm({
			action: permission.action,
			resource: permission.resource,
			scope: permission.scope,
			description: permission.description,
		});
		setIsPermissionDialogOpen(true);
	};

	const getRolePermissions = (roleId) => {
		const permIds = rolePermissions[roleId] || [];
		return permissions.filter(p => permIds.includes(p.id));
	};

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
											<Button onClick={() => { setSelectedRole(null); setRoleForm({ name: '', description: '' }); }}>
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
													<Label htmlFor="role-name">Role Name *</Label>
													<Input
														id="role-name"
														placeholder="e.g., manager"
														value={roleForm.name}
														onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
													/>
												</div>
												<div className="space-y-2">
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
												<Button onClick={selectedRole ? handleUpdateRole : handleCreateRole}>
													{selectedRole ? 'Update' : 'Create'}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Role Name</TableHead>
											<TableHead>Description</TableHead>
											<TableHead>Users</TableHead>
											<TableHead>Permissions</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{roles.map((role) => (
											<TableRow key={role.id}>
												<TableCell className="font-medium">{role.name}</TableCell>
												<TableCell className="text-gray-600">{role.description}</TableCell>
												<TableCell>
													<Badge variant="secondary">{role.userCount} users</Badge>
												</TableCell>
												<TableCell>
													<Badge variant="outline">{rolePermissions[role.id]?.length || 0} permissions</Badge>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => { setSelectedRole(role); setIsAssignDialogOpen(true); }}
														>
															<Key className="w-4 h-4" />
														</Button>
														<Button variant="ghost" size="sm" onClick={() => openEditRole(role)}>
															<Edit className="w-4 h-4" />
														</Button>
														<Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)}>
															<Trash2 className="w-4 h-4 text-red-500" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>

						<Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Manage Permissions for {selectedRole?.name}</DialogTitle>
									<DialogDescription>
										Select permissions to assign to this role
									</DialogDescription>
								</DialogHeader>
								<div className="max-h-96 overflow-y-auto space-y-2 py-4">
									{permissions.map((permission) => (
										<div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
											<Checkbox
												id={`perm-${permission.id}`}
												checked={rolePermissions[selectedRole?.id]?.includes(permission.id)}
												onCheckedChange={() => handleTogglePermission(selectedRole?.id, permission.id)}
											/>
											<div className="flex-1">
												<label htmlFor={`perm-${permission.id}`} className="text-sm font-medium cursor-pointer">
													{permission.action}:{permission.resource}
												</label>
												<div className="flex gap-2 mt-1">
													<Badge variant="outline" className="text-xs">{permission.scope}</Badge>
													{permission.description && (
														<span className="text-xs text-gray-600">{permission.description}</span>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
								<DialogFooter>
									<Button onClick={() => setIsAssignDialogOpen(false)}>Done</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</TabsContent>

					<TabsContent value="permissions" className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Permissions</CardTitle>
										<CardDescription>Manage system permissions and access controls</CardDescription>
									</div>
									<Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
										<DialogTrigger asChild>
											<Button onClick={() => { setSelectedPermission(null); setPermissionForm({ action: '', resource: '', scope: 'all', description: '' }); }}>
												<Plus className="w-4 h-4 mr-2" />
												Create Permission
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>{selectedPermission ? 'Edit Permission' : 'Create New Permission'}</DialogTitle>
												<DialogDescription>
													{selectedPermission ? 'Update permission details' : 'Add a new permission to the system'}
												</DialogDescription>
											</DialogHeader>
											<div className="space-y-4 py-4">
												<div className="space-y-2">
													<Label htmlFor="perm-action">Action *</Label>
													<Select
														value={permissionForm.action}
														onValueChange={(value) => setPermissionForm({ ...permissionForm, action: value })}
													>
														<SelectTrigger id="perm-action">
															<SelectValue placeholder="Select action" />
														</SelectTrigger>
														<SelectContent>
															{actions.map((action) => (
																<SelectItem key={action} value={action}>{action}</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-2">
													<Label htmlFor="perm-resource">Resource *</Label>
													<Input
														id="perm-resource"
														placeholder="e.g., users, products"
														value={permissionForm.resource}
														onChange={(e) => setPermissionForm({ ...permissionForm, resource: e.target.value })}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="perm-scope">Scope *</Label>
													<Select
														value={permissionForm.scope}
														onValueChange={(value) => setPermissionForm({ ...permissionForm, scope: value })}
													>
														<SelectTrigger id="perm-scope">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{scopes.map((scope) => (
																<SelectItem key={scope} value={scope}>{scope}</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-2">
													<Label htmlFor="perm-description">Description</Label>
													<Textarea
														id="perm-description"
														placeholder="Describe the permission..."
														value={permissionForm.description}
														onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
													/>
												</div>
											</div>
											<DialogFooter>
												<Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
													Cancel
												</Button>
												<Button onClick={selectedPermission ? handleUpdatePermission : handleCreatePermission}>
													{selectedPermission ? 'Update' : 'Create'}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Action</TableHead>
											<TableHead>Resource</TableHead>
											<TableHead>Scope</TableHead>
											<TableHead>Description</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{permissions.map((permission) => (
											<TableRow key={permission.id}>
												<TableCell>
													<Badge>{permission.action}</Badge>
												</TableCell>
												<TableCell className="font-medium">{permission.resource}</TableCell>
												<TableCell>
													<Badge variant="outline">{permission.scope}</Badge>
												</TableCell>
												<TableCell className="text-gray-600">{permission.description}</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<Button variant="ghost" size="sm" onClick={() => openEditPermission(permission)}>
															<Edit className="w-4 h-4" />
														</Button>
														<Button variant="ghost" size="sm" onClick={() => handleDeletePermission(permission.id)}>
															<Trash2 className="w-4 h-4 text-red-500" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
