'use client';

import InvitationsList from '@/features/invitations/components/InvitationsList';
import InviteUserForm from '@/features/invitations/components/InviteUserForm';
import { useState, useEffect } from 'react';

export default function InvitationsPage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8">Manage Invitations</h1>

			<div className="grid gap-8">
				<InviteUserForm />
				<InvitationsList />
			</div>
		</div>
	);
}
