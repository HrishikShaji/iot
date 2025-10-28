import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	// getToken works in Edge runtimes (no Prisma involved)
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	console.log("THIS IS TOKEN:", token)

	const isAuthPage = req.nextUrl.pathname.startsWith("/auth/login");

	if (!token && !isAuthPage) {
		const loginUrl = new URL("/auth/login", req.url);
		return NextResponse.redirect(loginUrl);
	}

	if (token && isAuthPage) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
	],
};
