import { icons } from "@repo/ui/icons"

export const homeSidebarLinks = [
	{
		title: "Home",
		href: "/",
		icon: "Home",
	},
	// {
	// 	title: "Your Trailers",
	// 	href: "/trailers",
	// 	icon: "Caravan",
	// },
	// {
	// 	title: "Shared Trailers",
	// 	href: "/trailers/shared",
	// 	icon: "Caravan",
	// },
	{
		title: "inbox",
		href: "/inbox",
		icon: "Caravan",
	},
]


export const sidebarLinks = [
	{
		title: "Home",
		href: "/",
		icon: "Home",
	},
	{
		title: "Accounts & Access",
		icon: "Users",
		children: [
			{
				title: "invite",
				href: "/invitations",
				icon: "User",
			},
			{
				title: "guest passes",
				href: "/guest-passes",
				icon: "UserPlus",
			},
			{
				title: "transfer trailer",
				href: "/trailer",
				icon: "UserPlus",
			},
		],
	},
	{
		title: "Controls & systems",
		icon: "Settings",
		children: [
			{
				title: "energy",
				href: "/controls/energy",
				icon: "Settings",
			},
			{
				title: "climate",
				href: "/controls/climate",
				icon: "Settings",
			},
			{
				title: "water",
				href: "/controls/water",
				icon: "Settings",
			},
			{
				title: "security",
				href: "/controls/security",
				icon: "Settings",
			},
			{
				title: "scenes",
				href: "/controls/scenes",
				icon: "Settings",
			},
		],
	},
	{
		title: "Privacy & safety",
		icon: "HatGlasses",
		children: [
			{
				title: "camera",
				href: "/privacy/camera",
				icon: "HatGlasses",
			},
			{
				title: "geofencing",
				href: "/privacy/geofencing",
				icon: "HatGlasses",
			},
			{
				title: "data",
				href: "/privacy/data",
				icon: "HatGlasses",
			},
		],
	},
	{
		title: "Device & Firmware",
		icon: "Cpu",
		children: [
			{
				title: "firmware",
				href: "/device/firmware",
				icon: "Cpu",
			},
			{
				title: "OTA",
				href: "/device/ota",
				icon: "Cpu",
			},
		],
	},
	{
		title: "support",
		href: "/support",
		icon: "Headset",
	},
]

export function getSidebarLinks(id: string) {
	return [
		{
			title: "Home",
			href: "/",
			icon: "Home",
		},
		{
			title: "Accounts & Access",
			icon: "Users",
			children: [
				{
					title: "invite",
					href: `/trailers/${id}/invite`,
					icon: "User",
				},
				{
					title: "sent invitations",
					href: `/trailers/${id}/sent-invitations`,
					icon: "User",
				},
				{
					title: "users",
					href: `/trailers/${id}/users`,
					icon: "UserPlus"
				},
				{
					title: "guest passes",
					href: "/guest-passes",
					icon: "UserPlus",
				},
				{
					title: "transfer trailer",
					href: "/trailer",
					icon: "UserPlus",
				},
			],
		},
		{
			title: "Controls & systems",
			icon: "Settings",
			children: [
				{
					title: "switch",
					icon: "Settings",
					children: [
						{
							title: "control",
							href: `/trailers/${id}/controls/switch`,
							icon: "Settings",
						},
						{
							title: "analytics",
							href: `/trailers/${id}/controls/switch/analytics`,
							icon: "Settings",
						},
					]
				},
				{
					title: "energy",
					icon: "Settings",
					children: [
						{
							title: "control",
							href: `/trailers/${id}/controls/energy`,
							icon: "Settings",
						},
						{
							title: "analytics",
							href: `/trailers/${id}/controls/energy/analytics`,
							icon: "Settings",
						},
					]
				},
				{
					title: "water",
					icon: "Settings",
					children: [
						{
							title: "control",
							href: `/trailers/${id}/controls/water`,
							icon: "Settings",
						},
						{
							title: "analytics",
							href: `/trailers/${id}/controls/water/analytics`,
							icon: "Settings",
						},
					]
				},
				{
					title: "climate",
					icon: "Settings",
					children: [
						{
							title: "control",
							href: `/trailers/${id}/controls/climate`,
							icon: "Settings",
						},
						{
							title: "analytics",
							href: `/trailers/${id}/controls/climate/analytics`,
							icon: "Settings",
						},
					]
				},
				{
					title: "security",
					icon: "Settings",
					children: [
						{
							title: "control",
							href: `/trailers/${id}/controls/security`,
							icon: "Settings",
						},
						{
							title: "analytics",
							href: `/trailers/${id}/controls/security/analytics`,
							icon: "Settings",
						},
					]
				},
				{
					title: "scenes",
					href: "/controls/scenes",
					icon: "Settings",
				},
			],
		},
		{
			title: "Privacy & safety",
			icon: "HatGlasses",
			children: [
				{
					title: "camera",
					href: "/privacy/camera",
					icon: "HatGlasses",
				},
				{
					title: "geofencing",
					href: "/privacy/geofencing",
					icon: "HatGlasses",
				},
				{
					title: "data",
					href: "/privacy/data",
					icon: "HatGlasses",
				},
			],
		},
		{
			title: "Device & Firmware",
			icon: "Cpu",
			children: [
				{
					title: "firmware",
					href: "/device/firmware",
					icon: "Cpu",
				},
				{
					title: "OTA",
					href: "/device/ota",
					icon: "Cpu",
				},
			],
		},
		{
			title: "support",
			href: "/support",
			icon: "Headset",
		},
	]

}
