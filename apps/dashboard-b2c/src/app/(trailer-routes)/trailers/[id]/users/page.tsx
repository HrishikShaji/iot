import TrailerUsers from "@/features/trailers/components/TrailerUsers"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div>
			<TrailerUsers trailerId={id} />
		</div>
	)
}
