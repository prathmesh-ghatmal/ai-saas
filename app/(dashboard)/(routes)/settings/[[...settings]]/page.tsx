"use client";
import Navbar from "@/components/navbar";
import { Settings } from "lucide-react";
import { SubscriptionButton } from "@/components/subscription-button";
import { ProfileButton } from "@/components/profilebutton";
import { useEffect, useState } from "react";
import axios from "axios";

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
        icon={Settings}
        iconColor="text-white-500"
        bgColor="bg-white-500/10"
        count={0}
      />
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
