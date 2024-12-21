import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  checkApiLimit,
  increaseApiLimit,
  IncreaseImageGenerationcount,
} from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;
    const validResolutions = ["256x256", "512x512", "1024x1024"];
    if (!validResolutions.includes(resolution)) {
      return new NextResponse("Invalid pgggggggggggggggg resolution", {
        status: 400,
      });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!prompt) {
      return new NextResponse("prompt is required", { status: 400 });
    }
    if (!amount) {
      return new NextResponse("amount is required", { status: 400 });
    }
    if (!resolution) {
      return new NextResponse("resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });
    if (!isPro) {
      await increaseApiLimit();
    }
    await IncreaseImageGenerationcount();

    console.log(response);
    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[Image_error]", error);
    return new NextResponse("internal do do error", { status: 500 });
  }
}
