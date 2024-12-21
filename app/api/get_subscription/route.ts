import { NextResponse } from "next/server";
import { GetUserSubscription } from "@/lib/api-limits";
export async function GET() {
  try {
    const subscriptionDetails = await GetUserSubscription();
    if (!subscriptionDetails) {
      return NextResponse.json("");
    }

    return NextResponse.json(subscriptionDetails);
  } catch (error) {
    console.log("error in getting subscription details", error);
  }
}
