import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth, currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    console.log("starteddddddddddddddddddddd");
    const { userId } = await auth();
    const user = await currentUser();

    if (!user || !userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    // If the user does not have a subscription, return an error
    if (!userSubscription?.razorpaySubscriptionId) {
      return new NextResponse("");
    }

    const subscriptionstatus = userSubscription.razorpaySubscriptionStatus;
    if (subscriptionstatus === "created") {
      const userstatus = userSubscription.razorpaySubscriptionStatus;
      const id = userSubscription.razorpaySubscriptionId;
      const subscription = razorpay.subscriptions.fetch(id);
      return new NextResponse(
        JSON.stringify({ url: (await subscription).short_url, userstatus })
      );
    }

    return new NextResponse(subscriptionstatus, { status: 200 });
  } catch (error) {
    console.error("Error in subscription status polling:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error creating order or polling status" }),
      { status: 500 }
    );
  }
}
