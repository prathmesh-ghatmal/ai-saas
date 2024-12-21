"use client";

import { CrispProvider } from "@/components/crisp-provider";
import { Empty } from "@/components/empty";
import Navbar from "@/components/navbar";
import PieChart from "@/components/piechart";
import axios from "axios";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [conversation, setConversation] = useState<number>(0);
  const [code, setCode] = useState<number>(0);
  const [image, setImage] = useState<number>(0);
  const [video, setVideo] = useState<number>(0);
  const [music, setMusic] = useState<number>(0);
  const [isempty, setIsempty] = useState(false);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/getcount");
        console.log("response is", response.data);
        const count = response.data.count;
        if (count === "empty") {
          setIsempty(true);
          console.log("this is null");
        } else {
          console.log("hello");
          setConversation(count[0]);
          setCode(count[1]);
          setImage(count[2]);
          setVideo(count[3]);
          setMusic(count[4]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response2 = await axios.post("/api/demo");
        setCount(response2.data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <Navbar
        title="Dashboard"
        icon={LayoutDashboard}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
        count={count}
      />
      <div className=" mb-8 space-y-4 ">
        <h2 className=" text-2xl md:text-4xl font-bold text-center">
          Unlock the Power of AI
        </h2>
        <p className=" text-muted-foreground font-light text-sm md:text-lg text-center">
          Engage with the Smartest AI Ever - Experience AI Like Never Before
        </p>
        <p className=" text-muted-foreground font-light text-xs md:text-sm text-center">
          Create, converse, and innovate with AI: images, code, music, video,
          and more—all in one platform.
        </p>
      </div>
      <div className=" flex justify-center ">
        <div className="w-4/5 md:3/4 lg:w-1/3">
          {isempty && <Empty label="You have not generated anyting yet " />}
          {!isempty && (
            <div>
              <PieChart
                conversation={conversation}
                code={code}
                image={image}
                music={music}
                video={video}
              />
              <div className=" flex justify-center pt-5 text-lg">
                <p className=" justify-center items-center">
                  {" "}
                  Analytics of your generations so far{" "}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <CrispProvider />
    </div>
  );
};
export default DashboardPage;
