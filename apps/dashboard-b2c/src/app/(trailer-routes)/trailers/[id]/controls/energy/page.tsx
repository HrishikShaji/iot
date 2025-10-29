import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";
import EnergyHome from "@/features/energy/components/EnergyHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<TrailerLayoutContainer trailerId={id} links={[]} currentPage="energy">
			<EnergyHome trailerId={id} />
		</TrailerLayoutContainer>
	)
}
