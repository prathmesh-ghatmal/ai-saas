import { useState } from "react";
import { Button } from "./ui/button";
import { UserProfile } from "@clerk/nextjs";

export const ProfileButton = () => {
  const [isopen, SetIsopen] = useState(true);

  const onClick = () => {
    SetIsopen(!isopen);
  };

  return (
    <div>
      <div>
        <Button onClick={onClick}>
          {isopen ? "open profile" : "close profile"}
        </Button>
        <div hidden={isopen}>
          <UserProfile />
        </div>
      </div>
    </div>
  );
};
