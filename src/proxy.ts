import { auth } from "@/auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isAccount = pathname.startsWith("/account");
  if ((isAdmin || isAccount) && !request.auth) {
    const login = new URL("/login", request.nextUrl.origin);
    login.searchParams.set("next", pathname);
    return Response.redirect(login);
  }
  if (isAdmin && request.auth?.user.role !== "ADMIN" && request.auth?.user.role !== "STAFF") {
    return Response.redirect(new URL("/", request.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
