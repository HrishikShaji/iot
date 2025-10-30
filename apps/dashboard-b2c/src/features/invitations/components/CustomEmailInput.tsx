import { Badge } from "@repo/ui/components/ui/badge";
import { Input } from "@repo/ui/components/ui/input";
import { UserCheck, UserPlus } from "@repo/ui/icons";
import { User } from "@repo/db";
import { useState, useEffect } from "react"
import { UsersForInvitation } from "../lib/fetchUsersForInvitation";

interface Props {
	users: UsersForInvitation;
	email: string;
	onEmailChange: (value: string) => void;
}

export default function CustomEmailInput({ users, onEmailChange, email }: Props) {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

	useEffect(() => {
		if (email && !selectedUser && email.includes('@')) {
			const exactMatch = users.find(
				user => user.email.toLowerCase() === email.toLowerCase()
			);
			if (exactMatch) {
				setSelectedUser(exactMatch);
			}
		}
	}, [email, selectedUser, users]);


	const filterUsers = (searchTerm: string) => {
		if (!searchTerm || searchTerm.length < 2) {
			setFilteredUsers([]);
			return;
		}

		const filtered = users.filter(user =>
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
		).slice(0, 5); // Limit to 5 suggestions

		setFilteredUsers(filtered);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onEmailChange(value);
		setSelectedUser(null); // Clear selected user when typing
		filterUsers(value);
		setShowSuggestions(true);
	};

	const handleUserSelect = (user: User) => {
		onEmailChange(user.email);
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

	return (
		<>
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

		</>
	)
}
