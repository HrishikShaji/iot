"use client"
import { useState, useMemo } from "react"
import { UsersWithRole } from "../types/user-types"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/ui/table"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Badge } from "@repo/ui/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Mail, Shield, Search } from "lucide-react"

interface Props {
	users: UsersWithRole
}

export default function UserManagement({ users }: Props) {
	const [searchTerm, setSearchTerm] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const usersPerPage = 5

	const filteredUsers = useMemo(() => {
		return users.filter(user =>
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.role?.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [users, searchTerm])

	const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
	const startIndex = (currentPage - 1) * usersPerPage
	const endIndex = startIndex + usersPerPage
	const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

	const formatDate = (dateString: string | Date) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})
	}

	const handleEdit = (userId: string) => console.log("Edit user:", userId)
	const handleDelete = (userId: string) => console.log("Delete user:", userId)
	const handleSendEmail = (email: string) => console.log("Send email to:", email)
	const handleChangeRole = (userId: string) => console.log("Change role for user:", userId)

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) setCurrentPage(page)
	}

	return (
		<div className="w-full space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">User Management</h2>
					<p className="text-muted-foreground">
						Manage your users and their roles
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value)
								setCurrentPage(1) // reset pagination when searching
							}}
							className="pl-8 w-[300px]"
						/>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Context</TableHead>
							<TableHead>Verified</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedUsers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
									No users found
								</TableCell>
							</TableRow>
						) : (
							paginatedUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">{user.email}</TableCell>
									<TableCell>
										<Badge variant={user.role?.name === "Owner" ? "default" : "secondary"}>
											{user.role?.name || "N/A"}
										</Badge>
									</TableCell>
									<TableCell>
										<span className="text-sm text-muted-foreground">
											{user.role?.context || "N/A"}
										</span>
									</TableCell>
									<TableCell>
										<Badge variant={user.emailVerified ? "default" : "outline"}>
											{user.emailVerified ? "Verified" : "Unverified"}
										</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatDate(user.createdAt)}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<span className="sr-only">Open menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem onClick={() => handleEdit(user.id)}>
													<Pencil className="mr-2 h-4 w-4" />
													Edit User
												</DropdownMenuItem>
												<DropdownMenuItem onClick={() => handleChangeRole(user.id)}>
													<Shield className="mr-2 h-4 w-4" />
													Change Role
												</DropdownMenuItem>
												<DropdownMenuItem onClick={() => handleSendEmail(user.email)}>
													<Mail className="mr-2 h-4 w-4" />
													Send Email
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => handleDelete(user.id)}
													className="text-red-600"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Delete User
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<div>
					Showing {paginatedUsers.length} of {filteredUsers.length} users
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</Button>

					{Array.from({ length: totalPages }, (_, i) => (
						<Button
							key={i + 1}
							variant={currentPage === i + 1 ? "default" : "outline"}
							size="sm"
							onClick={() => handlePageChange(i + 1)}
						>
							{i + 1}
						</Button>
					))}

					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
