"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Alert, AlertDescription } from "@repo/ui/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Role } from "@repo/db"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select"
import { Badge } from "@repo/ui/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function CreateTrailerForm() {
	const [name, setName] = useState("")
	const [loading, setLoading] = useState(false)



	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Validation
		if (!name) {
			return
		}


		setLoading(true)

		try {
			const res = await fetch("/api/trailers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name }),
			})

			const data = await res.json()

			if (!res.ok) {
				setLoading(false)
				return
			}

		} catch (err) {
			console.log(err)
		} finally {
			setLoading(false)
		}
	}
	return (
		<div className="h-full flex items-center justify-center p-4">
			<Card className="w-full max-w-md border-border/40 shadow-sm">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-3xl  tracking-tight text-balance">Create a Trailer</CardTitle>
					<CardDescription className="text-base text-muted-foreground">
						Get started with your new trailer
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="text" className="text-sm font-medium">
								Name
							</Label>
							<Input
								id="name"
								type="text"
								placeholder="your trailer"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="h-11"
							/>
						</div>
						<Button type="submit" disabled={loading} className="w-full h-11 text-base font-medium">
							{loading ? "Creating trailer..." : "Create trailer"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
