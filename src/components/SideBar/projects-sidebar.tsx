"use client"
import { fetchAllProjects } from "@/api/endpoints/project";
import useGlobalApi from "@/api/global-api";
import { FaFolder, FaLayerGroup } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import ContainerLoading from "../ContainerLoading";
import { PiProjectorScreenBold } from "react-icons/pi";
import { useState } from "react";
import Link from "next/link";

export default function SideBarStructure(){
    const[curProject, setCurrProject] = useState("");
    const {loading: contentLoaded,data: projects} = useGlobalApi(fetchAllProjects, undefined, false);
    // console.log(projects);

    function toggleProject(projectId: string){
        if(curProject===projectId){
            setCurrProject("");
        }else{
            setCurrProject(projectId);
        }
    }
    if(contentLoaded || projects===null) {
        return <ContainerLoading></ContainerLoading>;
    }
    return (
        <div className=" max-w-full h-[60vh] overflow-auto no-scrollbar">
        {projects.map((project: any, index: number) => (
        <div key={project["projectId"]} className=" text-white text-base w-full my-2">
        <div className=" w-full  flex items-center gap-2 cursor-pointer" onClick={()=>toggleProject(project["projectId"])}>
          {curProject===project["projectId"]? <MdKeyboardArrowDown />:<MdKeyboardArrowRight />}
          <FaFolder className=" text-base"></FaFolder>
          <p className=" text-base">{project["name"]}</p>
        </div>
        {curProject===project["projectId"] ? <div className=" h-fit w-full mt-2">
          <Link href={`/projects/${project["projectId"]}`}><div className=" hover:bg-zinc-800 transition-all h-fit w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
            <p>Home</p>
          </div></Link>
          <div className=" hover:bg-zinc-800  transition-all h-fit w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
            <p>Settings</p>
          </div>
          { project.stacks.map((stack:any, stackIndex: number)=>(
            <div key={stack["sId"]} className=" hover:bg-zinc-800  transition-all h-fit w-full font-light flex flex-row items-center gap-2 pl-[20%] rounded-lg cursor-pointer py-1 text-muted-foreground">
            <FaLayerGroup />
            {/* <BsDot className=" text-green-500 text-2xl"/> */}
            <p>{stack["name"]}</p>
          </div>
          ))}
        </div>:null}
      </div>
      ))}
        </div>
    )
}