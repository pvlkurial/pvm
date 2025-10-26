'use client'


import "./globals.css";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className="antialiased min-h-screen w-screen bg-gray-900 ">
          <div className="h-full w-full smooth-scroll">
            {children}
          </div>
      </body>
    </html>
  );
}
