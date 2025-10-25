import { Button } from "@repo/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { Label } from "@repo/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select"
import { Input } from "@repo/ui/components/ui/input"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { Loader2, Edit, X } from "lucide-react"
import { useState } from "react";
import { Permission } from "@/types/form-types";
import { permissionActions, permissionScopes } from "@/lib/permission-constants";
import { Badge } from "@repo/ui/components/ui/badge";

interface Props {
	fetchPermissions: () => void;
	permission: Permission;
}

export default function UpdatePermission({ fetchPermissions, permission }: Props) {
	const [permissionForm, setPermissionForm] = useState({
		actions: permission.actions || [],
		resource: permission.resource,
		scope: permission.scope,
		description: permission.description,
		context: permission.context
	});
	const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedAction, setSelectedAction] = useState('');

	const handleUpdatePermission = async () => {
		if (!permissionForm.actions.length || !permissionForm.resource) return;

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

			setSelectedAction('');
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

	const handleAddAction = (action: string) => {
		if (action && !permissionForm.actions.includes(action)) {
			setPermissionForm({
				...permissionForm,
				actions: [...permissionForm.actions, action]
			});
			setSelectedAction('');
		}
	};

	const handleRemoveAction = (actionToRemove: string) => {
		setPermissionForm({
			...permissionForm,
			actions: permissionForm.actions.filter(a => a !== actionToRemove)
		});
	};

	const availableActions = permissionActions.filter(
		action => !permissionForm.actions.includes(action)
	);

	return (
		<Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => {
						setPermissionForm({
							actions: permission.actions || [],
							resource: permission.resource,
							scope: permission.scope,
							description: permission.description || '',
							context: permission.context
						});
						setSelectedAction('');
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
						<Label htmlFor="perm-actions">Actions *</Label>
						<Select
							value={selectedAction}
							onValueChange={handleAddAction}
						>
							<SelectTrigger id="perm-actions">
								<SelectValue placeholder="Select actions" />
							</SelectTrigger>
							<SelectContent>
								{availableActions.map((action) => (
									<SelectItem key={action} value={action}>
										{action}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{permissionForm.actions.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{permissionForm.actions.map((action) => (
									<Badge key={action} variant="secondary" className="gap-1">
										{action}
										<X
											className="w-3 h-3 cursor-pointer hover:text-destructive"
											onClick={() => handleRemoveAction(action)}
										/>
									</Badge>
								))}
							</div>
						)}
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
						disabled={loading || !permissionForm.actions.length || !permissionForm.resource}
					>
						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						Update
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
