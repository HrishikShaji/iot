import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@repo/ui/components/ui/button";
import { useState } from "react";
import { Role } from "@/types/form-types";
import { Plus, Loader2, Edit } from "lucide-react"

interface Props {
	fetchRoles: () => void;
	role: Role;
}

export default function UpdateRole({ fetchRoles, role }: Props) {
	const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [roleForm, setRoleForm] = useState({ name: role.name, description: role.description });

	const handleUpdateRole = async () => {
		if (!roleForm.name) return;

		setLoading(true);
		try {
			const response = await fetch(`/api/roles/${role.id}`, {
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
						setRoleForm({ name: role.name, description: role.description });
					}}
				>
					<Edit className="w-4 h-4 mr-2" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Role</DialogTitle>
					<DialogDescription>
						Update role details
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
					<Button onClick={handleUpdateRole} disabled={loading}>
						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						Update
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

	)
}

