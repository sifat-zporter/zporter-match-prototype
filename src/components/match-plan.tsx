// src/components/match-plan.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Camera, Video, Loader2, ListFilter, Mic, ChevronUp, ChevronDown } from "lucide-react";
import { Switch } from "./ui/switch";
import { apiClient } from "@/lib/api-client";
import type { MatchPlanPayload, Invite, InviteUserSearchResult } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { ZaiIcon } from "./icons";
import { cn } from "@/lib/utils";
import type { Player } from "@/lib/data";
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';

const PlayerOnPitch = ({ player }: { player: Player }) => (
    <div className="flex flex-col items-center justify-center gap-1 text-center w-16">
        <div className="relative">
            <Image src={player.avatarUrl} alt={player.name} width={40} height={40} className="rounded-full" data-ai-hint="player avatar" />
            <div className="absolute -top-1 -left-4 text-xs font-semibold text-purple-400">{player.zporterId}</div>
            <div className="absolute -top-1 -right-4 text-xs font-semibold">{player.number}</div>
        </div>
        <p className="text-xs font-semibold truncate w-full">{player.name}</p>
    </div>
);

const EmptySlot = ({ droppableId, position }: { droppableId: string, position: string }) => (
    <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                    "w-16 h-[60px] bg-card/50 border-2 border-dashed border-muted-foreground/50 rounded-md flex items-center justify-center transition-colors",
                    snapshot.isDraggingOver && "bg-primary/20 border-primary"
                )}
            >
                <Plus className="w-6 h-6 text-muted-foreground" />
                {provided.placeholder}
            </div>
        )}
    </Droppable>
);

const NumberInput = ({ value, onValueChange }: { value: number; onValueChange: (newValue: number) => void }) => (
    <div className="relative bg-card border border-input rounded-md w-24 h-12 flex items-center justify-center">
        <span className="text-xl font-semibold">{value}</span>
        <div className="absolute right-2 flex flex-col items-center">
            <button onClick={() => onValueChange(value + 1)} className="h-5 w-5"><ChevronUp className="w-4 h-4 text-muted-foreground" /></button>
            <button onClick={() => onValueChange(Math.max(0, value - 1))} className="h-5 w-5"><ChevronDown className="w-4 h-4 text-muted-foreground" /></button>
        </div>
    </div>
);

