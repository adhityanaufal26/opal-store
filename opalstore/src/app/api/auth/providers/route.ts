import { NextRequest, NextResponse } from "next/server";

// Block direct access to /api/auth/providers
// Only allow requests from our own site (via referer check)
export async function GET(request: NextRequest) {
  const referer = request.headers.get("referer") || "";
  const host = request.headers.get("host") || "";
  
  // Allow if referer is from our own domain (login page calls this)
  if (referer && host && referer.includes(host)) {
    // Let NextAuth catch-all handle it by redirecting internally
    // But since we're at a more specific route, we need to return providers ourselves
    // Simple: just return a minimal response
    return NextResponse.json({
      credentials: { id: "credentials", name: "Email", type: "credentials" },
      google: { id: "google", name: "Google", type: "oauth" },
    });
  }

  // Block direct/external access
  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}
