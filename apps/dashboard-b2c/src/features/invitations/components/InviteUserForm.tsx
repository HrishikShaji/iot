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
import { Badge } from "@repo/ui/components/ui/badge";
import { useSession } from 'next-auth/react';

export default function InviteUserForm() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
	const [roles, setRoles] = useState<Role[]>([]);
	const [roleId, setRoleId] = useState("");
	const [trailerId, setTrailerId] = useState("");
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [trailers, setTrailers] = useState<Trailer[]>([])
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

	const { data } = useSession();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const initializeData = async () => {
			await Promise.all([fetchRoles(), fetchUsers(), fetchTrailers()]);
			setIsReady(true);
		};
		initializeData();
	}, []);

	// Auto-detect exact email match
	useEffect(() => {
		if (email && !selectedUser && email.includes('@')) {
			const exactMatch = allUsers.find(
				user => user.email.toLowerCase() === email.toLowerCase()
			);
			if (exactMatch) {
				setSelectedUser(exactMatch);
			}
		}
	}, [email, selectedUser, allUsers]);
	const fetchTrailers = async () => {
		try {
			const response = await fetch('/api/trailers');
			const data = await response.json();
			setTrailers(data.trailers || []);
			console.log(data.trailers)
		} catch (error) {
			console.error('Error fetching shared trailers:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/users');
			if (!response.ok) throw new Error('Failed to fetch users');
			const data = await response.json();
			setAllUsers(data.users);
		} catch (error) {
			console.error('Failed to fetch users:', error);
		}
	};

	const fetchRoles = async () => {
		try {
			const response = await fetch('/api/roles?context=B2C');
			if (!response.ok) throw new Error('Failed to fetch roles');
			const data = await response.json();
			setRoles(data);
		} catch (error) {
			console.error('Failed to fetch roles:', error);
		}
	};

	const filterUsers = (searchTerm: string) => {
		if (!searchTerm || searchTerm.length < 2) {
			setFilteredUsers([]);
			return;
		}

		const filtered = allUsers.filter(user =>
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
		).slice(0, 5); // Limit to 5 suggestions

		setFilteredUsers(filtered);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		setSelectedUser(null); // Clear selected user when typing
		setMessage(null);
		filterUsers(value);
		setShowSuggestions(true);
	};

	const handleUserSelect = (user: User) => {
		setEmail(user.email);
		setSelectedUser(user);
		setShowSuggestions(false);
		setFilteredUsers([]);
	};

	const handleEmailBlur = () => {
		// Just hide suggestions after a delay
		setTimeout(() => {
			setShowSuggestions(false);
		}, 200);
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
			console.error("ERROR", error);
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
				{!isReady || !data?.user.trailers ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="w-6 h-6 animate-spin" />
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<div className="relative">
								<Input
									type="email"
									id="email"
									value={email}
									onChange={handleEmailChange}
									onFocus={() => email.length >= 2 && setShowSuggestions(true)}
									onBlur={handleEmailBlur}
									placeholder="user@example.com"
									required
									disabled={loading}
									className={selectedUser ? "border-green-500" : ""}
								/>
								{selectedUser && (
									<div className="absolute right-3 top-1/2 -translate-y-1/2">
										<UserCheck className="w-4 h-4 text-green-600" />
									</div>
								)}

								{/* Suggestions dropdown */}
								{showSuggestions && filteredUsers.length > 0 && (
									<div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
										{filteredUsers.map((user) => (
											<button
												key={user.id}
												type="button"
												onMouseDown={(e) => {
													e.preventDefault(); // Prevent blur from firing
													handleUserSelect(user);
												}}
												className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
											>
												<span className="text-sm">{user.email}</span>
												<Badge variant="outline" className="text-xs">
													<UserCheck className="w-3 h-3 mr-1" />
													Existing
												</Badge>
											</button>
										))}
									</div>
								)}
							</div>

							{selectedUser && (
								<div className="flex items-center gap-2 mt-2">
									<Badge variant="secondary" className="flex items-center gap-1">
										<UserCheck className="w-3 h-3" />
										Existing User
									</Badge>
									<span className="text-xs text-muted-foreground">
										Will grant access immediately
									</span>
								</div>
							)}
							{email && !selectedUser && email.includes('@') && (
								<div className="flex items-center gap-2 mt-2">
									<Badge variant="outline" className="flex items-center gap-1">
										<UserPlus className="w-3 h-3" />
										New User
									</Badge>
									<span className="text-xs text-muted-foreground">
										Will send invitation email
									</span>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="trailer">Trailer</Label>
							<Select
								value={trailerId}
								onValueChange={(value) => setTrailerId(value)}
								disabled={loading}
							>
								<SelectTrigger id="trailer">
									<SelectValue placeholder="Select trailer" />
								</SelectTrigger>
								<SelectContent>
									{trailers.map((trailer) => (
										<SelectItem key={trailer.id} value={trailer.id}>
											{trailer.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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
				)}
			</CardContent>
		</Card>
	);
}
