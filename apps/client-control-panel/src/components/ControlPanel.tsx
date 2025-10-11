"use client"
import { useState, useEffect } from "react"
import mqtt, { type MqttClient } from "mqtt"
import { Power, Wifi, WifiOff } from "lucide-react"
import { SERVER_URL } from "@/lib/variables"
import SwitchCard from "@/features/switch/components/SwitchCard"
import TemperatureCard from "@/features/temperature/components/TemperatureCard"
import WaterCard from "@/features/water/components/WaterCard"
import PowerCard from "@/features/power/components/PowerCard"
import UserProfile from "./common/UserProfile"
import LocationCard from "@/features/location/components/LocationCard"

interface Props {
	userId: string;
	email: string;
	status: "authenticated" | "unauthenticated" | "loading";
	client: MqttClient;
}

export default function ControlPanel({ userId, email, status, client }: Props) {

	return (
		<div className="h-screen p-4 md:p-6 lg:p-8 relative"
			style={{
				backgroundImage: "url('/home_m_2.jpg')",
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center'
			}}
		>

			<div className="absolute top-0 left-0 bg-gradient-to-r from-black/50 to-black h-full w-full"></div>

			<div className="grid grid-cols-1 absolute top-40 right-10 w-[40%] lg:grid-cols-2 gap-6">
				<SwitchCard
					userId={userId}
					email={email}
					client={client}
				/>
				<TemperatureCard
					email={email}
					userId={userId}
					client={client}
				/>
				<WaterCard
					email={email}
					userId={userId}
					client={client}
				/>
				<PowerCard
					email={email}
					userId={userId}
					client={client}
				/>
				<LocationCard
					client={client}
					userId={userId}
					email={email}
				/>
			</div>
		</div>
	)
}
