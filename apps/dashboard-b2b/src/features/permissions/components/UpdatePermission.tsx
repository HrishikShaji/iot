import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2, Edit } from "lucide-react"
import { useState } from "react";
import { Permission } from "@/types/form-types";
import { permissionActions, permissionScopes } from "@/lib/permission-constants";

interface Props {
	fetchPermissions: () => void;
	permission: Permission;
}

export default function UpdatePermission({ fetchPermissions, permission }: Props) {
	const [permissionForm, setPermissionForm] = useState({
		action: permission.action,
		resource: permission.resource,
		scope: permission.scope,
		description: permission.description,
	});
	const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);


	const handleUpdatePermission = async () => {
		if (!permissionForm.action || !permissionForm.resource) return;

		setLoading(true);
		try {
			const response = await fetch(`/api/permissions/${permission.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(permissionForm),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to update permission');
			}

			// toast({
			// 	title: 'Success',
			// 	description: 'Permission updated successfully',
			// });

			setPermissionForm({ action: '', resource: '', scope: 'all', description: '' });
			setSelectedPermission(null);
			setIsPermissionDialogOpen(false);
			fetchPermissions();
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

	return (
		<Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						setPermissionForm({
							action: permission.action,
							resource: permission.resource,
							scope: permission.scope,
							description: permission.description
						});
					}}
				>
					<Edit className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Edit Permission
					</DialogTitle>
					<DialogDescription>
						Update permission details
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
								{permissionActions.map((action) => (
									<SelectItem key={action} value={action}>
										{action}
									</SelectItem>
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
							onChange={(e) =>
								setPermissionForm({ ...permissionForm, resource: e.target.value })
							}
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
								{permissionScopes.map((scope) => (
									<SelectItem key={scope} value={scope}>
										{scope}
									</SelectItem>
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
							onChange={(e) =>
								setPermissionForm({ ...permissionForm, description: e.target.value })
							}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleUpdatePermission}
						disabled={loading}
					>
						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						{selectedPermission ? 'Update' : 'Create'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

	)
}
