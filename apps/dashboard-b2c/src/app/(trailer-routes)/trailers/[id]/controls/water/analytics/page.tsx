import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params

	const links = [
		{ label: "water", href: `/trailers/${id}/controls/water` }
	]

	return (
		<div>
			<TrailerBreadCrumbs id={id} links={links} currentPage="analytics" />
		</div>
	)
}
