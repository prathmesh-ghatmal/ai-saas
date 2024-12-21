import { useProModal } from "@/hooks/use-pro-modal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Check,
  Code,
  Image,
  MessageSquare,
  Music,
  Video,
  Zap,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useProcessingModal } from "@/hooks/use-processing-modal copy";

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
    bgcolor: "bg-emerald-500/10",
    href: "/music",
  },
];

export const ProModal = () => {
  const proModal = useProModal();
  const processingModal = useProcessingModal();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      proModal.onClose();
      processingModal.onOpen();
      setLoading(true);
      const response = axios.post("/api/payment");

      // window.location.href = (await response).data.url;
      window.open((await response).data.url, "_blank");
      console.log("hellllllllllllllllllllllllllllllllloooooooooooooooo");
    } catch (error) {
      console.log(error, "RAZORPAY_CLIENT_ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              upgrade to genius
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
          {tools.map((tool) => (
            <Card
              key={tool.lable}
              className="p-3 border-black/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgcolor)}>
                  <tool.icon className={cn("w-6 h-6", tool.color)} />
                </div>
                <div className="font-semibold text-sm">{tool.lable}</div>
              </div>
              <Check className="text-primary w-4 h-4" />
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onSubscribe} variant="premium" className="w-full">
            Upgrade <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
