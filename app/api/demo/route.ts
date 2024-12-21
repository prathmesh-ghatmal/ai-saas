import { getApiLimitCount } from "@/lib/api-limits";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const count = await getApiLimitCount();
    if (!count) {
      const count1 = 0;
      return NextResponse.json({ count1 });
    } else {
      return NextResponse.json({ count });
    }
  } catch (error) {
    console.log("[counting_error]", error);
    return new NextResponse("internal do do error", { status: 500 });
  }
}
