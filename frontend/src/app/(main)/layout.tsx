import type { Metadata } from "next";
import ExportedImage from "next-image-export-optimizer";
import Footer from "@/component/layout/footer";
import Link from "next/link";
import CookieConsent from "@/component/input/cookie";
import { metadataTemplate } from "@/app/layout";

export const metadata: Metadata = metadataTemplate

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 s:p-2">
    <ExportedImage src={"/imgs/logos/dbd_bg.jpg"} fetchPriority="high" priority alt="dead by daylight background" height={1733} width={2560} className="h-[115%] select-none fixed top-0 -z-20 object-cover"/>
    <CookieConsent />
    <main className="flex flex-col mb-20 gap-[32px] items-center s:w-[100%] sm:w-[75%] lg:w-[40%] mx-auto">
      <Link href={"/"}><ExportedImage loading="eager" src={"/imgs/logos/Deadbydaylight_logo.webp"} alt="dead by daylight logo" height={238} width={736} className="h-full select-none"/></Link>
      {children}
    </main>
    <Footer/>
  </div>
  );
}
