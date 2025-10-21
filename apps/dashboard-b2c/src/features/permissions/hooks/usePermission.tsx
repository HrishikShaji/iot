'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function usePermission(
	action: string,
	resource: string,
	organizationId?: string
) {
	const { data: session } = useSession();
	const [hasPermission, setHasPermission] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkPermission() {
			if (!session?.user?.id) {
				setHasPermission(false);
				setLoading(false);
				return;
			}

			try {
				const response = await fetch('/api/permissions/check', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ action, resource, organizationId })
				});

				const data = await response.json();
				setHasPermission(data.hasPermission);
			} catch (error) {
				console.error('Permission check failed:', error);
				setHasPermission(false);
			} finally {
				setLoading(false);
			}
		}

		checkPermission();
	}, [session, action, resource, organizationId]);

	return { hasPermission, loading };
}