// Main Component
export function MatchPlan({ matchId }: { matchId: string }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [invitedPlayers, setInvitedPlayers] = useState<Player[]>([]);
    
    const [planData, setPlanData] = useState<Partial<MatchPlanPayload>>({
        main: { matchHeadLine: "", isPrivate: false },
        teamLineup: {
            planId: "", planName: "New Plan",
            generalTactics: { summary: "", attachedMedia: [] },
            lineup: { formation: "4-3-3", playerPositions: [] },
            plannedExchanges: { isEnabled: false, substitutions: [{ playerInId: '', playerOutId: '', minute: 65 }] },
            publishingSettings: { isEnabled: false, publishInternallyMinutesBefore: 240, publishPubliclyMinutesBefore: 60 }
        },
    });

    useEffect(() => {
        const fetchInvites = async () => {
            if (!matchId) return;
            try {
                // Corrected: Fetch actual invites, not search results.
                const invites = await apiClient<Invite[]>(`/matches/${matchId}/invites`);
                
                // Now, fetch details for each invited user.
                const playerPromises = invites
                    .filter(invite => invite.inviteeDetails) // Ensure details exist
                    .map(async (invite) => {
                        const user = invite.inviteeDetails as InviteUserSearchResult;
                        return {
                            id: user.userId,
                            name: user.name,
                            avatarUrl: user.faceImage || 'https://placehold.co/40x40.png',
                            number: Math.floor(Math.random() * 99) + 1, // Placeholder
                            zporterId: '173', // Placeholder
                        };
                    });

                const players = await Promise.all(playerPromises);
                setInvitedPlayers(players);

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
                body: { ...planData, status: 'draft' }, // ensure status is sent
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
    
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        const sourceId = source.droppableId;
        const destinationId = destination.droppableId;

        if (sourceId === 'invited-players' && destinationId.startsWith('pos-')) {
            const position = destinationId.split('-')[1];
            const player = invitedPlayers[source.index];

            const playerOnPitch = planData.teamLineup?.lineup?.playerPositions.find(p => p.playerId === player.id);
            if (playerOnPitch) {
                toast({ variant: "destructive", title: "Player already in lineup" });
                return;
            }

            const newPlayerPosition = { playerId: player.id, position };
            const newPositions = [...(planData.teamLineup?.lineup?.playerPositions || []), newPlayerPosition];
            handlePlanChange('teamLineup.lineup.playerPositions', newPositions);
        }
    };

    const renderPlayerOnPitch = (position: string) => {
        const playerPosition = planData.teamLineup?.lineup?.playerPositions.find(p => p.position === position);
        if (playerPosition) {
            const playerDetails = invitedPlayers.find(p => p.id === playerPosition.playerId);
            if (playerDetails) {
                return <PlayerOnPitch player={playerDetails} />;
            }
        }
        return <EmptySlot droppableId={`pos-${position}`} position={position} />;
    };
    

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="space-y-4">
            <Tabs defaultValue="line-up" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-transparent p-0">
                    <TabsTrigger value="opponent" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Opponent</TabsTrigger>
                    <TabsTrigger value="line-up" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Line Up</TabsTrigger>
                    <TabsTrigger value="offense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Offense</TabsTrigger>
                    <TabsTrigger value="defense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Defense</TabsTrigger>
                    <TabsTrigger value="other" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Other</TabsTrigger>
                </TabsList>
                
                <TabsContent value="opponent" className="pt-4 space-y-4">
                   <Card><CardContent className="p-4">Opponent analysis UI goes here.</CardContent></Card>
                </TabsContent>

                <TabsContent value="line-up" className="pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <Select onValueChange={(v) => handlePlanChange('teamLineup.planName', v)} value={planData.teamLineup?.planName}>
                            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="New Plan">New Plan</SelectItem>
                                <SelectItem value="Plan A">Plan A</SelectItem>
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
                        <Droppable droppableId="invited-players" direction="horizontal">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex gap-4 pb-4 overflow-x-auto"
                                >
                                    {invitedPlayers.map((p, index) => (
                                        <Draggable key={p.id} draggableId={p.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="flex flex-col items-center justify-center gap-1 text-center w-16 flex-shrink-0"
                                                >
                                                    <div className="relative">
                                                        <Image src={p.avatarUrl} alt={p.name} width={48} height={48} className="rounded-full" data-ai-hint="player avatar" />
                                                        <div className="absolute -top-1 -left-2 text-xs font-semibold text-purple-400">{p.zporterId}</div>
                                                        <div className="absolute -top-1 -right-2 text-xs font-semibold">{p.number}</div>
                                                    </div>
                                                    <p className="text-xs font-semibold truncate w-full">{p.name}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Line up - {planData.teamLineup?.lineup?.playerPositions.length || 0}v{planData.teamLineup?.lineup?.playerPositions.length || 0}</Label>
                            <Button variant="ghost" size="icon"><ListFilter className="w-5 h-5"/></Button>
                        </div>
                        <div className="relative h-[450px] bg-center bg-no-repeat bg-contain" style={{backgroundImage: "url('/football-pitch-vertical.svg')"}}>
                            <div className="absolute top-[8%] left-[50%] -translate-x-1/2 grid grid-cols-3 gap-x-8 gap-y-2">
                                {renderPlayerOnPitch('LW')}
                                {renderPlayerOnPitch('ST')}
                                {renderPlayerOnPitch('RW')}
                            </div>
                            <div className="absolute top-[28%] left-[50%] -translate-x-1/2 grid grid-cols-3 gap-x-8 gap-y-4">
                                {renderPlayerOnPitch('LCM')}
                                {renderPlayerOnPitch('CM')}
                                {renderPlayerOnPitch('RCM')}
                            </div>
                            <div className="absolute top-[55%] left-[50%] -translate-x-1/2 grid grid-cols-4 gap-x-2 gap-y-4">
                                {renderPlayerOnPitch('LB')}
                                {renderPlayerOnPitch('LCB')}
                                {renderPlayerOnPitch('RCB')}
                                {renderPlayerOnPitch('RB')}
                            </div>
                            <div className="absolute top-[80%] left-[50%] -translate-x-1/2">
                                {renderPlayerOnPitch('GK')}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <Label>Planned exchanges</Label>
                            <Switch checked={planData.teamLineup?.plannedExchanges?.isEnabled} onCheckedChange={(c) => handlePlanChange('teamLineup.plannedExchanges.isEnabled', c)} />
                        </div>
                        {planData.teamLineup?.plannedExchanges?.isEnabled && planData.teamLineup?.plannedExchanges?.substitutions.map((sub, index) => (
                             <div key={index} className="flex items-center justify-between gap-2">
                                <div className="w-20 h-20 bg-card rounded-md flex items-center justify-center"><Plus className="w-6 h-6 text-muted-foreground"/></div>
                                <NumberInput value={sub.minute} onValueChange={(v) => handlePlanChange(`teamLineup.plannedExchanges.substitutions.${index}.minute`, v)} />
                                <div className="w-20 h-20 bg-card rounded-md flex items-center justify-center"><Plus className="w-6 h-6 text-muted-foreground"/></div>
                                <Button size="icon" variant="ghost" className="rounded-full bg-card w-10 h-10"><Plus className="w-5 h-5"/></Button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <Label>Line-Up Publishing, before match start</Label>
                            <Switch checked={planData.teamLineup?.publishingSettings?.isEnabled} onCheckedChange={(c) => handlePlanChange('teamLineup.publishingSettings.isEnabled', c)} />
                        </div>
                         {planData.teamLineup?.publishingSettings?.isEnabled && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs">Internally</Label>
                                    <Select value={String(planData.teamLineup?.publishingSettings?.publishInternallyMinutesBefore)} onValueChange={(v) => handlePlanChange('teamLineup.publishingSettings.publishInternallyMinutesBefore', parseInt(v))}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent><SelectItem value="240">- 4h</SelectItem><SelectItem value="120">- 2h</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs">Public</Label>
                                    <Select value={String(planData.teamLineup?.publishingSettings?.publishPubliclyMinutesBefore)} onValueChange={(v) => handlePlanChange('teamLineup.publishingSettings.publishPubliclyMinutesBefore', parseInt(v))}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent><SelectItem value="60">- 1h</SelectItem><SelectItem value="30">- 30m</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                         )}
                    </div>
                </TabsContent>

                <TabsContent value="offense" className="pt-4 space-y-4">
                    <Card><CardContent className="p-4">Offense tactics UI goes here.</CardContent></Card>
                </TabsContent>
                
                <TabsContent value="defense" className="pt-4 space-y-4">
                     <Card><CardContent className="p-4">Defense tactics UI goes here.</CardContent></Card>
                </TabsContent>

                <TabsContent value="other" className="pt-4">
                     <Card><CardContent className="p-4">Other tactics UI goes here.</CardContent></Card>
                </TabsContent>
            </Tabs>

            <div className="pt-4">
                <Button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save'}
                </Button>
            </div>
        </div>
      </DragDropContext>
    );
}
