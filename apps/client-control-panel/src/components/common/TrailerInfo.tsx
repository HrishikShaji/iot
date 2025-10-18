"use client"
import { useSession } from "next-auth/react";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";

export default function TrailerInfo() {
	const { status, data } = useSession()

	if (status === "unauthenticated") {
		return null;
	}

	if (status === "loading") {
		return <Loader2 className="w-4 h-4 animate-spin" />
	}
	return (
		<Badge>{`Trailer:${data?.user.trailer.name}`}</Badge>
	)
}
