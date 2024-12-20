import { auth } from "@clerk/nextjs/server";
import prismadb from "./prismadb";

export const checkSubscription = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
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
    return false;
  }

  const isValid =
    userSubscription.razorpaySubscriptionId &&
    (userSubscription.razorpaySubscriptionStatus === "authenticated" ||
      userSubscription.razorpaySubscriptionStatus === "active");

  return !!isValid;
};
