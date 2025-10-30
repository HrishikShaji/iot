import RegisterForm from "@/features/auth/components/RegisterForm"
import { validateInvitation } from "@/features/auth/lib/validateInvitation";
import { prisma } from "@repo/db";
import { Suspense } from "react"


export default async function Page({ searchParams }: { searchParams: Promise<{ token: string }> }) {

	const { token } = await searchParams

	if (!token) {
		<div>
			<RegisterForm />
		</div>
	}
	console.log("Token in server side", token)

	const invitation = await validateInvitation(token)

	return (
		<div>
			<Suspense fallback={
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
						<p className="mt-4 text-gray-600">Loading...</p>
					</div>
				</div>
			}>
				<RegisterForm
					invitation={invitation}
					invitationToken={token}
				/>
			</Suspense>

		</div>
	)
}
