import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Camera, Video, Plus, ListFilter, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import Image from "next/image";
import { FootballPitchIcon } from "./icons";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const ZaiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FBBF24"/>
        <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="#F59E0B"/>
        <path d="M22 7L12 12V22L22 17V7Z" fill="#FBBF24"/>
        <path d="M2 7L12 12V22L2 17V7Z" fill="#FCD34D"/>
    </svg>
);


const invitedPlayers = [
  { name: 'Ronaldinho', avatar: 'https://placehold.co/48x48.png', number: 15 },
  { name: 'Iniesta', avatar: 'https://placehold.co/48x48.png', number: 9 },
  { name: 'Iniesta', avatar: 'https://placehold.co/48x48.png', number: 21 },
  { name: 'Ronaldinho', avatar: 'https://placehold.co/48x48.png', number: 10 },
  { name: 'Sterling', avatar: 'https://placehold.co/48x48.png', number: 27 },
  { name: 'Messi', avatar: 'https://placehold.co/48x48.png', number: 30 },
];

const PlayerSlot = () => (
    <div className="w-12 h-16 bg-card/50 border border-dashed border-muted-foreground/50 rounded-md flex items-center justify-center">
        <Plus className="w-6 h-6 text-muted-foreground/50" />
    </div>
);

export function PlanPanel() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="lineup" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-transparent p-0">
          <TabsTrigger value="opponent" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Opponent</TabsTrigger>
          <TabsTrigger value="lineup" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Line Up</TabsTrigger>
          <TabsTrigger value="offense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Offense</TabsTrigger>
          <TabsTrigger value="defense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Defense</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Reviews</TabsTrigger>
        </TabsList>
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
                    <h3 className="font-semibold">Invited - <span className="text-primary">22 Players</span></h3>
                    <Button variant="ghost" size="icon"><ListFilter className="w-4 h-4" /></Button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                    {invitedPlayers.map((player, index) => (
                        <div key={index} className="flex flex-col items-center shrink-0 space-y-1">
                             <div className="relative">
                                <Image src={player.avatar} alt={player.name} width={48} height={48} className="rounded-full" data-ai-hint="player avatar" />
                                <span className="absolute -top-1 -right-1 bg-background text-foreground text-xs rounded-full px-1.5 py-0.5 border border-border text-center">{player.number}</span>
                            </div>
                            <p className="text-xs">{player.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Line up - <span className="text-primary">11v11</span></h3>
                    <Button variant="ghost" size="icon"><ListFilter className="w-4 h-4" /></Button>
                </div>
                <div className="relative">
                    <FootballPitchIcon className="w-full h-auto text-muted-foreground/20" />
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 gap-y-2 p-4">
                        {/* Goalkeeper */}
                        <div className="col-start-2 col-span-2 flex justify-center items-end row-start-5"><PlayerSlot /></div>
                        {/* Defenders */}
                        <div className="flex justify-center items-center row-start-4 col-start-1"><PlayerSlot /></div>
                        <div className="flex justify-center items-center row-start-4 col-start-2"><PlayerSlot /></div>
                        <div className="flex justify-center items-center row-start-4 col-start-3"><PlayerSlot /></div>
                        <div className="flex justify-center items-center row-start-4 col-start-4"><PlayerSlot /></div>
                        {/* Midfielders */}
                        <div className="flex justify-center items-center row-start-3 col-start-1 col-span-2"><PlayerSlot /></div>
                        <div className="flex justify-center items-center row-start-3 col-start-3 col-span-2"><PlayerSlot /></div>
                        {/* Forwards */}
                        <div className="flex justify-center items-center row-start-2 col-start-1"><PlayerSlot /></div>
                        <div className="flex justify-center items-center row-start-2 col-start-2"><PlayerSlot /></div>
                        <div className="flex justify-center items-center row-start-2 col-start-3"><PlayerSlot /></div>
                        <div className="flex justify-center items-center row-start-2 col-start-4"><PlayerSlot /></div>
                    </div>
                </div>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Planned exchanges</h3>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex-1 space-y-1 text-center">
                        <label className="text-xs text-muted-foreground">In</label>
                        <PlayerSlot />
                    </div>
                    <div className="space-y-1 text-center">
                         <label className="text-xs text-muted-foreground">Time</label>
                         <div className="relative w-16">
                            <Input defaultValue="65" className="text-center h-16 text-lg" />
                            <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-8 w-8"><ChevronUp /></Button>
                            <Button variant="ghost" size="icon" className="absolute bottom-0 right-0 h-8 w-8"><ChevronDown /></Button>
                         </div>
                    </div>
                    <div className="flex-1 space-y-1 text-center">
                        <label className="text-xs text-muted-foreground">Out</label>
                        <PlayerSlot />
                    </div>
                    <Button size="icon" variant="outline" className="self-end rounded-full h-12 w-12"><PlusCircle /></Button>
                </div>
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
      </Tabs>
    </div>
  );
}
