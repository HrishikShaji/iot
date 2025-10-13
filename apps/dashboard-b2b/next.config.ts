import type { NextConfig } from "next";
//@ts-ignore
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin"

const nextConfig: NextConfig = {
	/* config options here */
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.plugins = [...config.plugins, new PrismaPlugin()]
		}
		return config
	},
	eslint: {
		ignoreDuringBuilds: true
	}
};

export default nextConfig;
