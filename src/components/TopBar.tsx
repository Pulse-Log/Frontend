import Link from "next/link";
import { PiGraphLight } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlaceholdersAndVanishInput } from "./ui/placeholder-and-vanish-input";
import { useNavbar } from "@/contexts/navbar-context";
import { FiMenu } from "react-icons/fi";

export default function TopBar() {

  const {toggleSidebar} = useNavbar();
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className=" fixed z-[30] w-screen top-0 h-[60px] flex justify-between items-center px-4">
      <div className="flex items-center justify-center border-white/[0.2] h-full gap-3">
      <FiMenu onClick={toggleSidebar} className=" cursor-pointer text-xl"></FiMenu>
      <PiGraphLight className=" text-white text-3xl" />
      <p className=" text-xl">Logix</p>
      
      </div>
      <p className=" text-base">Pre-release version</p>
    </div>
  );
}
