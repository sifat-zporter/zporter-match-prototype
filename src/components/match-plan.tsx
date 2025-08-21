
"use client"

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Camera, Video, Plus, List, ChevronUp, ChevronDown, CheckSquare } from "lucide-react";
import { FootballPitchIcon } from "./icons";
import { Switch } from "./ui/switch";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

const invitedPlayers = [
    { name: 'Ronaldinho', number: 15, rating: 173, avatar: 'https://placehold.co/40x40.png' },
    { name: 'Iniesta', number: 9, rating: 173, avatar: 'https://placehold.co/40x40.png' },
    { name: 'Iniesta', number: 21, rating: 173, avatar: 'https://placehold.co/40x40.png' },
    { name: 'Ronaldinho', number: 15, rating: 173, avatar: 'https://placehold.co/40x40.png' },
    { name: 'Sterling', number: 27, rating: 173, avatar: 'https://placehold.co/40x40.png' },
    { name: 'Messi', number: 10, rating: 180, avatar: 'https://placehold.co/40x40.png' },
    { name: 'Xavi', number: 6, rating: 175, avatar: 'https://placehold.co/40x40.png' },
];

const PlayerPlaceholder = () => (
    <div className="w-12 h-14 bg-card/50 border border-dashed border-muted-foreground rounded-md flex items-center justify-center">
        <Plus className="w-5 h-5 text-muted-foreground" />
    </div>
);

const LinedPlayerPlaceholder = () => (
     <div className="relative flex flex-col items-center">
        <PlayerPlaceholder />
        <div className="absolute -top-10 h-10 w-px bg-orange-400" />
    </div>
)

const PlayerOnPitch = ({ player }: { player: { name: string, number: number, rating: number, avatar: string } }) => (
    <div className="flex flex-col items-center justify-center gap-1 text-center">
        <div className="relative">
            <Image src={player.avatar} alt={player.name} width={40} height={40} className="rounded-full" data-ai-hint="player avatar" />
            <div className="absolute -top-1 -left-4 text-xs font-semibold text-purple-400">{player.rating}</div>
            <div className="absolute -top-1 -right-4 text-xs font-semibold">{player.number}</div>
        </div>
        <p className="text-xs font-semibold">{player.name}</p>
    </div>
)

const TimeInput = () => {
  const [value, setValue] = useState(65);

  return (
    <div className="relative bg-transparent border border-input rounded-md w-16 h-14 flex items-center justify-center">
      <span className="text-lg font-semibold">{value}</span>
      <div className="absolute right-1 flex flex-col items-center">
        <button onClick={() => setValue(v => v + 1)} className="h-5 w-5"><ChevronUp className="w-4 h-4 text-muted-foreground" /></button>
        <button onClick={() => setValue(v => Math.max(0, v - 1))} className="h-5 w-5"><ChevronDown className="w-4 h-4 text-muted-foreground" /></button>
      </div>
    </div>
  );
};

