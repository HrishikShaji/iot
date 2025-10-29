import { ReactNode } from "react"
import TrailerBreadCrumbs from "./TrailerBreadCrumbs";

interface Props {
	children: ReactNode;
	trailerId: string;
	links: { label: string; href: string; }[];
	currentPage?: string;
}

export default function TrailerLayoutContainer({ children, trailerId, links, currentPage }: Props) {
	return (
		<div className="flex flex-col h-full gap-4 p-4">
			<TrailerBreadCrumbs links={links} id={trailerId} currentPage={currentPage} />
			<div className=" h-full overflow-y-auto custom-scrollbar pr-5">
				{children}
			</div>
		</div>
	)
}
