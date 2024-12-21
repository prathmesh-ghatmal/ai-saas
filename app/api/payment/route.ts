import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth, currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");
const plan = process.env.RAZORPAY_PLAN_ID;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  try {
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

    if (!userSubscription) {
      console.log("in new user subscription");
      const razorpaySubscription = await razorpay.subscriptions.create({
        plan_id: "plan_PWXLFO1Zs5ETAy",
        customer_notify: 1,

        total_count: 12,
        quantity: 1,
        start_at: Math.floor(Date.now() / 1000) + 3600,
        expire_by: Math.floor(Date.now() / 1000) + 31536000,

        notes: {
          user_id: userId,
        },
      });

      await prismadb.userSubscription.create({
        data: {
          userId,
          razorpaySubscriptionId: razorpaySubscription.id,
          razorpayPlanId: razorpaySubscription.plan_id,
          razorpaySubscriptionStatus: razorpaySubscription.status,
          razorpayCustomerId: razorpaySubscription.customer_id,
        },
      });

      console.log("hiiiiiiiiiiiiii", razorpaySubscription);

      return new NextResponse(
        JSON.stringify({ url: razorpaySubscription.short_url })
      );
    }
    if (userSubscription) {
      console.log("in existing user subscription");
      const razorpaySubscription = await razorpay.subscriptions.fetch(
        userSubscription.razorpaySubscriptionId || ""
      );
      return new NextResponse(
        JSON.stringify({ url: razorpaySubscription.short_url })
      );
    }
  } catch (error) {
    console.error("error creating order", error);
    return NextResponse.json(
      { error: "error creating order" },
      { status: 500 }
    );
  }
}
