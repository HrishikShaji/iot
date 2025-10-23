import SwitchHome from "@/features/switch/components/SwitchHome";

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
	const { id } = await params
	return (
		<SwitchHome trailerId={id} />
	)
}
