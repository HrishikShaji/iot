export const sidebarLinks = [
	{
		title: "Home",
		href: "/",
		icon: "Home",
	},
	{
		title: "B2C",
		icon: "Users",
		children: [
			{
				title: "roles",
				href: "/b2c/roles",
				icon: "User",
			},
			{
				title: "permissions",
				href: "/b2c/permissions",
				icon: "UserPlus",
			},
		],
	},
	{
		title: "B2B",
		icon: "Users",
		children: [
			{
				title: "roles",
				href: "/b2b/roles",
				icon: "User",
			},
			{
				title: "permissions",
				href: "/b2b/permissions",
				icon: "UserPlus",
			},
		],
	},
]
