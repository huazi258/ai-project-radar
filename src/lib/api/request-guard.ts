import type { NextRequest } from "next/server";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function getOriginError(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return "请求来源无法校验。";
  }

  try {
    const requestOrigin = new URL(origin).origin;
    const expectedOrigin = `${protocol}://${host}`;

    if (requestOrigin !== expectedOrigin) {
      return "请求来源不合法。";
    }
  } catch {
    return "请求来源不合法。";
  }

  return null;
}

export function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}
