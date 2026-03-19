"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import "@/app/globals.css";
import React from "react";
import Link from "next/link";
import Footer from "@/app/_components/Footer";
import LoginButton from "@/app/_components/LoginButton";
import { AuthProvider } from "@/contexts/AuthContext";
import PatreonButton from "@/app/_components/PatreonButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
            <Link
              color="foreground"
              href="/mappacks"
              className="nav-link text-label"
            >
              Mappacks
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <LoginButton />
          </NavbarItem>
          <NavbarItem>
            <PatreonButton />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <hr className="divider" />
      <div className="w-full smooth-scroll flex-1">{children}</div>
      <Footer />
    </AuthProvider>
  );
}
