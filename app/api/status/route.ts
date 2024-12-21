import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await prismadb.userSubscription.findUnique({
      where: { userId: userId },
    });

    const status = subscription?.razorpaySubscriptionStatus;

    // Return the status as a JSON response
    return NextResponse.json({ status });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
