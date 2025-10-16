
export interface Role {
	id: string;
	name: string;
	description: string;
	userCount: number;
	context: string;
	permissionCount: number;
	permissions?: Permission[];
}

export interface Permission {
	id: string;
	action: string;
	resource: string;
	scope: string;
	context: string;
	description: string;
	roleCount?: number;
}
