import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./globals.css";
import { Theme, ThemePanel } from "@radix-ui/themes";
import NavBar from "./components/NavBar";
import Sidebar from "./ui/dashboard/Sidebar";
import { AppProvider } from "./AppProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Storegreat",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="overscroll-none">
          <Theme accentColor="indigo" grayColor="mauve"> 
            <main>{children}</main>
          </Theme>
      </body>
    </html>
  );
}
