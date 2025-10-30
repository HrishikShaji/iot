import LayoutContainer from "@/components/common/LayoutContainer";
import CreateTrailerForm from "@/features/trailers/components/CreateTrailerForm";

export default function Page() {
	const links = [{ label: "trailers", href: "/" }]
	return (
		<LayoutContainer links={links}>
			<CreateTrailerForm />
		</LayoutContainer>
	)
}
