'use client';
import InvitationsList from '@/features/invitations/components/InvitationsList';
import InviteUserForm from '@/features/invitations/components/InviteUserForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, List } from 'lucide-react';

export default function Page() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8">Manage Invitations</h1>

			<Tabs defaultValue="send" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="send" className="flex items-center gap-2">
						<UserPlus className="h-4 w-4" />
						Send Invitation
					</TabsTrigger>
					<TabsTrigger value="list" className="flex items-center gap-2">
						<List className="h-4 w-4" />
						View Invitations
					</TabsTrigger>
				</TabsList>

				<TabsContent value="send" className="mt-6">
					<InviteUserForm />
				</TabsContent>

				<TabsContent value="list" className="mt-6">
					<InvitationsList />
				</TabsContent>
			</Tabs>
		</div>
	);
}
