"use client";
import { EvervaultCard } from '@/components/ui/evervault-card'
import { FlipWords } from '@/components/ui/flip-words'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholder-and-vanish-input';
import { useMotionValue } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react'
import { PiGraphLight } from 'react-icons/pi'

export default function Dashboard() {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  const router = useRouter();

  function navigationPage(to: string){
    router.push(to);
  }

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  
  return (
    
    <div className='flex justify-start items-center p-20 group/card' onMouseMove={onMouseMove}>
      <EvervaultCard className=' left-[15vw] bottom-5 top-5 right-5 rounded-xl z-[-15] fixed' mouseX={mouseX} mouseY={mouseY}></EvervaultCard>
      <div className='fixed left-[15vw] top-[10px] right-0 flex justify-center items-center'>
      
      </div>
      <div className="text-3xl font-extrabold text-white w-[50%]">
        <div className='flex items-center justify-start gap-3'>
          <PiGraphLight className=" text-white text-3xl" /><p>Unlock</p>
          <FlipWords words={["hidden", "valuable", "crucial", "real-time"]} className=' text-3xl'></FlipWords>
        </div>
        <p>insights from <i className=' font-light'><u>your logs</u></i>.</p>
        <p className=' my-6 font-normal text-base text-gray-500'>Designed to transform how you visualize and manage logs from your Kafka setup. Seamlessly create projects and organize your logs into subgroups, each identified by unique Kafka topics. Customize log schemas to fit your needs and gain insightful visualizations at your fingertips. Simplify your logging infrastructure and enhance your data analysis capabilities with our intuitive dashboard. Start streamlining your log management today!</p>
        <div className=' flex items-center justify-start gap-4 w-[70%]'>
        <div onClick={()=>navigationPage('/projects/new')} className=" cursor-pointer h-fit w-full py-2  bg-white text-black flex justify-center align-middle font-normal rounded-lg text-base">New Project</div>
        <HoverBorderGradient as="button" containerClassName=" rounded-lg w-full" className="rounded-lg w-full">
          <p className='text-base font-normal'>Pricing</p>
        </HoverBorderGradient>
        </div>
        
      </div>
     
    </div>
    
  )
}
