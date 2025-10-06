"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

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
				router.push("/") // Redirect after successful registration
			}
		} catch (err) {
			setError("Something went wrong. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<h1>Register</h1>
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

				<div>
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						id="confirmPassword"
						type="password"
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>

				<button type="submit" disabled={loading}>
					{loading ? "Creating account..." : "Register"}
				</button>
			</form>

			{error && <p style={{ color: "red" }}>{error}</p>}

			<p>
				Already have an account?{" "}
				<a href="/auth/login" style={{ color: "blue", textDecoration: "underline" }}>
					Login here
				</a>
			</p>
		</div>
	)
}
