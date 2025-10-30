import RegisterForm from "@/features/auth/components/RegisterForm"
import { Suspense } from "react"

export default function Page() {
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
				<RegisterForm />
			</Suspense>

		</div>
	)
}
