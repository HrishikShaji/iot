"use client"

import type React from "react"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
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
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		})

		if (result?.error) {
			setError("Invalid credentials")
		} else {
			router.push("/")
		}

		setLoading(false)
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md border-border/40 shadow-sm">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-3xl  tracking-tight text-balance">Welcome back</CardTitle>
					<CardDescription className="text-base text-muted-foreground">
						Sign in to your account to continue
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
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
							{loading ? "Signing in..." : "Sign in"}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center border-t border-border/40 pt-6">
					<p className="text-sm text-muted-foreground">
						Don't have an account?{" "}
						<Link
							href="/auth/register"
							className="font-medium text-foreground hover:underline underline-offset-4 transition-colors"
						>
							Create account
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}

