import TrailerBreadCrumbs from "@/components/common/TrailerBreadCrumbs";
import SecurityHome from "@/features/security/components/SecurityHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<div>
			<TrailerBreadCrumbs id={id} links={[]} currentPage="security" />
			<SecurityHome trailerId={id} />
		</div>
	)
}
