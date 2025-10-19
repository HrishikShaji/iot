// components/InvitationsList.tsx
'use client';

import { useState, useEffect } from 'react';

interface Invitation {
	id: string;
	email: string;
	status: string;
	createdAt: string;
	expiresAt: string;
}

export default function InvitationsList() {
	const [invitations, setInvitations] = useState<Invitation[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchInvitations();
	}, []);

	const fetchInvitations = async () => {
		try {
			const response = await fetch('/api/invitations');
			const data = await response.json();
			setInvitations(data.invitations || []);
		} catch (error) {
			console.error('Error fetching invitations:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleRevoke = async (id: string) => {
		if (!confirm('Are you sure you want to revoke this invitation?')) return;

		try {
			const response = await fetch(`/api/invitations/${id}/revoke`, {
				method: 'POST',
			});

			if (response.ok) {
				fetchInvitations();
			}
		} catch (error) {
			console.error('Error revoking invitation:', error);
		}
	};

	const getStatusBadge = (status: string, expiresAt: string) => {
		const isExpired = new Date(expiresAt) < new Date();
		const actualStatus = isExpired ? 'EXPIRED' : status;

		const colors = {
			PENDING: 'bg-yellow-100 text-yellow-800',
			ACCEPTED: 'bg-green-100 text-green-800',
			EXPIRED: 'bg-gray-100 text-gray-800',
		};

		return (
			<span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[actualStatus as keyof typeof colors]}`}>
				{actualStatus}
			</span>
		);
	};

	if (loading) {
		return <div className="text-center py-8">Loading invitations...</div>;
	}

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h2 className="text-xl font-semibold mb-4">Sent Invitations</h2>

			{invitations.length === 0 ? (
				<p className="text-gray-500 text-center py-8">No invitations sent yet</p>
			) : (
				<div className="space-y-4">
					{invitations.map((invitation) => (
						<div
							key={invitation.id}
							className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
						>
							<div className="flex-1">
								<p className="font-medium text-gray-900">{invitation.email}</p>
								<p className="text-sm text-gray-500">
									Sent: {new Date(invitation.createdAt).toLocaleDateString()}
								</p>
								<p className="text-sm text-gray-500">
									Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
								</p>
							</div>

							<div className="flex items-center gap-3">
								{getStatusBadge(invitation.status, invitation.expiresAt)}

								{invitation.status === 'PENDING' && new Date(invitation.expiresAt) > new Date() && (
									<button
										onClick={() => handleRevoke(invitation.id)}
										className="text-red-600 hover:text-red-800 text-sm font-medium"
									>
										Revoke
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
