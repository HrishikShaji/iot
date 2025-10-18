import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@repo/db"


export async function POST(req: Request) {
	try {
		const { email, password, roleId, trailerName } = await req.json()

		if (!email || !password || !trailerName) {
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

		// const role = await prisma.role.findFirst({ where: { name: "user" } })
		// Create user

		// console.log("this is role", role)
		// if (!role) {
		// 	throw new Error("No Role")
		// }
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				roleId
			},
		})

		const role = await prisma.role.findUnique({ where: { id: roleId } })

		if (role?.name === "Owner Admin") {
			const trailer = await prisma.trailer.create({
				data: {
					name: trailerName,
					userId: user.id
				}
			})
			console.log("TRAILER CREATED", trailer)
		}

		return NextResponse.json(
			{ message: "User created successfully", userId: user.id },
			{ status: 201 }
		)
	} catch (error) {
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		)
	}
}
