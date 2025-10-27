import { prisma } from "@repo/db"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export default {
	providers: [Credentials({
		name: "Credentials",
		credentials: {
			email: { label: "Email", type: "email" },
			password: { label: "Password", type: "password" },
		},
		async authorize(credentials) {
			if (!credentials?.email || !credentials?.password) {
				throw new Error("Missing credentials")
			}

			const user = await prisma.user.findUnique({
				where: { email: credentials.email as string },
				include: {
					role:
					{
						select:
						{
							id: true,
							name: true,
							permissions: {
								select: {
									id: true,
									permission: {
										select: {
											description: true,
											scope: true,
											id: true,
											actions: true,
											context: true,
										}
									}
								}
							}
						}
					},
					trailers: true
				}
			})

			console.log("THIS IS AUTHENTICATED USER", user)

			if (!user || !user.password) {
				throw new Error("Invalid credentials")
			}

			const isPasswordValid = await bcrypt.compare(
				credentials.password as string,
				user.password
			)

			if (!isPasswordValid) {
				throw new Error("Invalid credentials")
			}

			return {
				id: user.id,
				email: user.email,
				role: user.role as any,
				trailers: user.trailers as any
			}
		},
	}),],
	pages: {
		signIn: "/login", // Customize your login page path
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.role = user.role
				token.trailers = user.trailers
			}
			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string
				session.user.role = token.role as any
				session.user.trailers = token.trailers as any
			}
			return session
		},
	},

} satisfies NextAuthConfig
