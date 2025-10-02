import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import ExportedImage from "next-image-export-optimizer";
import Footer from "@/component/layout/footer";
import Link from "next/link";
import CookieConsent from "@/component/input/cookie";
import { metadataTemplate } from "@/app/layout";

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

export const metadata: Metadata = metadataTemplate

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="selection:bg-red-700 font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 s:p-2">
          <ExportedImage src={"/imgs/logos/dbd_bg.jpg"} fetchPriority="high" priority alt="dead by daylight background" height={1733} width={2560} className="h-[115%] select-none fixed top-0 -z-20 object-cover"/>
          <CookieConsent />
          <main className="flex flex-col mb-20 gap-[32px] items-center s:w-[100%] sm:w-[75%] lg:w-[40%] mx-auto">
            <Link href={"/"}><ExportedImage unoptimized src={"/imgs/logos/Deadbydaylight_logo.webp"} alt="dead by daylight logo" height={238} width={736} className="h-full select-none"/></Link>
            {children}
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
