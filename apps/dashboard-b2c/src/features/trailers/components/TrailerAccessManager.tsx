'use client';

import { useState, useEffect } from 'react';

interface TrailerAccess {
	id: string;
	accessType: string;
	grantedAt: string;
	user: {
		id: string;
		email: string;
	};
}

interface TrailerAccessManagerProps {
	trailerId: string;
}

export default function TrailerAccessManager({ trailerId }: TrailerAccessManagerProps) {
	const [accesses, setAccesses] = useState<TrailerAccess[]>([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	useEffect(() => {
		fetchAccesses();
	}, [trailerId]);

	const fetchAccesses = async () => {
		try {
			const response = await fetch(`/api/trailers/${trailerId}/access`);
			const data = await response.json();
			setAccesses(data.accesses || []);
		} catch (error) {
			console.error('Error fetching accesses:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateAccess = async (accessId: string, newAccessType: string) => {
		setUpdatingId(accessId);

		try {
			const response = await fetch(`/api/trailers/access/${accessId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ accessType: newAccessType }),
			});

			if (response.ok) {
				fetchAccesses();
			}
		} catch (error) {
			console.error('Error updating access:', error);
		} finally {
			setUpdatingId(null);
		}
	};

	const handleRevokeAccess = async (accessId: string) => {
		if (!confirm('Are you sure you want to revoke access for this user?')) return;

		setUpdatingId(accessId);

		try {
			const response = await fetch(`/api/trailers/access/${accessId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				fetchAccesses();
			}
		} catch (error) {
			console.error('Error revoking access:', error);
		} finally {
			setUpdatingId(null);
		}
	};

	if (loading) {
		return <div className="text-center py-8">Loading access list...</div>;
	}

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h3 className="text-lg font-semibold mb-4">Users with Access</h3>

			{accesses.length === 0 ? (
				<p className="text-gray-500 text-center py-8">No users have access yet</p>
			) : (
				<div className="space-y-3">
					{accesses.map((access) => (
						<div
							key={access.id}
							className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
						>
							<div className="flex-1">
								<p className="font-medium text-gray-900">{access.user.email}</p>
								<p className="text-sm text-gray-500">
									Access granted: {new Date(access.grantedAt).toLocaleDateString()}
								</p>
							</div>

							<div className="flex items-center gap-3">
								<select
									value={access.accessType}
									onChange={(e) => handleUpdateAccess(access.id, e.target.value)}
									disabled={updatingId === access.id}
									className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
								>
									<option value="VIEW">View</option>
									<option value="EDIT">Edit</option>
									<option value="ADMIN">Admin</option>
								</select>

								<button
									onClick={() => handleRevokeAccess(access.id)}
									disabled={updatingId === access.id}
									className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
								>
									Revoke
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
