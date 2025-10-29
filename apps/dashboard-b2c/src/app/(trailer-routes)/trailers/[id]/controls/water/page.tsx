import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs";
import WaterHome from "@/features/water/components/WaterHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<div>
			<TrailerBreadCrumbs id={id} links={[]} currentPage="control" />
			<WaterHome trailerId={id} />
		</div>
	)
}
