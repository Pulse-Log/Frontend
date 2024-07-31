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
        <div className=" mx-2 max-w-full h-[60vh] overflow-auto no-scrollbar">
        {projects.map((project: any, index: number) => (
        <div key={project["projectId"]} className=" text-white text-base w-full my-4">
        <div className=" w-full flex items-center justify-between cursor-pointer" onClick={()=>toggleProject(project["projectId"])}>
          
          <div className=" flex items-center justify-center gap-4">
          <FaFolder className=" text-base"></FaFolder>
          <p className=" text-sm">{project["name"]}</p>
          </div>
          {curProject===project["projectId"]? <MdKeyboardArrowDown />:<MdKeyboardArrowRight />}
        </div>
        {curProject===project["projectId"] ? <div className=" h-fit w-full mt-2 text-sm">
          <Link href={`/projects/${project["projectId"]}`}><div className=" hover:bg-accent text-sm px-2 transition-all h-fit w-full font-light flex flex-row items-center gap-2 rounded-lg cursor-pointer py-2 ">
            <p>Home</p>
          </div></Link>
          <div className=" hover:bg-accent  transition-all h-fit w-full px-2 font-light flex flex-row items-center gap-2 rounded-lg cursor-pointer py-2 ">
            <p>Settings</p>
          </div>
          { project.stacks.map((stack:any, stackIndex: number)=>(
            <div key={stack["sId"]} className=" hover:bg-accent px-2  transition-all h-fit w-full font-light flex flex-row items-center gap-2 rounded-lg cursor-pointer py-2 ">
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