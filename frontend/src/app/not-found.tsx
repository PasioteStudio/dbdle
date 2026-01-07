"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import ExportedImage from "next-image-export-optimizer";
import Footer from "@/component/layout/footer";
import Link from "next/link";
import CookieConsent from "@/component/input/cookie";
import HowTo from "@/component/howTo";
import IconButton from "@/component/button/icon";
import { categories } from "@/util/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  subsets: ["latin"],
});

export default function NotFound() {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="selection:bg-red-400 font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 s:p-2">
          <ExportedImage src={"/imgs/logos/dbd_bg.jpg"} alt="dead by daylight background" height={1733} width={2560} className="select-none h-[115%] fixed top-0 -z-20 object-cover"/>
          <CookieConsent />
          <main className="flex flex-col mb-20 gap-[32px] items-center s:w-[100%] sm:w-[75%] lg:w-[40%] mx-auto">
            <Link href={"/"}><ExportedImage src={"/imgs/logos/Deadbydaylight_logo.webp"} alt="dead by daylight logo" height={238} width={736} className="select-none w-full"/></Link>
            <div className="flex gap-4">
              <ul className="flex gap-2 relative">
                  {categories.map(category => (
                      <IconButton key={category.title} link={category.link} icon={category.icon}/>
                  ))}
                  <HowTo></HowTo>
              </ul>
            </div>
            <ExportedImage  src={"/imgs/logos/notFound.gif"} alt="Confused Quentin" height={220} width={270} className="select-none"/>
            <div className="w-full grid">
              <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} unoptimized  alt="" width={500} height={500} className="select-none grid-column-1 h-40 w-full -z-10 -mt-10 " />
              <h1 className="text-3xl text-center grid-column-1 my-outline">Are you lost? Back to the campfire right <Link className="text-blue-500 underline" href={"/"}>here</Link></h1>
            </div>
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
