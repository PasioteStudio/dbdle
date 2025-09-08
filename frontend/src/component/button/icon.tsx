"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface IconButton {
    link:string;
    icon:string
}

const IconButton: React.FC<IconButton> = ({link,icon}) => {
    const router = useRouter()
    return (
    <li className=" rounded-full bg-red-400 cursor-pointer" onClick={()=>{router.push(link)}}>
        <Image src={icon} alt="perk guessing icon" width={40} height={40} />
    </li>
    );
};
export default IconButton;