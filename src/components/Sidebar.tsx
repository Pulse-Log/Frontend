import React, { useState, useEffect } from 'react';
import { PiGraphLight } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IoCreate } from "react-icons/io5";
import Link from "next/link";
import { MdDashboard, MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { FaFolder, FaLayerGroup, FaUser } from "react-icons/fa";
import { useNavbar } from '@/contexts/navbar-context';
import useGlobalApi from '@/api/global-api';
import { fetchAllProjects } from '@/api/endpoints/project';
import ContainerLoading from './ContainerLoading';
import { usePathname, useRouter } from 'next/navigation';
import { PiPushPinFill, PiPushPinSlashFill } from "react-icons/pi";
import { Button } from './ui/button';


interface Stack {
  sId: string;
  name: string;
}

interface Project {
  projectId: string;
  name: string;
  stacks: Stack[];
}
const ResponsiveSidebar = () => {
  const { isPinned, isSidebarOpen: isOpen, togglePin, toggleSidebar } = useNavbar();
  const [isMobile, setIsMobile] = useState(false);
  const [openProjects, setOpenProjects] = useState<string[]>([]);
  const { loading: contentLoaded, data: projects, fetchData } = useGlobalApi<Project[]>(fetchAllProjects, undefined, false);
  const { setNavbarFunction } = useNavbar();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setNavbarFunction(() => fetchData);
  }, [setNavbarFunction, fetchData]);

  function toggleProject(projectId: string) {
    setOpenProjects(prevOpenProjects =>
      prevOpenProjects.includes(projectId)
        ? prevOpenProjects.filter(id => id !== projectId)
        : [...prevOpenProjects, projectId]
    );
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/auth/login');
  }

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        if (isPinned) {
          togglePin();
        }
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isPinned, togglePin]);

  // if (isMobile) {
  //   return null;
  // }

  return (
    <>
      <div
        className={`fixed z-[30] top-[60px] bg-card bottom-0 flex flex-col justify-between align-middle rounded-xl transition-all duration-300 border ${isOpen || isPinned ? 'md:w-[500px] lg:w-[15vw] left-0  mx-2 my-2 py-[2vh] px-[15px] sm:w-[500px]' : 'w-0 left-0'
          }`}
      >
        {isOpen && (
          <>
          <div className='h-full overflow-auto no-scrollbar'>
              <div className="flex justify-between items-center mt-3">
                <p className="text-base font-semibold">{isOpen ? 'Menu' : ''}</p>
                {!isMobile && (
                  <button onClick={togglePin} className="text-xl">
                    {isPinned ? <PiPushPinFill /> : <PiPushPinSlashFill />}
                  </button>
                )}
              </div>
              <Link href={'/dashboard'}><div className="flex justify-start items-center gap-4 px-2 h-fit py-2 hover:bg-accent transition-all rounded-lg cursor-pointer">
                <MdDashboard />
                {isOpen && <p className="text-sm">Dashboard</p>}
              </div></Link>
              <div >
                <div className="flex justify-between items-center mt-3">
                  <p className="text-base font-semibold">Projects</p>
                  <Link href='/projects/new'><IoCreate className="cursor-pointer" /></Link>
                </div>
                <div>
                  {contentLoaded || !projects ? <ContainerLoading /> : <div className="mx-2 max-w-full">
                    {projects.map((project: Project) => (
                      <div key={project.projectId} className="text-white text-base w-full my-4">
                        <div
                          className="w-full flex items-center justify-between cursor-pointer"
                          onClick={() => toggleProject(project.projectId)}
                        >
                          <div className="flex items-center justify-center gap-4">
                            <FaFolder className="text-base" />
                            <p className="text-sm">{project.name}</p>
                          </div>
                          {openProjects.includes(project.projectId) ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
                        </div>
                        {openProjects.includes(project.projectId) && (
                          <div className="h-fit w-full mt-2 text-sm">
                            <Link href={`/projects/${project.projectId}`}>
                              <div className={`hover:bg-accent text-sm px-2 transition-all h-fit w-full font-light flex flex-row items-center gap-2 rounded-lg cursor-pointer py-2 ${pathname === `/projects/${project.projectId}` ? 'bg-accent text-primary' : ''}`}>
                                <p>Home</p>
                              </div>
                            </Link>
                            <Link href={`/projects/${project.projectId}/settings`}>
                              <div className={`hover:bg-accent transition-all h-fit w-full px-2 font-light flex flex-row items-center gap-2 rounded-lg cursor-pointer py-2 ${pathname === `/projects/${project.projectId}/settings` ? 'bg-accent text-primary' : ''}`}>
                                <p>Settings</p>
                              </div>
                            </Link>
                            {project.stacks.map((stack: Stack) => (
                              <Link key={stack.sId} href={`/projects/${project.projectId}/stacks/${stack.sId}`}>
                                <div className={`hover:bg-accent px-2 transition-all h-fit w-full font-light flex flex-row items-center gap-2 rounded-lg cursor-pointer py-2 ${pathname === `/projects/${project.projectId}/stacks/${stack.sId}` ? 'bg-accent text-primary' : ''}`}>
                                  <FaLayerGroup />
                                  <p>{stack.name}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  }
                </div>
              </div>
        </div>
        <div className=" w-full py-2 flex flex-col items-center justify-center gap-5">
              <div className="flex items-center justify-evenly gap-2">
                <p className="text-base">Pre-release version</p>
                <p className="bg-green-500 rounded-lg px-2 py-1 text-sm">Free</p>
              </div>
              <Button onClick={logout} className='w-full' variant="outline" >Logout</Button>
        </div>
          </>
        )}
        {/* {isOpen && (
          <div className='h-full bg-yellow-300 flex flex-col justify-between'>
            <div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-base font-semibold">{isOpen ? 'Menu' : ''}</p>
                {!isMobile && (
                  <button onClick={togglePin} className="text-xl">
                    {isPinned ? <PiPushPinFill /> : <PiPushPinSlashFill />}
                  </button>
                )}
              </div>
              <Link href={'/dashboard'}><div className="flex justify-start items-center gap-4 px-2 h-fit py-2 hover:bg-accent transition-all rounded-lg cursor-pointer">
                <MdDashboard />
                {isOpen && <p className="text-sm">Dashboard</p>}
              </div></Link>
              <div >
                <div className="flex justify-between items-center mt-3">
                  <p className="text-base font-semibold">Projects</p>
                  <Link href='/projects/new'><IoCreate className="cursor-pointer" /></Link>
                </div>
                <div>
                  {contentLoaded || !projects ? <ContainerLoading /> : <div className="mx-2 max-w-full">
                    {projects.map((project: Project) => (
                      <div key={project.projectId} className="text-white text-base w-full my-4">
                        <div
                          className="w-full flex items-center justify-between cursor-pointer"
                          onClick={() => toggleProject(project.projectId)}
                        >
                          <div className="flex items-center justify-center gap-4">
                            <FaFolder className="text-base" />
                            <p className="text-sm">{project.name}</p>
                          </div>
                          {openProjects.includes(project.projectId) ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
                        </div>
                        {openProjects.includes(project.projectId) && (
                          <div className="h-fit w-full mt-2 text-sm">
                            <Link href={`/projects/${project.projectId}`}>
                              <div className={`hover:bg-accent text-sm px-2 transition-all h-fit w-full font-light flex flex-row items-center gap-2 rounded-lg cursor-pointer py-2 ${pathname === `/projects/${project.projectId}` ? 'bg-accent text-primary' : ''}`}>
                                <p>Home</p>
                              </div>
                            </Link>
                            <Link href={`/projects/${project.projectId}/settings`}>
                              <div className={`hover:bg-accent transition-all h-fit w-full px-2 font-light flex flex-row items-center gap-2 rounded-lg cursor-pointer py-2 ${pathname === `/projects/${project.projectId}/settings` ? 'bg-accent text-primary' : ''}`}>
                                <p>Settings</p>
                              </div>
                            </Link>
                            {project.stacks.map((stack: Stack) => (
                              <Link key={stack.sId} href={`/projects/${project.projectId}/stacks/${stack.sId}`}>
                                <div className={`hover:bg-accent px-2 transition-all h-fit w-full font-light flex flex-row items-center gap-2 rounded-lg cursor-pointer py-2 ${pathname === `/projects/${project.projectId}/stacks/${stack.sId}` ? 'bg-accent text-primary' : ''}`}>
                                  <FaLayerGroup />
                                  <p>{stack.name}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  }
                </div>
              </div>
            </div>
            <div className=" bg-gray-600 w-full py-2 flex flex-col items-center justify-center gap-5">
              <div className="flex items-center justify-evenly gap-2">
                <p className="text-base">Pre-release version</p>
                <p className="bg-green-500 rounded-lg px-2 py-1 text-sm">Free</p>
              </div>
              <Button onClick={logout} className='w-full' variant="outline" >Logout</Button>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default ResponsiveSidebar;