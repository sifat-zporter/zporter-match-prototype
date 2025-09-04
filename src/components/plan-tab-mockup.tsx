
"use client"

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Camera, Video, Loader2, ListFilter, Mic } from "lucide-react";
import { Switch } from "./ui/switch";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { ZaiIcon } from "./icons";
import { cn } from "@/lib/utils";


// Mock data, in a real app this would come from an API
const pastOpponentReviews = [
    { id: 'review-1', date: '2023/10/11 16:00', teams: 'IF Brommapojkarna - IFK Norrköping', summary: 'Opponent focused on a high press and fast counter-attacks. Vulnerable to long balls over the top.' },
    { id: 'review-2', date: '2023/09/28 18:30', teams: 'AIK - IFK Norrköping', summary: 'They played a very defensive 5-3-2 formation, absorbing pressure and looking for set-piece opportunities.' },
];

const opponentPlayers = {
    'p1': { id: 'p1', name: 'Sterling', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 11 },
    'p2': { id: 'p2', name: 'Ronaldinho', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 14 },
    'p3': { id: 'p3', name: 'Iniesta', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 10 },
    'p4': { id: 'p4', name: 'Sterling', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 8 },
    'p5': { id: 'p5', name: 'Iniesta', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 19 },
    'p6': { id: 'p6', name: 'Xavi', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 6 },
    'p7': { id: 'p7', name: 'Alba', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 3 },
    'p8': { id: 'p8', name: 'Pique', avatar: 'https://placehold.co/40x40.png', rating: 177, number: 5 },
    'p9': { id: 'p9', name: 'Ramos', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 4 },
    'p10': { id: 'p10', name: 'Alves', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 2 },
    'p11': { id: 'p11', name: 'Casillas', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 1 },
};

const invitedPlayers = [
    { id: 'p1', name: 'Ronaldinho', avatar: 'https://placehold.co/64x64.png', rating: 173, number: 15 },
    { id: 'p2', name: 'Iniesta', avatar: 'https://placehold.co/64x64.png', rating: 173, number: 9 },
    { id: 'p3', name: 'Iniesta', avatar: 'https://placehold.co/64x64.png', rating: 173, number: 21 },
    { id: 'p4', name: 'Ronaldinho', avatar: 'https://placehold.co/64x64.png', rating: 173, number: 18 },
    { id: 'p5', name: 'Sterling', avatar: 'https://placehold.co/64x64.png', rating: 173, number: 27 },
];

const PlayerOnPitch = ({ player }: { player: { name: string; avatar: string; rating: number; number: number } }) => (
    <div className="flex flex-col items-center justify-center gap-1 text-center w-16">
        <div className="relative">
            <Image src={player.avatar} alt={player.name} width={40} height={40} className="rounded-full" data-ai-hint="player avatar" />
            <div className="absolute -top-1 -left-4 text-xs font-semibold text-purple-400">{player.rating}</div>
            <div className="absolute -top-1 -right-4 text-xs font-semibold">{player.number}</div>
        </div>
        <p className="text-xs font-semibold truncate w-full">{player.name}</p>
    </div>
);

const EmptySlot = () => (
    <div className="w-16 h-[60px] bg-card/50 border-2 border-dashed border-muted-foreground/50 rounded-md flex items-center justify-center">
        <Plus className="w-6 h-6 text-muted-foreground" />
    </div>
)

