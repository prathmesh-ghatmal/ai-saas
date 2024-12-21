import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { CreateChatCompletionRequestMessage } from "openai/resources/index.mjs";
import {
  checkApiLimit,
  increaseApiLimit,
  IncreaseCodeGenerationcount,
} from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const instructionMessage: CreateChatCompletionRequestMessage = {
  role: "system",
  content:
    "you are a code generator. you must answer in markdown code snippets followed by their explanation.if user ask anything other than code related question please say them i cant help you with that i am a code generator you ",
};

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

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });
    if (!isPro) {
      await increaseApiLimit();
    }
    await IncreaseCodeGenerationcount();

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[code_error]", error);
    return new NextResponse("internal do do error", { status: 500 });
  }
}
