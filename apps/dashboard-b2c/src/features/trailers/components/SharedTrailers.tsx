import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { auth } from "../../../../auth";
import { prisma } from "@repo/db";
import { Badge } from "@repo/ui/components/ui/badge";
import { ArrowUpRightIcon } from "@repo/ui/icons";
import Link from "next/link";

async function fetchTrailers() {
	const session = await auth()
	console.log("session in server:", session)
	if (!session) {
		throw new Error("No session")
	}
	const user = session.user;

	if (!user) {
		throw new Error("Unauthorized")
	}

	const trailers = await prisma.trailerAccess.findMany({
		where: { userId: user.id, grantedBy: { not: user.id } },
		include: {
			trailer: {
				include: {
					user: {
						select: {
							email: true,
						},
					},
				},
			},
			role: {
				select: {
					id: true,
					name: true,
					description: true
				}
			}
		},
	});

	return trailers;

}

export default async function SharedTrailers() {
	const trailers = await fetchTrailers()
	console.log("these are server trailers:", trailers)
	return (
		<div className="flex flex-col gap-5">
			<h1 className="text-4xl font-semibold pb-3 w-full border-b-2">Shared Trailers</h1>
			{trailers.length === 0 ?
				<div>No Trailers shared with you.</div>
				:
				<div className="grid grid-cols-4 gap-3">
					{trailers.map(access => (
						<Card key={access.trailer.id}>
							<CardHeader>{access.trailer.name}</CardHeader>
							<CardContent>
								<div className="flex w-full justify-between">
									<Badge>
										{new Date(access.trailer.createdAt).toLocaleDateString()}
									</Badge>
									<Link href={`trailers/${access.trailer.id}`}>
										<ArrowUpRightIcon className="hover:scale-125" />
									</Link>
								</div>
							</CardContent>
						</Card>

					))}
				</div>
			}
		</div>
	)
}
