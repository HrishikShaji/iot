import TrailerAccessManager from "@/features/trailers/components/TrailerAccessManager";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<div>
			<TrailerAccessManager trailerId={id} />
		</div>
	)
}
