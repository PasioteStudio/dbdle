"use client"
import React, { useEffect, useState } from 'react';
import ExportedImage from "next-image-export-optimizer";
import {  usePathname, useRouter } from 'next/navigation';

interface IconButton {
    link:string;
    icon:string
}
function sameDay(d1:Date, d2:Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
//return true if any element in the array has val true:
const IconButton: React.FC<IconButton> = ({link,icon}) => {
    const router = useRouter()
    const path = usePathname()
    const [visible, setVisible] = useState(false);

    //update when url path changes
    useEffect(() => {
        if(!localStorage.getItem(link)) return
        if(!localStorage.getItem(link) || !sameDay(new Date(JSON.parse(localStorage.getItem(link)!).date),new Date()))return
        const visited = JSON.parse(localStorage.getItem(link) || 'false').used.some((e:{found:boolean})=>e.found===true);
        setVisible(visited)
    }, [path,link]);
    return (
    <li className=" rounded-full bg-red-900 cursor-pointer grid" onClick={()=>{router.push(link)}}>
        <ExportedImage  src={icon} alt="perk guessing icon" width={32} height={32} className='p-1 grid-column-1 select-none' />
        {visible && <ExportedImage  src={"/imgs/logos/check_mark.webp"} alt="check mark" width={30} height={30} className='select-none p-1 ml-auto -mr-3 -mt-3 relative grid-column-1' />}
    </li>
    );
};
export default IconButton;