import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { BsDot } from "react-icons/bs";

export const HoverEffect = ({
  items,
  className,
  projectId
}: {
  items: {
    name: string;
    description: string;
    sId: string;
  }[];
  className?: string;
  projectId: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10 h-full",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={`/projects/${projectId}/stacks/${item.sId}`}
          key={item.sId}
          className="relative group  block p-2 w-full h-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-zinc-800 block  rounded-xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle >{item.name}</CardTitle>
            <CardDescription >{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
  // items
}: {
  className?: string;
  children: React.ReactNode;
  // items:{
  //   status: number;}
}) => {
  return (
    <div className=" flex justfiy-start items-center gap-4"><h4 className={cn("text-zinc-100 font-bold tracking-wide", className)}>
    {children}
  </h4>
  <BsDot className={`text-4xl 
    "text-red-500"}`} /></div>
  );
};
export const CardDescription = ({
  className,
  children,
  // items
}: {
  className?: string;
  children: React.ReactNode;
  // items:{
  //   lps: number;}
}) => {
  return (
    <>
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm text-ellipsis text-wrap line-clamp-5",
        className
      )}
    >
      {children}
    </p>
    <p className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}>Lps: 58</p>
    </>
  );
};
