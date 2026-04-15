import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/http/env";

export const dynamic = "force-dynamic";

function forwardRequestHeaders(req: NextRequest): Headers {
  const h = new Headers();
  const cookie = req.headers.get("cookie");
  if (cookie) h.set("cookie", cookie);
  const ct = req.headers.get("content-type");
  if (ct) h.set("content-type", ct);
  const auth = req.headers.get("authorization");
  if (auth) h.set("authorization", auth);
  return h;
}

function copyResponseCookies(from: Response, to: NextResponse) {
  const anyHeaders = from.headers as unknown as { getSetCookie?: () => string[] };
  const list = typeof anyHeaders.getSetCookie === "function" ? anyHeaders.getSetCookie() : null;
  if (list?.length) {
    for (const c of list) {
      to.headers.append("Set-Cookie", c);
    }
    return;
  }
  const single = from.headers.get("set-cookie");
  if (single) {
    to.headers.append("Set-Cookie", single);
  }
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await ctx.params;
  const path = segments.join("/");
  const cleanPath = path.startsWith("api/") ? path.slice(4) : path;
  const target = `${getBackendUrl()}/api/${cleanPath}${req.nextUrl.search}`;

  const init: RequestInit = {
    method: req.method,
    headers: forwardRequestHeaders(req),
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const buf = await req.arrayBuffer();
    if (buf.byteLength) init.body = buf;
  }

  const upstream = await fetch(target, init);
  const out = new NextResponse(upstream.body, { status: upstream.status });

  copyResponseCookies(upstream, out);

  const ct = upstream.headers.get("content-type");
  if (ct) out.headers.set("content-type", ct);

  return out;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
