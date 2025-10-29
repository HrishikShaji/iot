import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params

	const links = [
		{ label: "security", href: `/trailers/${id}/controls/security` }
	]

	return (
		<div>
			<TrailerBreadCrumbs id={id} links={links} currentPage="analytics" />
		</div>
	)
}
