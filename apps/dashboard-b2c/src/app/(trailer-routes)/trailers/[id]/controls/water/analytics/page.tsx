import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params

	const links = [
		{ label: "water", href: `/trailers/${id}/controls/water` }
	]

	return (
		<TrailerLayoutContainer trailerId={id} links={links} currentPage="analytics">
			<div>
			</div>
		</TrailerLayoutContainer>
	)
}
