"use client";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import for hidden title

interface mobileSidebarProps {
  apiLimitCount: number;
}

const MobileSidebar = ({ apiLimitCount = 0 }: mobileSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetTitle></SheetTitle>
        <Sidebar apiLimitCount={apiLimitCount} isPro={true} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
