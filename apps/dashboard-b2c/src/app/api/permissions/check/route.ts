import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { checkUserPermission } from '@/lib/permissions';

export async function POST(req: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ hasPermission: false }, { status: 401 });
		}

		const { action, resource, scope, organizationId } = await req.json();

		const hasPermission = await checkUserPermission({
			userId: session.user.id,
			action,
			resource,
			scope,
			organizationId
		});

		return NextResponse.json({ hasPermission });

	} catch (err) {
		return NextResponse.json({ error: "Unknown error" }, { status: 500 })
	}
}
