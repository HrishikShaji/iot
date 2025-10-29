"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Label } from '@repo/ui/components/ui/label';
import { Slider } from '@repo/ui/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Input } from '@repo/ui/components/ui/input';
import { Droplets, Gauge, Thermometer, Activity, Filter, AlertCircle } from 'lucide-react';
import type { MqttClient } from "mqtt";
import useWaterControl from "@/features/water/hooks/useWaterControl";

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
	trailerId: string;
}

export default function WaterControl({ email, userId, client, trailerId }: Props) {
	const { waterData, updateField } = useWaterControl({ email, client, userId, trailerId });

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto space-y-6 grid grid-cols-2 gap-3">
				{/* Water Levels Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle className="flex items-center gap-2">
							<Droplets className="w-6 h-6" />
							Water Levels
						</CardTitle>
						<CardDescription className="">
							Fresh and gray water tank levels
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Fresh Water */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Fresh Water</Label>
							<Input
								type="text"
								value={waterData.freshWater}
								onChange={(e) => updateField('freshWater', e.target.value)}
								className="w-full"
								placeholder="e.g., 78% (156L)"
							/>
						</div>

						{/* Gray Water */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Gray Water</Label>
							<Input
								type="text"
								value={waterData.grayWater}
								onChange={(e) => updateField('grayWater', e.target.value)}
								className="w-full"
								placeholder="e.g., 23% (46L)"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Water System Status Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle className="flex items-center gap-2">
							<Activity className="w-6 h-6" />
							System Status
						</CardTitle>
						<CardDescription className="">
							Pump and filter information
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Pump Status */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Pump Status</Label>
							<Select value={waterData.pumpStatus} onValueChange={(value) => updateField('pumpStatus', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Auto">Auto</SelectItem>
									<SelectItem value="On">On</SelectItem>
									<SelectItem value="Off">Off</SelectItem>
									<SelectItem value="Maintenance">Maintenance</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Filter Status */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Filter className="w-4 h-4" />
								Filter Status
							</Label>
							<Input
								type="text"
								value={waterData.filterStatus}
								onChange={(e) => updateField('filterStatus', e.target.value)}
								className="w-full"
								placeholder="e.g., Good (87%)"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Water Metrics Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle>Water Metrics</CardTitle>
						<CardDescription className="">
							Pressure and temperature readings
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Water Pressure */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="flex items-center gap-2">
									<Gauge className="w-4 h-4" />
									Water Pressure
								</Label>
								<span className="text-sm font-semibold">{waterData.waterPressure} PSI</span>
							</div>
							<Slider
								value={[waterData.waterPressure]}
								onValueChange={(value) => updateField('waterPressure', value[0])}
								min={0}
								max={100}
								step={1}
								className="w-full"
							/>
						</div>

						{/* Water Temperature */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="flex items-center gap-2">
									<Thermometer className="w-4 h-4" />
									Water Temperature
								</Label>
								<span className="text-sm font-semibold">{waterData.waterTemperature}°F</span>
							</div>
							<Slider
								value={[waterData.waterTemperature]}
								onValueChange={(value) => updateField('waterTemperature', value[0])}
								min={50}
								max={80}
								step={1}
								className="w-full"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Usage & Monitoring Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle>Usage & Monitoring</CardTitle>
						<CardDescription className="">
							Daily usage and leak detection
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Daily Usage */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="">Daily Usage</Label>
								<span className="text-sm font-semibold">{waterData.dailyUsage} L</span>
							</div>
							<Slider
								value={[waterData.dailyUsage]}
								onValueChange={(value) => updateField('dailyUsage', value[0])}
								min={0}
								max={100}
								step={1}
								className="w-full"
							/>
						</div>

						{/* Leak Detection */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<AlertCircle className="w-4 h-4" />
								Leak Detection
							</Label>
							<Input
								type="text"
								value={waterData.leakDetection}
								onChange={(e) => updateField('leakDetection', e.target.value)}
								className="w-full"
								placeholder="e.g., No leaks detected"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Summary Panel */}
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Current Water System Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
							<div>
								<div className="text-slate-300">Fresh Water</div>
								<div className="font-semibold text-lg">{waterData.freshWater}</div>
							</div>
							<div>
								<div className="text-slate-300">Gray Water</div>
								<div className="font-semibold text-lg">{waterData.grayWater}</div>
							</div>
							<div>
								<div className="text-slate-300">Pressure</div>
								<div className="font-semibold text-lg">{waterData.waterPressure} PSI</div>
							</div>
							<div>
								<div className="text-slate-300">Temperature</div>
								<div className="font-semibold text-lg">{waterData.waterTemperature}°F</div>
							</div>
							<div>
								<div className="text-slate-300">Pump</div>
								<div className="font-semibold text-lg">{waterData.pumpStatus}</div>
							</div>
							<div>
								<div className="text-slate-300">Filter</div>
								<div className="font-semibold text-lg">{waterData.filterStatus}</div>
							</div>
							<div>
								<div className="text-slate-300">Daily Usage</div>
								<div className="font-semibold text-lg">{waterData.dailyUsage} L</div>
							</div>
							<div>
								<div className="text-slate-300">Leak Status</div>
								<div className="font-semibold text-lg">{waterData.leakDetection}</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
