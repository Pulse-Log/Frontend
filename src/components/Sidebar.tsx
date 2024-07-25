"use client"

import React from "react";
import { PiGraphLight } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IoCreate } from "react-icons/io5";
import Link from "next/link";
import SideBarStructure from "./SideBar/projects-sidebar";
export default function SideBar() {
  
  return (
    <div className=" max-h-screen w-[15vw] bg-black fixed top-0 left-0 bottom-0 flex flex-col justify-between align-middle py-[2vh] px-[15px] border-r-1 border-[#222222c4]">
      <div>
        <Link href={'/dashboard'}><div className=" flex max-w-full justify-center items-center gap-2 my-[10px] cursor-pointer">
          <PiGraphLight className=" text-white text-4xl" />
          <h1 className=" text-2xl font-medium">Logix</h1>
        </div></Link>
        <div className=" mb-1 mt-3 pt-4 mx-2 flex justify-between items-center">
          <p className=" text-muted-foreground text-sm font-semibold">PROJECTS</p> <Link href={'/projects/new'}><IoCreate className=" cursor-pointer" /></Link>
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
