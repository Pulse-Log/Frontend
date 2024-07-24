"use client"

import React from "react";
import { PiGraphLight } from "react-icons/pi";
import { Button } from "./ui/button";
import { FaFolder, FaLayerGroup } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HiHome } from "react-icons/hi";
import { IoCreate } from "react-icons/io5";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
export default function SideBar() {
  return (
    <div className=" max-h-screen w-[17vw] bg-black fixed top-0 left-0 bottom-0 flex flex-col justify-between align-middle py-[2vh] px-[15px] border-r-1 border-[#222222c4]">
      <div>
        <div className=" flex max-w-full justify-center items-center gap-2 my-[10px]">
          <PiGraphLight className=" text-white text-4xl" />
          <h1 className=" text-xl font-medium">Logix</h1>
        </div>
        <div className=" mb-3 mt-7 flex justify-between items-center">
          {" "}
          <p>Projects</p> <IoCreate className=" cursor-pointer" />
        </div>

        <div className=" max-w-full h-[60vh] overflow-auto no-scrollbar">
          <div className=" text-white text-base w-full my-2">
            <div className=" w-full  flex items-center gap-2 cursor-pointer">
              <MdKeyboardArrowDown />
              <FaFolder className=" text-base"></FaFolder>
              <p className=" text-base">geogabble</p>
            </div>
            <div className=" h-fit w-full mt-2">
              <div className=" hover:bg-zinc-800 transition-all h-fit w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
                <p>Home</p>
              </div>
              <div className=" hover:bg-zinc-800  transition-all h-fit w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
                <p>Settings</p>
              </div>
              <div className=" hover:bg-zinc-800  transition-all h-fit border-1 w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg bg-zinc-800 py-1 cursor-pointer">
                <FaLayerGroup />
                {/* <BsDot className=" text-red-500 text-2xl"/> */}
                <p>latency</p>
              </div>
              <div className=" hover:bg-zinc-800  transition-all h-fit w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
                <FaLayerGroup />
                {/* <BsDot className=" text-green-500 text-2xl"/> */}
                <p>response time</p>
              </div>
              <div className="hover:bg-zinc-800  transition-all h-fit w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
                <FaLayerGroup />
                {/* <BsDot className=" text-yellow-500 text-2xl"/> */}
                <p>server 1</p>
              </div>
              <div className="hover:bg-zinc-800  transition-all w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
                <FaLayerGroup />
                {/* <BsDot className=" text-green-500 text-2xl"/> */}
                <p>group 1</p>
              </div>
              <div className="hover:bg-zinc-800  transition-all w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
                <FaLayerGroup />
                {/* <BsDot className=" text-red-500 text-2xl"/> */}
                <p>login-ms</p>
              </div>
              <div className="hover:bg-zinc-800  transition-all w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
                <FaLayerGroup />
                {/* <BsDot className=" text-green-500 text-2xl"/> */}
                <p>profile-ms</p>
              </div>
              <div className="hover:bg-zinc-800  transition-all w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
                <FaLayerGroup />
                {/* <BsDot className=" text-green-500 text-2xl"/> */}
                <p>test-server</p>
              </div>
            </div>
          </div>
          <div className=" text-white text-base w-full my-2">
            <div className=" w-full  flex items-center gap-2 cursor-pointer">
              <MdKeyboardArrowRight className="text-base" />
              <FaFolder className=" text-base"></FaFolder>
              <p className=" text-base">project a</p>
            </div>
          </div>
          <div className=" text-white text-base w-full my-2">
            <div className=" w-full  flex items-center gap-2 cursor-pointer">
              <MdKeyboardArrowRight className="text-base" />
              <FaFolder className=" text-base"></FaFolder>
              <p className=" text-base">codexsphere</p>
            </div>
          </div>
          <div className=" text-white text-base w-full my-2">
            <div className=" w-full  flex items-center gap-2 cursor-pointer">
              <MdKeyboardArrowRight className="text-base" />
              <FaFolder className=" text-base"></FaFolder>
              <p className=" text-base">logix</p>
            </div>
          </div>
        </div>
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
