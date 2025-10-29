import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";
import SwitchAnalytics from "@/features/switch/components/SwitchAnalytics";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params

	const links = [
		{ label: "switch", href: `/trailers/${id}/controls/switch` }
	]

	return (
		<TrailerLayoutContainer trailerId={id} links={links} currentPage="analytics">
			<SwitchAnalytics trailerId={id} />
		</TrailerLayoutContainer>
	)
}
