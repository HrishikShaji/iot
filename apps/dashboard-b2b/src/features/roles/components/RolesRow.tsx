import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import { Permission, Role } from "@/types/form-types"
import AssignRole from "./AssignRole"
import DeleteRole from "./DeleteRole";
import UpdateRole from "./UpdateRole";

interface Props {
	role: Role;
	permissions: Permission[];
	fetchRoles: () => void;
}

export default function RolesRow({ role, permissions, fetchRoles }: Props) {
	return (
		<tr key={role.id} className="border-b ">
			<td className="px-4 py-3 font-medium">{role.name}</td>
			<td className="px-4 py-3 text-gray-600">{role.description}</td>
			<td className="px-4 py-3">
				<Badge variant="outline">{role.permissionCount} permissions</Badge>
			</td>
			<td className="px-4 py-3 text-right">
				<div className="flex justify-end gap-2">
					<AssignRole
						fetchRoles={fetchRoles}
						permissions={permissions}
						selectedRole={role}
					/>
					<UpdateRole
						role={role}
						fetchRoles={fetchRoles}
					/>
					<DeleteRole
						id={role.id}
						fetchRoles={fetchRoles}
					/>
				</div>
			</td>
		</tr>

	)
}
