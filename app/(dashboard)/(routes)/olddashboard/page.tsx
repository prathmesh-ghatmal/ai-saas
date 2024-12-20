"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Code,
  Image,
  MessageSquare,
  Music,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    lable: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgcolor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    lable: "Code Generation",
    icon: Code,
    color: "text-yellow-500",
    bgcolor: "bg-yellow-500/10",
    href: "/code",
  },
  {
    lable: "Image Generation",
    icon: Image,
    color: "text-pink-500",
    bgcolor: "bg-pink-500/10",
    href: "/image",
  },
  {
    lable: "Video Generation",
    icon: Video,
    color: "text-orange-500",
    bgcolor: "bg-orange-500/10",
    href: "/video",
  },
  {
    lable: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgcolor: "bg-emerals-500/10",
    href: "/music",
  },
];

const DashboardPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className=" mb-8 space-y-4 ">
        <h2 className=" text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className=" text-muted-foreground font-light text-sm md:text-lg text-center">
          chat with the smartest AI - Experience the power of AI
        </p>
      </div>
      <div className=" px-4 md:px-20 lg:px32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className=" p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className=" flex items-center gap-x-4 ">
              <div className={cn(" p-2 w-fit rounded-md ", tool.bgcolor)}>
                <tool.icon className={cn(" w-8 h-8", tool.color)} />
              </div>
              <div className=" font-semibold">{tool.lable}</div>
            </div>
            <ArrowRight className=" w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
};
export default DashboardPage;
