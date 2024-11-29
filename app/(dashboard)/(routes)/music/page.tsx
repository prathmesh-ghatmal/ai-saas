import { Heading } from "@/components/heading";
import { Video } from "lucide-react";

const MusicGenerationPage = () => {
  return (
    <div>
      <Heading
        title="Music Generation"
        description="Best music generation ai model"
        icon={Video}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
    </div>
  );
};

export default MusicGenerationPage;
