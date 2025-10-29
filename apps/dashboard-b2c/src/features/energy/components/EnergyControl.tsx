"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Label } from '@repo/ui/components/ui/label';
import { Slider } from '@repo/ui/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Input } from '@repo/ui/components/ui/input';
import { Battery, Zap, Thermometer, Activity } from 'lucide-react';
import type { MqttClient } from "mqtt";
import useEnergyControl from "@/features/energy/hooks/useEnergyControl";

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
	trailerId: string;
}

export default function EnergyControl({ email, userId, client, trailerId }: Props) {
	const { energyData, updateField } = useEnergyControl({ email, client, userId, trailerId });

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto space-y-6 grid grid-cols-2 gap-3">
				{/* Current Status Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle className="flex items-center gap-2">
							<Battery className="w-6 h-6" />
							Power Status
						</CardTitle>
						<CardDescription className="">
							Real-time battery metrics
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Current Charge Level */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="">Current Charge Level</Label>
								<span className="text-sm font-semibold ">{energyData.currentCharge}%</span>
							</div>
							<Slider
								value={[energyData.currentCharge]}
								onValueChange={(value) => updateField('currentCharge', value[0])}
								min={0}
								max={100}
								step={1}
								className="w-full"
							/>
						</div>

						{/* Voltage */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className=" flex items-center gap-2">
									<Zap className="w-4 h-4 " />
									Voltage
								</Label>
								<span className="text-sm font-semibold ">{energyData.voltage.toFixed(1)} V</span>
							</div>
							<Slider
								value={[energyData.voltage]}
								onValueChange={(value) => updateField('voltage', value[0])}
								min={40}
								max={50}
								step={0.1}
								className="w-full"
							/>
						</div>

						{/* Current Draw */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className=" flex items-center gap-2">
									<Activity className="w-4 h-4 " />
									Current Draw
								</Label>
								<span className="text-sm font-semibold ">{energyData.currentDraw.toFixed(1)} A</span>
							</div>
							<Slider
								value={[energyData.currentDraw]}
								onValueChange={(value) => updateField('currentDraw', value[0])}
								min={0}
								max={20}
								step={0.1}
								className="w-full"
							/>
						</div>

						{/* Temperature */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className=" flex items-center gap-2">
									<Thermometer className="w-4 h-4 " />
									Temperature
								</Label>
								<span className="text-sm font-semibold ">{energyData.temperature}°C</span>
							</div>
							<Slider
								value={[energyData.temperature]}
								onValueChange={(value) => updateField('temperature', value[0])}
								min={20}
								max={40}
								step={1}
								className="w-full"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Battery Health & Lifecycle Card */}
				<Card className="space-y-4">
					<CardHeader className="">
						<CardTitle>Battery Health & Lifecycle</CardTitle>
						<CardDescription className="">
							Long-term battery information
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Total Charge Cycles */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="">Total Charge Cycles</Label>
								<span className="text-sm font-semibold ">{energyData.totalChargeCycles}</span>
							</div>
							<Slider
								value={[energyData.totalChargeCycles]}
								onValueChange={(value) => updateField('totalChargeCycles', value[0])}
								min={0}
								max={2000}
								step={1}
								className="w-full"
							/>
						</div>

						{/* Health */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Health Status</Label>
							<Select value={energyData.health} onValueChange={(value) => updateField('health', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Excellent">Excellent</SelectItem>
									<SelectItem value="Good">Good</SelectItem>
									<SelectItem value="Fair">Fair</SelectItem>
									<SelectItem value="Poor">Poor</SelectItem>
									<SelectItem value="Critical">Critical</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Last Charged */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Last Charged</Label>
							<Input
								type="text"
								value={energyData.lastCharged}
								onChange={(e) => updateField('lastCharged', e.target.value)}
								className="w-full"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Runtime & Charging Card */}
				<Card className="">
					<CardHeader className=" ">
						<CardTitle>Runtime & Charging</CardTitle>
						<CardDescription className="">
							Estimated runtime and charging information
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Estimated Runtime */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="">Estimated Runtime</Label>
								<span className="text-sm font-semibold ">{energyData.estimatedRuntime} hours</span>
							</div>
							<Slider
								value={[energyData.estimatedRuntime]}
								onValueChange={(value) => updateField('estimatedRuntime', value[0])}
								min={0}
								max={24}
								step={1}
								className="w-full"
							/>
						</div>

						{/* Charging Status */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Charging Status</Label>
							<Select value={energyData.chargingStatus} onValueChange={(value) => updateField('chargingStatus', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Not charging">Not charging</SelectItem>
									<SelectItem value="Charging">Charging</SelectItem>
									<SelectItem value="Fast charging">Fast charging</SelectItem>
									<SelectItem value="Trickle charging">Trickle charging</SelectItem>
									<SelectItem value="Fully charged">Fully charged</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Summary Panel */}
				<Card className="">
					<CardHeader>
						<CardTitle>Current Configuration Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
							<div>
								<div className="text-slate-300">Charge</div>
								<div className="font-semibold text-lg">{energyData.currentCharge}%</div>
							</div>
							<div>
								<div className="text-slate-300">Voltage</div>
								<div className="font-semibold text-lg">{energyData.voltage.toFixed(1)} V</div>
							</div>
							<div>
								<div className="text-slate-300">Current</div>
								<div className="font-semibold text-lg">{energyData.currentDraw.toFixed(1)} A</div>
							</div>
							<div>
								<div className="text-slate-300">Temperature</div>
								<div className="font-semibold text-lg">{energyData.temperature}°C</div>
							</div>
							<div>
								<div className="text-slate-300">Health</div>
								<div className="font-semibold text-lg">{energyData.health}</div>
							</div>
							<div>
								<div className="text-slate-300">Runtime</div>
								<div className="font-semibold text-lg">{energyData.estimatedRuntime}h</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
