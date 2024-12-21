import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { userId } = await auth();

  // Check if the user is authenticated
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Retrieve subscription ID from your database
  const subscription = await prismadb.userSubscription.findUnique({
    where: { userId },
    select: { razorpaySubscriptionId: true }, // Ensure your database has the Razorpay subscription ID
  });

  if (!subscription?.razorpaySubscriptionId) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 }
    );
  }

  try {
    // Cancel the Razorpay subscription
    const response = await razorpay.subscriptions.cancel(
      subscription.razorpaySubscriptionId,
      false // Pass `false` to cancel immediately or `true` to cancel at the end of the billing cycle
    );
    if (response.status === "cancelled") {
      await prismadb.userSubscription.delete({ where: { userId } });
    }
    console.log("Subscription cancellation response:", response.status);

    // Optionally, update your database to reflect cancellation

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
