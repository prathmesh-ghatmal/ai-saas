"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";
import axios from "axios";

interface FreeCounterProps {
  apiLimitCount: number;
  isPro: boolean;
}

export const FreeCounter = ({ apiLimitCount = 0, isPro }: FreeCounterProps) => {
  const proModal = useProModal();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  if (isPro) {
    return null;
  }
  const onSubscribe = async () => {
    try {
      //proModal.onClose();

      const response = axios.post("/api/redirect");
      if ((await response).data.userstatus === "created") {
        window.open((await response).data.url, "_blank");
        alert(
          "your payment is already initiated please complete the payment if already done please wait patiently  for a moment"
        );
      }
      if ((await response).data === "") {
        proModal.onOpen();
      } else if ((await response).data === "active") {
        proModal.onClose();
      } else if ((await response).data === "created") {
        // window.location.href = (await response).data.url;
      } else if ((await response).data === "authenticated") {
        window.location.reload();
      }

      console.log((await response).data);
      // window.location.href = (await response).data.url;
    } catch (error) {
      console.log(error, "RAZORPAY_CLIENT_ERROR");
    }
  };

  return (
    <div className=" px-3">
      <Card className=" bg-white/10 border-0">
        <CardContent className=" py-6">
          <div className=" text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount}/{MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
              className=" h-3"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
          </div>
          <Button onClick={onSubscribe} className=" w-full" variant="premium">
            Upgrade
            <Zap className=" w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
