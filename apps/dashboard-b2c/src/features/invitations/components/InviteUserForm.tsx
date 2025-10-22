'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Role } from '@repo/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useSession } from 'next-auth/react';

export default function InviteUserForm() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
	const [roles, setRoles] = useState<Role[]>([])
	const [rolesLoading, setRolesLoading] = useState(false)
	const [roleId, setRoleId] = useState("")
	const [trailerId, setTrailerId] = useState("")

	const { data } = useSession()
	console.log(data?.user.trailers)
	useEffect(() => {
		fetchRoles()
	}, [])

	const fetchRoles = async () => {
		console.log("this ran")
		try {
			setRolesLoading(true)
			const response = await fetch('/api/roles?context=B2C');
			if (!response.ok) throw new Error('Failed to fetch roles');
			const data = await response.json();
			setRoles(data);
		} catch (error) {
			// toast({
			// 	title: 'Error',
			// 	description: 'Failed to fetch roles',
			// 	variant: 'destructive',
			// });
		} finally {
			setRolesLoading(false)
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const response = await fetch('/api/invitations/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, roleId, trailerId }),
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
					<div className="space-y-2">
						<Label htmlFor="role">Trailer</Label>
						{data?.user.trailers ?
							<Select
								value={trailerId}
								onValueChange={(value) => setTrailerId(value)}
							>
								<SelectTrigger id="role">
									<SelectValue placeholder="Select trailer" />
								</SelectTrigger>
								<SelectContent>
									{data.user.trailers.map((trailer) => (
										<SelectItem key={trailer.id} value={trailer.id}>
											{trailer.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							:
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						}
					</div>

					<div className="space-y-2">
						<Label htmlFor="role">Role</Label>
						{rolesLoading ?
							<Loader2 className="w-4 h-4 mr-2 animate-spin" /> :
							<Select
								value={roleId}
								onValueChange={(value) => setRoleId(value)}
							>
								<SelectTrigger id="role">
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									{roles.map((role) => (
										<SelectItem key={role.id} value={role.id}>
											{role.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

						}
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
