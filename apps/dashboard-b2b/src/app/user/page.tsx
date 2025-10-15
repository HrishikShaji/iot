import RBAC from "@/components/RBAC";
import RBACAdminDashboard from "@/components/RBACAdminDashboard";

export default function Page() {
	return (
		<div className="">
			<RBAC />
			<RBACAdminDashboard />
		</div>
	)
}
