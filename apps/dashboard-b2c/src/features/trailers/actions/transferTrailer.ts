'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { auth } from '../../../../auth';
import { checkPermission } from '@/features/permissions/lib/checkPermissions';

export async function transferTrailer(formData: FormData) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return {
				success: false,
				message: 'Unauthorized'
			};
		}

		const email = formData.get('email') as string;
		const trailerId = formData.get('trailerId') as string;
		const trailerAccessRoleId = formData.get("trailerAccessRoleId") as string;

		if (!email || !trailerId || !trailerAccessRoleId) {
			return {
				success: false,
				message: 'Email and trailer ID are required'
			};
		}
		const { hasPermission } = await checkPermission({
			scope: "trailer",
			resource: "trailers",
			action: "update",
			roleId: trailerAccessRoleId
		})

		if (!hasPermission) {
			return {
				success: false,
				message: 'Only owner can tranfer trailer'
			};
		}

		// Find the user by email
		const targetUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() }
		});

		if (!targetUser) {
			return {
				success: false,
				message: 'User with this email does not exist'
			};
		}

		// Verify the current user owns the trailer
		const trailer = await prisma.trailer.findUnique({
			where: { id: trailerId }
		});

		if (!trailer) {
			return {
				success: false,
				message: 'Trailer not found'
			};
		}

		if (trailer.userId !== session.user.id) {
			return {
				success: false,
				message: 'You do not have permission to transfer this trailer'
			};
		}

		// Transfer the trailer
		await prisma.trailer.update({
			where: { id: trailerId },
			data: { userId: targetUser.id }
		});

		// Revalidate relevant paths
		revalidatePath('/');
		revalidatePath(`/trailers/${trailerId}`);

		return {
			success: true,
			message: `Trailer successfully transferred to ${targetUser.email}`
		};
	} catch (error) {
		console.error('Transfer error:', error);
		return {
			success: false,
			message: 'An error occurred during transfer'
		};
	}
}
