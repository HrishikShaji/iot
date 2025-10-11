"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { User, LogOut, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Props {
	email: string | undefined | null;
	status: "authenticated" | "unauthenticated" | "loading";
	signOut: () => Promise<void>;
}

export default function UserProfileMenu({ email, status, signOut }: Props) {
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)

	const handleLogout = async () => {
		setIsLoggingOut(true)
		await signOut()
	}

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center">
				<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
			</div>
		)
	}

	if (status === "unauthenticated" || !email) {
		return null
	}

	const initials = email
		? email
			.split("@")[0]
			.substring(0, 2)
			.toUpperCase()
		: "U"

	return (
		<div className="relative">
			{/* Collapsed State - Just Avatar */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="group"
			>
				<Avatar className="h-10 w-10 border-2 border-primary/10 bg-white cursor-pointer transition-all hover:border-primary/30 hover:scale-105">
					<AvatarFallback className="bg-primary/5  font-semibold group-hover:bg-primary/10">
						{initials}
					</AvatarFallback>
				</Avatar>
			</button>

			{/* Expanded State - Full Details */}
			{isExpanded && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsExpanded(false)}
					/>

					{/* Dropdown Card */}
					<div className="absolute bg-white rounded-2xl right-0 top-12 z-[9999]  shadow-lg animate-in slide-in-from-top-2 duration-200">
						<div className="p-4">
							<div className="flex items-center gap-3 pb-3 border-b">
								<div className="min-w-0 flex-1">
									<p className="font-semibold text-foreground truncate text-sm">
										{email}
									</p>
								</div>
							</div>

							<div className="pt-3">
								<Button
									onClick={handleLogout}
									disabled={isLoggingOut}
									variant="ghost"
									size="sm"
									className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
								>
									{isLoggingOut ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Logging out...
										</>
									) : (
										<>
											<LogOut className="mr-2 h-4 w-4" />
											Logout
										</>
									)}
								</Button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}
