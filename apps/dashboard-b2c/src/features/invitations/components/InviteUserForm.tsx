'use client';

import { useState } from 'react';

export default function InviteUserForm() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const response = await fetch('/api/invitations/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to send invitation');
			}

			setMessage({ type: 'success', text: 'Invitation sent successfully!' });
			setEmail('');
		} catch (error) {
			console.log("ERROR", error)
			setMessage({
				type: 'error',
				text: error instanceof Error ? error.message : 'Failed to send invitation',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h2 className="text-xl font-semibold mb-4">Invite User to Access Your Trailer</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="user@example.com"
						required
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				{message && (
					<div
						className={`p-4 rounded-lg ${message.type === 'success'
							? 'bg-green-50 text-green-800'
							: 'bg-red-50 text-red-800'
							}`}
					>
						{message.text}
					</div>
				)}

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
				>
					{loading ? 'Sending...' : 'Send Invitation'}
				</button>
			</form>
		</div>
	);
}
