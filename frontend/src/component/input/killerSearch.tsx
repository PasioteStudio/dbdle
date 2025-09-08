"use client"
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface KillerSearchInput {
    from:string,
    onFound:Function,
    onMissed:Function,
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
    const [options,setOptions] = useState<string[]>([])
    const [visibleOptions,setVisibleOptions] = useState<string[]>([])
    const [usedOptions,setUsedOptions] = useState<{
        name:string;
        gender:{value:string;bool:boolean};
        origin:{value:string;bool:boolean};
        power_attack_type:{value:string;bool:boolean};
        release_date:{value:string;bool:string};
        height:{value:string;bool:boolean};
        movement_speed:{value:string;bool:string};
        found:boolean}[]>([])
    useEffect(()=>{
        if(localStorage.getItem(from) && sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),new Date())){
            setUsedOptions(JSON.parse(localStorage.getItem(from)!).used)
            setOptions(JSON.parse(localStorage.getItem(from)!).options.filter((option:any) => !JSON.parse(localStorage.getItem(from)!).used.map((used:any)=>used.name).includes(option)))
            for(let i = 0; i<JSON.parse(localStorage.getItem(from)!).used.length; i++){
                if(JSON.parse(localStorage.getItem(from)!).used[i].found){
                    setFound(JSON.parse(localStorage.getItem(from)!).used[i].name)
                    onFound()
                    input.current?.classList.add("hidden")
                }else{
                    onMissed()
                }
            }
            return
        }
        axios.get(process.env.NEXT_PUBLIC_HOST + from).then(res=>{
            setOptions(res.data)
        })
    },[])
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        if(e.currentTarget.value == ""){
            setVisibleOptions([])
            return
        }
        let newVisibleOptionsFirst = []
        let newVisibleOptions = []
        for(let i = 0; i < options.length;i++){
            if(options[i].toLowerCase().includes(e.currentTarget.value) && options[i].toLowerCase().startsWith(e.currentTarget.value)){
                newVisibleOptionsFirst.push(options[i])
                
            }else if(options[i].toLowerCase().includes(e.currentTarget.value)){
                newVisibleOptions.push(options[i])
            }
        }
        setVisibleOptions([...newVisibleOptionsFirst,...newVisibleOptions])
    }
    const handleClick = (selected:string) => {
        setVisibleOptions([])
        input.current!.value = ""
        setOptions(options.filter(option => option != selected))
        axios.get(process.env.NEXT_PUBLIC_HOST + from + "/" + selected).then(res=>{
            usedOptions.push({name:selected,found:res.status == 202,
                gender:{value:res.data.selected.gender,bool:res.data.difference ? res.data.difference.gender : true},
                origin:{value:res.data.selected.origin,bool:res.data.difference ? res.data.difference.origin : true},
                power_attack_type:{value:res.data.selected.power_attack_type,bool:res.data.difference ? res.data.difference.power_attack_type : true},
                release_date:{value:res.data.selected.release_date,bool:res.data.difference ? res.data.difference.release_date : "true"},
                height:{value:res.data.selected.height,bool:res.data.difference ? res.data.difference.height : true},
                movement_speed:{value:res.data.selected.movement_speed,bool:res.data.difference ? res.data.difference.movement_speed : "true"},
            })
            localStorage.setItem(from,JSON.stringify({date:new Date(),streak:0,hint:"",used:usedOptions,options:options}))
            setUsedOptions(JSON.parse(JSON.stringify(usedOptions)))
            if(res.status == 202){
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
        <h1 className={`w-full mx-auto text-4xl ${found ? "" : "hidden"}`}>{found}</h1>
        <input type="text" ref={input} onInput={handleInput} className='w-[40%] bg-gray-700 h-8 rounded-lg px-2' />
        {children}
        <ul className='rounded-lg bg-gray-600 w-[40%] absolute justify-self-anchor flex flex-col mt-4 overflow-x-hidden overflow-y-scroll max-h-64'>
            {visibleOptions.map((option,id) => [
                <li className='min-h-12 max-h-12 content-center hover:bg-blue-500 cursor-pointer' key={`${id}a`} onClick={()=>{handleClick(option)}}>
                    <h2 className='h-full content-center'>{option}</h2>
                </li>,
                id != visibleOptions.length -1 ? <div className={`bg-black w-full h-0.5`} key={`${id}b`}></div> : null
            ])}
        </ul>
        <div className='grid grid-min-100 w-full overflow-x-auto items-end gap-4 p-4 '>
            <h1>Character <hr className='mt-4' /></h1>
            <h1>Gender<hr className='mt-4' /></h1>
            <h1>Height<hr className='mt-4' /></h1>
            <h1>Movement Speed<hr className='mt-4' /></h1>
            <h1>Origin<hr className='mt-4' /></h1>
            <h1>Power Attack Type<hr className='mt-4' /></h1>
            <h1>Release Date<hr className='mt-4' /></h1>
            {usedOptions.toReversed().map(option => (
                <div className={`h-10 grid col-span-7 grid-min-100 w-full gap-4 items-center`} key={option.name} >
                    <div className={`h-full rounded content-center ${option.found ? 'bg-green-500' : 'bg-red-500'}`}>{option.name}</div>
                    <div className={`h-full rounded content-center ${option.gender.bool ? 'bg-green-500' : 'bg-red-500'}`}>{option.gender.value}</div>
                    <div className={`h-full rounded content-center ${option.height.bool ? 'bg-green-500' : 'bg-red-500'}`}>{option.height.value}</div>
                    <div className={`h-full rounded content-center ${option.movement_speed.bool != "true" ? (option.movement_speed.bool == "false"  ? 'bg-red-500' : 'bg-orange-500') : 'bg-green-500'}`}>{option.movement_speed.value}</div>
                    <div className={`h-full rounded content-center ${option.origin.bool ? 'bg-green-500' : 'bg-red-500'}`}>{option.origin.value}</div>
                    <div className={`h-full rounded content-center ${option.power_attack_type.bool ? 'bg-green-500' : 'bg-red-500'}`}>{option.power_attack_type.value}</div>
                    <div className={`h-full rounded content-center ${option.release_date.bool == "true" ? 'bg-green-500' : 'bg-red-500'}`}>{option.release_date.value} {option.release_date.bool == "true" ? null : (option.release_date.bool == "DOWN" ? "⬇️" : "⬆️") }</div>
                </div>
            ))}
        </div>
    </div>
    );
};
export default KillerSearchInput;