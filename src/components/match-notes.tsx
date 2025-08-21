
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Mic, Plus } from "lucide-react";
import { FootballPitchIcon } from "./icons";
import { cn } from "@/lib/utils";

export function MatchNotes() {
    const [activeTeam, setActiveTeam] = useState<'home' | 'away' | null>('home');
    const [activeNumber, setActiveNumber] = useState<number | null>(null);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4">
                {/* Notes content will go here */}
                <p className="text-center text-muted-foreground">Start taking notes using the panel below.</p>
            </div>

            <div className="sticky bottom-0 left-0 right-0 p-2 bg-background border-t border-border space-y-2">
                <div className="flex items-center justify-between gap-1">
                    <Button 
                        onClick={() => setActiveTeam('home')}
                        className={cn("flex-1 text-xs h-8", activeTeam === 'home' ? 'bg-blue-500 hover:bg-blue-500/90 text-white' : 'bg-card text-card-foreground')}
                    >
                        Home
                    </Button>
                    <div className="flex items-center gap-1">
                    {[...Array(10).keys()].map(i => (
                        <Button 
                            key={i} 
                            size="icon" 
                            variant="outline" 
                            className={cn("w-7 h-7 rounded-full", activeNumber === i && "bg-primary text-primary-foreground")}
                            onClick={() => setActiveNumber(i)}
                        >
                           {i}
                        </Button>
                    ))}
                    </div>
                    <Button 
                        onClick={() => setActiveTeam('away')}
                        className={cn("flex-1 text-xs h-8", activeTeam === 'away' ? 'bg-purple-500 hover:bg-purple-500/90 text-white' : 'bg-card text-card-foreground')}
                    >
                        Away
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Input placeholder="Add a note..." className="pl-24" />
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button variant="ghost" size="icon"><Camera className="w-5 h-5" /></Button>
                             <Button variant="ghost" size="icon"><Mic className="w-5 h-5" /></Button>
                             <Button variant="ghost" size="icon"><FootballPitchIcon className="w-5 h-5" /></Button>
                        </div>
                    </div>
                    <Button size="icon" className="rounded-full w-10 h-10 flex-shrink-0">
                        <Plus className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
