import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Role, Permission } from "@/types/form-types";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react"
import { Key } from "lucide-react"
import { DialogTrigger } from "@radix-ui/react-dialog";

interface Props {
	selectedRole: Role | null;
	permissions: Permission[];
	fetchRoles: () => void;
}

export default function AssignRole({ fetchRoles, selectedRole, permissions }: Props) {
	const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

	useEffect(() => {
		if (selectedRole?.permissions) {
			const permissionIds = selectedRole.permissions.map((p) => p.id)
			setSelectedPermissionIds(permissionIds)
		}
	}, [selectedRole])

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

	console.log("permissions", selectedRole)

	const togglePermission = (permissionId: string) => {
		setSelectedPermissionIds(prev =>
			prev.includes(permissionId)
				? prev.filter(id => id !== permissionId)
				: [...prev, permissionId]
		);
	};
	return (
		<Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
			<DialogTrigger asChild>
				<Key className="w-4 h-4" />
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Manage Permissions for {selectedRole?.name}</DialogTitle>
					<DialogDescription>Select permissions to assign to this role</DialogDescription>
				</DialogHeader>
				<div className="max-h-96 overflow-y-auto space-y-2 py-4">
					{permissions.map((permission) => (
						<div
							key={permission.id}
							className="flex items-start space-x-3 p-3 border rounded-lg "
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

	)
}
