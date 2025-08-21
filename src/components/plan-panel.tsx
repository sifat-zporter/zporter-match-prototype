
"use client"

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Camera, Video, Plus, ListFilter, ChevronDown, ChevronUp, PlusCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { FootballPitchIcon } from "./icons";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { OpponentPlanPanel } from './opponent-plan-panel';
import { OtherPlanPanel } from './other-plan-panel';

const ZaiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FBBF24"/>
        <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="#F59E0B"/>
        <path d="M22 7L12 12V22L22 17V7Z" fill="#FBBF24"/>
        <path d="M2 7L12 12V22L2 17V7Z" fill="#FCD34D"/>
    </svg>
);


const invitedPlayers = [
  { id: '1', name: 'Ronaldinho', avatar: 'https://placehold.co/48x48.png', number: 15 },
  { id: '2', name: 'Iniesta', avatar: 'https://placehold.co/48x48.png', number: 9 },
  { id: '3', name: 'Xavi', avatar: 'https://placehold.co/48x48.png', number: 21 },
  { id: '4', name: 'Puyol', avatar: 'https://placehold.co/48x48.png', number: 10 },
  { id: '5', name: 'Sterling', avatar: 'https://placehold.co/48x48.png', number: 27 },
  { id: '6', name: 'Messi', avatar: 'https://placehold.co/48x48.png', number: 30 },
  { id: '7', name: 'Ronaldo', avatar: 'https://placehold.co/48x48.png', number: 7 },
  { id: '8', name: 'Neymar', avatar: 'https://placehold.co/48x48.png', number: 11 },
  { id: '9', name: 'Mbappe', avatar: 'https://placehold.co/48x48.png', number: 29 },
  { id: '10', name: 'Salah', avatar: 'https://placehold.co/48x48.png', number: 17 },
  { id: '11', name: 'De Bruyne', avatar: 'https://placehold.co/48x48.png', number: 18 },
  { id: '12', name: 'Haaland', avatar: 'https://placehold.co/48x48.png', number: 23 },
];

type Player = typeof invitedPlayers[0];
type Lineup = (Player | null)[];
type Exchange = {
    id: number;
    playerIn: Player | null;
    playerOut: Player | null;
    time: number;
};


