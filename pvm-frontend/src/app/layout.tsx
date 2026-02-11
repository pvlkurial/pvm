'use client'


import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import "./globals.css";
import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Inter } from 'next/font/google'
import { Casko, myCustomFont } from '@/fonts'
import { HeatherGreen } from '@/fonts'
import Footer from "./_components/Footer";
import LoginButton from "./_components/LoginButton";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ 
  weight: '900',
  style: 'italic',
  subsets: ['latin'] 
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <span>
    <html lang="en" className={`${myCustomFont.variable} ${HeatherGreen.variable} ${Casko.variable}`}>
      <AuthProvider>
      <body className="antialiased min-h-screen w-full bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
      <Navbar position="static" isBlurred isBordered>
        <NavbarBrand>
        <Link className="font-ruigslay font-bold scale-140 hover:animate-pulse" href="/">Player vs Map</Link>
      </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/mappacks" className="hover:bg-neutral-600 p-3 rounded-lg transition duration-200 ease-in-out">
            Mappacks
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <LoginButton/>
        </NavbarItem>
      </NavbarContent>
      </Navbar>
      <hr className="h-px bg-white-300"/>
          <div className="w-full smooth-scroll">
            {children}
          </div>
      </body>
      </AuthProvider>
    </html>
      <Footer></Footer>
</span>
  );
}
