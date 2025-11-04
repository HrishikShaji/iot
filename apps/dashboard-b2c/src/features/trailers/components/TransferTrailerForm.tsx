'use client';
import { useState, useTransition } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Truck } from "@repo/ui/icons";
import { toast } from 'sonner';
import { transferTrailer } from '../actions/transferTrailer';

interface Props {
	trailerId: string;
	trailerName: string;
	trailerAccessRoleId: string;
}

export default function TransferTrailerForm({ trailerAccessRoleId, trailerId, trailerName }: Props) {
	const [email, setEmail] = useState('');
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		formData.append('trailerId', trailerId);
		formData.append('trailerAccessRoleId', trailerAccessRoleId);

		startTransition(async () => {
			try {
				const result = await transferTrailer(formData);

				if (result.success) {
					toast.success('Trailer transferred successfully!', {
						description: result.message
					});
					setEmail('');
				} else {
					toast.error('Failed to transfer trailer', {
						description: result.message
					});
				}
			} catch (error) {
				toast.error('An unexpected error occurred', {
					description: error instanceof Error ? error.message : 'Failed to transfer trailer'
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
									Transfer Trailer: {trailerName}
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

					<Button
						type="submit"
						disabled={isPending || !email}
						className="w-full h-11 text-base font-medium"
					>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isPending ? 'Processing...' : 'Transfer'}
					</Button>
				</form>
			</div>
		</>
	);
}
