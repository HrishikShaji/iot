import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs";
import SwitchHome from "@/features/switch/components/SwitchHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<div>
			<TrailerBreadCrumbs id={id} links={[]} currentPage="control" />
			<SwitchHome trailerId={id} />
		</div>
	)
}
