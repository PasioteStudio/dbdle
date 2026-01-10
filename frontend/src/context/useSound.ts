"use client"
import { usePathname } from "next/navigation";
import React, { createContext, createElement, useContext, useEffect, useState } from "react";

type SoundContextValue = {
    audio: HTMLAudioElement | null;
    Play: () => Promise<void>;
    audioChange: number;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [audioChange, setAudioChange] = useState<number>(0);
    const pathname = usePathname();

    useEffect(() => {
        if (!audio) {
            setAudio(new Audio(process.env.NEXT_PUBLIC_HOST + "/terror_radius/sound"));
            return;
        }
        audio.volume = 0.7;
        audio.pause();
        setAudioChange(Date.now());
    }, [audio]);

    useEffect(() => {
        if (audio) audio.pause();
    }, [audio, pathname]);

    const Play = async () => {
        if (!audio) return;
        if (audio.paused) {
            await audio.play();
            setAudioChange(Date.now());
            setTimeout(() => (audio.volume = 0.0), 50);
            setTimeout(() => (audio.volume = 0.2), 100);
            setTimeout(() => (audio.volume = 0.4), 150);
            setTimeout(() => (audio.volume = 0.6), 200);
        } else {
            audio.volume = 0.6;
            setTimeout(() => (audio.volume = 0.4), 50);
            setTimeout(() => (audio.volume = 0.2), 100);
            setTimeout(() => (audio.volume = 0.0), 150);
            setTimeout(() => {
                audio.pause();
                setAudioChange(Date.now());
            }, 200);
        }
    };

    return createElement(SoundContext.Provider, { value: { audio, Play, audioChange } }, children);
};

export const useSound = () => {
    const ctx = useContext(SoundContext);
    if (!ctx) throw new Error("useSound must be used within SoundProvider");
    return ctx;
};