'use client'


import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import "./globals.css";
import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Inter } from 'next/font/google'
import { myCustomFont } from '@/fonts'
import { HeatherGreen } from '@/fonts'
import Footer from "./_components/Footer";

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
    <html lang="en" className={`${myCustomFont.variable} ${HeatherGreen.variable}`}>
      <body className="antialiased min-h-screen w-full bg-neutral-900">
      <Navbar position="static" isBlurred isBordered className="bg-black-900">
        <NavbarBrand>
        <p className="font-ruigslay font-bold scale-140">Player vs Map</p>
      </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/mappacks" className="hover:bg-neutral-600 p-3 rounded-lg transition duration-200 ease-in-out">
            Mappacks
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link aria-current="page" href="/dashboard" className="hover:bg-neutral-600 p-3 rounded-lg transition duration-200 ease-in-out">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/tracks" className="hover:bg-neutral-600 p-3 rounded-lg transition duration-200 ease-in-out">
            Tracks
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="default" href="/login" variant="bordered">
            Login With Trackmania
          </Button>
        </NavbarItem>
      </NavbarContent>
      </Navbar>
      <hr className="h-px bg-white-300"/>
          <div className="w-full smooth-scroll">
            {children}
          </div>
      </body>
          <footer className="pt-10">
            <Footer></Footer>
          </footer>
    </html>
  );
}
