import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react"

interface Props {
	fetchRoles: () => void;
	id: string;
}

export default function DeleteRole({ fetchRoles, id }: Props) {
	const [loading, setLoading] = useState(false)
	const handleDeleteRole = async (roleId: string) => {
		if (!confirm('Are you sure you want to delete this role?')) return;

		setLoading(true);
		try {
			const response = await fetch(`/api/roles/${roleId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to delete role');
			}

			// toast({
			// 	title: 'Success',
			// 	description: 'Role deleted successfully',
			// });

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
		<Button
			variant="ghost"
			size="sm"
			onClick={() => handleDeleteRole(id)}
			title="Delete Role"
			disabled={loading}
		>
			<Trash2 className="w-4 h-4 text-red-500" />
		</Button>

	)
}
