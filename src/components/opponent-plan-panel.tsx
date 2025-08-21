
"use client"

import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Camera, Video, Plus } from "lucide-react";
import Image from "next/image";
import { FootballPitchIcon } from "./icons";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ZaiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FBBF24"/>
        <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="#F59E0B"/>
        <path d="M22 7L12 12V22L22 17V7Z" fill="#FBBF24"/>
        <path d="M2 7L12 12V22L2 17V7Z" fill="#FCD34D"/>
    </svg>
);

const opponentPlayers = [
  { id: '1', name: 'Sterling', avatar: 'https://placehold.co/48x48.png', number: 11 },
  { id: '2', name: 'Ronaldinho', avatar: 'https://placehold.co/48x48.png', number: 14 },
  { id: '3', name: 'Iniesta', avatar: 'https://placehold.co/48x48.png', number: 10 },
  { id: '4', name: 'Sterling', avatar: 'https://placehold.co/48x48.png', number: 8 },
  { id: '5', name: 'Iniesta', avatar: 'https://placehold.co/48x48.png', number: 19 },
  { id: '6', name: 'Sterling', avatar: 'https://placehold.co/48x48.png', number: 3 },
  { id: '7', name: 'Ronaldinho', avatar: 'https://placehold.co/48x48.png', number: 6 },
  { id: '8', name: 'Iniesta', avatar: 'https://placehold.co/48x48.png', number: 2 },
  { id: '9', name: 'Ronaldinho', avatar: 'https://placehold.co/48x48.png', number: 5 },
  { id: '10', name: 'Iniesta', avatar: 'https://placehold.co/48x48.png', number: 4 },
  { id: '11', name: 'Ronaldinho', avatar: 'https://placehold.co/48x48.png', number: 1 },
];


const PlayerCard = ({ player }: { player: { name: string, avatar: string, number: number } }) => (
    <div className="flex flex-col items-center space-y-1 w-16">
        <div className="relative">
            <Image src={player.avatar} alt={player.name} width={48} height={48} className="rounded-md" data-ai-hint="player avatar" />
            <div className="absolute -top-2 left-0 text-white font-bold text-xs">173</div>
            <div className="absolute -top-2 right-0 text-white font-bold text-xs">{player.number}</div>
        </div>
        <p className="text-xs truncate w-full text-center text-white bg-black/30 rounded-full">{player.name}</p>
    </div>
);

export function OpponentPlanPanel() {
  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium">Choose Opponent review</label>
            <Select defaultValue="if-bromma">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="if-bromma">
                        <div className="flex flex-col text-left">
                            <span className="text-xs text-muted-foreground">2022/10/17, 14:00</span>
                            <span>IF Brommapojkarna - IFK Norrköping</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
          <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">General</TabsTrigger>
          <TabsTrigger value="offense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Offense</TabsTrigger>
          <TabsTrigger value="defense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Defense</TabsTrigger>
          <TabsTrigger value="other" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Other</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="pt-6 space-y-4">
            <div>
                <label className="text-sm font-medium">Tactics summary</label>
                <Textarea 
                    defaultValue="General review from another match which a coach could use to create his own opponent analysis from."
                    rows={4} 
                    className="mt-1" 
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-card rounded-md flex items-center justify-center relative group cursor-pointer">
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-sm border-2 border-background bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L4.5 7.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                </div>
                 <div className="aspect-video bg-card rounded-md flex items-center justify-center relative group cursor-pointer">
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-sm border-2 border-background bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L4.5 7.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Camera /></Button>
                <Button variant="ghost" size="icon"><Video /></Button>
                <Button variant="ghost" size="icon"><Plus /></Button>
                <Button variant="ghost" size="icon" className="ml-auto"><ZaiIcon /></Button>
            </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Line up</h3>
          <Switch defaultChecked />
        </div>
         <div className="space-y-2">
            <label className="text-sm font-medium">Choose Opponent line up</label>
            <Select defaultValue="if-bromma">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="if-bromma">
                        <div className="flex flex-col text-left">
                            <span className="text-xs text-muted-foreground">2022/10/17, 14:00</span>
                            <span>IF Brommapojkarna - IFK Norrköping</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="relative">
            <FootballPitchIcon className="w-full h-auto text-muted-foreground/20" />
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-y-2 p-4">
                {/* Forwards */}
                <div className="col-start-1 row-start-1 flex justify-center items-center"><PlayerCard player={opponentPlayers[0]}/></div>
                <div className="col-start-3 row-start-1 flex justify-center items-center"><PlayerCard player={opponentPlayers[1]}/></div>
                <div className="col-start-5 row-start-1 flex justify-center items-center"><PlayerCard player={opponentPlayers[2]}/></div>
                {/* Midfielders */}
                <div className="col-start-2 row-start-2 flex justify-center items-center"><PlayerCard player={opponentPlayers[3]}/></div>
                <div className="col-start-4 row-start-2 flex justify-center items-center"><PlayerCard player={opponentPlayers[4]}/></div>
                <div className="col-start-1 row-start-3 flex justify-center items-center"><PlayerCard player={opponentPlayers[5]}/></div>
                <div className="col-start-3 row-start-3 flex justify-center items-center"><PlayerCard player={opponentPlayers[6]}/></div>
                <div className="col-start-5 row-start-3 flex justify-center items-center"><PlayerCard player={opponentPlayers[7]}/></div>
                {/* Defenders */}
                <div className="col-start-2 row-start-4 flex justify-center items-center"><PlayerCard player={opponentPlayers[8]}/></div>
                <div className="col-start-4 row-start-4 flex justify-center items-center"><PlayerCard player={opponentPlayers[9]}/></div>
                {/* Goalkeeper */}
                <div className="col-start-3 row-start-5 flex justify-center items-end"><PlayerCard player={opponentPlayers[10]}/></div>
            </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
          <h3 className="font-semibold">Set plays</h3>
          <Switch />
      </div>
      
      <div className="pt-4">
          <Button className="w-full" size="lg">Save</Button>
      </div>

    </div>
  );
}
