
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Mic, Plus, Video, Keyboard, ChevronDown, ChevronRight } from "lucide-react";
import { FootballPitchIcon } from "./icons";
import { cn } from "@/lib/utils";
import { players } from "@/lib/data";
import { PlayerListItem } from "./player-list-item";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";

const PlayerNumber = ({ number }: { number: number }) => (
    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
        {number}
    </div>
);

export function MatchNotes() {
    const [activeTeam, setActiveTeam] = useState<'home' | 'away' | null>('home');
    const [activeNumber, setActiveNumber] = useState<number | null>(7);
    const [activeFilter, setActiveFilter] = useState<string>('Players');
    const substitutes = players.slice(11, 18);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-4">
                {/* Notes content */}
                <div className="flex items-start gap-3">
                    <div className="text-sm text-muted-foreground">31'</div>
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500 hover:bg-blue-500/90 text-white">Home</Badge>
                            <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center text-sm font-bold">7</div>
                        </div>
                        <p className="mt-1 text-sm">
                            Finds space, turns and attacks together with the Striker. Love it.
                        </p>
                    </div>
                </div>
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(i => (
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

                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-card">
                    <Button variant="ghost" size="icon"><Camera className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon"><FootballPitchIcon className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon"><Mic className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon"><Keyboard className="w-5 h-5" /></Button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {['Players', 'Events', 'Line ups', 'Traits', 'Players'].map((filter, i) => (
                        <Button
                            key={i}
                            variant={activeFilter === filter ? 'default' : 'secondary'}
                            size="sm"
                            className={cn("rounded-full h-8 text-xs", activeFilter === filter ? 'bg-blue-500 hover:bg-blue-500/90' : '')}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>

                <div className="relative h-64">
                    <FootballPitchIcon className="w-full h-full text-muted-foreground/10" />
                     <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 gap-y-2 p-4">
                        <div className="col-start-1 row-start-2 flex justify-center items-center"><PlayerNumber number={11}/></div>
                        <div className="col-start-2 row-start-2 flex justify-center items-center"><PlayerNumber number={8}/></div>
                        <div className="col-start-3 row-start-2 flex justify-center items-center"><PlayerNumber number={7}/></div>
                        <div className="col-start-4 row-start-2 flex justify-center items-center"><PlayerNumber number={10}/></div>
                        
                        <div className="col-start-2 col-span-2 row-start-1 flex justify-center items-center"><PlayerNumber number={9}/></div>

                        <div className="col-start-2 col-span-2 row-start-3 flex justify-center items-center"><PlayerNumber number={6}/></div>

                        <div className="col-start-1 row-start-4 flex justify-center items-center"><PlayerNumber number={3}/></div>
                        <div className="col-start-2 row-start-4 flex justify-center items-center"><PlayerNumber number={5}/></div>
                        <div className="col-start-3 row-start-4 flex justify-center items-center"><PlayerNumber number={4}/></div>
                        <div className="col-start-4 row-start-4 flex justify-center items-center"><PlayerNumber number={2}/></div>

                        <div className="col-start-2 col-span-2 row-start-5 flex justify-center items-center"><PlayerNumber number={1}/></div>
                    </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="substitutes">
                        <AccordionTrigger className="text-sm font-semibold">Substitutes</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-1">
                                {substitutes.map(player => (
                                    <PlayerListItem key={player.id} player={player} />
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
            </div>
        </div>
    )
}
