import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";
import SwitchAnalytics from "@/features/switch/components/SwitchAnalytics";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params

	const links = [
		{ label: "climate", href: `/trailers/${id}/controls/climate` }
	]

	return (
		<TrailerLayoutContainer links={links} trailerId={id} currentPage="analytics">
			<SwitchAnalytics trailerId={id} />
		</TrailerLayoutContainer>
	)
}
