import { generateTemplateMetadata } from "@/util/metadata"

export const metadata = generateTemplateMetadata("Privacy Policy","The privacy policy of the page")

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
