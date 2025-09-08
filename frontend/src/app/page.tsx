import Image from "next/image";
import Link from "next/link";
import { categories } from "@/util/constants";

export default function Home() {
  return (
        <ul>
          {categories.map(category=>(
            <li key={category.title}>
            <Link href={category.link} className="w-full grid">
              <Image src={"/imgs/effects/ui_cloud.png"} alt="" width={500} height={500} className="grid-column-1 h-40 w-full overflow-visible -z-10 " />
              <div className="flex gap-4 grid-column-1 items-center s:px-10 sm:px-20 z-10">
                <div className="bg-purple rounded-full aspect-square w-20">
                  <Image src={category.icon} alt="perk icon" width={128} height={128} className="m-auto"/>
                </div>
                <div className="">
                  <h1 className="text-2xl font-semibold">{category.title}</h1>
                  <p className="text-sm">{category.description}</p>
                </div>
              </div>
            </Link>
          </li>
          ))}
        </ul>
  );
}
