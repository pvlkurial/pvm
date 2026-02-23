'use client'


import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import "./globals.css";
import React from "react";
import Link from "next/link";
import { Casko, myCustomFont } from '@/fonts'
import { HeatherGreen } from '@/fonts'
import Footer from "./_components/Footer";
import LoginButton from "./_components/LoginButton";
import { AuthProvider } from "@/contexts/AuthContext";
import ImportantInfoButton from "./_components/ImportantInfoButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <span>
    <html lang="en" className={`${myCustomFont.variable} ${HeatherGreen.variable} ${Casko.variable}`}
    style={{ backgroundColor: '#000' }}>
      <body>
      <AuthProvider>
      <Navbar position="static" isBlurred isBordered>
        <NavbarBrand>
        <Link className="text-heading scale-140 hover:animate-pulse" href="/">
        <span className="sm:hidden">PvM</span>
        <span className="hidden md:inline">Player vs Map</span>
        </Link>
      </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/mappacks" className="nav-link">
            Mappacks
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <LoginButton/>
        </NavbarItem>
        <NavbarItem>
          <ImportantInfoButton/>
        </NavbarItem>
      </NavbarContent>
      </Navbar>
      <hr className="divider"/>
          <div className="w-full smooth-scroll flex-1">
            {children}
          </div>
        <Footer/>
      </AuthProvider>
      </body>
    </html>
</span>
  );
}
