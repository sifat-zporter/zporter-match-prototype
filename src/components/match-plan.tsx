
"use client"

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Camera, Video, Loader2, ListFilter } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { apiClient } from "@/lib/api-client";
import type { MatchPlanDto } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

// Mock data, in a real app this would come from an API
const pastOpponentReviews = [
    { id: 'review-1', date: '2023/10/11 16:00', teams: 'IF Brommapojkarna - IFK Norrköping', summary: 'Opponent focused on a high press and fast counter-attacks. Vulnerable to long balls over the top.' },
    { id: 'review-2', date: '2023/09/28 18:30', teams: 'AIK - IFK Norrköping', summary: 'They played a very defensive 5-3-2 formation, absorbing pressure and looking for set-piece opportunities.' },
];

const opponentLineup = [
    { id: 'p1', name: 'Sterling', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 11, position: 'LW' },
    { id: 'p2', name: 'Ronaldinho', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 14, position: 'ST' },
    { id: 'p3', name: 'Iniesta', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 10, position: 'RW' },
    { id: 'p4', name: 'Sterling', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 8, position: 'LCM' },
    { id: 'p5', name: 'Iniesta', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 19, position: 'RCM' },
    { id: 'p6', name: 'Xavi', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 6, position: 'CDM' },
    { id: 'p7', name: 'Alba', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 3, position: 'LB' },
    { id: 'p8', name: 'Pique', avatar: 'https://placehold.co/40x40.png', rating: 177, number: 5, position: 'LCB' },
    { id: 'p9', name: 'Ramos', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 4, position: 'RCB' },
    { id: 'p10', name: 'Alves', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 2, position: 'RB' },
    { id: 'p11', name: 'Casillas', avatar: 'https://placehold.co/40x40.png', rating: 173, number: 1, position: 'GK' },
];

const PlayerOnPitch = ({ player }: { player: typeof opponentLineup[0] }) => (
    <div className="flex flex-col items-center justify-center gap-1 text-center w-16">
        <div className="relative">
            <Image src={player.avatar} alt={player.name} width={40} height={40} className="rounded-full" data-ai-hint="player avatar" />
            <div className="absolute -top-1 -left-4 text-xs font-semibold text-purple-400">{player.rating}</div>
            <div className="absolute -top-1 -right-4 text-xs font-semibold">{player.number}</div>
        </div>
        <p className="text-xs font-semibold truncate w-full">{player.name}</p>
    </div>
);

