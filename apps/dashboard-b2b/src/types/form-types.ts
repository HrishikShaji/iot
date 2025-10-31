
export interface Role {
	id: string;
	name: string;
	description: string;
	context: string;
	permissionCount: number;
	permissions?: Permission[];
}

export interface Permission {
	id: string;
	actions: string[];
	resource: string;
	scope: string;
	context: string;
	description: string;
	roleCount?: number;
}
