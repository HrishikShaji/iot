import { Permission as PermissionType } from "@/types/form-types"
import Permission from "./Permission"

interface Props {
	permissions: PermissionType[];
	fetchPermissions: () => void;
}

export default function PermissionsTable({ permissions, fetchPermissions }: Props) {
	return (
		<div className="rounded-md border">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="">
						<tr className="border-b">
							<th className="px-4 py-3 text-left text-sm font-medium ">Action</th>
							<th className="px-4 py-3 text-left text-sm font-medium ">Resource</th>
							<th className="px-4 py-3 text-left text-sm font-medium ">Scope</th>
							<th className="px-4 py-3 text-left text-sm font-medium ">Description</th>
							<th className="px-4 py-3 text-right text-sm font-medium ">Actions</th>
						</tr>
					</thead>
					<tbody>
						{permissions.map((permission) => (
							<Permission
								key={permission.id}
								permission={permission}
								fetchPermissions={fetchPermissions}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>

	)
}
