import TrailerLayoutContainer from "@/components/common/TrailerLayoutContainer";
import SecurityHome from "@/features/security/components/SecurityHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<TrailerLayoutContainer trailerId={id} links={[]} currentPage="security">
			<SecurityHome trailerId={id} />
		</TrailerLayoutContainer>
	)
}
