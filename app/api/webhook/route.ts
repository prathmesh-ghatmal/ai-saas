import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prismadb from "@/lib/prismadb";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!; // Your Razorpay Webhook Secret

export async function POST(req: NextRequest) {
  try {
    const sigHeader = req.headers.get("X-Razorpay-Signature");
    const body = await req.text();

    // Generate a signature from the payload and secret key
    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    // Validate the signature
    if (sigHeader !== generatedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Parse the body (JSON payload)
    const event = JSON.parse(body);

    // Handle different types of events
    if (event.event === "payment.captured") {
      const paymentId = event.payload.payment.entity.id;
      const amount = event.payload.payment.entity.amount;
      console.log(`Payment captured: ${paymentId} for amount ${amount}`);

      // Update your database with payment success details
    }
    if (event.event === "subscription.completed") {
      const subscriptionId = event.payload.subscription.entity.id;
      const customerId = event.payload.subscription.entity.customer_id;
      console.log(`Subscription completed: ${subscriptionId}`);
      console.log(`Customer ID: ${customerId}`);
      console.log("thissssssssss is user id", event.payload.userId);

      // Save subscription details to your database
    }
    if (event.event === "subscription.authenticated") {
      const subscriptionId = event.payload.subscription.entity.id;
      console.log(`Subscription authenticated: ${subscriptionId}`);
      console.log(
        "thissssssssss is user id",
        event.payload.subscription.entity
      );
      const uid = event.payload.subscription.entity.notes.user_id;
      const status = event.payload.subscription.entity.status;
      const cid = event.payload.subscription.entity.customer_id;
      const end = event.payload.subscription.entity.expire_by;

      await prismadb.userSubscription.update({
        where: { userId: uid },
        data: {
          razorpaySubscriptionStatus: status,
          razorpayCustomerId: cid,
          razorpayCurrentPeriodEnd: parseInt(end),
        },
      });

      // Update your database to mark subscription as cancelled
    }
    if (event.event === "subscription.activated") {
      const subscriptionId = event.payload.subscription.entity.id;
      console.log(`Subscription activated: ${subscriptionId}`);
      console.log(event.payload.subscription.entity.notes.user_id);
      const uid = event.payload.subscription.entity.notes.user_id;
      const status = event.payload.subscription.entity.status;
      await prismadb.userSubscription.update({
        where: { userId: uid },
        data: { razorpaySubscriptionStatus: status },
      });

      // Update your database to mark subscription as cancelled
    }
    if (event.event === "payment.failed") {
      const paymentId = event.payload.payment.entity.id;
      console.log(`Payment failed: ${paymentId}`);
      // Update your database with payment failure details
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
