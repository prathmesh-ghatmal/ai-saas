import { getGenerationCount } from "@/lib/api-limits";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const count = await getGenerationCount();
    console.log(count);
    if (count === null) {
      return "empty";
    } else {
      return NextResponse.json({ count });
    }
  } catch (error) {
    console.log("[counting_error]", error);
    return new NextResponse("internal do do error", { status: 500 });
  }
}
