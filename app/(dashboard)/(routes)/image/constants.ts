import { Label } from "@radix-ui/react-label";
import * as z from "zod";

export const fromSchema = z.object({
  prompt: z.string().min(1, { message: "Image prompt is required" }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
});

export const amountOptions = [
  {
    value: "1",
    label: "1 image",
  },
  {
    value: "2",
    label: "2 image",
  },
  {
    value: "3",
    label: "3 image",
  },
  {
    value: "4",
    label: "4 image",
  },
  {
    value: "5",
    label: "5 image",
  },
];

export const resolutionOptions = [
  {
    value: "256x256",
    label: "256x256",
  },
  {
    value: "512x512",
    label: "512x512",
  },
  {
    value: "1024x1024",
    label: "1024x1024",
  },
];
