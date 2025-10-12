"use client"
import Header from "@repo/ui/components/elements/Header";
import UserProfileMenu from "@repo/ui/components/elements/UserProfileMenu";
import Image from "next/image";

export default function Home() {
	return (
		<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<Header
				title="Hello"
				subtitle="HI THERE"
				isConnected
			>
				<div></div>
			</Header>
		</div>
	);
}
