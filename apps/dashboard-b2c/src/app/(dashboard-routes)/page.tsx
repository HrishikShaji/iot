import SharedTrailers from "@/features/trailers/components/SharedTrailers";
import UserTrailers from "@/features/trailers/components/UserTrailers";

export default function Home() {
	return (
		<div className="p-10 flex flex-col gap-10">
			<UserTrailers />
			<SharedTrailers />
		</div>

	);
}
