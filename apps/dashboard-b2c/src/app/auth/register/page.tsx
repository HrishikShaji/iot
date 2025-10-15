"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Page() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		// Validation
		if (!email || !password || !confirmPassword) {
			setError("All fields are required")
			return
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match")
			return
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters")
			return
		}

		setLoading(true)

		try {
			// Register user
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.error || "Something went wrong")
				setLoading(false)
				return
			}

			// Automatically sign in after successful registration
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			})

			if (result?.error) {
				setError("Registration successful, but login failed. Please try logging in.")
			} else {
				router.push("/")
			}
		} catch (err) {
			setError("Something went wrong. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="h-full flex items-center justify-center p-4">
			<Card className="w-full max-w-md border-border/40 shadow-sm">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-3xl  tracking-tight text-balance">Create an account</CardTitle>
					<CardDescription className="text-base text-muted-foreground">
						Get started with your new account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium">
								Email address
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="h-11"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium">
								Password
							</Label>
							<Input
								id="password"
								type="password"
								placeholder="Create a password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="h-11"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="text-sm font-medium">
								Confirm password
							</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Confirm your password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="h-11"
							/>
						</div>

						{error && (
							<Alert variant="destructive" className="py-3">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button type="submit" disabled={loading} className="w-full h-11 text-base font-medium">
							{loading ? "Creating account..." : "Create account"}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center border-t border-border/40 pt-6">
					<p className="text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link
							href="/auth/login"
							className="font-medium text-foreground hover:underline underline-offset-4 transition-colors"
						>
							Sign in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}
