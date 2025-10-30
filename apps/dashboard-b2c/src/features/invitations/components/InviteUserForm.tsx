'use client';
import { useEffect, useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, UserCheck, UserPlus } from 'lucide-react';
import { Role, Trailer, User } from '@repo/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { RolesForInvitation } from '../lib/fetchRolesForInvitation';
import { UsersForInvitation } from '../lib/fetchUsersForInvitation';
import CustomEmailInput from './CustomEmailInput';
import { Truck } from "@repo/ui/icons"

interface Props {
	trailerId: string;
	trailerName: string;
	roles: RolesForInvitation;
	users: UsersForInvitation;
}

export default function InviteUserForm({ roles, users, trailerId, trailerName }: Props) {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
	const [roleId, setRoleId] = useState("");
	const [selectedUser, setSelectedUser] = useState<User | null>(null);


	const handleEmailChange = (value: string) => {
		setEmail(value);
		setMessage(null);
	};


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const response = await fetch('/api/invitations/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: email.toLowerCase(),
					roleId,
					trailerId,
					existingUser: !!selectedUser,
					userId: selectedUser?.id
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to send invitation');
			}

			setMessage({
				type: 'success',
				text: selectedUser
					? 'Access granted to existing user!'
					: 'Invitation sent successfully!'
			});
			setEmail('');
			setSelectedUser(null);
			setRoleId('');
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
		<>
			<div className="border-b border-border ">
				<div className="mx-auto max-w-5xl px-6 py-6 ">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="flex items-start gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
								<Truck className="h-7 w-7 text-primary-foreground" />
							</div>
							<div className="space-y-2">
								<h1 className="text-2xl  font-medium tracking-tight text-foreground ">
									{`Invite users into ${trailerName}`}
								</h1>
								<p className="text-base text-muted-foreground">ID: {trailerId}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-16">
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Invite User</CardTitle>
						<CardDescription>Send an invitation to access your trailer</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<CustomEmailInput
									users={users}
									onEmailChange={handleEmailChange}
									email={email}
								/>
							</div>


							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<Select
									value={roleId}
									onValueChange={(value) => setRoleId(value)}
									disabled={loading}
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

							<Button
								type="submit"
								disabled={loading || !email || !roleId || !trailerId}
								className="w-full"
							>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{loading ? 'Processing...' : selectedUser ? 'Grant Access' : 'Send Invitation'}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>

		</>
	);
}
