"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<button type="submit" disabled={loading}>
					{loading ? "Signing in..." : "Sign In"}
				</button>
			</form>

			{error && <p style={{ color: "red" }}>{error}</p>}

			<p>
				Don't have an account?{" "}
				<a href="/auth/register" style={{ color: "blue", textDecoration: "underline" }}>
					Register here
				</a>
			</p>
		</div>
	)
}
