import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const headers = new Headers(request.headers);
    headers.set("x-current-path", pathname);

    // if (pathname === "/") {
    //     return handleRootRedirect(request) ?? NextResponse.next({ headers });
    // }

    return NextResponse.next({ headers });
    // if (isAdminRoute(pathname)) {
    //     const adminUser = await validateAdminAccess(request);
    //     if (!adminUser) {
    //     return redirectToRoot(request);
    //     }
    //     return NextResponse.next({ headers });
    // }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};