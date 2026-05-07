"use client"
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ExportedImage from "next-image-export-optimizer";
import { renames } from '@/util/constants';

interface KillerSearchInput {
    from:string,
    onFound:() => void,
    onMissed:() => void,
    children?:React.ReactNode,
}
function sameDay(d1:Date, d2:Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
const KillerSearchInput: React.FC<KillerSearchInput> = ({from,onFound,onMissed,children}) => {
    const input = useRef<HTMLInputElement>(null)
    const [found,setFound] = useState<string>()
    const [options,setOptions] = useState<{key:string,value:string}[]>([])
    const [search,setSearch] = useState<string>("-")
    const [usedOptions,setUsedOptions] = useState<{
        name:string;
        gender:{value:string;bool:string};
        origin:{value:string;bool:string};
        power_attack_type:{value:string;bool:boolean};
        release_date:{value:string;bool:string};
        height:{value:string;bool:boolean};
        movement_speed:{value:string;bool:string};
        found:boolean}[]>([])
    useEffect(()=>{
        if(!localStorage.getItem(from) || !sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),new Date())){
            axios.get(process.env.NEXT_PUBLIC_HOST + from).then(res=>{
                setOptions(res.data.map((option:string)=>option.includes("The ") ? {key:option.split("The ")[1],value:option} : {key:option,value:option}))
                renames.forEach(rename=>{
                    if(res.data.includes(rename.from)){
                        setOptions((prev)=>[...prev,{key:rename.to,value:rename.from}])
                    }
                })
            })
            return
        }
        if(localStorage.getItem(from) && sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),new Date())){
            setUsedOptions(JSON.parse(localStorage.getItem(from)!).used)
            setOptions(JSON.parse(localStorage.getItem(from)!).options.filter((option:string) => !JSON.parse(localStorage.getItem(from)!).used.map((used:{name:string})=>used.name).includes(option)))
            for(let i = 0; i<JSON.parse(localStorage.getItem(from)!).used.length; i++){
                if(JSON.parse(localStorage.getItem(from)!).used[i].found){
                    axios.get(process.env.NEXT_PUBLIC_HOST + from +"/" + JSON.parse(localStorage.getItem(from)!).used[i].name.replaceAll(" ","_").replaceAll("ryō","ryo")).then(res=>{
                        if(res.status != 202){
                            localStorage.removeItem(from)
                            setUsedOptions([])
                            axios.get(process.env.NEXT_PUBLIC_HOST + from).then(res=>{
                                setOptions(res.data)
                            })
                        }else{
                            setFound(JSON.parse(localStorage.getItem(from)!).used[i].name)
                            onFound()
                            input.current?.classList.add("hidden")
                        }
                    })
                }else{
                    onMissed()
                }
            }
            return
        }
    },[from])
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value.toLowerCase() == "" ? "-" : e.currentTarget.value.toLowerCase())
    }
    const handleClick = (selected:string) => {
        setSearch("-")
        input.current!.value = ""
        input.current!.focus()
        setOptions(options.filter(option => option.value != selected))
        window.fullres ||= {events: []};
        window.fullres.events.push({ key: 'guess', mode: from.slice(1) });
        axios.get(process.env.NEXT_PUBLIC_HOST + from + "/" + selected.replaceAll(" ","_").replaceAll("ryō","ryo")).then(res=>{
            usedOptions.push({name:selected,found:res.status == 202,
                gender:{value:res.data.selected.gender,bool:res.data.difference ? res.data.difference.gender : "true"},
                origin:{value:res.data.selected.origin,bool:res.data.difference ? res.data.difference.origin : "true"},
                power_attack_type:{value:res.data.selected.power_attack_type,bool:res.data.difference ? res.data.difference.power_attack_type : true},
                release_date:{value:res.data.selected.release_date,bool:res.data.difference ? res.data.difference.release_date : "true"},
                height:{value:res.data.selected.height,bool:res.data.difference ? res.data.difference.height : true},
                movement_speed:{value:res.data.selected.movement_speed,bool:res.data.difference ? res.data.difference.movement_speed : "true"},
            })
            let streak = localStorage.getItem(from) ? JSON.parse(localStorage.getItem(from)!).streak : 0
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1);
            if(localStorage.getItem(from)){
                if(!sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),new Date()) && !sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),yesterday)){
                    streak=0
                }
            }
            if(res.status == 202){
                streak++
            }
            localStorage.setItem(from,JSON.stringify({date:new Date(),streak:streak,used:usedOptions,options:options}))
            setUsedOptions(JSON.parse(JSON.stringify(usedOptions)))
            if(res.status == 202){
                window.fullres ||= {events: []};
                window.fullres.events.push({ key: 'found', mode: from.slice(1),streak: streak });
                input.current?.classList.add("hidden")
                setFound(selected)
                onFound()
            }else{
                onMissed()
            }
        })
    }
    return (
    <div className='relative'>
        <h2 className={`w-full mx-auto text-4xl ${found ? "" : "hidden"}`}>{found}</h2>
        <input id='input' autoComplete='off' type="text" ref={input} onInput={handleInput} className='min-w-[200px] w-[40%] bg-gray-700 h-8 rounded-lg px-2' />
        {children}
        <ul className='min-w-[200px] left-1/2 right-1/2 rounded-lg bg-gray-600 w-[40%] absolute justify-self-anchor flex flex-col mt-4 gap-0.5 overflow-x-hidden overflow-y-scroll max-h-64'>
            {options.map((option,id) => [
                <li className={`${option.key.toLowerCase().startsWith(search) ? "flex" : ((search.length > 3 && option.key.toLowerCase().includes(search)) ? "flex" : "hidden")} min-h-12 max-h-12 overflow-hidden items-center content-center hover:bg-blue-500 cursor-pointer`} key={`${id}a`} onClick={()=>{handleClick(option.value)}}>
                    <ExportedImage  src={"/imgs/splashes/" + option.value + ".png"} className='aspect-square h-full p-2 select-none' alt={option.key} width={64} height={64} />
                    <h3 className='h-full content-center'>{option.key}</h3>
                </li>,
            ])}
        </ul>
        <div className='grid grid-min-100 w-full overflow-x-auto items-end gap-4 p-4 '>
            <h2>Character <hr className='mt-4' /></h2>
            <h2>Gender<hr className='mt-4' /></h2>
            <h2>Height<hr className='mt-4' /></h2>
            <h2>Movement Speed<hr className='mt-4' /></h2>
            <h2>Origin<hr className='mt-4' /></h2>
            <h2>Power Attack Type<hr className='mt-4' /></h2>
            <h2>Release Date<hr className='mt-4' /></h2>
            {usedOptions.toReversed().map(option => (
                <div className={`grid col-span-7 grid-min-100 break-words w-full gap-4 items-center`} key={option.name} >
                    <div className={`h-full rounded content-center ${option.found ? 'bg-green-500' : 'bg-red-500'}`}>{option.name}</div>
                    <div className={`h-full rounded content-center ${option.gender.bool != "true" ? (option.gender.bool == "false"  ? 'bg-red-500' : 'bg-orange-500') : 'bg-green-500'}`}>{option.gender.value}</div>
                    <div className={`h-full rounded content-center ${option.height.bool ? 'bg-green-500' : 'bg-red-500'}`}>{option.height.value}</div>
                    <div className={`h-full rounded content-center ${option.movement_speed.bool != "true" ? (option.movement_speed.bool == "false"  ? 'bg-red-500' : 'bg-orange-500') : 'bg-green-500'}`}>{option.movement_speed.value}</div>
                    <div className={`h-full rounded content-center ${option.origin.bool != "true" ? (option.origin.bool == "false"  ? 'bg-red-500' : 'bg-orange-500') : 'bg-green-500'}`}>{option.origin.value}</div>
                    <div className={`h-full rounded content-center ${option.power_attack_type.bool ? 'bg-green-500' : 'bg-red-500'}`}>{option.power_attack_type.value}</div>
                    <div className={`h-full rounded content-center ${option.release_date.bool == "true" ? 'bg-green-500' : 'bg-red-500'}`}>{option.release_date.value} {option.release_date.bool == "true" ? null : (option.release_date.bool == "DOWN" ? "⬇️" : "⬆️") }</div>
                </div>
            ))}
        </div>
    </div>
    );
};
export default KillerSearchInput;