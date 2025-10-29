import { Badge } from '@repo/ui/components/ui/badge';
import { Separator } from '@repo/ui/components/ui/separator';
import { Truck, User, Calendar, Shield } from 'lucide-react';

interface Props {
	trailerName: string;
	trailerId: string;
	trailerOwnerEmail: string;
	userRole: string;
	trailerCreatedAt: Date;
	trailerUpdatedAt: Date;
}

export default function TrailerInfo({
	trailerName,
	trailerId,
	trailerOwnerEmail,
	userRole,
	trailerCreatedAt,
	trailerUpdatedAt
}: Props) {

	return (
		<>
			<div className="border-b border-border ">
				<div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-16">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="flex items-start gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
								<Truck className="h-7 w-7 text-primary-foreground" />
							</div>
							<div className="space-y-2">
								<h1 className="text-4xl  font-medium tracking-tight text-foreground lg:text-5xl">
									{trailerName}
								</h1>
								<p className="text-base text-muted-foreground">ID: {trailerId}</p>
							</div>
						</div>
						<Badge
							variant="secondary"
							className="flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
						>
							<Shield className="h-3.5 w-3.5" />
							{userRole}
						</Badge>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-8">
				<h2 className="mb-6 text-xl  font-medium text-foreground">Trailer Details</h2>
				<div className="space-y-6">
					<div className="flex items-start gap-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
							<User className="h-5 w-5 text-muted-foreground" />
						</div>
						<div className="flex-1 space-y-1">
							<p className="text-sm text-muted-foreground">Owner</p>
							<p className="font-medium text-foreground">{trailerOwnerEmail}</p>
						</div>
					</div>

					<Separator />

					<div className="flex items-start gap-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
							<Calendar className="h-5 w-5 text-muted-foreground" />
						</div>
						<div className="flex-1 space-y-1">
							<p className="text-sm text-muted-foreground">Created</p>
							<p className="font-medium text-foreground">
								{trailerCreatedAt.toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					</div>

					<Separator />

					<div className="flex items-start gap-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
							<Calendar className="h-5 w-5 text-muted-foreground" />
						</div>
						<div className="flex-1 space-y-1">
							<p className="text-sm text-muted-foreground">Last Updated</p>
							<p className="font-medium text-foreground">
								{trailerUpdatedAt.toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
