// app/dashboard/page.tsx
import SharedTrailersList from '@/features/trailers/components/SharedTrailersList';
import Link from 'next/link';

export default function DashboardPage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<Link
					href="/invitations"
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				>
					Manage Invitations
				</Link>
			</div>

			<div className="grid gap-8">
				{/* Your own trailer section */}
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-4">My Trailer</h2>
					{/* Add your trailer details here */}
				</div>

				{/* Shared trailers section */}
				<SharedTrailersList />
			</div>
		</div>
	);
}
