"use client"
import { useState, useEffect } from "react"
import mqtt, { type MqttClient } from "mqtt"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Thermometer, Droplets, Zap, Power, Wifi, WifiOff } from "lucide-react"
import { PowerSensorType, SwitchSensorType, TemperatureSensorType, WaterSensorType } from "@/types/sensor-types"
import { SERVER_URL } from "@/lib/variables"
import SwitchMonitoring from "./SwitchMonitoring"

export default function B2BDashboard() {
	return (
		<div
		>
			<SwitchMonitoring />
		</div>
	)
}
