import { LucideIcon, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import { Heading } from "./heading";
import { getApiLimitCount } from "@/lib/api-limits";

interface NavbarProps {
  title: string;
  // description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  count: number;
}

const Navbar = ({
  title,
  // description,
  icon: Icon,
  iconColor,
  bgColor,
  count,
}: NavbarProps) => {
  // const apiLimitCount = await getApiLimitCount();
  return (
    <div className="fixed top-0 left-0 md:left-72 right-0 h-16 bg-gray-800 text-white flex items-center px-4 z-50">
      <MobileSidebar apiLimitCount={count} />
      <div className=" w-full">
        <Heading
          title={title}
          // description={description}
          icon={Icon}
          iconColor={iconColor}
          bgColor={bgColor}
        />
      </div>

      <div className=" flex w-full justify-end">
        <UserButton />
      </div>
    </div>
  );
};
export default Navbar;
