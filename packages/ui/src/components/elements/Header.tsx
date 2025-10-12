import { Wifi, WifiOff } from "lucide-react";
import { ReactNode } from "react";

interface Props {
	isConnected: boolean;
	children: ReactNode;
	title: string;
	subtitle: string;
}

export default function Header({ isConnected, children, title, subtitle }: Props) {
	return (
		<div className="text-center space-y-2 px-10 py-5 w-full flex left-0 top-0 justify-between absolute z-10 items-center">
			<div className="text-left">
				<h1 className="text-4xl font-bold text-white">{title}</h1>
				<p className="text-muted-foreground text-lg">{subtitle}</p>
			</div>
			<div className="flex gap-2 items-center">
				{isConnected ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
				{children}
			</div>
		</div>

	)
}
