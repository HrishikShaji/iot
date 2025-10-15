export const sidebarLinks = [
	{
		title: "Home",
		href: "/",
		icon: "Home",
	},
	{
		title: "Users",
		icon: "Users",
		children: [
			{
				title: "All Users",
				href: "/users",
				icon: "User",
			},
			{
				title: "Add User",
				href: "/users/add",
				icon: "UserPlus",
			},
		],
	},
	{
		title: "Content",
		icon: "FileText",
		children: [
			{
				title: "Posts",
				href: "/content/posts",
				icon: "FileText",
			},
			{
				title: "Pages",
				href: "/content/pages",
				icon: "File",
			},
		],
	},
	{
		title: "Settings",
		href: "/settings",
		icon: "Settings",
	},
]
