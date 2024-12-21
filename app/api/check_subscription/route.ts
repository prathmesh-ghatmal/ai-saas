import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(false);
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
      select: {
        razorpaySubscriptionId: true,
        razorpaySubscriptionStatus: true,
        razorpayPlanId: true,
      },
    });

    if (!userSubscription) {
      return NextResponse.json(false);
    }

    const isValid =
      userSubscription.razorpaySubscriptionId &&
      (userSubscription.razorpaySubscriptionStatus === "authenticated" ||
        userSubscription.razorpaySubscriptionStatus === "active");

    return NextResponse.json(!!isValid);
  } catch {}
}