function LineUpPlan() {
    return (
        <div className="pt-4 space-y-4">
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="New Plan" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="plan-a">Plan A</SelectItem>
                    <SelectItem value="plan-b">Plan B</SelectItem>
                </SelectContent>
            </Select>
            
            <Textarea placeholder="General Tactics Match plan summary..." rows={3} />
            
            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                <Button type="button" variant="outline" size="icon" className="text-yellow-400 font-bold">Zai</Button>
            </div>

            <Separator />

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Invited - <span className="text-primary">{invitedPlayers.length} Players</span></h3>
                    <Button variant="ghost" size="icon"><List className="w-5 h-5" /></Button>
                </div>
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-4 pb-4">
                        {invitedPlayers.map((player, index) => (
                            <div key={index} className="flex flex-col items-center justify-center gap-1 text-center w-14">
                                <Image src={player.avatar} alt={player.name} width={40} height={40} className="rounded-full" data-ai-hint="player avatar" />
                                <p className="text-xs font-semibold truncate">{player.name}</p>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
            
            <Separator />

            <div className="space-y-2">
                    <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Line up - <span className="text-primary">11v11</span></h3>
                    <Button variant="ghost" size="icon"><List className="w-5 h-5" /></Button>
                </div>
                <div className="relative h-96">
                    <FootballPitchIcon className="w-full h-full text-muted-foreground/10" />
                    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-y-2 p-2">
                        {/* Attackers */}
                        <div className="col-start-2 row-start-1 flex justify-center items-end"><LinedPlayerPlaceholder /></div>
                        <div className="col-start-4 row-start-1 flex justify-center items-end"><LinedPlayerPlaceholder /></div>
                        
                        {/* Midfielders */}
                        <div className="col-start-1 row-start-2 flex justify-center items-center"><PlayerOnPitch player={invitedPlayers[4]}/></div>
                        <div className="col-start-2 row-start-3 flex justify-center items-center"><PlayerPlaceholder /></div>
                        <div className="col-start-3 row-start-2 flex justify-center items-center"><PlayerPlaceholder /></div>
                        <div className="col-start-4 row-start-3 flex justify-center items-center"><LinedPlayerPlaceholder /></div>
                        <div className="col-start-5 row-start-2 flex justify-center items-center"><PlayerPlaceholder /></div>

                        {/* Defenders */}
                        <div className="col-start-1 row-start-4 flex justify-center items-center"><PlayerPlaceholder /></div>
                        <div className="col-start-3 row-start-4 flex justify-center items-center"><PlayerPlaceholder /></div>
                        <div className="col-start-5 row-start-4 flex justify-center items-center"><PlayerPlaceholder /></div>

                        {/* Goalkeeper */}
                        <div className="col-start-3 row-start-5 flex justify-center items-start"><PlayerPlaceholder /></div>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Planned exchanges</h3>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-end justify-between">
                    <div className="text-center space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">In</p>
                        <PlayerPlaceholder />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Time</p>
                        <TimeInput />
                    </div>
                        <div className="text-center space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Out</p>
                        <PlayerPlaceholder />
                    </div>
                    <Button size="icon" className="rounded-full w-14 h-14"><Plus className="w-6 h-6" /></Button>
                </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Line Up Publishing, before match start</h3>
                    <Switch defaultChecked />
                </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-muted-foreground">Internally</label>
                        <Select defaultValue="-4h">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-4h">- 4h</SelectItem>
                                <SelectItem value="-2h">- 2h</SelectItem>
                                <SelectItem value="-1h">- 1h</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                        <div>
                        <label className="text-xs text-muted-foreground">Public</label>
                        <Select defaultValue="-1h">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-1h">- 1h</SelectItem>
                                <SelectItem value="-30m">- 30m</SelectItem>
                                <SelectItem value="-15m">- 15m</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    </div>
            </div>
        </div>
    )
}

const OffensePlan = () => {
    const formationPlayers = {
        attack: [
            {...invitedPlayers[4], number: 11},
            {...invitedPlayers[0], number: 14},
            {...invitedPlayers[1], number: 10},
        ],
        midfield: [
            {...invitedPlayers[4], number: 8},
            {...invitedPlayers[1], number: 19},
        ],
        defense: [
            {...invitedPlayers[4], number: 3},
            {...invitedPlayers[0], number: 6},
            {...invitedPlayers[1], number: 2},
            {...invitedPlayers[0], number: 5},
            {...invitedPlayers[1], number: 4},
        ],
        goalie: [
            {...invitedPlayers[0], number: 1},
        ]
    }

    return (
        <div className="pt-4 space-y-4">
            <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                    <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-orange-500 data-[state=active]:text-orange-500">General</TabsTrigger>
                    <TabsTrigger value="build-up" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Build up</TabsTrigger>
                    <TabsTrigger value="attack" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Attack</TabsTrigger>
                    <TabsTrigger value="finish" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Finish</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tactics summary</label>
                        <Textarea placeholder="Offense tactics from another match" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                            <CheckSquare className="absolute top-2 right-2 w-6 h-6 text-primary fill-background" />
                        </div>
                        <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                             <CheckSquare className="absolute top-2 right-2 w-6 h-6 text-primary fill-background" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                        <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                        <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                        <Button type="button" variant="outline" size="icon" className="text-yellow-400 font-bold">Zai</Button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Line up</h3>
                            <Switch defaultChecked />
                        </div>
                        <div className="relative bg-background rounded-lg p-4 space-y-8">
                            {/* Attack */}
                            <div className="flex justify-around items-center">
                                {formationPlayers.attack.map(p => <PlayerOnPitch key={p.number} player={p} />)}
                            </div>
                            {/* Midfield */}
                            <div className="relative flex justify-around items-center">
                                <div className="absolute border-t border-muted-foreground/30 rounded-full w-48 h-24 -top-8" />
                                {formationPlayers.midfield.map(p => <PlayerOnPitch key={p.number} player={p} />)}
                            </div>
                             {/* Defense */}
                            <div className="flex justify-around items-center">
                                {formationPlayers.defense.slice(0,3).map(p => <PlayerOnPitch key={p.number} player={p} />)}
                            </div>
                             <div className="flex justify-around items-center">
                                {formationPlayers.defense.slice(3).map(p => <PlayerOnPitch key={p.number} player={p} />)}
                            </div>
                             {/* Goalie */}
                             <div className="flex justify-around items-center">
                                {formationPlayers.goalie.map(p => <PlayerOnPitch key={p.number} player={p} />)}
                            </div>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Set plays</h3>
                            <Switch />
                        </div>
                    </div>

                </TabsContent>
            </Tabs>
        </div>
    )
}

const DefensePlan = () => {
    const formationPlayers = {
        attack: [
            {...invitedPlayers[4], number: 11},
            {...invitedPlayers[0], number: 14},
            {...invitedPlayers[1], number: 10},
        ],
        midfield: [
            {...invitedPlayers[4], number: 8},
            {...invitedPlayers[1], number: 19},
        ],
        defense: [
            {...invitedPlayers[4], number: 3},
            {...invitedPlayers[0], number: 6},
            {...invitedPlayers[1], number: 2},
            {...invitedPlayers[0], number: 5},
            {...invitedPlayers[1], number: 4},
        ],
        goalie: [
            {...invitedPlayers[0], number: 1},
        ]
    }

    return (
        <div className="pt-4 space-y-4">
            <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                    <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-orange-500 data-[state=active]:text-orange-500">General</TabsTrigger>
                    <TabsTrigger value="high-block" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">High Block</TabsTrigger>
                    <TabsTrigger value="mid-block" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Mid Block</TabsTrigger>
                    <TabsTrigger value="low-block" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Low Block</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tactics summary</label>
                        <Textarea placeholder="Defense tactics from another match" rows={3} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                            <CheckSquare className="absolute top-2 right-2 w-6 h-6 text-primary fill-background" />
                        </div>
                        <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                             <CheckSquare className="absolute top-2 right-2 w-6 h-6 text-primary fill-background" />
                        </div>
                        <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                             <CheckSquare className="absolute top-2 right-2 w-6 h-6 text-primary fill-background" />
                        </div>
                         <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                            <CheckSquare className="absolute top-2 right-2 w-6 h-6 text-primary fill-background" />
                        </div>
                        <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                             <CheckSquare className="absolute top-2 right-2 w-6 h-6 text-primary fill-background" />
                        </div>
                         <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                            <div className="w-full h-full border-2 border-dashed border-muted-foreground/50 rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                        <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                        <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                        <Button type="button" variant="outline" size="icon" className="text-yellow-400 font-bold">Zai</Button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Line up</h3>
                            <Switch defaultChecked />
                        </div>
                        <div className="relative bg-background rounded-lg p-4 space-y-8">
                             <div className="flex justify-around items-center">
                                <PlayerOnPitch player={formationPlayers.midfield[0]} />
                                <PlayerOnPitch player={formationPlayers.attack[1]} />
                                <PlayerOnPitch player={formationPlayers.midfield[1]} />
                            </div>
                            <div className="relative flex justify-around items-center">
                                <PlayerOnPitch player={formationPlayers.attack[0]} />
                                <div className="absolute border-t border-muted-foreground/30 rounded-full w-48 h-24 -top-8" />
                                <PlayerOnPitch player={formationPlayers.defense[1]} />
                                <PlayerOnPitch player={formationPlayers.attack[2]} />
                            </div>
                             <div className="flex justify-around items-center">
                                {formationPlayers.defense.slice(0,2).map(p => <PlayerOnPitch key={p.number} player={p} />)}
                                {formationPlayers.defense.slice(3,4).map(p => <PlayerOnPitch key={p.number} player={p} />)}
                            </div>
                             <div className="flex justify-around items-center">
                                 <PlayerOnPitch player={formationPlayers.goalie[0]} />
                            </div>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Set plays</h3>
                            <Switch />
                        </div>
                         <div className="grid grid-cols-2 gap-2">
                            <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                                <CheckSquare className="absolute top-2 right-2 w-6 h-6 text-primary fill-background" />
                            </div>
                            <div className="relative w-full aspect-square bg-card rounded-md flex items-center justify-center">
                                <div className="w-full h-full border-2 border-dashed border-muted-foreground/50 rounded-md"></div>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                            <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                        </div>
                    </div>

                </TabsContent>
            </Tabs>
        </div>
    )
}

export function MatchPlan() {

    return (
        <div className="space-y-4">
            <Tabs defaultValue="line-up">
                <TabsList className="grid w-full grid-cols-5 bg-transparent p-0">
                    <TabsTrigger value="opponent" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Opponent</TabsTrigger>
                    <TabsTrigger value="line-up" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Line Up</TabsTrigger>
                    <TabsTrigger value="offense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-orange-500 data-[state=active]:text-orange-500">Offense</TabsTrigger>
                    <TabsTrigger value="defense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-orange-500 data-[state=active]:text-orange-500">Defense</TabsTrigger>
                    <TabsTrigger value="other" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Other</TabsTrigger>
                </TabsList>

                <TabsContent value="line-up" className="pt-4 space-y-4">
                   <LineUpPlan />
                    <div className="pt-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                    </div>
                </TabsContent>
                <TabsContent value="offense" className="pt-4 space-y-4">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose Plan" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="plan-a">2022/10/17, 14:00 Maj FC - IFK Norrköping</SelectItem>
                             <SelectItem value="plan-b">Plan B</SelectItem>
                        </SelectContent>
                    </Select>
                   <OffensePlan />
                   <div className="pt-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                    </div>
                </TabsContent>
                <TabsContent value="defense" className="pt-4 space-y-4">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose Plan" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="plan-a">2022/10/17, 14:00 IF Brommapojkarn - Maj FC</SelectItem>
                             <SelectItem value="plan-b">Plan B</SelectItem>
                        </SelectContent>
                    </Select>
                   <DefensePlan />
                   <div className="pt-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                    </div>
                </TabsContent>
                <TabsContent value="opponent">
                    <p className="text-muted-foreground text-center p-8">Opponent planning will be available here.</p>
                </TabsContent>
                <TabsContent value="other">
                    <p className="text-muted-foreground text-center p-8">Other planning will be available here.</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}

    