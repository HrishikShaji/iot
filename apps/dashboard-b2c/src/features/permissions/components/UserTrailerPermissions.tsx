import { Truck } from "@repo/ui/icons";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/ui/table";
import { Badge } from "@repo/ui/components/ui/badge";
import { UserTrailerPermissions as PermissionsType } from "../lib/fetchPermissions";

interface Props {
	trailerName: string;
	trailerId: string;
	trailerAccess: PermissionsType;
}

export default function UserTrailerPermissions({ trailerId, trailerName, trailerAccess }: Props) {
	console.log(trailerAccess?.role.permissions);

	const permissions = trailerAccess?.role?.permissions || [];

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
									Permissions for {trailerName}
								</h1>
								<p className="text-base text-muted-foreground">ID: {trailerId}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto max-w-5xl flex flex-col gap-2 px-6 py-8 lg:px-8 lg:py-16">
				{permissions.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-muted-foreground">No permissions assigned</p>
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Resource</TableHead>
									<TableHead>Scope</TableHead>
									<TableHead>Actions</TableHead>
									<TableHead>Context</TableHead>
									<TableHead>Description</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{permissions.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="font-medium">
											{item.permission.resource}
										</TableCell>
										<TableCell>
											<Badge variant="outline">{item.permission.scope}</Badge>
										</TableCell>
										<TableCell>
											<div className="flex gap-1 flex-wrap">
												{item.permission.actions.map((action, index) => (
													<Badge key={index} variant="secondary">
														{action}
													</Badge>
												))}
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="default">{item.permission.context}</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground">
											{item.permission.description}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</>
	);
}
