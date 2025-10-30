"use server"

import { auth } from "../../../../auth"
import { prisma } from "@repo/db"
import { revalidatePath } from "next/cache"

export async function createTrailer(name: string) {
	try {
		// Get session
		const session = await auth()

		if (!session?.user) {
			return {
				success: false,
				error: "You must be logged in to create a trailer"
			}
		}

		// Validate input
		if (!name || name.trim().length === 0) {
			return {
				success: false,
				error: "Trailer name is required"
			}
		}

		if (name.length > 100) {
			return {
				success: false,
				error: "Trailer name must be less than 100 characters"
			}
		}

		// Create trailer
		const trailer = await prisma.trailer.create({
			data: {
				name: name.trim(),
				userId: session.user.id
			}
		})

		// Revalidate the trailers page
		revalidatePath("/")

		return {
			success: true,
			trailer: {
				id: trailer.id,
				name: trailer.name
			}
		}
	} catch (error) {
		console.error("Error creating trailer:", error)
		return {
			success: false,
			error: "Failed to create trailer. Please try again."
		}
	}
}
