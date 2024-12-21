"use client";
import Navbar from "@/components/navbar";
import { Settings } from "lucide-react";
import { checkSubscription } from "@/lib/subscription";
import { UserProfile } from "@clerk/nextjs";
import { SubscriptionButton } from "@/components/subscription-button";
import { ProfileButton } from "@/components/profilebutton";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SettingsPage = () => {
  const [ispro, Setispro] = useState(false);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = axios.post("/api/check_subscription");
        Setispro((await response).data);
        console.log("hrrr", (await response).data);
      } catch (error) {
        console.log("error in fetching data", error);
      }
    };
    fetchdata();
  }, []);

  return (
    <div>
      {" "}
      <Navbar
        title="Settings"
        // description="Best music generation ai model"
        icon={Settings}
        iconColor="text-white-500"
        bgColor="bg-white-500/10"
        count={0}
      />
      {/* <div className=" mx-10 w-4/5 md:w-3/4 lg:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>hello</CardTitle>
            <CardDescription>how are you </CardDescription>
            <Card>
              <CardContent className=" flex justify-between pt-5">
                <div>Subscription id </div>
                <div>where are you from </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className=" flex justify-between pt-5">
                <div>Subscription Status </div>
                <div>where are you from </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className=" flex justify-between pt-5">
                <div>Subscription end date </div>
                <div>where are you from </div>
              </CardContent>
            </Card>
          </CardHeader>
        </Card>
      </div> */}
      <div className=" px-4 lg:px-8 space-y-4">
        <div className=" text-muted-foreground text-sm">
          {ispro
            ? "you are currently on pro plan"
            : "you are currently on free plan"}
        </div>

        <SubscriptionButton isPro={ispro} />
        <ProfileButton />
      </div>
    </div>
  );
};
export default SettingsPage;
