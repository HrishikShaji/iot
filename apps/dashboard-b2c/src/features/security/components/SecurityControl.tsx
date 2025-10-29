"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Input } from '@repo/ui/components/ui/input';
import { Shield, Camera, Activity, Lock, Eye, Bell, FileText, Wifi } from 'lucide-react';
import type { MqttClient } from "mqtt";
import useSecurityControl from '../hooks/useSecurityControl';

interface Props {
	client: MqttClient;
	userId: string;
	email: string;
	trailerId: string;
}

export default function SecurityControl({ email, userId, client, trailerId }: Props) {
	const { securityData, updateField } = useSecurityControl({ email, client, userId, trailerId });

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto space-y-6 grid grid-cols-2 gap-3">
				{/* System Status Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle className="flex items-center gap-2">
							<Shield className="w-6 h-6" />
							System Status
						</CardTitle>
						<CardDescription className="">
							Security system configuration
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* System Status */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">System Status</Label>
							<Select value={securityData.systemStatus} onValueChange={(value) => updateField('systemStatus', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Armed">Armed</SelectItem>
									<SelectItem value="Disarmed">Disarmed</SelectItem>
									<SelectItem value="Armed Home">Armed Home</SelectItem>
									<SelectItem value="Armed Away">Armed Away</SelectItem>
									<SelectItem value="Triggered">Triggered</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Motion Detection */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Activity className="w-4 h-4" />
								Motion Detection
							</Label>
							<Select value={securityData.motionDetection} onValueChange={(value) => updateField('motionDetection', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Active">Active</SelectItem>
									<SelectItem value="Inactive">Inactive</SelectItem>
									<SelectItem value="Paused">Paused</SelectItem>
									<SelectItem value="Motion Detected">Motion Detected</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Remote Access */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Wifi className="w-4 h-4" />
								Remote Access
							</Label>
							<Select value={securityData.remoteAccess} onValueChange={(value) => updateField('remoteAccess', value)}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Enabled">Enabled</SelectItem>
									<SelectItem value="Disabled">Disabled</SelectItem>
									<SelectItem value="Limited">Limited</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Monitoring Card */}
				<Card className="">
					<CardHeader className="">
						<CardTitle className="flex items-center gap-2">
							<Camera className="w-6 h-6" />
							Monitoring
						</CardTitle>
						<CardDescription className="">
							Cameras and detection systems
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Active Cameras */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Eye className="w-4 h-4" />
								Active Cameras
							</Label>
							<Input
								type="text"
								value={securityData.activeCameras}
								onChange={(e) => updateField('activeCameras', e.target.value)}
								className="w-full"
								placeholder="e.g., 4 of 4"
							/>
						</div>

						{/* Door Status */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Lock className="w-4 h-4" />
								Door Status
							</Label>
							<Input
								type="text"
								value={securityData.doorStatus}
								onChange={(e) => updateField('doorStatus', e.target.value)}
								className="w-full"
								placeholder="e.g., All locked"
							/>
						</div>

						{/* Window Status */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Window Status</Label>
							<Input
								type="text"
								value={securityData.windowStatus}
								onChange={(e) => updateField('windowStatus', e.target.value)}
								className="w-full"
								placeholder="e.g., All secure"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Activity Logs Card */}
				<Card className="col-span-2">
					<CardHeader className="">
						<CardTitle className="flex items-center gap-2">
							<FileText className="w-6 h-6" />
							Activity & Logs
						</CardTitle>
						<CardDescription className="">
							Recent activity and alarm history
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Alarm History */}
							<div className="space-y-2">
								<Label className="text-sm font-medium flex items-center gap-2">
									<Bell className="w-4 h-4" />
									Alarm History
								</Label>
								<Input
									type="text"
									value={securityData.alarmHistory}
									onChange={(e) => updateField('alarmHistory', e.target.value)}
									className="w-full"
									placeholder="e.g., No recent alerts"
								/>
							</div>

							{/* Access Log */}
							<div className="space-y-2">
								<Label className="text-sm font-medium">Access Log</Label>
								<Input
									type="text"
									value={securityData.accessLog}
									onChange={(e) => updateField('accessLog', e.target.value)}
									className="w-full"
									placeholder="e.g., 3 entries today"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Summary Panel */}
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Current Security Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
							<div>
								<div className="text-slate-300">System</div>
								<div className="font-semibold text-lg">{securityData.systemStatus}</div>
							</div>
							<div>
								<div className="text-slate-300">Cameras</div>
								<div className="font-semibold text-lg">{securityData.activeCameras}</div>
							</div>
							<div>
								<div className="text-slate-300">Motion</div>
								<div className="font-semibold text-lg">{securityData.motionDetection}</div>
							</div>
							<div>
								<div className="text-slate-300">Doors</div>
								<div className="font-semibold text-lg">{securityData.doorStatus}</div>
							</div>
							<div>
								<div className="text-slate-300">Windows</div>
								<div className="font-semibold text-lg">{securityData.windowStatus}</div>
							</div>
							<div>
								<div className="text-slate-300">Alarms</div>
								<div className="font-semibold text-lg">{securityData.alarmHistory}</div>
							</div>
							<div>
								<div className="text-slate-300">Access Log</div>
								<div className="font-semibold text-lg">{securityData.accessLog}</div>
							</div>
							<div>
								<div className="text-slate-300">Remote</div>
								<div className="font-semibold text-lg">{securityData.remoteAccess}</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
