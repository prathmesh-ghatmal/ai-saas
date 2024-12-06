import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const checkPredictionStatus = async (predictionId: string) => {
  const response = await replicate.predictions.get(predictionId); // pass the predictionId directly
  return response.status;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!prompt) {
      return new NextResponse("messages are required", { status: 400 });
    }

    const input = {
      fps: 24,
      width: 1024,
      height: 576,
      prompt: prompt,
      guidance_scale: 17.5,
      negative_prompt: " dust, noisy, washed out, ugly, distorted, broken",
    };

    const prediction = replicate.predictions.create({
      version:
        "9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      input,
    });

    console.log(prediction);

    // Polling loop to wait for the prediction to succeed
    let status = "starting";
    while (status !== "succeeded" && status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before checking again
      status = await checkPredictionStatus((await prediction).id); // pass prediction.id directly
      console.log(`Current status: ${status}`);
    }

    if (status === "succeeded") {
      const finalPrediction = await replicate.predictions.get(
        (
          await prediction
        ).id
      ); // pass prediction.id directly
      console.log("Prediction succeeded:", finalPrediction);
      return NextResponse.json(finalPrediction);
    } else {
      console.log("Prediction failed.");
      return new NextResponse("Prediction failed", { status: 500 });
    }
  } catch (error) {
    console.log("[conversation_error]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
