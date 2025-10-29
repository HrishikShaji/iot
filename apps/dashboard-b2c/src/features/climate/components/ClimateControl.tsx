"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Label } from '@repo/ui/components/ui/label';
import { Slider } from '@repo/ui/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Thermometer, Wind, Droplets, Gauge, Filter, Leaf, Zap } from 'lucide-react';
import type { MqttClient } from "mqtt";
import useClimateControl from '../hooks/useClimateControl';

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
	trailerId: string;
}

export default function ClimateControl({ email, userId, client, trailerId }: Props) {
	const { climateData, updateField } = useClimateControl({ email, client, userId, trailerId });

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto space-y-6 grid grid-cols-2 gap-3">
				{/* Temperature Control Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle className="flex items-center gap-2">
							<Thermometer className="w-6 h-6" />
							Temperature Control
						</CardTitle>
						<CardDescription className="">
							Current and target temperature settings
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Interior Temperature */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="">Interior Temperature</Label>
								<span className="text-sm font-semibold">{climateData.interiorTemperature}°F</span>
							</div>
							<Slider
								value={[climateData.interiorTemperature]}
								onValueChange={(value) => updateField('interiorTemperature', value[0])}
								min={60}
								max={80}
								step={1}
								className="w-full"
							/>
						</div>

						{/* Target Temperature */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="">Target Temperature</Label>
								<span className="text-sm font-semibold">{climateData.targetTemperature}°F</span>
							</div>
							<Slider
								value={[climateData.targetTemperature]}
								onValueChange={(value) => updateField('targetTemperature', value[0])}
								min={60}
								max={80}
								step={1}
								className="w-full"
							/>
						</div>

						{/* Humidity */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="flex items-center gap-2">
									<Droplets className="w-4 h-4" />
									Humidity
								</Label>
								<span className="text-sm font-semibold">{climateData.humidity}%</span>
							</div>
							<Slider
								value={[climateData.humidity]}
								onValueChange={(value) => updateField('humidity', value[0])}
								min={0}
								max={100}
								step={1}
								className="w-full"
							/>
						</div>
					</CardContent>
				</Card>

				{/* HVAC System Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle className="flex items-center gap-2">
							<Wind className="w-6 h-6" />
							HVAC System
						</CardTitle>
						<CardDescription className="">
							Heating, cooling, and fan settings
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* HVAC Mode */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">HVAC Mode</Label>
							<Select value={climateData.hvacMode} onValueChange={(value) => updateField('hvacMode', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Auto">Auto</SelectItem>
									<SelectItem value="Cool">Cool</SelectItem>
									<SelectItem value="Heat">Heat</SelectItem>
									<SelectItem value="Fan Only">Fan Only</SelectItem>
									<SelectItem value="Off">Off</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Fan Speed */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Fan Speed</Label>
							<Select value={climateData.fanSpeed} onValueChange={(value) => updateField('fanSpeed', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Low">Low</SelectItem>
									<SelectItem value="Medium">Medium</SelectItem>
									<SelectItem value="High">High</SelectItem>
									<SelectItem value="Auto">Auto</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Energy Usage */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<Label className="flex items-center gap-2">
									<Zap className="w-4 h-4" />
									Energy Usage
								</Label>
								<span className="text-sm font-semibold">{climateData.energyUsage.toFixed(1)} kW/h</span>
							</div>
							<Slider
								value={[climateData.energyUsage]}
								onValueChange={(value) => updateField('energyUsage', value[0])}
								min={0}
								max={5}
								step={0.1}
								className="w-full"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Air Quality Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle className="flex items-center gap-2">
							<Leaf className="w-6 h-6" />
							Air Quality
						</CardTitle>
						<CardDescription className="">
							Indoor air quality monitoring
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Air Quality */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Gauge className="w-4 h-4" />
								Air Quality Status
							</Label>
							<Select value={climateData.airQuality} onValueChange={(value) => updateField('airQuality', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Excellent">Excellent</SelectItem>
									<SelectItem value="Good">Good</SelectItem>
									<SelectItem value="Fair">Fair</SelectItem>
									<SelectItem value="Poor">Poor</SelectItem>
									<SelectItem value="Hazardous">Hazardous</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Filter Status */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Filter className="w-4 h-4" />
								Filter Status
							</Label>
							<Select value={climateData.filterStatus} onValueChange={(value) => updateField('filterStatus', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Clean">Clean</SelectItem>
									<SelectItem value="Good">Good</SelectItem>
									<SelectItem value="Fair">Fair</SelectItem>
									<SelectItem value="Replace Soon">Replace Soon</SelectItem>
									<SelectItem value="Replace Now">Replace Now</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Summary Panel */}
				<Card className="">
					<CardHeader>
						<CardTitle>Current Climate Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
							<div>
								<div className="text-slate-300">Interior Temp</div>
								<div className="font-semibold text-lg">{climateData.interiorTemperature}°F</div>
							</div>
							<div>
								<div className="text-slate-300">Target Temp</div>
								<div className="font-semibold text-lg">{climateData.targetTemperature}°F</div>
							</div>
							<div>
								<div className="text-slate-300">Humidity</div>
								<div className="font-semibold text-lg">{climateData.humidity}%</div>
							</div>
							<div>
								<div className="text-slate-300">HVAC Mode</div>
								<div className="font-semibold text-lg">{climateData.hvacMode}</div>
							</div>
							<div>
								<div className="text-slate-300">Fan Speed</div>
								<div className="font-semibold text-lg">{climateData.fanSpeed}</div>
							</div>
							<div>
								<div className="text-slate-300">Air Quality</div>
								<div className="font-semibold text-lg">{climateData.airQuality}</div>
							</div>
							<div>
								<div className="text-slate-300">Filter</div>
								<div className="font-semibold text-lg">{climateData.filterStatus}</div>
							</div>
							<div>
								<div className="text-slate-300">Energy</div>
								<div className="font-semibold text-lg">{climateData.energyUsage.toFixed(1)} kW/h</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