const PlayerSlot = ({ player, onRemove, onClick }: { player: Player | null; onRemove?: () => void; onClick?: () => void }) => {
    if (player) {
        return (
            <div className="relative w-12 h-16 flex flex-col items-center justify-center cursor-pointer group" onClick={onClick}>
                <Image src={player.avatar} alt={player.name} width={48} height={48} className="rounded-full" data-ai-hint="player avatar" />
                <p className="text-xs mt-1 truncate w-full text-center bg-black/30 rounded-full px-1">{player.name}</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                    className="absolute -top-1 -right-1 bg-background rounded-full text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <XCircle className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div onClick={onClick} className="w-12 h-16 bg-card/50 border border-dashed border-muted-foreground/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-accent">
            <Plus className="w-6 h-6 text-muted-foreground/50" />
        </div>
    );
};

export function PlanPanel() {
    const [lineup, setLineup] = useState<Lineup>(Array(11).fill(null));
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    
    const availablePlayers = invitedPlayers.filter(p => !lineup.some(lp => lp?.id === p.id));
    const lineupPlayers = lineup.filter(p => p !== null) as Player[];

    const handleSelectPlayerForSlot = (player: Player, index: number) => {
        const newLineup = [...lineup];
        newLineup[index] = player;
        setLineup(newLineup);
    };

    const handleRemovePlayerFromSlot = (index: number) => {
        const newLineup = [...lineup];
        newLineup[index] = null;
        setLineup(newLineup);
    }
    
    const addExchange = () => {
        setExchanges([...exchanges, { id: Date.now(), playerIn: null, playerOut: null, time: 65 }]);
    }
    
    const removeExchange = (id: number) => {
        setExchanges(exchanges.filter(ex => ex.id !== id));
    }
    
    const updateExchange = (id: number, updatedExchange: Partial<Exchange>) => {
        setExchanges(exchanges.map(ex => ex.id === id ? { ...ex, ...updatedExchange } : ex));
    }
    
    const handleTimeChange = (id: number, newTime: number) => {
      const clampedTime = Math.max(0, Math.min(120, newTime));
      updateExchange(id, { time: clampedTime });
    }

    const PlayerPicker = ({ onSelect, available, title }: { onSelect: (player: Player) => void, available: Player[], title: string }) => (
        <PopoverContent className="p-2 w-64">
            <h4 className="text-sm font-medium px-2 py-1">{title}</h4>
            <ScrollArea className="h-48">
                <div className="space-y-1 p-1">
                {available.map(player => (
                    <Button key={player.id} variant="ghost" className="w-full justify-start h-auto" onClick={() => onSelect(player)}>
                        <Image src={player.avatar} alt={player.name} width={32} height={32} className="rounded-full mr-2" data-ai-hint="player avatar" />
                        <div>
                            <p className="text-sm font-medium">{player.name}</p>
                            <p className="text-xs text-muted-foreground">#{player.number}</p>
                        </div>
                    </Button>
                ))}
                </div>
            </ScrollArea>
        </PopoverContent>
    )


  return (
    <div className="space-y-6">
      <Tabs defaultValue="opponent" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-transparent p-0">
          <TabsTrigger value="opponent" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Opponent</TabsTrigger>
          <TabsTrigger value="lineup" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Line Up</TabsTrigger>
          <TabsTrigger value="offense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Offense</TabsTrigger>
          <TabsTrigger value="defense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Defense</TabsTrigger>
          <TabsTrigger value="other" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Other</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="opponent" className="pt-6">
            <OpponentPlanPanel />
        </TabsContent>
        <TabsContent value="lineup" className="pt-6 space-y-6">
            <Select defaultValue="new-plan">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="new-plan">New Plan</SelectItem>
                    <SelectItem value="plan-a">Plan A</SelectItem>
                </SelectContent>
            </Select>

            <div>
                <label className="text-sm font-medium">General Tactics</label>
                <Textarea placeholder="Match plan summary..." rows={3} className="mt-1" />
                <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="icon"><Camera /></Button>
                    <Button variant="ghost" size="icon"><Video /></Button>
                    <Button variant="ghost" size="icon"><Plus /></Button>
                    <Button variant="ghost" size="icon" className="ml-auto"><ZaiIcon /></Button>
                </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Invited - <span className="text-primary">{invitedPlayers.length} Players</span></h3>
                    <Button variant="ghost" size="icon"><ListFilter className="w-4 h-4" /></Button>
                </div>
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-4 pb-2 -mx-4 px-4">
                        {invitedPlayers.map((player) => (
                            <div key={player.id} className="flex flex-col items-center shrink-0 space-y-1 w-16">
                                <div className="relative">
                                    <Image src={player.avatar} alt={player.name} width={48} height={48} className="rounded-full" data-ai-hint="player avatar" />
                                    <span className="absolute -top-1 -right-1 bg-background text-foreground text-xs rounded-full px-1.5 py-0.5 border border-border text-center">{player.number}</span>
                                </div>
                                <p className="text-xs truncate w-full text-center">{player.name}</p>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Line up - <span className="text-primary">{lineup.filter(p=>p).length}v11</span></h3>
                    <Button variant="ghost" size="icon"><ListFilter className="w-4 h-4" /></Button>
                </div>
                <div className="relative">
                    <FootballPitchIcon className="w-full h-auto text-muted-foreground/20" />
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 gap-y-2 p-4">
                        {/* Goalkeeper */}
                        <div className="col-start-2 col-span-2 flex justify-center items-end row-start-5">
                            <Popover>
                                <PopoverTrigger asChild><PlayerSlot player={lineup[0]} onRemove={() => handleRemovePlayerFromSlot(0)} /></PopoverTrigger>
                                <PlayerPicker onSelect={(p) => handleSelectPlayerForSlot(p, 0)} available={availablePlayers} title="Select Goalkeeper" />
                            </Popover>
                        </div>
                        {/* Defenders */}
                        {[1, 2, 3, 4].map((pos, i) => (
                            <div key={pos} className={`flex justify-center items-center row-start-4 col-start-${i + 1}`}>
                               <Popover>
                                    <PopoverTrigger asChild><PlayerSlot player={lineup[pos]} onRemove={() => handleRemovePlayerFromSlot(pos)} /></PopoverTrigger>
                                    <PlayerPicker onSelect={(p) => handleSelectPlayerForSlot(p, pos)} available={availablePlayers} title="Select Defender" />
                                </Popover>
                            </div>
                        ))}
                        {/* Midfielders */}
                        {[5, 6].map((pos, i) => (
                            <div key={pos} className={`flex justify-center items-center row-start-3 col-start-${i * 2 + 1} col-span-2`}>
                                <Popover>
                                    <PopoverTrigger asChild><PlayerSlot player={lineup[pos]} onRemove={() => handleRemovePlayerFromSlot(pos)} /></PopoverTrigger>
                                    <PlayerPicker onSelect={(p) => handleSelectPlayerForSlot(p, pos)} available={availablePlayers} title="Select Midfielder" />
                                </Popover>
                            </div>
                        ))}
                        {/* Forwards */}
                        {[7, 8, 9, 10].map((pos, i) => (
                             <div key={pos} className={`flex justify-center items-center row-start-2 col-start-${i+1}`}>
                                <Popover>
                                    <PopoverTrigger asChild><PlayerSlot player={lineup[pos]} onRemove={() => handleRemovePlayerFromSlot(pos)} /></PopoverTrigger>
                                    <PlayerPicker onSelect={(p) => handleSelectPlayerForSlot(p, pos)} available={availablePlayers} title="Select Forward" />
                                </Popover>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Planned exchanges</h3>
                    <Switch defaultChecked />
                </div>
                {exchanges.map((exchange) => (
                    <div key={exchange.id} className="flex items-center gap-2">
                        <div className="flex-1 space-y-1 text-center">
                            <label className="text-xs text-muted-foreground">In</label>
                            <Popover>
                                <PopoverTrigger asChild><PlayerSlot player={exchange.playerIn} onClick={() => {}} /></PopoverTrigger>
                                <PlayerPicker onSelect={(p) => updateExchange(exchange.id, { playerIn: p })} available={availablePlayers.filter(p => p.id !== exchange.playerOut?.id)} title="Player In" />
                            </Popover>
                        </div>
                        <div className="space-y-1 text-center">
                            <label className="text-xs text-muted-foreground">Time</label>
                            <div className="relative w-16">
                                <Input value={exchange.time} onChange={(e) => handleTimeChange(exchange.id, parseInt(e.target.value) || 0)} className="text-center h-16 text-lg" />
                                <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-8 w-8" onClick={() => handleTimeChange(exchange.id, exchange.time + 1)}><ChevronUp /></Button>
                                <Button variant="ghost" size="icon" className="absolute bottom-0 right-0 h-8 w-8" onClick={() => handleTimeChange(exchange.id, exchange.time - 1)}><ChevronDown /></Button>
                            </div>
                        </div>
                        <div className="flex-1 space-y-1 text-center">
                            <label className="text-xs text-muted-foreground">Out</label>
                             <Popover>
                                <PopoverTrigger asChild><PlayerSlot player={exchange.playerOut} onClick={() => {}} /></PopoverTrigger>
                                <PlayerPicker onSelect={(p) => updateExchange(exchange.id, { playerOut: p })} available={lineupPlayers.filter(p => p.id !== exchange.playerIn?.id)} title="Player Out" />
                            </Popover>
                        </div>
                        <Button size="icon" variant="ghost" className="self-end rounded-full h-12 w-12 text-muted-foreground hover:text-destructive" onClick={() => removeExchange(exchange.id)}><XCircle /></Button>
                    </div>
                ))}
                 <Button variant="outline" className="w-full" onClick={addExchange}><PlusCircle className="mr-2" /> Add Exchange</Button>
            </div>

            <Separator />
            
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Line Up Publishing, before match start</h3>
                    <Switch />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Internally</label>
                        <Select defaultValue="-4h">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-4h">- 4h</SelectItem>
                                <SelectItem value="-2h">- 2h</SelectItem>
                                <SelectItem value="-1h">- 1h</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Public</label>
                        <Select defaultValue="-1h">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-2h">- 2h</SelectItem>
                                <SelectItem value="-1h">- 1h</SelectItem>
                                <SelectItem value="-30m">- 30m</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            
            <div className="pt-4">
                <Button className="w-full" size="lg">Save</Button>
            </div>

        </TabsContent>
        <TabsContent value="other" className="pt-6">
            <OtherPlanPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
