"use client";

import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  weight: ["400", "900", "700", "500", "200", "300"],
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en">
      <body className={`${poppins.className} bg-black text-base`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <main className="min-h-screen flex items-center justify-center">
            <div className='fixed left-0 right-0 bottom-0 top-0 flex justify-start items-center group/card' onMouseMove={onMouseMove}>
            <EvervaultCard className={` left-0 bottom-0 top-0 p-5 right-0 z-[-15] fixed`} mouseX={mouseX} mouseY={mouseY}></EvervaultCard>
      {children}
            </div>
          </main>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}