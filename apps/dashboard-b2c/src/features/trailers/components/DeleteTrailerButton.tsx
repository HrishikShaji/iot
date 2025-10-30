"use client"

import { TrashIcon } from "@repo/ui/icons";
import { useTransition } from "react";

interface DeleteTrailerButtonProps {
	trailerId: string;
	deleteTrailer: (trailerId: string) => Promise<void>;
}

export function DeleteTrailerButton({ trailerId, deleteTrailer }: DeleteTrailerButtonProps) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		if (!confirm("Are you sure you want to delete this trailer? This action cannot be undone.")) {
			return;
		}

		startTransition(async () => {
			try {
				await deleteTrailer(trailerId);
			} catch (error) {
				console.error("Failed to delete trailer:", error);
				alert("Failed to delete trailer. Please try again.");
			}
		});
	};

	return (
		<button
			onClick={handleDelete}
			disabled={isPending}
			className="text-red-600 hover:text-red-800 hover:scale-125 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
			aria-label="Delete trailer"
		>
			<TrashIcon className={isPending ? "animate-pulse" : ""} />
		</button>
	);
}
