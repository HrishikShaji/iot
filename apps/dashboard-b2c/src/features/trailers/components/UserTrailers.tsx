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

	const trailers = await prisma.trailer.findMany({
		where: {
			userId: user.id
		},
		include: {
			user: {
				include: {
					role: true
				}
			}
		}
	})

	return trailers;

}

export default async function UserTrailers() {
	const trailers = await fetchTrailers()
	console.log("these are server trailers:", trailers)
	return (
		<div className="flex flex-col gap-5">
			<h1 className="text-4xl font-semibold pb-3 w-full border-b-2">Your Trailers</h1>
			{trailers.length === 0 ?
				<div>You have no trailers</div>
				:
				<div className="grid grid-cols-4 gap-3">
					{trailers.map(trailer => (
						<Card key={trailer.id}>
							<CardHeader>{trailer.name}</CardHeader>
							<CardContent>
								<div className="flex w-full justify-between">
									<Badge>
										{new Date(trailer.createdAt).toLocaleDateString()}
									</Badge>
									<Link href={`trailers/${trailer.id}`}>
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
