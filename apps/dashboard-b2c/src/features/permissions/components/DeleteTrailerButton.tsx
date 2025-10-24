'use client';

import { Badge } from "@repo/ui/components/ui/badge";
import { usePermission } from "../hooks/usePermission";


export function DeleteTrailerButton({
	trailerId,
	organizationId
}: {
	trailerId: string;
	organizationId?: string;
}) {
	const { hasPermission, loading } = usePermission('delete', 'trailer', organizationId);

	async function deleteTrailer(trailerId: string, organizationId?: string) {
		console.log("Can delete trailer")
	}

	if (loading) return <div>Loading...</div>;
	if (!hasPermission) return <Badge>No permission</Badge>;

	return (
		<button onClick={() => deleteTrailer(trailerId, organizationId)}>
			Delete Trailer
		</button>
	);
}
