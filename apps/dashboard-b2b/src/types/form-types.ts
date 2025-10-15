
export interface Role {
	id: string;
	name: string;
	description: string;
	userCount: number;
	permissionCount: number;
	permissions?: Permission[];
}

export interface Permission {
	id: string;
	action: string;
	resource: string;
	scope: string;
	description: string;
	roleCount?: number;
}
