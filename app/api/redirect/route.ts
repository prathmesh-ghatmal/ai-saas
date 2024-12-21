// import { NextRequest, NextResponse } from "next/server";
// import Razorpay from "razorpay";
// import { auth, currentUser } from "@clerk/nextjs/server";
// import prismadb from "@/lib/prismadb";
// import { absoluteUrl } from "@/lib/utils";

// const settingsUrl = absoluteUrl("/settings");
// const plan = process.env.RAZORPAY_PLAN_ID;

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await auth();
//     const user = await currentUser();

//     if (!user || !userId) {
//       return new NextResponse("unauthorized", { status: 401 });
//     }

//     const userSubscription = await prismadb.userSubscription.findUnique({
//       where: {
//         userId,
//       },
//     });
//    const current =razorpay.subscriptions.fetch(userSubscription?.razorpaySubscriptionId|| ' ')

//     return new NextResponse(
//       JSON.stringify({  })
//     );
//   } catch (error) {
//     console.error("error creating order", error);
//     return NextResponse.json(
//       { error: "error creating order" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth, currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");
const plan = process.env.RAZORPAY_PLAN_ID;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const POLL_INTERVAL = 5000; // 5 seconds interval between checks
const MAX_POLL_ATTEMPTS = 10; // Max number of attempts before stopping the polling

export async function POST(req: NextRequest) {
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
