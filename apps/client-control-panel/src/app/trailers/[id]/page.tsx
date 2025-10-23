import TrailerControlPanel from "@/components/common/TrailerControlPanel";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<div>
			<TrailerControlPanel trailerId={id} />
		</div>
	)
}
