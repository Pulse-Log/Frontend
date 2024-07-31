import Link from "next/link";
import { PiGraphLight } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlaceholdersAndVanishInput } from "./ui/placeholder-and-vanish-input";

export default function TopBar() {
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className=" fixed z-[10] w-screen top-0 h-[60px] flex justify-between items-center">
      <div className=" w-[15vw] flex items-center justify-center border-white/[0.2] border-r-1 h-full">
        <Link href={"/dashboard"} className=" w-full mx-2 rounded-md flex items-center justify-center h-fit py-1 ">
          <div className=" flex w-full justify-center items-center gap-2 cursor-pointer">
            <PiGraphLight className=" text-white text-3xl" />
            <h1 className=" text-2xl font-semibold">Logix</h1>
          </div>
        </Link>
      </div>
      <div className=" flex items-center w-fit justify-center h-full mr-5 gap-3">
      <PlaceholdersAndVanishInput
        placeholders={["Seach anything"]}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
        <div className=" flex w-fit items-center justify-center gap-2">
        <Avatar className=" h-[60%]">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className=" text-base">Lakshya Bhati</p>
        </div>
      </div>
    </div>
  );
}
