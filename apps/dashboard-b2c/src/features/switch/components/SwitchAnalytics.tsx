"use client"
import SwitchStatsTable from "@/features/switch/components/SwitchStatsTable";
import useSwitchMonitoring from "@/features/switch/hooks/useSwitchMonitoring";
import SwitchChart1 from "./SwitchChart1";

interface Props {
	trailerId: string;
}

export default function SwitchAnalytics({ trailerId }: Props) {
	const { messages } = useSwitchMonitoring({ trailerId })
	return (
		<div className="p-10">
			<SwitchStatsTable messages={messages} />
			<SwitchChart1 messages={messages} />
		</div>
	)
}
