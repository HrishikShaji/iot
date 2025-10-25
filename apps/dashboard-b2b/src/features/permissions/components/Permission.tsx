import { Badge } from "@repo/ui/components/ui/badge";
import { Permission as PermissionType } from "@/types/form-types"
import DeletePermission from "./DeletePermission";
import UpdatePermission from "./UpdatePermission";

interface Props {
	permission: PermissionType;
	fetchPermissions: () => void;
}

export default function Permission({ permission, fetchPermissions }: Props) {
	return (
		<tr key={permission.id} className="border-b ">
			<td className="px-4 py-3 flex gap-2 items-center">
				{permission.actions.map((a, i) => (
					<Badge key={i}>{a}</Badge>
				))}
			</td>
			<td className="px-4 py-3 font-medium">{permission.resource}</td>
			<td className="px-4 py-3">
				<Badge variant="outline">{permission.scope}</Badge>
			</td>
			<td className="px-4 py-3 text-gray-600">{permission.description}</td>
			<td className="px-4 py-3 text-right">
				<div className="flex justify-end gap-2">
					<UpdatePermission
						permission={permission}
						fetchPermissions={fetchPermissions}
					/>
					<DeletePermission
						id={permission.id}
						fetchPermissions={fetchPermissions}
					/>
				</div>
			</td>
		</tr>

	)
}
