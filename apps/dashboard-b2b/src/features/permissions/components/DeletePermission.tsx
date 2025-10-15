import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react"

interface Props {
	fetchPermissions: () => void;
	id: string;
}

export default function DeletePermission({ fetchPermissions, id }: Props) {
	const [loading, setLoading] = useState(false);


	const handleDeletePermission = async (permissionId: string) => {
		if (!confirm('Are you sure you want to delete this permission?')) return;

		setLoading(true);
		try {
			const response = await fetch(`/api/permissions/${permissionId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to delete permission');
			}

			// toast({
			// 	title: 'Success',
			// 	description: 'Permission deleted successfully',
			// });

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
		<Button
			variant="ghost"
			size="sm"
			onClick={() => handleDeletePermission(id)}
			title="Delete Permission"
			disabled={loading}
		>
			<Trash2 className="w-4 h-4 text-red-500" />
		</Button>

	)
}
