import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs";
import SwitchAnalytics from "@/features/switch/components/SwitchAnalytics";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params

	const links = [
		{ label: "switch", href: `/trailers/${id}/controls/switch` }
	]

	return (
		<div>
			<TrailerBreadCrumbs id={id} links={links} currentPage="analytics" />
			<SwitchAnalytics trailerId={id} />
		</div>
	)
}
