import { Permission, Role } from "@/types/form-types"
import RolesRow from "./RolesRow";

interface Props {
	roles: Role[];
	permissions: Permission[];
	fetchRoles: () => void;
}

export default function RolesTable({ permissions, roles, fetchRoles }: Props) {
	return (
		<div className="rounded-md border">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="">
						<tr className="border-b">
							<th className="px-4 py-3 text-left text-sm font-medium ">Role Name</th>
							<th className="px-4 py-3 text-left text-sm font-medium ">Description</th>
							<th className="px-4 py-3 text-left text-sm font-medium ">Users</th>
							<th className="px-4 py-3 text-left text-sm font-medium ">Permissions</th>
							<th className="px-4 py-3 text-right text-sm font-medium ">Actions</th>
						</tr>
					</thead>
					<tbody>
						{roles.map((role) => (
							<RolesRow
								key={role.id}
								role={role}
								permissions={permissions}
								fetchRoles={fetchRoles}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>

	)
}
