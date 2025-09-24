import { generateTemplateMetadata } from "@/util/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generateTemplateMetadata("Killer","Guess the daily Killer in Dead by Daylight")

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
