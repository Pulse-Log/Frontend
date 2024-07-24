"use client"

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/Sidebar";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { GlobalStateProvider } from "@/contexts/global-state-context";
import GlobalLoadingIndicator from "@/components/Loading";

const poppins = Poppins({weight: ['400', '900', '700', '500', '200', '300'], subsets: ['latin']});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} flex bg-[#090909] text-base`}>
      <GlobalStateProvider>
        <GlobalLoadingIndicator></GlobalLoadingIndicator>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            // enableSystem
            disableTransitionOnChange
          >
            <SideBar></SideBar>
            {children}
          </ThemeProvider>
      </GlobalStateProvider>
          <Toaster />
          </body>
    </html>
  );
}
