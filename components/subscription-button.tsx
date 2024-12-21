"use client";

import { Cross, Zap } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import axios from "axios";
import { useProModal } from "@/hooks/use-pro-modal";

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({
  isPro = false,
}: SubscriptionButtonProps) => {
  const promodal = useProModal();
  const [ishidden, SetIshidden] = useState(true);
  const [subscriptionId, SetsubscriptionId] = useState(null);
  const [subscriptionStatus, SetsubscriptionStatus] = useState(null);
  const [subscriptionend, Setsubscriptionend] = useState("");

  const onCancle = async () => {
    try {
      console.log("inside of oncanel");
      await axios.post("/api/cancel_subscription");
      window.location.reload();
      alert("your subscription is cancelled");
    } catch (error) {
      console.log("some error occured in canceling", error);
    }
  };

  const ONclick = async () => {
    try {
      if (isPro) {
        const response = await axios.get("/api/get_subscription");
        SetsubscriptionId(response.data.SubscriptionId);
        SetsubscriptionStatus(response.data.SubscriptionStatus);
        const enddate = new Date(
          parseInt(response.data.CurrentPeriodEnd) * 1000
        ).toLocaleDateString("en-GB");
        Setsubscriptionend(enddate.toString());
        SetIshidden(false);
      } else {
        promodal.onOpen();
      }
    } catch (error) {
      console.log("BILLING_ERROR", error);
    }
  };

  const onClose = () => {
    SetIshidden(true);
  };

  return (
    <div>
      <div hidden={!ishidden}>
        <Button variant={isPro ? "default" : "premium"} onClick={ONclick}>
          {isPro ? "Manage Subscription" : "Upgrade"}
          {!isPro && <Zap className=" w-4 h-4 ml-2 fill-white" />}
        </Button>
      </div>
      <div hidden={ishidden} className=" mt-5 w-4/5 md:w-3/4 lg:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className=" flex justify-between">
                <div>Subscriptio Details</div>
                <div>
                  <Button onClick={onClose}>
                    <Cross className=" rotate-45 w-1 h-1 fill-white" />
                  </Button>
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              you can manage your subscriptions here{" "}
            </CardDescription>
            <Card>
              <CardContent className=" flex justify-between pt-5">
                <div>Subscription id </div>
                <div>{subscriptionId}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className=" flex justify-between pt-5">
                <div>Subscription Status </div>
                <div>{subscriptionStatus} </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className=" flex justify-between pt-5">
                <div>Subscription end date </div>
                <div>{subscriptionend}</div>
              </CardContent>
            </Card>
          </CardHeader>
          <CardFooter>
            <Button onClick={onCancle} className="w-full">
              Cancle Subscription
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
