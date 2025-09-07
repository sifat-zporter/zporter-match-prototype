// src/components/match-plan.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Camera, Video, Loader2, ListFilter, Mic } from "lucide-react";
import { Switch } from "./ui/switch";
import { apiClient } from "@/lib/api-client";
import type { MatchPlanPayload } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { ZaiIcon } from "./icons";
import { cn } from "@/lib/utils";
import type { Player } from "@/lib/data";

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
export function MatchPlan({ matchId }: { matchId: string }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [invitedPlayers, setInvitedPlayers] = useState<Player[]>([]);
    
    // State to hold the entire plan data, mirroring the final JSON structure
    const [planData, setPlanData] = useState<Partial<MatchPlanPayload>>({
        main: {
            matchHeadLine: "",
            isPrivate: false,
        },
        opponentAnalysis: {
            general: { 
                selectedReviewId: '', summary: '', attachedMedia: [], isLineupVisible: true, areSetPlaysVisible: false,
                lineup: { formation: "4-3-3", playerPositions: [
                    { playerId: "p1", position: "LW" }, { playerId: "p2", position: "ST" }, { playerId: "p3", position: "RW" },
                    { playerId: "p4", position: "LCM" }, { playerId: "p5", position: "RCM" }, { playerId: "p6", position: "CDM" },
                    { playerId: "p7", position: "LB" }, { playerId: "p8", position: "LCB" }, { playerId: "p9", position: "RCB" }, { playerId: "p10", position: "RB" },
                    { playerId: "p11", position: "GK" },
                ]}
            },
            offense: { selectedReviewId: '', summary: '', attachedMedia: [], isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            defense: { selectedReviewId: '', summary: '', attachedMedia: [], isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            other: { selectedReviewId: '', summary: '', attachedMedia: [], isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } }
        },
        teamLineup: {
            planId: "", planName: "",
            generalTactics: { summary: "", attachedMedia: [] },
            lineup: { formation: "", playerPositions: [] },
            plannedExchanges: { isEnabled: false, substitutions: [] },
            publishingSettings: { isEnabled: false, publishInternallyMinutesBefore: 0, publishPubliclyMinutesBefore: 0 }
        },
        offenseTactics: {
            planId: "", planName: "",
            general: { selectedReviewId: "", summary: "", attachedMedia: [], isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] }},
            buildUp: { selectedReviewId: "", summary: "", attachedMedia: [], isLineupVisible: false, areSetPlaysVisible: false, lineup: { formation: "", playerPositions: [] }},
            attack: { selectedReviewId: "", summary: "", attachedMedia: [], isLineupVisible: false, areSetPlaysVisible: false, lineup: { formation: "", playerPositions: [] }},
            finishing: { selectedReviewId: "", summary: "", attachedMedia: [], isLineupVisible: false, areSetPlaysVisible: false, lineup: { formation: "", playerPositions: [] }}
        },
        defenseTactics: {
            planId: "", planName: "",
            general: { selectedReviewId: "", summary: "", attachedMedia: [], isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "5-3-2", playerPositions: [] }},
            highBlock: { selectedReviewId: "", summary: "", attachedMedia: [], isLineupVisible: false, areSetPlaysVisible: false, lineup: { formation: "", playerPositions: [] }},
            midBlock: { selectedReviewId: "", summary: "", attachedMedia: [], isLineupVisible: false, areSetPlaysVisible: false, lineup: { formation: "", playerPositions: [] }},
            lowBlock: { selectedReviewId: "", summary: "", attachedMedia: [], isLineupVisible: false, areSetPlaysVisible: false, lineup: { formation: "", playerPositions: [] }}
        },
        otherTactics: { planId: "", planName: "", summary: "", attachedMedia: [], isLineupVisible: false, areSetPlaysVisible: false, lineup: { formation: "", playerPositions: [] } }
    });


    useEffect(() => {
        const fetchInvites = async () => {
            if (!matchId) return;
            try {
                const homeTeamPlayers = await apiClient<Player[]>(`/matches/${matchId}/invites/search-users?role=PLAYER_HOME`);
                setInvitedPlayers(homeTeamPlayers);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Failed to load players",
                    description: "Could not fetch the list of invited players for the lineup.",
                });
            }
        };
        fetchInvites();
    }, [matchId, toast]);

    const handlePlanChange = (path: string, value: any) => {
        setPlanData(prev => {
            const newPlan = JSON.parse(JSON.stringify(prev)); // Deep copy
            const keys = path.split('.');
            let current = newPlan;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newPlan;
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await apiClient(`/matches/${matchId}`, {
                method: 'PATCH',
                body: planData,
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
    
    const renderPlayerOnPitch = (position: string, lineupProvider: any) => {
        if (!lineupProvider) return <EmptySlot />;
        const playerPos = lineupProvider.playerPositions.find((p: any) => p.position === position);
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
        const currentTactic = planData.opponentAnalysis?.[subTab];
        
        return (
             <div className="pt-4 space-y-4">
                <div className="space-y-2">
                    <Label>Choose Opponent review</Label>
                    <Select onValueChange={(value) => {
                        const selectedReview = pastOpponentReviews.find(r => r.id === value);
                        handlePlanChange(`opponentAnalysis.${subTab}.summary`, selectedReview?.summary || '');
                        handlePlanChange(`opponentAnalysis.${subTab}.selectedReviewId`, value);
                    }}
                    value={currentTactic?.selectedReviewId}
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
                        value={currentTactic?.summary}
                        onChange={(e) => handlePlanChange(`opponentAnalysis.${subTab}.summary`, e.target.value)}
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
                        checked={currentTactic?.isLineupVisible} 
                        onCheckedChange={(value) => handlePlanChange(`opponentAnalysis.${subTab}.isLineupVisible`, value)} 
                    />
                </div>
                
                <div className={cn(!currentTactic?.isLineupVisible && "hidden")}>
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
                            {renderPlayerOnPitch('LW', currentTactic?.lineup)}
                            {renderPlayerOnPitch('ST', currentTactic?.lineup)}
                            {renderPlayerOnPitch('RW', currentTactic?.lineup)}
                        </div>
                        <div className="absolute top-[25%] left-[50%] -translate-x-1/2 grid grid-cols-2 gap-x-20 gap-y-4">
                            {renderPlayerOnPitch('LCM', currentTactic?.lineup)}
                            {renderPlayerOnPitch('RCM', currentTactic?.lineup)}
                        </div>
                        <div className="absolute top-[40%] left-[50%] -translate-x-1/2">
                            {renderPlayerOnPitch('CDM', currentTactic?.lineup)}
                        </div>
                        <div className="absolute top-[55%] left-[50%] -translate-x-1/2 grid grid-cols-4 gap-x-4 gap-y-4">
                            {renderPlayerOnPitch('LB', currentTactic?.lineup)}
                            {renderPlayerOnPitch('LCB', currentTactic?.lineup)}
                            {renderPlayerOnPitch('RCB', currentTactic?.lineup)}
                            {renderPlayerOnPitch('RB', currentTactic?.lineup)}
                        </div>
                        <div className="absolute top-[78%] left-[50%] -translate-x-1/2">
                            {renderPlayerOnPitch('GK', currentTactic?.lineup)}
                        </div>
                    </div>
                </div>


                    <div className="flex items-center justify-between pt-4">
                    <Label>Set plays</Label>
                    <Switch 
                        checked={currentTactic?.areSetPlaysVisible} 
                        onCheckedChange={(value) => handlePlanChange(`opponentAnalysis.${subTab}.areSetPlaysVisible`, value)}
                    />
                </div>
            </div>
        )
    }

    const TacticSubTabs = ({ section, subTabs }: { section: 'offenseTactics' | 'defenseTactics', subTabs: Record<string, string> }) => {
        return (
             <Tabs defaultValue={Object.keys(subTabs)[0]} className="w-full">
                <TabsList className={`grid w-full grid-cols-${Object.keys(subTabs).length}`}>
                    {Object.entries(subTabs).map(([key, title]) => (
                        <TabsTrigger key={key} value={key}>{title}</TabsTrigger>
                    ))}
                </TabsList>
                {Object.keys(subTabs).map(tabKey => {
                    // @ts-ignore
                    const tacticData = planData[section]?.[tabKey];
                    return (
                    <TabsContent key={tabKey} value={tabKey} className="pt-4 space-y-4">
                       <div>
                           <Label>Tactics summary for {subTabs[tabKey]}</Label>
                           <Textarea 
                               placeholder={`Notes on ${subTabs[tabKey]}...`}
                               value={tacticData?.summary || ''}
                               onChange={(e) => handlePlanChange(`${section}.${tabKey}.summary`, e.target.value)}
                           />
                       </div>
                       <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                            <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                            <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                            <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <Label>Show Lineup</Label>
                          <Switch
                            checked={tacticData?.isLineupVisible || false}
                            onCheckedChange={(checked) => handlePlanChange(`${section}.${tabKey}.isLineupVisible`, checked)}
                          />
                       </div>
                       {/* Pitch would go here if visible */}
                    </TabsContent>
                )})}
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
                                <Select onValueChange={(v) => handlePlanChange('teamLineup.planId', v)} value={planData.teamLineup?.planId}>
                                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="New Plan" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new-plan">New Plan</SelectItem>
                                        <SelectItem value="plan-a">Plan A</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon"><Mic className="w-5 h-5"/></Button>
                            </div>

                            <div>
                                <Label>General Tactics</Label>
                                <Textarea placeholder="Match plan summary." rows={3} value={planData.teamLineup?.generalTactics?.summary} onChange={(e) => handlePlanChange('teamLineup.generalTactics.summary', e.target.value)} />
                                <div className="flex items-center gap-2 mt-2">
                                    <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                    <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                    <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                    <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Invited - {invitedPlayers.length} Players</Label>
                                    <Button variant="ghost" size="icon"><ListFilter className="w-5 h-5"/></Button>
                                </div>
                                <ScrollArea className="w-full whitespace-nowrap">
                                    <div className="flex gap-4 pb-4">
                                        {invitedPlayers.map(p => (
                                            <div key={p.id} className="flex flex-col items-center justify-center gap-1 text-center w-16 flex-shrink-0">
                                                <div className="relative">
                                                    <Image src={p.avatarUrl} alt={p.name} width={48} height={48} className="rounded-full" data-ai-hint="player avatar" />
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
                                    {/* Pitch with empty slots */}
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label>Planned exchanges</Label>
                                    <Switch checked={planData.teamLineup?.plannedExchanges?.isEnabled} onCheckedChange={(c) => handlePlanChange('teamLineup.plannedExchanges.isEnabled', c)} />
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label>Line-Up Publishing, before match start</Label>
                                    <Switch checked={planData.teamLineup?.publishingSettings?.isEnabled} onCheckedChange={(c) => handlePlanChange('teamLineup.publishingSettings.isEnabled', c)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs">Internally</Label>
                                        <Select value={String(planData.teamLineup?.publishingSettings?.publishInternallyMinutesBefore)} onValueChange={(v) => handlePlanChange('teamLineup.publishingSettings.publishInternallyMinutesBefore', parseInt(v))}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent><SelectItem value="240">- 4h</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                     <div>
                                        <Label className="text-xs">Public</Label>
                                        <Select value={String(planData.teamLineup?.publishingSettings?.publishPubliclyMinutesBefore)} onValueChange={(v) => handlePlanChange('teamLineup.publishingSettings.publishPubliclyMinutesBefore', parseInt(v))}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent><SelectItem value="60">- 1h</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="offense" className="pt-4 space-y-4">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                             <Select onValueChange={(v) => handlePlanChange('offenseTactics.planId', v)} value={planData.offenseTactics?.planId}>
                                <SelectTrigger><SelectValue placeholder="Choose Plan" /></SelectTrigger>
                                <SelectContent><SelectItem value="plan-a">Plan A - Maj FC - IFK Norrköping</SelectItem></SelectContent>
                            </Select>
                            <TacticSubTabs section="offenseTactics" subTabs={{ general: 'General', buildUp: 'Build Up', attack: 'Attack', finishing: 'Finishing' }} />
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="defense" className="pt-4 space-y-4">
                     <Card>
                        <CardContent className="p-4 space-y-4">
                             <Select onValueChange={(v) => handlePlanChange('defenseTactics.planId', v)} value={planData.defenseTactics?.planId}>
                                <SelectTrigger><SelectValue placeholder="Choose Plan" /></SelectTrigger>
                                <SelectContent><SelectItem value="plan-a">IF Brommapojkarna - Maj FC</SelectItem></SelectContent>
                            </Select>
                             <TacticSubTabs section="defenseTactics" subTabs={{ general: 'General', highBlock: 'High Block', midBlock: 'Mid Block', lowBlock: 'Low Block' }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="other" className="pt-4">
                     <Card>
                        <CardContent className="p-4 space-y-4">
                             <div className="space-y-2">
                                <Label>Choose Plan</Label>
                                <Select onValueChange={(v) => handlePlanChange('otherTactics.planId', v)} value={planData.otherTactics?.planId}>
                                    <SelectTrigger><SelectValue placeholder="New Plan" /></SelectTrigger>
                                    <SelectContent><SelectItem value="new-plan">New Plan</SelectItem></SelectContent>
                                </Select>
                             </div>
                             <div className="space-y-2">
                                <Label>Tactics summary</Label>
                                <Textarea rows={4} value={planData.otherTactics?.summary} onChange={(e) => handlePlanChange('otherTactics.summary', e.target.value)} />
                             </div>
                             <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Label>Line up</Label>
                                <Switch checked={planData.otherTactics?.isLineupVisible} onCheckedChange={(c) => handlePlanChange('otherTactics.isLineupVisible', c)} />
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <Label>Set plays</Label>
                                <Switch checked={planData.otherTactics?.areSetPlaysVisible} onCheckedChange={(c) => handlePlanChange('otherTactics.areSetPlaysVisible', c)} />
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
