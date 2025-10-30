import Inbox from "@/features/invitations/components/Inbox";
import { auth } from "../../../../auth";
import { notFound } from "next/navigation";
import { fetchInbox } from "@/features/invitations/lib/fetchInbox";
import LayoutContainer from "@/components/common/LayoutContainer";

export default async function Page() {
	const session = await auth()

	if (!session || !session.user.email) {
		return notFound()
	}

	const inboxInvitations = await fetchInbox(session.user.email)

	const links = [{ label: "Home", href: "/" }]

	return (
		<LayoutContainer links={links} currentPage="inbox" >
			<Inbox invitations={inboxInvitations} />
		</LayoutContainer>
	)
}
