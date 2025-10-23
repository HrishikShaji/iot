import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@repo/db"
import { auth } from "../../../../../auth"


export async function POST(req: Request) {
	try {
		const { invitationToken, roleId } = await req.json()
		console.log(invitationToken, roleId)
		const session = await auth()

		const user = session?.user

		if (!user) {
			return NextResponse.json({ error: "user is required" })

		}

		if (!invitationToken || !roleId) {
			return NextResponse.json({ error: "token is required" })
		}

		const invitation = await prisma.invitation.findUnique({
			where: { token: invitationToken },
		});

		if (
			!invitation ||
			invitation.status !== 'PENDING' ||
			invitation.expiresAt < new Date()
		) {
			return NextResponse.json(
				{ error: 'Invalid or expired invitation' },
				{ status: 400 }
			);
		}

		// Create user and grant access in transaction
		const result = await prisma.$transaction(async (tx) => {


			await tx.invitation.update({
				where: { id: invitation.id },
				data: { status: 'EXPIRED' },
			});

			return user;
		});

		console.log("user with invited trailer", result)

		return NextResponse.json({
			message: 'trailer access created',
			user: { id: result.id, email: result.email },
		});


	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		)
	}
}
