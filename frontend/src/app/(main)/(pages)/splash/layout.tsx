import { generateTemplateMetadata } from "@/util/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generateTemplateMetadata("Splash","Guess the daily splash art in Dead by Daylight")

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
