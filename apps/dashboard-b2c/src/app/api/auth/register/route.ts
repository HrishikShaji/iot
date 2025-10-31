import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@repo/db"


export async function POST(req: Request) {
	try {
		const { email, password, invitationToken, roleId } = await req.json()

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			)
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		})


		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 }
			)
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10)


		if (invitationToken) {

			if (!roleId) {
				return NextResponse.json(
					{ error: 'roleId is required' },
					{ status: 400 }
				);

			}

			const invitation = await prisma.invitation.findUnique({
				where: { token: invitationToken },
			});

			if (
				!invitation ||
				invitation.status !== 'PENDING' ||
				invitation.expiresAt < new Date() ||
				invitation.email !== email
			) {
				return NextResponse.json(
					{ error: 'Invalid or expired invitation' },
					{ status: 400 }
				);
			}

			// Create user and grant access in transaction
			const result = await prisma.$transaction(async (tx) => {

				const user = await tx.user.create({
					data: {
						email,
						password: hashedPassword,
					},
				});

				await tx.trailerAccess.create({
					data: {
						roleId,
						userId: user.id,
						trailerId: invitation.trailerId,
						grantedBy: invitation.inviterId,
						accessType: 'VIEW',
					},
				});

				await tx.invitation.update({
					where: { id: invitation.id },
					data: { status: 'ACCEPTED' },
				});

				return user;
			});

			console.log("user with invited trailer", result)

			return NextResponse.json({
				message: 'Account created successfully with trailer access',
				user: { id: result.id, email: result.email },
			});
		}

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		})

		return NextResponse.json(
			{ message: "User created successfully", userId: user.id },
			{ status: 201 }
		)
	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		)
	}
}
