import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";
import WaterHome from "@/features/water/components/WaterHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<TrailerLayoutContainer trailerId={id} links={[]} currentPage="water">
			<WaterHome trailerId={id} />
		</TrailerLayoutContainer>
	)
}
