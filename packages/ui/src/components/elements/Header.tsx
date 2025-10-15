"use client"
import { SidebarIcon, Wifi, WifiOff } from "lucide-react";
import { ReactNode } from "react";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

interface Props {
	children: ReactNode;
	title: string;
	subtitle: string;
}

export default function Header({ children, title, subtitle }: Props) {
	const { toggleSidebar } = useSidebar()
	const pathname = usePathname()

	if (pathname === "/auth/login" || pathname === "/auth/register") {
		return null
	}

	return (
		<header className="h-[100px] border-b-2">
			<div className="text-center   space-y-2 px-4 h-full  w-full flex  justify-between  items-center">
				<div className="flex gap-2 items-center">
					<div className="h-full  px-4 border-r-2">
						<Button
							className="h-8 w-8"
							variant="ghost"
							size="icon"
							onClick={toggleSidebar}
						>
							<SidebarIcon />
						</Button>

					</div>
					<div className="text-left">
						<h1 className="text-2xl font-bold text-white">{title}</h1>
						<p className="text-muted-foreground">{subtitle}</p>
					</div>

				</div>
				<div className="flex gap-2 items-center">
					{children}
				</div>
			</div>
		</header>

	)
}
