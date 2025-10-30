import { ReactNode } from "react"
import CustomBreadCrumbs from "./CustomBreadcrumbs";

interface Props {
	children: ReactNode;
	links: { label: string; href: string; }[];
	currentPage?: string;
}

export default function LayoutContainer({ children, links, currentPage }: Props) {
	return (
		<div className="flex flex-col h-full gap-4 p-4">
			<CustomBreadCrumbs links={links} currentPage={currentPage} />
			<div className=" h-full overflow-y-auto custom-scrollbar pr-5">
				{children}
			</div>
		</div>

	)
}
