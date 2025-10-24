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
      <body className="antialiased">
          <div className="h-full w-full smooth-scroll">
            {children}
          </div>
      </body>
    </html>
  );
}
