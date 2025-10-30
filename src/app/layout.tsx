'use client'


import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import "./globals.css";
import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Inter } from 'next/font/google'
import { myCustomFont } from '@/fonts'
import { HeatherGreen } from '@/fonts'

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
      <body className="antialiased min-h-screen w-screen bg-gradient-to-b from-neutral-900 via-white-600 to-white-800">
      <Navbar position="static" isBlurred isBordered className="bg-black-900">
        <NavbarBrand>
        <p className="font-ruigslay font-bold scale-140">Player vs Map</p>
      </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/mappacks" className="hover:bg-sky-700 p-3 rounded-lg transition duration-200 ease-in-out">
            Mappacks
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link aria-current="page" href="/dashboard" className="hover:bg-sky-700 p-3 rounded-lg transition duration-200 ease-in-out">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/tracks" className="hover:bg-sky-700 p-3 rounded-lg transition duration-200 ease-in-out">
            Tracks
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/login" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
      </Navbar>
          <div className="h-full w-full smooth-scroll">
            {children}
          </div>
      </body>
    </html>
  );
}