// Main Component
export function MatchPlan({ matchId }: { matchId: string }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState<MatchPlanDto>({});

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await apiClient(`/api/matches/${matchId}`, {
                method: 'PATCH',
                body: { tacticsNotes: plan }, // This matches the old API structure, adjust if backend changes
            });
            toast({
                title: "Plan Saved!",
                description: "Your match plan has been updated successfully.",
            });
        } catch (error) {
            console.error("Failed to save match plan:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save match plan. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTacticChange = (section: 'offense' | 'defense', field: string, value: string, subField?: string) => {
        setPlan(p => {
            const newPlan = JSON.parse(JSON.stringify(p)); // Deep copy
            if (subField) {
                if (!newPlan[section]) newPlan[section] = {};
                if (!newPlan[section][field]) newPlan[section][field] = {};
                newPlan[section][field][subField] = value;
            } else {
                if (!newPlan[section]) newPlan[section] = {};
                newPlan[section][field] = value;
            }
            return newPlan;
        });
    }

    const TacticSubTabs = ({ section }: { section: 'offense' | 'defense' }) => {
        const fields = section === 'offense' 
            ? ["general", "buildUp", "attack", "finishing", "turnovers"] 
            : ["general", "highBlock", "midBlock", "lowBlock", "turnovers"];
        
        const setPieceFields = ["penalties", "corners", "freeKicks", "throwIns", "goalKicks", "other"];

        return (
             <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="buildup">{section === 'offense' ? 'Build Up' : 'High Block'}</TabsTrigger>
                    <TabsTrigger value="attack">{section === 'offense' ? 'Attack' : 'Mid Block'}</TabsTrigger>
                    <TabsTrigger value="finishing">{section === 'offense' ? 'Finishing' : 'Low Block'}</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="pt-4">
                    <Textarea 
                        placeholder={`General notes on ${section}...`}
                        // @ts-ignore
                        value={plan[section]?.general || ''}
                        onChange={(e) => handleTacticChange(section, 'general', e.target.value)}
                    />
                </TabsContent>
                {/* Add other TabsContent here */}
            </Tabs>
        )
    };


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
                            <div>
                                <Label>Choose Opponent review</Label>
                                <Select onValueChange={(value) => {
                                    const selectedReview = pastOpponentReviews.find(r => r.id === value);
                                    if (selectedReview) {
                                        setPlan(p => ({...p, opponentTactics: selectedReview.summary}));
                                    }
                                }}>
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
                            </div>
                            
                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="offense">Offense</TabsTrigger>
                                    <TabsTrigger value="defense">Defense</TabsTrigger>
                                    <TabsTrigger value="other">Other</TabsTrigger>
                                </TabsList>
                                <TabsContent value="general" className="pt-4">
                                    <Label>Tactics summary</Label>
                                    <Textarea 
                                        placeholder="General review from another match which a coach could use to create his own opponent analysis from." 
                                        rows={4} 
                                        value={plan.opponentTactics || ''}
                                        onChange={(e) => setPlan(p => ({...p, opponentTactics: e.target.value}))}
                                    />
                                     <div className="flex items-center gap-2 mt-2">
                                        <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                        <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex items-center justify-between pt-4">
                               <Label>Line up</Label>
                               <Switch />
                            </div>
                            <div>
                                <Label>Choose Opponent line up</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select opponent lineup" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {/* Options would be populated from API */}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="relative h-[600px] bg-center bg-no-repeat bg-contain" style={{backgroundImage: "url('/football-pitch.svg')"}}>
                                <div className="absolute top-[8%] left-[50%] -translate-x-1/2 grid grid-cols-3 gap-x-8 gap-y-2">
                                    <PlayerOnPitch player={opponentLineup[0]} />
                                    <PlayerOnPitch player={opponentLineup[1]} />
                                    <PlayerOnPitch player={opponentLineup[2]} />
                                </div>
                                 <div className="absolute top-[25%] left-[50%] -translate-x-1/2 grid grid-cols-2 gap-x-20 gap-y-4">
                                    <PlayerOnPitch player={opponentLineup[3]} />
                                    <PlayerOnPitch player={opponentLineup[4]} />
                                </div>
                                <div className="absolute top-[40%] left-[50%] -translate-x-1/2">
                                     <PlayerOnPitch player={opponentLineup[5]} />
                                </div>
                                 <div className="absolute top-[55%] left-[50%] -translate-x-1/2 grid grid-cols-4 gap-x-4 gap-y-4">
                                    <PlayerOnPitch player={opponentLineup[6]} />
                                    <PlayerOnPitch player={opponentLineup[7]} />
                                    <PlayerOnPitch player={opponentLineup[8]} />
                                    <PlayerOnPitch player={opponentLineup[9]} />
                                </div>
                                <div className="absolute top-[78%] left-[50%] -translate-x-1/2">
                                     <PlayerOnPitch player={opponentLineup[10]} />
                                </div>
                            </div>

                             <div className="flex items-center justify-between pt-4">
                               <Label>Set plays</Label>
                               <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="line-up" className="pt-4 space-y-4">
                     <Card>
                        <CardHeader><CardTitle>Line Up</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground p-8 text-center">Line Up planning UI goes here.</div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="offense" className="pt-4 space-y-4">
                    <TacticSubTabs section="offense" />
                </TabsContent>
                
                <TabsContent value="defense" className="pt-4 space-y-4">
                    <TacticSubTabs section="defense" />
                </TabsContent>

                <TabsContent value="other" className="pt-4">
                     <div className="text-muted-foreground p-8 text-center">Other planning UI goes here.</div>
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
