import useSwitchMonitoring from "@/hooks/useSwitchMonitoring"
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TimelineData {
	time: string;
	activeUsers: number;
	totalUsers: number;
}

export default function SwitchMonitoring() {
	const { messages } = useSwitchMonitoring()
	console.log(messages)

	const getActiveCountOverTime = () => {
		const sortedData = [...messages].sort((a, b) =>
			new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
		);

		const result: TimelineData[] = [];
		const userStates = new Map();

		sortedData.forEach(item => {
			userStates.set(item.userId, item.state);
			const activeCount = Array.from(userStates.values()).filter(state => state).length;

			result.push({
				time: new Date(item.timestamp).toLocaleTimeString(),
				activeUsers: activeCount,
				totalUsers: userStates.size
			});
		});

		return result;
	};

	const activeOverTime = getActiveCountOverTime();

	return (
		<div className="p-10">
			<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
				<h2 className="text-xl font-semibold text-slate-800 mb-4">Active Trailers Over Time</h2>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={activeOverTime}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="time" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="activeUsers" stroke="#10b981" strokeWidth={2} name="Active Trailers" />
						<Line type="monotone" dataKey="totalUsers" stroke="#3b82f6" strokeWidth={2} name="Total Trailers" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
