'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

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
			console.log("ERROR", error);
			setMessage({
				type: 'error',
				text: error instanceof Error ? error.message : 'Failed to send invitation',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Invite User</CardTitle>
				<CardDescription>Send an invitation to access your trailer</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email Address</Label>
						<Input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="user@example.com"
							required
							disabled={loading}
						/>
					</div>

					{message && (
						<Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
							{message.type === 'success' ? (
								<CheckCircle2 className="h-4 w-4" />
							) : (
								<AlertCircle className="h-4 w-4" />
							)}
							<AlertDescription>{message.text}</AlertDescription>
						</Alert>
					)}

					<Button type="submit" disabled={loading} className="w-full">
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{loading ? 'Sending...' : 'Send Invitation'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
