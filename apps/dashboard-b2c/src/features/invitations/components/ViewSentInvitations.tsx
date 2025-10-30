import { Loader2, Mail, Calendar, Clock } from 'lucide-react';
import { auth } from '../../../../auth';
import fetchInvitations from '@/features/users/lib/fetchInvitations';
import InvitationRow from './InvitationRow';
import { Truck } from "@repo/ui/icons"

interface Props {
	trailerId: string;
	trailerName: string;
}

async function fetchData(trailerId: string) {
	const session = await auth()
	if (!session) {
		throw new Error("No session")
	}
	const user = session.user;

	if (!user) {
		throw new Error("No user")
	}

	const invitations = await fetchInvitations({ userId: user.id, trailerId })
	return invitations

}

export default async function ViewSentInvitations({ trailerId, trailerName }: Props) {
	const invitations = await fetchData(trailerId)
	return (
		<>
			<div className="border-b border-border ">
				<div className="mx-auto max-w-5xl px-6 py-6 ">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="flex items-start gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
								<Truck className="h-7 w-7 text-primary-foreground" />
							</div>
							<div className="space-y-2">
								<h1 className="text-2xl  font-medium tracking-tight text-foreground ">
									{`Invitations sent from ${trailerName}`}
								</h1>
								<p className="text-base text-muted-foreground">ID: {trailerId}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-5xl flex flex-col gap-2 px-6 py-8 lg:px-8 lg:py-16">
				{invitations.length === 0 ? (
					<div className="text-center py-8">
						<Mail className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
						<p className="text-muted-foreground">No invitations sent yet</p>
					</div>
				) : (
					<div className="space-y-3">
						{invitations.map((invitation) => (
							<InvitationRow invitation={invitation} key={invitation.id} />
						))}
					</div>
				)}
			</div>
		</>
	);
}
