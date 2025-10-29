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
	id: string;
	links: { label: string; href: string }[];
	currentPage?: string;
}

async function fetchTrailer(id: string) {
	const trailer = await prisma.trailer.findUnique({ where: { id }, select: { name: true } })
	return trailer
}

export default async function TrailerBreadCrumbs({ currentPage, links, id }: Props) {
	const trailer = await fetchTrailer(id)

	if (!trailer) return <div>No trailer</div>

	const firstLink = { label: trailer.name, href: `/trailers/${id}` }
	const finalLinks = [firstLink, ...links]


	return (
		<Breadcrumb>
			<BreadcrumbList>
				{finalLinks.map((link) => (
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
