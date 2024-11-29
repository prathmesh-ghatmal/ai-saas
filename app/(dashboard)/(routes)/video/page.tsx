import { Heading } from "@/components/heading";
import { Video } from "lucide-react";

const VideoGenerationPage = () => {
  return (
    <div>
      <Heading
        title="Video generation"
        description="Best video generation ai model"
        icon={Video}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />
    </div>
  );
};

export default VideoGenerationPage;
