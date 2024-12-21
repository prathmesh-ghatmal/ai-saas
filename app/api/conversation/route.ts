import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  checkApiLimit,
  increaseApiLimit,
  IncreaseConversationcount,
} from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!messages) {
      return new NextResponse("messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    console.log("check", isPro);

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    if (!isPro) {
      await increaseApiLimit();
    }
    await IncreaseConversationcount();
    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[conversation_error]", error);
    return new NextResponse("internal do do error", { status: 500 });
  }
}
