import type { Metadata } from "next";
import { categories } from "@/util/constants";
import IconButton from "@/component/button/icon";
import HowTo from "@/component/howTo";
import StreakIcon from "@/component/icon/streak";

export const metadata: Metadata = metadataTemplate
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return [
    <div className="flex gap-4" key={1}>
        <ul className="flex gap-2 relative items-center">
            <StreakIcon />
            {categories.map(category => (
                <IconButton key={category.title} link={category.link} icon={category.icon}/>
            ))}
            <HowTo />
        </ul>
    </div>,
    children
  ]
}
