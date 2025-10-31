// types/next-auth.d.ts
import { Trailer } from "@repo/db"
import { DefaultSession } from "next-auth"

interface Permission {
	id: string
	permission: {
		id: string
		action: string
		context: string
		description: string
		scope: string
	}
}

export interface Role {
	id: string
	name: string
	permissions: Permission[]
}

declare module "next-auth" {
	interface Session {
		user: {
			id: string
			role: string
		} & DefaultSession["user"]
	}

	interface User {
		role: string
	}
}

declare module "@auth/core/adapters" {
	interface AdapterUser {
		role: string
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string
		role: string
	}
}
