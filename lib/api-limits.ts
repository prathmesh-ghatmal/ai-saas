import { MAX_FREE_COUNTS } from "@/constants";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export const increaseApiLimit = async () => {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });
  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  const { userId } = await auth();
  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit) {
    return 0;
  } else {
    return userApiLimit.count;
  }
};

export const IncreaseConversationcount = async () => {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  const userGenerationCount = await prismadb.userGenerationCount.findUnique({
    where: { userId },
  });

  if (userGenerationCount) {
    await prismadb.userGenerationCount.update({
      where: { userId: userId },
      data: { Conversationcount: userGenerationCount.Conversationcount + 1 },
    });
  } else {
    await prismadb.userGenerationCount.create({
      data: { userId: userId, Conversationcount: 1 },
    });
  }
};

export const IncreaseImageGenerationcount = async () => {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  const userGenerationCount = await prismadb.userGenerationCount.findUnique({
    where: { userId },
  });

  if (userGenerationCount) {
    await prismadb.userGenerationCount.update({
      where: { userId: userId },
      data: {
        ImageGenerationcount: userGenerationCount.ImageGenerationcount + 1,
      },
    });
  } else {
    await prismadb.userGenerationCount.create({
      data: { userId: userId, ImageGenerationcount: 1 },
    });
  }
};

export const IncreaseCodeGenerationcount = async () => {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  const userGenerationCount = await prismadb.userGenerationCount.findUnique({
    where: { userId },
  });

  if (userGenerationCount) {
    await prismadb.userGenerationCount.update({
      where: { userId: userId },
      data: {
        CodeGenerationcount: userGenerationCount.CodeGenerationcount + 1,
      },
    });
  } else {
    await prismadb.userGenerationCount.create({
      data: { userId: userId, CodeGenerationcount: 1 },
    });
  }
};

export const IncreaseMusicGenerationcount = async () => {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  const userGenerationCount = await prismadb.userGenerationCount.findUnique({
    where: { userId },
  });

  if (userGenerationCount) {
    await prismadb.userGenerationCount.update({
      where: { userId: userId },
      data: {
        MusicGenerationcount: userGenerationCount.MusicGenerationcount + 1,
      },
    });
  } else {
    await prismadb.userGenerationCount.create({
      data: { userId: userId, MusicGenerationcount: 1 },
    });
  }
};

export const IncreaseVideoGenerationcount = async () => {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  const userGenerationCount = await prismadb.userGenerationCount.findUnique({
    where: { userId },
  });

  if (userGenerationCount) {
    await prismadb.userGenerationCount.update({
      where: { userId: userId },
      data: {
        VideoGenerationcount: userGenerationCount.VideoGenerationcount + 1,
      },
    });
  } else {
    await prismadb.userGenerationCount.create({
      data: { userId: userId, VideoGenerationcount: 1 },
    });
  }
};

export const getGenerationCount = async () => {
  const { userId } = await auth();
  if (!userId) {
    return 0;
  }

  const userGenerationCount = await prismadb.userGenerationCount.findUnique({
    where: {
      userId,
    },
  });

  if (!userGenerationCount) {
    return "empty";
  } else {
    const count: number[] = [
      userGenerationCount.Conversationcount,
      userGenerationCount.CodeGenerationcount,
      userGenerationCount.ImageGenerationcount,
      userGenerationCount.VideoGenerationcount,
      userGenerationCount.MusicGenerationcount,
    ];

    return count;
  }
};

export const GetUserSubscription = async () => {
  const { userId } = await auth();
  if (!userId) {
    return;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: { userId },
  });

  if (!userSubscription) {
    return;
  } else {
    const SubscriptionId = userSubscription.razorpaySubscriptionId;
    const SubscriptionStatus = userSubscription.razorpaySubscriptionStatus;
    const CurrentPeriodEnd = userSubscription.razorpayCurrentPeriodEnd;
    return {
      SubscriptionId,
      SubscriptionStatus,
      CurrentPeriodEnd,
    };
  }
};
