import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 60;
const AUTH_RATE_LIMIT_MAX: number = 10;

function getRateLimitKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "127.0.0.1";
}

function isRateLimited(key: string, maxRequests: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > maxRequests;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getRateLimitKey(request);

  // ── Rate Limiting on API routes ──
  if (pathname.startsWith("/api/auth")) {
    if (isRateLimited(`auth:${ip}`, AUTH_RATE_LIMIT_MAX)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  } else if (pathname.startsWith("/api/")) {
    if (isRateLimited(`api:${ip}`, RATE_LIMIT_MAX)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  // ── Block exposed NextAuth providers endpoint from direct access ──
  if (pathname === "/api/auth/providers") {
    const referer = request.headers.get("referer") || "";
    const origin = request.headers.get("host") || "";
    if (!referer.includes(origin)) {
      return NextResponse.json({}, { status: 403 });
    }
  }

  return NextResponse.next();
}

// No config.matcher — middleware runs on all matched routes (auto-detected)
