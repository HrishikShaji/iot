import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs";
import EnergyHome from "@/features/energy/components/EnergyHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<div>
			<TrailerBreadCrumbs id={id} links={[]} currentPage="control" />
			<EnergyHome trailerId={id} />
		</div>
	)
}
