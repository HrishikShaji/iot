import { Button } from "@repo/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { Label } from "@repo/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { Plus, Loader2, X } from "lucide-react"
import { useState } from "react";
import { permissionActions, permissionResources, permissionScopes } from "@/lib/permission-constants";
import { Badge } from "@repo/ui/components/ui/badge";

interface Props {
	fetchPermissions: () => void;
	context: string;
}

export default function CreatePermission({ fetchPermissions, context }: Props) {
	const [permissionForm, setPermissionForm] = useState({
		actions: [] as string[],
		resource: '',
		scope: '',
		description: '',
		context
	});
	const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedAction, setSelectedAction] = useState('');

	const handleCreatePermission = async () => {
		if (!permissionForm.actions.length || !permissionForm.resource) {
			// toast({
			// 	title: 'Validation Error',
			// 	description: 'At least one action and resource are required',
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

			setPermissionForm({ actions: [], resource: '', scope: '', description: '', context });
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
					onClick={() => {
						setPermissionForm({ context, actions: [], resource: '', scope: '', description: '' });
						setSelectedAction('');
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
						<Select
							value={permissionForm.resource}
							onValueChange={(value) => setPermissionForm({ ...permissionForm, resource: value })}
						>
							<SelectTrigger id="perm-resource">
								<SelectValue placeholder="Select resource" />
							</SelectTrigger>
							<SelectContent>
								{permissionResources.map((resource) => (
									<SelectItem key={resource} value={resource}>
										{resource}
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
						disabled={loading || !permissionForm.actions.length || !permissionForm.resource}
					>
						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
