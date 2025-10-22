'use client';
import { useState, useEffect } from 'react';
import { Loader2, Truck, User, Calendar, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation';

interface SharedTrailer {
	id: string;
	name: string;
	createdAt: string;
	user: {
		email: string;
		id: string;
		role: {
			id: string;
			name: string;
			description: string;
		}
	}
}

export default function UserTrailersDropdown() {
	const [trailers, setTrailers] = useState<SharedTrailer[]>([]);
	const [trailerId, setTrailerId] = useState("")
	const [loading, setLoading] = useState(true);
	const router = useRouter()


	useEffect(() => {
		fetchTrailers();
	}, []);

	const fetchTrailers = async () => {
		try {
			const response = await fetch('/api/trailers');
			const data = await response.json();
			setTrailers(data.trailers || []);
			console.log(data.trailers)
		} catch (error) {
			console.error('Error fetching shared trailers:', error);
		} finally {
			setLoading(false);
		}
	};


	function handleValueChange(value: string) {
		setTrailerId(value)
		router.push(`/trailers/${value}`)
	}

	if (loading) {
		return (
			<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
		);
	}

	return (

		<Select
			value={trailerId}
			onValueChange={handleValueChange}
		>
			<SelectTrigger id="role">
				<SelectValue placeholder="Select trailer" />
			</SelectTrigger>
			<SelectContent>
				{trailers.map((trailer) => (
					<SelectItem key={trailer.id} value={trailer.id}>
						{trailer.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
