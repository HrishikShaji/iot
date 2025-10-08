import { useState } from 'react';
import {
	LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
	Area, XAxis, YAxis, CartesianGrid,
	Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Thermometer, Droplets, Users, MapPin } from 'lucide-react';
import useTemperatureMonitoring from '../hooks/useTemperatureMonitoring';



export default function TemperatureMonitoring() {
	const { messages } = useTemperatureMonitoring()
	console.log("messages", messages)
	// Transform data for multi-line chart
	const transformDataForLineChart = () => {
		// Group by time
		const grouped = messages.reduce((acc: any, item) => {
			const time = new Date(item.timestamp).toLocaleTimeString();
			if (!acc[time]) {
				acc[time] = { time };
			}
			acc[time][item.email] = item.temperature;
			return acc;
		}, {});

		return Object.values(grouped);
	};

	// Get unique emails for the lines
	const uniqueEmails = [...new Set(messages.map(item => item.email))];
	const lineChartData = transformDataForLineChart();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="bg-white rounded-lg shadow-lg p-6">
					<h2 className="text-2xl font-bold text-slate-800 mb-4">
						1. Multi-line Chart - Temperature Trends Over Time
					</h2>
					<ResponsiveContainer width="100%" height={350}>
						<LineChart data={lineChartData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
							<XAxis dataKey="time" stroke="#64748b" />
							<YAxis stroke="#64748b" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
							<Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
							<Legend />
							{uniqueEmails.map((email, idx) => (
								<Line
									key={email}
									type="monotone"
									dataKey={email}
									stroke={['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][idx % 5]}
									strokeWidth={2}
									dot={{ r: 4 }}
									activeDot={{ r: 6 }}
								/>
							))}
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}