// Main Component
export function PlanTabMockup() {
    const [isLoading, setIsLoading] = useState(false);
    
    // State to hold the entire plan data, mirroring the final JSON structure
    const [planData, setPlanData] = useState({
        opponentAnalysis: {
            tacticalBreakdown: {
                general: { 
                    selectedReviewId: '', 
                    summary: '', 
                    attachedMedia: [],
                    isLineupVisible: true,
                    areSetPlaysVisible: false,
                    lineup: {
                        formation: "4-3-3",
                        playerPositions: [
                          { playerId: "p1", position: "LW" }, { playerId: "p2", position: "ST" }, { playerId: "p3", position: "RW" },
                          { playerId: "p4", position: "LCM" }, { playerId: "p5", position: "RCM" },
                          { playerId: "p6", position: "CDM" },
                          { playerId: "p7", position: "LB" }, { playerId: "p8", position: "LCB" }, { playerId: "p9", position: "RCB" }, { playerId: "p10", position: "RB" },
                          { playerId: "p11", position: "GK" },
                        ]
                    },
                },
                offense: { 
                    selectedReviewId: '', 
                    summary: '', 
                    attachedMedia: [],
                    isLineupVisible: true,
                    areSetPlaysVisible: false,
                    lineup: { formation: "4-3-3", playerPositions: [] },
                },
                defense: { 
                    selectedReviewId: '', 
                    summary: '', 
                    attachedMedia: [],
                    isLineupVisible: true,
                    areSetPlaysVisible: false,
                    lineup: { formation: "4-3-3", playerPositions: [] },
                },
                other: { 
                    selectedReviewId: '', 
                    summary: '', 
                    attachedMedia: [],
                    isLineupVisible: true,
                    areSetPlaysVisible: false,
                    lineup: { formation: "4-3-3", playerPositions: [] },
                },
            }
        },
        offenseTactics: {
            lineup: {
                formation: "4-3-3",
                playerPositions: [
                    { playerId: 'p1', position: 'LW' }, { playerId: 'p2', position: 'ST' }, { playerId: 'p3', position: 'RW' },
                    { playerId: 'p4', position: 'LCM' }, { playerId: 'p5', position: 'RCM' },
                    { playerId: 'p6', position: 'CDM' },
                    { playerId: 'p7', position: 'LB' }, { playerId: 'p8', position: 'LCB' }, { playerId: 'p9', position: 'RCB' }, { playerId: 'p10', position: 'RB' }
                ],
            },
            // other offense tactics would go here
        },
        defenseTactics: {
            lineup: {
                formation: "5-3-2",
                playerPositions: [
                    { playerId: 'p2', position: 'ST' },
                    { playerId: 'p1', position: 'LCB' }, { playerId: 'p4', position: 'CB' }, { playerId: 'p5', position: 'RCB' }, { playerId: 'p10', position: 'RWB' },
                    { playerId: 'p7', position: 'LWB' }, { playerId: 'p8', position: 'LCM' }, { playerId: 'p9', position: 'CM' }, { playerId: 'p3', position: 'RCM' },
                    { playerId: 'p6', position: 'GK' }, { playerId: 'p11', position: 'SUB' }
                ],
            },
            // other defense tactics would go here
        },
        otherTactics: {
            summary: "",
            isLineupVisible: false,
            areSetPlaysVisible: false,
            lineup: {
                formation: "",
                playerPositions: []
            }
        }
    });

    const handleOpponentTacticChange = (
        subTab: 'general' | 'offense' | 'defense' | 'other', 
        field: 'summary' | 'selectedReviewId' | 'isLineupVisible' | 'areSetPlaysVisible', 
        value: string | boolean
    ) => {
        setPlanData(prev => {
            const newState = JSON.parse(JSON.stringify(prev)); // Deep copy
            newState.opponentAnalysis.tacticalBreakdown[subTab][field] = value;
            return newState;
        });
    };
    
    const handleSave = async () => {
        setIsLoading(true);
        console.log("Saving Plan Data:", JSON.stringify(planData, null, 2));
        // Mock save action
        setTimeout(() => {
            setIsLoading(false);
            
        }, 1000);
    };
    
    const renderPlayerOnPitch = (position: string, lineupProvider: typeof planData.opponentAnalysis.tacticalBreakdown.general.lineup) => {
        const playerPos = lineupProvider.playerPositions.find(p => p.position === position);
        if (playerPos) {
            // @ts-ignore
            const playerDetails = opponentPlayers[playerPos.playerId];
            if (playerDetails) {
                return <PlayerOnPitch player={playerDetails} />;
            }
        }
        return <EmptySlot />;
    };
    
    const OpponentTacticContent = ({ subTab }: { subTab: 'general' | 'offense' | 'defense' | 'other' }) => {
        const currentTactic = planData.opponentAnalysis.tacticalBreakdown[subTab];
        
        return (
             <div className="pt-4 space-y-4">
                <div className="space-y-2">
                    <Label>Choose Opponent review</Label>
                    <Select onValueChange={(value) => {
                        const selectedReview = pastOpponentReviews.find(r => r.id === value);
                        handleOpponentTacticChange(subTab, 'summary', selectedReview?.summary || '');
                        handleOpponentTacticChange(subTab, 'selectedReviewId', value);
                    }}
                    value={currentTactic.selectedReviewId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a past match for analysis" />
                        </SelectTrigger>
                        <SelectContent>
                            {pastOpponentReviews.map(r => (
                                <SelectItem key={r.id} value={r.id}>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">{r.date}</span>
                                        <span>{r.teams}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Label>Tactics summary</Label>
                    <Textarea 
                        placeholder="General review from another match which a coach could use to create his own opponent analysis from." 
                        rows={4} 
                        value={currentTactic.summary}
                        onChange={(e) => handleOpponentTacticChange(subTab, 'summary', e.target.value)}
                    />
                        <div className="flex items-center gap-2 mt-2">
                        <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                        <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                        <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <Label>Line up</Label>
                    <Switch 
                        checked={currentTactic.isLineupVisible} 
                        onCheckedChange={(value) => handleOpponentTacticChange(subTab, 'isLineupVisible', value)} 
                    />
                </div>
                
                <div className={cn(!currentTactic.isLineupVisible && "hidden")}>
                    <Label>Choose Opponent line up</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select opponent lineup" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Options would be populated from API */}
                        </SelectContent>
                    </Select>
                    
                    <div className="relative h-[600px] bg-center bg-no-repeat bg-contain mt-4" style={{backgroundImage: "url('/football-pitch.svg')"}}>
                        <div className="absolute top-[8%] left-[50%] -translate-x-1/2 grid grid-cols-3 gap-x-8 gap-y-2">
                            {renderPlayerOnPitch('LW', currentTactic.lineup)}
                            {renderPlayerOnPitch('ST', currentTactic.lineup)}
                            {renderPlayerOnPitch('RW', currentTactic.lineup)}
                        </div>
                        <div className="absolute top-[25%] left-[50%] -translate-x-1/2 grid grid-cols-2 gap-x-20 gap-y-4">
                            {renderPlayerOnPitch('LCM', currentTactic.lineup)}
                            {renderPlayerOnPitch('RCM', currentTactic.lineup)}
                        </div>
                        <div className="absolute top-[40%] left-[50%] -translate-x-1/2">
                            {renderPlayerOnPitch('CDM', currentTactic.lineup)}
                        </div>
                        <div className="absolute top-[55%] left-[50%] -translate-x-1/2 grid grid-cols-4 gap-x-4 gap-y-4">
                            {renderPlayerOnPitch('LB', currentTactic.lineup)}
                            {renderPlayerOnPitch('LCB', currentTactic.lineup)}
                            {renderPlayerOnPitch('RCB', currentTactic.lineup)}
                            {renderPlayerOnPitch('RB', currentTactic.lineup)}
                        </div>
                        <div className="absolute top-[78%] left-[50%] -translate-x-1/2">
                            {renderPlayerOnPitch('GK', currentTactic.lineup)}
                        </div>
                    </div>
                </div>


                    <div className="flex items-center justify-between pt-4">
                    <Label>Set plays</Label>
                    <Switch 
                        checked={currentTactic.areSetPlaysVisible} 
                        onCheckedChange={(value) => handleOpponentTacticChange(subTab, 'areSetPlaysVisible', value)}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Tabs defaultValue="opponent" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-transparent p-0">
                    <TabsTrigger value="opponent" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Opponent</TabsTrigger>
                    <TabsTrigger value="line-up" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Line Up</TabsTrigger>
                    <TabsTrigger value="offense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Offense</TabsTrigger>
                    <TabsTrigger value="defense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Defense</TabsTrigger>
                    <TabsTrigger value="other" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Other</TabsTrigger>
                </TabsList>
                
                <TabsContent value="opponent" className="pt-4 space-y-4">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="offense">Offense</TabsTrigger>
                                    <TabsTrigger value="defense">Defense</TabsTrigger>
                                    <TabsTrigger value="other">Other</TabsTrigger>
                                </TabsList>
                                <TabsContent value="general"><OpponentTacticContent subTab="general" /></TabsContent>
                                <TabsContent value="offense"><OpponentTacticContent subTab="offense" /></TabsContent>
                                <TabsContent value="defense"><OpponentTacticContent subTab="defense" /></TabsContent>
                                <TabsContent value="other"><OpponentTacticContent subTab="other" /></TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="line-up" className="pt-4 space-y-4">
                     <Card>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <Select defaultValue="new-plan">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new-plan">New Plan</SelectItem>
                                        <SelectItem value="plan-a">Plan A</SelectItem>
                                        <SelectItem value="plan-b">Plan B</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon"><Mic className="w-5 h-5"/></Button>
                            </div>

                            <div>
                                <Label>General Tactics</Label>
                                <Textarea placeholder="Match plan summary." rows={3} />
                                <div className="flex items-center gap-2 mt-2">
                                    <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                    <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                    <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                    <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Invited - 22 Players</Label>
                                    <Button variant="ghost" size="icon"><ListFilter className="w-5 h-5"/></Button>
                                </div>
                                <ScrollArea className="w-full whitespace-nowrap">
                                    <div className="flex gap-4 pb-4">
                                        {invitedPlayers.map(p => (
                                            <div key={p.id} className="flex flex-col items-center justify-center gap-1 text-center w-16 flex-shrink-0">
                                                <div className="relative">
                                                    <Image src={p.avatar} alt={p.name} width={48} height={48} className="rounded-full" data-ai-hint="player avatar" />
                                                    <div className="absolute -top-1 -left-2 text-xs font-semibold text-purple-400">{p.rating}</div>
                                                    <div className="absolute -top-1 -right-2 text-xs font-semibold">{p.number}</div>
                                                </div>
                                                <p className="text-xs font-semibold truncate w-full">{p.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Line up - 11v11</Label>
                                     <Button variant="ghost" size="icon"><ListFilter className="w-5 h-5"/></Button>
                                </div>
                                <div className="relative h-[600px] bg-center bg-no-repeat bg-contain" style={{backgroundImage: "url('/football-pitch.svg')"}}>
                                    {/* Forwards */}
                                    <div className="absolute top-[8%] left-[50%] -translate-x-1/2 grid grid-cols-3 gap-x-8 gap-y-2">
                                        <EmptySlot />
                                        <EmptySlot />
                                        <EmptySlot />
                                    </div>
                                    {/* Midfielders */}
                                    <div className="absolute top-[28%] left-[50%] -translate-x-1/2 grid grid-cols-3 gap-x-12 gap-y-4">
                                        <EmptySlot />
                                        <PlayerOnPitch player={invitedPlayers[4]} />
                                        <EmptySlot />
                                    </div>
                                    {/* Defenders */}
                                    <div className="absolute top-[52%] left-[50%] -translate-x-1/2 grid grid-cols-4 gap-x-4 gap-y-4">
                                        <EmptySlot />
                                        <EmptySlot />
                                        <EmptySlot />
                                        <EmptySlot />
                                    </div>
                                    {/* Goalkeeper */}
                                    <div className="absolute top-[78%] left-[50%] -translate-x-1/2">
                                         <EmptySlot />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label>Planned exchanges</Label>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-col items-center gap-1">
                                        <Label className="text-xs">In</Label>
                                        <EmptySlot />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Label className="text-xs">Time</Label>
                                        <div className="w-16 h-[60px] bg-card/50 border-2 border-muted-foreground/50 rounded-md flex items-center justify-center text-xl font-bold">65</div>
                                    </div>
                                     <div className="flex flex-col items-center gap-1">
                                        <Label className="text-xs">Out</Label>
                                        <EmptySlot />
                                    </div>
                                    <Button size="icon" className="rounded-full self-end"><Plus /></Button>
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label>Line-Up Publishing, before match start</Label>
                                    <Switch />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs">Internally</Label>
                                        <Select defaultValue="-4h"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="-4h">- 4h</SelectItem></SelectContent></Select>
                                    </div>
                                     <div>
                                        <Label className="text-xs">Public</Label>
                                        <Select defaultValue="-1h"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="-1h">- 1h</SelectItem></SelectContent></Select>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="offense" className="pt-4 space-y-4">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                             <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="plan-a">Plan A - Maj FC - IFK Norrköping</SelectItem>
                                </SelectContent>
                            </Select>

                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="build-up">Build up</TabsTrigger>
                                    <TabsTrigger value="attack">Attack</TabsTrigger>
                                    <TabsTrigger value="finishing">Finishing</TabsTrigger>
                                </TabsList>
                                <TabsContent value="general" className="pt-4 space-y-4">
                                    <div>
                                        <Label>Tactics summary</Label>
                                        <Textarea placeholder="Offense tactics from another match" rows={3}/>
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="w-24 h-24 bg-card border border-input rounded-md flex items-center justify-center">
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                            </div>
                                        </div>
                                        <div className="w-24 h-24 bg-card border border-input rounded-md flex items-center justify-center">
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <Label>Line up</Label>
                                        <Switch defaultChecked/>
                                    </div>

                                    <div className="relative h-[600px] bg-center bg-no-repeat bg-contain" style={{backgroundImage: "url('/football-pitch.svg')"}}>
                                        <div className="absolute top-[8%] left-[50%] -translate-x-1/2 grid grid-cols-3 gap-x-8 gap-y-2">
                                            {renderPlayerOnPitch('LW', planData.offenseTactics.lineup)}
                                            {renderPlayerOnPitch('ST', planData.offenseTactics.lineup)}
                                            {renderPlayerOnPitch('RW', planData.offenseTactics.lineup)}
                                        </div>
                                         <div className="absolute top-[25%] left-[50%] -translate-x-1/2 grid grid-cols-2 gap-x-20 gap-y-4">
                                            {renderPlayerOnPitch('LCM', planData.offenseTactics.lineup)}
                                            {renderPlayerOnPitch('RCM', planData.offenseTactics.lineup)}
                                        </div>
                                         <div className="absolute top-[40%] left-[50%] -translate-x-1/2">
                                             {renderPlayerOnPitch('CDM', planData.offenseTactics.lineup)}
                                        </div>
                                         <div className="absolute top-[55%] left-[50%] -translate-x-1/2 grid grid-cols-4 gap-x-4 gap-y-4">
                                            {renderPlayerOnPitch('LB', planData.offenseTactics.lineup)}
                                            {renderPlayerOnPitch('LCB', planData.offenseTactics.lineup)}
                                            {renderPlayerOnPitch('RCB', planData.offenseTactics.lineup)}
                                            {renderPlayerOnPitch('RB', planData.offenseTactics.lineup)}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <Label>Set plays</Label>
                                        <Switch />
                                    </div>

                                </TabsContent>
                                <TabsContent value="build-up" className="pt-4">
                                    <p className="text-center text-muted-foreground p-8">Build up tactics UI goes here.</p>
                                </TabsContent>
                                <TabsContent value="attack" className="pt-4">
                                    <p className="text-center text-muted-foreground p-8">Attack tactics UI goes here.</p>
                                </TabsContent>
                                <TabsContent value="finishing" className="pt-4">
                                    <p className="text-center text-muted-foreground p-8">Finishing tactics UI goes here.</p>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="defense" className="pt-4 space-y-4">
                     <Card>
                        <CardContent className="p-4 space-y-4">
                             <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="plan-a">IF Brommapojkarna - Maj FC</SelectItem>
                                </SelectContent>
                            </Select>

                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="high-block">High Block</TabsTrigger>
                                    <TabsTrigger value="mid-block">Mid Block</TabsTrigger>
                                    <TabsTrigger value="low-block">Low Block</TabsTrigger>
                                </TabsList>
                                <TabsContent value="general" className="pt-4 space-y-4">
                                    <div>
                                        <Label>Tactics summary</Label>
                                        <Textarea placeholder="Defense tactics from another match" rows={3}/>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-24 bg-card border border-input rounded-md flex items-center justify-center">
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                            </div>
                                        </div>
                                        <div className="h-24 bg-card border border-input rounded-md flex items-center justify-center">
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                            </div>
                                        </div>
                                         <div className="h-24 bg-card border border-input rounded-md flex items-center justify-center">
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                            </div>
                                        </div>
                                         <div className="h-24 bg-card border border-input rounded-md flex items-center justify-center">
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                            </div>
                                        </div>
                                         <div className="h-24 bg-card border border-input rounded-md flex items-center justify-center">
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                            </div>
                                        </div>
                                         <div className="h-24 bg-card border border-input rounded-md"></div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <Label>Line up</Label>
                                        <Switch defaultChecked/>
                                    </div>

                                    <div className="relative h-[600px] bg-center bg-no-repeat bg-contain" style={{backgroundImage: "url('/football-pitch.svg')"}}>
                                        <div className="absolute top-[28%] left-[50%] -translate-x-1/2">
                                             {renderPlayerOnPitch('ST', planData.defenseTactics.lineup)}
                                        </div>
                                         <div className="absolute top-[52%] left-[50%] -translate-x-1/2 grid grid-cols-4 gap-x-4 gap-y-4">
                                            {renderPlayerOnPitch('LCB', planData.defenseTactics.lineup)}
                                            {renderPlayerOnPitch('CB', planData.defenseTactics.lineup)}
                                            {renderPlayerOnPitch('RCB', planData.defenseTactics.lineup)}
                                            {renderPlayerOnPitch('RWB', planData.defenseTactics.lineup)}
                                        </div>
                                         <div className="absolute top-[68%] left-[50%] -translate-x-1/2 grid grid-cols-4 gap-x-4 gap-y-4">
                                            {renderPlayerOnPitch('LWB', planData.defenseTactics.lineup)}
                                            {renderPlayerOnPitch('LCM', planData.defenseTactics.lineup)}
                                            {renderPlayerOnPitch('CM', planData.defenseTactics.lineup)}
                                            {renderPlayerOnPitch('RCM', planData.defenseTactics.lineup)}
                                        </div>
                                         <div className="absolute top-[84%] left-[50%] -translate-x-1/2 grid grid-cols-2 gap-x-20 gap-y-4">
                                            {renderPlayerOnPitch('GK', planData.defenseTactics.lineup)}
                                            {renderPlayerOnPitch('SUB', planData.defenseTactics.lineup)}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <Label>Set plays</Label>
                                        <Switch />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-24 bg-card border border-input rounded-md flex items-center justify-center">
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                            </div>
                                        </div>
                                        <div className="h-24 bg-card border border-input rounded-md flex items-center justify-center">
                                             <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                            </div>
                                        </div>
                                        <div className="h-24 bg-card border border-input rounded-md"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="high-block" className="pt-4">
                                    <p className="text-center text-muted-foreground p-8">High Block tactics UI goes here.</p>
                                </TabsContent>
                                <TabsContent value="mid-block" className="pt-4">
                                    <p className="text-center text-muted-foreground p-8">Mid Block tactics UI goes here.</p>
                                </TabsContent>
                                <TabsContent value="low-block" className="pt-4">
                                    <p className="text-center text-muted-foreground p-8">Low Block tactics UI goes here.</p>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="other" className="pt-4">
                     <Card>
                        <CardContent className="p-4 space-y-4">
                             <div className="space-y-2">
                                <Label>Choose Plan</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="New Plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new-plan">New Plan</SelectItem>
                                        <SelectItem value="other-plan-a">Other Plan A</SelectItem>
                                    </SelectContent>
                                </Select>
                             </div>
                             <div className="space-y-2">
                                <Label>Tactics summary</Label>
                                <Textarea rows={4} />
                             </div>
                             <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Label>Line up</Label>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Label>Set plays</Label>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="pt-4">
                <Button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save'}
                </Button>
            </div>
        </div>
    );
}

    

    
