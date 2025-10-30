
import { prisma } from "@repo/db";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import { Fragment } from "react"

interface Props {
	links: { label: string; href: string }[];
	currentPage?: string;
}


export default async function CustomBreadCrumbs({ currentPage, links }: Props) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{links.map((link) => (
					<Fragment key={link.href}>
						<BreadcrumbItem>
							<BreadcrumbLink href={link.href}>{link.label}</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</Fragment>
				))}
				{currentPage ?
					<BreadcrumbItem>
						<BreadcrumbPage>{currentPage}</BreadcrumbPage>
					</BreadcrumbItem>
					: null}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
