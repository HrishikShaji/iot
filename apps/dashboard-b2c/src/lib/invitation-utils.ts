// lib/invitation-utils.ts
import crypto from 'crypto';

export function generateInvitationToken(): string {
	return crypto.randomBytes(32).toString('hex');
}

export function getInvitationExpiry(): Date {
	const expiryDate = new Date();
	expiryDate.setDate(expiryDate.getDate() + 7); // 7 days
	return expiryDate;
}
