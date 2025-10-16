import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { useState } from "react";
import { permissionActions, permissionResources, permissionScopes } from "@/lib/permission-constants";

interface Props {
	fetchPermissions: () => void;
	context: string;
}

export default function CreatePermission({ fetchPermissions, context }: Props) {
	const [permissionForm, setPermissionForm] = useState({
		action: '',
		resource: '',
		scope: '',
		description: '',
		context
	});
	const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);

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

			setPermissionForm({ action: '', resource: '', scope: '', description: '', context });
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
						setPermissionForm({ context, action: '', resource: '', scope: '', description: '' });
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
						<Select
							value={permissionForm.resource}
							onValueChange={(value) => setPermissionForm({ ...permissionForm, resource: value })}
						>
							<SelectTrigger id="perm-resource">
								<SelectValue placeholder="Select resource" />
							</SelectTrigger>
							<SelectContent>
								{permissionResources.map((action) => (
									<SelectItem key={action} value={action}>
										{action}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="perm-scope">Scope *</Label>
						<Select
							value={permissionForm.scope}
							onValueChange={(value) => setPermissionForm({ ...permissionForm, scope: value })}
						>
							<SelectTrigger id="perm-scope">
								<SelectValue placeholder="Select scope" />
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
