'use client';
import { useState, useTransition } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Truck } from "@repo/ui/icons";
import { transferTrailer } from '../actions/transferTrailer';

interface Props {
	trailerId: string;
	trailerName: string;
}

export default function TransferTrailerForm({ trailerId, trailerName }: Props) {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessage(null);

		const formData = new FormData(e.currentTarget);
		formData.append('trailerId', trailerId);

		startTransition(async () => {
			try {
				const result = await transferTrailer(formData);

				if (result.success) {
					setMessage({
						type: 'success',
						text: result.message
					});
					setEmail('');
				} else {
					setMessage({
						type: 'error',
						text: result.message
					});
				}
			} catch (error) {
				setMessage({
					type: 'error',
					text: error instanceof Error ? error.message : 'Failed to transfer trailer',
				});
			}
		});
	};

	return (
		<>
			<div className="border-b border-border">
				<div className="mx-auto max-w-5xl px-6 py-6">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="flex items-start gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
								<Truck className="h-7 w-7 text-primary-foreground" />
							</div>
							<div className="space-y-2">
								<h1 className="text-2xl font-medium tracking-tight text-foreground">
									{`Transfer Trailer: ${trailerName}`}
								</h1>
								<p className="text-base text-muted-foreground">ID: {trailerId}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-16">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email" className="text-sm font-medium">
							Transfer to email
						</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="receiver email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isPending}
							className="h-11"
						/>
					</div>

					{message && (
						<Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
							{message.type === 'success' ? (
								<CheckCircle2 className="h-4 w-4" />
							) : (
								<AlertCircle className="h-4 w-4" />
							)}
							<AlertDescription>{message.text}</AlertDescription>
						</Alert>
					)}

					<Button
						type="submit"
						disabled={isPending || !email}
						className="w-full"
					>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isPending ? 'Processing...' : 'Transfer'}
					</Button>
				</form>
			</div>
		</>
	);
}
