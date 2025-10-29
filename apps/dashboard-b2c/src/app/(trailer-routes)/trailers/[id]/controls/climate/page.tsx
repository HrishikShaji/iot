import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";
import ClimateHome from "@/features/climate/components/ClimateHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<TrailerLayoutContainer trailerId={id} links={[]} currentPage="climate">
			<ClimateHome trailerId={id} />
		</TrailerLayoutContainer>
	)
}
