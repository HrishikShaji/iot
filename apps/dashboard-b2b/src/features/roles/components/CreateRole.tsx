import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@repo/ui/components/ui/button";
import { useState } from "react";
import { Role } from "@/types/form-types";
import { Plus, Loader2 } from "lucide-react"

interface Props {
	fetchRoles: () => void;
}

export default function CreateRole({ fetchRoles }: Props) {
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [roleForm, setRoleForm] = useState({ name: '', description: '', context: "B2C" });
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
					context: roleForm.context,
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

			setRoleForm({ name: '', description: '', context: "B2C" });
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

	return (
		<Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						setSelectedRole(null);
						setRoleForm({ name: '', description: '', context: "B2C" });
					}}
				>
					<Plus className="w-4 h-4 mr-2" />
					Create Role
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{'Create New Role'}</DialogTitle>
					<DialogDescription>
						{'Add a new role to the system'}
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
					<Button onClick={handleCreateRole} disabled={loading}>
						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						{'Create'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

	)
}
