"use client"

import React from "react";
import { PiGraphLight } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IoCreate } from "react-icons/io5";
import Link from "next/link";
import SideBarStructure from "./SideBar/projects-sidebar";
import { MdDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
export default function SideBar() {
  
  return (
    <div className=" z-[3] w-[15vw] top-[60px] bg-black fixed left-0 bottom-0 flex flex-col justify-between align-middle py-[2vh] px-[15px] border-t-1 border-white/[0.2]">
      <div>
      <div className="flex justify-between items-center mt-3">
          <p className=" text-base font-semibold">Menu</p>
        </div>
      <div className=" flex justify-start items-center gap-4 px-2 h-fit py-2 hover:bg-accent  transition-all rounded-lg cursor-pointer">
      <MdDashboard />
      <p className=" text-sm">Dashboard</p>
      </div>
      <div className=" flex justify-start items-center gap-4 px-2 h-fit py-2 hover:bg-accent  transition-all rounded-lg cursor-pointer">
      <FaUser />
      <p className=" text-sm">Profile</p>
      </div>
        <div className="flex justify-between items-center mt-3">
          <p className=" text-base font-semibold">Projects</p> <Link href={'/projects/new'}><IoCreate className=" cursor-pointer" /></Link>
        </div>
        <SideBarStructure></SideBarStructure>
      </div>
      <div className=" w-full h-fit  py-2 flex flex-col items-center justify-center gap-5" >
        <div className=" flex items-center justify-evenly gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-base">Lakshya Bhati</p>
          <p className=" bg-green-500 rounded-lg px-2 py-1 text-sm">Free</p>
        </div>
        <p className=" h-fit cursor-pointer px-4 my-1 py-2 bg-white text-black flex justify-center align-middle rounded-lg text-base">Upgrade to pro</p>
      </div>
    </div>
  );
}
