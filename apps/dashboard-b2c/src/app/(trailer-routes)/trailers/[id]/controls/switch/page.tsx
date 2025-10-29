import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";
import SwitchHome from "@/features/switch/components/SwitchHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<TrailerLayoutContainer trailerId={id} links={[]} currentPage="switch">
			<SwitchHome trailerId={id} />
		</TrailerLayoutContainer>
	)
}
