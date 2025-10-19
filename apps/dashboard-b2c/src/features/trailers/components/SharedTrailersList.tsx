'use client';

import { useState, useEffect } from 'react';

interface SharedTrailer {
	id: string;
	accessType: string;
	grantedAt: string;
	trailer: {
		id: string;
		name: string;
		user: {
			email: string;
		};
	};
}

export default function SharedTrailersList() {
	const [sharedTrailers, setSharedTrailers] = useState<SharedTrailer[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchSharedTrailers();
	}, []);

	const fetchSharedTrailers = async () => {
		try {
			const response = await fetch('/api/trailers/shared');
			const data = await response.json();
			setSharedTrailers(data.sharedTrailers || []);
		} catch (error) {
			console.error('Error fetching shared trailers:', error);
		} finally {
			setLoading(false);
		}
	};

	const getAccessBadge = (accessType: string) => {
		const colors = {
			VIEW: 'bg-blue-100 text-blue-800',
			EDIT: 'bg-green-100 text-green-800',
			ADMIN: 'bg-purple-100 text-purple-800',
		};

		return (
			<span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[accessType as keyof typeof colors]}`}>
				{accessType}
			</span>
		);
	};

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow p-6">
				<div className="text-center py-8">Loading shared trailers...</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h2 className="text-xl font-semibold mb-4">Trailers Shared With You</h2>

			{sharedTrailers.length === 0 ? (
				<p className="text-gray-500 text-center py-8">No trailers shared with you yet</p>
			) : (
				<div className="space-y-4">
					{sharedTrailers.map((sharedTrailer) => (
						<div
							key={sharedTrailer.id}
							className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
						>
							<div className="flex-1">
								<h3 className="font-medium text-gray-900">{sharedTrailer.trailer.name}</h3>
								<p className="text-sm text-gray-500">
									Owner: {sharedTrailer.trailer.user.email}
								</p>
								<p className="text-sm text-gray-500">
									Access granted: {new Date(sharedTrailer.grantedAt).toLocaleDateString()}
								</p>
							</div>

							<div className="flex items-center gap-3">
								{getAccessBadge(sharedTrailer.accessType)}

								<a href={`/trailers/${sharedTrailer.trailer.id}`}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
								>
									View
								</a>
							</div>
						</div>
					))}
				</div>
			)
			}
		</div >
	);
}
