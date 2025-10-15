import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { useState } from "react";

interface Props {
	fetchPermissions: () => void;
}

export default function CreatePermission({ fetchPermissions }: Props) {
	const [permissionForm, setPermissionForm] = useState({
		action: '',
		resource: '',
		scope: 'all',
		description: '',
	});
	const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const actions = ['create', 'read', 'update', 'delete'];
	const scopes = ['all', 'own', 'department', 'team'];
	const handleCreatePermission = async () => {
		if (!permissionForm.action || !permissionForm.resource) {
			// toast({
			// 	title: 'Validation Error',
			// 	description: 'Action and resource are required',
			// 	variant: 'destructive',
			// });
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/permissions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(permissionForm),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to create permission');
			}

			// toast({
			// 	title: 'Success',
			// 	description: 'Permission created successfully',
			// });

			setPermissionForm({ action: '', resource: '', scope: 'all', description: '' });
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
						setPermissionForm({ action: '', resource: '', scope: 'all', description: '' });
					}}
				>
					<Plus className="w-4 h-4 mr-2" />
					Create Permission
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Create New Permission
					</DialogTitle>
					<DialogDescription>
						Add a new permission to the system
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
								{scopes.map((scope) => (
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
						onClick={handleCreatePermission}
						disabled={loading}
					>
						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

	)
}
