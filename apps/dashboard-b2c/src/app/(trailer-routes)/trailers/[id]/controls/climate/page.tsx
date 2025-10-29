import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs";
import ClimateHome from "@/features/climate/components/ClimateHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<div>
			<TrailerBreadCrumbs id={id} links={[]} currentPage="control" />
			<ClimateHome trailerId={id} />
		</div>
	)
}
