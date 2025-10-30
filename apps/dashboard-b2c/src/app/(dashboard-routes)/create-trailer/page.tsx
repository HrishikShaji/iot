import LayoutContainer from "@/components/common/LayoutContainer";
import CreateTrailerForm from "@/features/trailers/components/CreateTrailerForm";

export default function Page() {
	const links = [{ label: "Home", href: "/" }]
	return (
		<LayoutContainer links={links} currentPage="create">
			<CreateTrailerForm />
		</LayoutContainer>
	)
}
