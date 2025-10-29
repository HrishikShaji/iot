import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs";
import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params

	const links = [
		{ label: "energy", href: `/trailers/${id}/controls/energy` }
	]

	return (
		<TrailerLayoutContainer links={links} trailerId={id} currentPage="analytics">
			<div></div>
		</TrailerLayoutContainer>
	)
}
