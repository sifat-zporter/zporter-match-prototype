// src/components/match-plan.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Camera, Video, Loader2, ListFilter, Mic, ChevronUp, ChevronDown, X, UserPlus } from "lucide-react";
import { Switch } from "./ui/switch";
import { apiClient } from "@/lib/api-client";
import type { MatchPlanPayload, Invite, UserDto } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { ZaiIcon } from "./icons";
import { cn } from "@/lib/utils";
import type { Player } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";


const PlayerOnPitch = ({ player, onRemove, isOpponent = false }: { player: Player, onRemove?: () => void, isOpponent?: boolean }) => (
    <div className="flex flex-col items-center justify-center gap-1 text-center w-16 relative group/player">
        <div className="relative">
            <Image src={player.avatarUrl} alt={player.name} width={40} height={40} className="rounded-full" data-ai-hint="player avatar" />
            {!isOpponent && <div className="absolute -top-1 -left-4 text-xs font-semibold text-purple-400">{player.zporterId}</div>}
            <div className="absolute -top-1 -right-4 text-xs font-semibold">{player.number}</div>
            {onRemove && (
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full opacity-0 group-hover/player:opacity-100 transition-opacity"
                    onClick={onRemove}
                >
                    <X className="w-3 h-3" />
                </Button>
            )}
        </div>
        <p className="text-xs font-semibold truncate w-full">{player.name}</p>
    </div>
);


const EmptySlot = ({ onSelectPlayer, availablePlayers, position }: { onSelectPlayer: (playerId: string) => void, availablePlayers: Player[], position: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="w-16 h-[60px] bg-card/50 border-2 border-dashed border-muted-foreground/50 rounded-md flex items-center justify-center transition-colors hover:bg-primary/20 hover:border-primary"
                    aria-label={`Add player to ${position}`}
                >
                    <UserPlus className="w-6 h-6 text-muted-foreground" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-64">
                <Command>
                    <CommandInput placeholder="Assign player..." />
                    <CommandList>
                        <CommandEmpty>No available players.</CommandEmpty>
                        <CommandGroup>
                            {availablePlayers.map((player) => (
                                <CommandItem
                                    key={player.id}
                                    value={player.name}
                                    onSelect={() => {
                                        onSelectPlayer(player.id);
                                        setOpen(false);
                                    }}
                                >
                                    {player.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

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
    
    // Mock opponent players for UI demonstration
    const opponentPlayers: Player[] = Array.from({ length: 11 }, (_, i) => ({
        id: `opponent-${i + 1}`,
        name: ['Sterling', 'Ronaldinho', 'Iniesta'][i % 3],
        avatarUrl: `https://picsum.photos/id/${10 + i}/40/40`,
        number: [11, 14, 10, 8, 19, 3, 2, 6, 5, 4, 1][i],
        zporterId: `zpid${1000 + i}`
    }));

    const [planData, setPlanData] = useState<Partial<MatchPlanPayload>>({
        main: { matchHeadLine: "", isPrivate: false },
        opponentAnalysis: {
            general: { summary: 'General review from another match which a coach could use to create his own opponent analysis from.', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            offense: { summary: '', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            defense: { summary: '', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            other: { summary: '', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
        },
        teamLineup: {
            planId: "", planName: "New Plan",
            generalTactics: { summary: "", attachedMedia: [] },
            lineup: { formation: "4-3-3", playerPositions: [] },
            plannedExchanges: { isEnabled: false, substitutions: [{ playerInId: '', playerOutId: '', minute: 65 }] },
            publishingSettings: { isEnabled: false, publishInternallyMinutesBefore: 240, publishPubliclyMinutesBefore: 60 }
        },
        offenseTactics: {
            planId: "",
            planName: "New Offense Plan",
            general: { summary: 'Offense tactics from another match.', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            buildUp: { summary: '', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            attack: { summary: '', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            finishing: { summary: '', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
        },
        defenseTactics: {
            planId: "",
            planName: "New Defense Plan",
            general: { summary: 'Defense tactics from another match.', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            highBlock: { summary: '', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            midBlock: { summary: '', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
            lowBlock: { summary: '', isLineupVisible: true, areSetPlaysVisible: false, lineup: { formation: "4-3-3", playerPositions: [] } },
        },
         otherTactics: {
            planId: "",
            planName: "New Other Plan",
            summary: "Other tactics from another match.",
            attachedMedia: [],
            isLineupVisible: true,
            areSetPlaysVisible: false,
            lineup: {
                formation: "4-3-3",
                playerPositions: []
            }
        },
    });

    useEffect(() => {
        const fetchInvitedPlayers = async () => {
            if (!matchId) return;
            try {
                const invites = await apiClient<Invite[]>(`/matches/${matchId}/invites`);
                
                const playerPromises = invites
                    .filter(invite => invite.inviteeId)
                    .map(async (invite) => {
                        try {
                            const user = await apiClient<UserDto>(`/users/${invite.inviteeId}`);
                            return {
                                id: user.userId,
                                name: `${user.profile.firstName} ${user.profile.lastName}`,
                                avatarUrl: user.media.faceImage || `https://picsum.photos/seed/${user.userId}/40/40`,
                                number: user.playerCareer?.shirtNumber || Math.floor(Math.random() * 99) + 1,
                                zporterId: user.username,
                                role: user.type,
                            };
                        } catch (error) {
                            console.error(`Failed to fetch details for user ${invite.inviteeId}`, error);
                            return null;
                        }
                    });

                const players = (await Promise.all(playerPromises)).filter(Boolean) as Player[];
                setInvitedPlayers(players);

            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Failed to load players",
                    description: "Could not fetch the list of invited players for the lineup.",
                });
            }
        };
        fetchInvitedPlayers();
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

    const handleAddSubstitution = () => {
        const currentSubs = planData.teamLineup?.plannedExchanges?.substitutions || [];
        const newSubstitutions = [...currentSubs, { playerInId: '', playerOutId: '', minute: 0 }];
        handlePlanChange('teamLineup.plannedExchanges.substitutions', newSubstitutions);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await apiClient(`/matches/${matchId}`, {
                method: 'PATCH',
                body: { ...planData, status: 'draft' },
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
    
    const playersOnPitchIds = new Set((planData.teamLineup?.lineup?.playerPositions || []).map(p => p.playerId));
    const availablePlayers = invitedPlayers.filter(p => !playersOnPitchIds.has(p.id));

    const handleSelectPlayerForPosition = (position: string, playerId: string) => {
        const currentPositions = planData.teamLineup?.lineup?.playerPositions || [];
        const newPositions = [...currentPositions.filter(p => p.playerId !== playerId), { playerId, position }];
        handlePlanChange('teamLineup.lineup.playerPositions', newPositions);
    };
    
    const handleRemovePlayerFromPosition = (position: string) => {
        const currentPositions = planData.teamLineup?.lineup?.playerPositions || [];
        const newPositions = currentPositions.filter(p => p.position !== position);
        handlePlanChange('teamLineup.lineup.playerPositions', newPositions);
    };

    const renderPlayerOnPitch = (position: string) => {
        const playerPosition = planData.teamLineup?.lineup?.playerPositions.find(p => p.position === position);
        if (playerPosition) {
            const playerDetails = invitedPlayers.find(p => p.id === playerPosition.playerId);
            if (playerDetails) {
                return <PlayerOnPitch player={playerDetails} onRemove={() => handleRemovePlayerFromPosition(position)} />;
            }
        }
        return <EmptySlot availablePlayers={availablePlayers} onSelectPlayer={(playerId) => handleSelectPlayerForPosition(position, playerId)} position={position} />;
    };

    const renderFormationPitch = (players: Player[]) => {
        if (!players || players.length === 0) return null;
         const formation = {
            forwards: players.slice(0, 3),
            midfielders: players.slice(3, 5),
            defenders: players.slice(5, 9),
            goalkeeper: players.slice(9, 10),
        };
        return (
             <div className="relative h-[450px] bg-center bg-no-repeat bg-contain" style={{backgroundImage: "url('/football-pitch-vertical.svg')"}}>
                <div className="absolute top-[8%] left-[50%] -translate-x-1/2 grid grid-cols-3 gap-x-8 gap-y-2">
                    {formation.forwards.map(p => <PlayerOnPitch key={p.id} player={p} isOpponent />)}
                </div>
                <div className="absolute top-[28%] left-[50%] -translate-x-1/2 grid grid-cols-2 gap-x-8 gap-y-4">
                    {formation.midfielders.map(p => <PlayerOnPitch key={p.id} player={p} isOpponent />)}
                </div>
                <div className="absolute top-[55%] left-[50%] -translate-x-1/2 grid grid-cols-4 gap-x-2 gap-y-4">
                    {formation.defenders.map(p => <PlayerOnPitch key={p.id} player={p} isOpponent />)}
                </div>
                <div className="absolute top-[80%] left-[50%] -translate-x-1/2">
                    {formation.goalkeeper.map(p => <PlayerOnPitch key={p.id} player={p} isOpponent />)}
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
                   <Select>
                       <SelectTrigger>
                           <SelectValue placeholder="Choose Opponent review" />
                       </SelectTrigger>
                       <SelectContent>
                           <SelectItem value="if-bromma">IF Brommapojkarna - IFK Norrköping</SelectItem>
                       </SelectContent>
                   </Select>
                   <Tabs defaultValue="general" className="w-full">
                       <TabsList className="grid w-full grid-cols-4">
                           <TabsTrigger value="general">General</TabsTrigger>
                           <TabsTrigger value="offense">Offense</TabsTrigger>
                           <TabsTrigger value="defense">Defense</TabsTrigger>
                           <TabsTrigger value="other">Other</TabsTrigger>
                       </TabsList>
                       {(['general', 'offense', 'defense', 'other'] as const).map(subTab => (
                           <TabsContent key={subTab} value={subTab} className="pt-4 space-y-4">
                               <div className="space-y-2">
                                   <Label>Tactics summary</Label>
                                   <Textarea 
                                     rows={4}
                                     value={planData.opponentAnalysis?.[subTab]?.summary || ''}
                                     onChange={(e) => handlePlanChange(`opponentAnalysis.${subTab}.summary`, e.target.value)}
                                   />
                               </div>
                               <div className="flex gap-2">
                                   <div className="w-1/2 h-24 bg-card rounded-md flex items-center justify-center">
                                       <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div>
                                   </div>
                                   <div className="w-1/2 h-24 bg-card rounded-md flex items-center justify-center">
                                       <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div>
                                   </div>
                               </div>
                               <div className="flex items-center gap-2">
                                   <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                   <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                   <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                   <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                               </div>
                               <div className="flex items-center justify-between">
                                   <Label>Line up</Label>
                                   <Switch 
                                     checked={planData.opponentAnalysis?.[subTab]?.isLineupVisible}
                                     onCheckedChange={(c) => handlePlanChange(`opponentAnalysis.${subTab}.isLineupVisible`, c)}
                                   />
                               </div>
                               {planData.opponentAnalysis?.[subTab]?.isLineupVisible && renderFormationPitch(opponentPlayers)}
                               <div className="flex items-center justify-between">
                                   <Label>Set plays</Label>
                                   <Switch
                                     checked={planData.opponentAnalysis?.[subTab]?.areSetPlaysVisible}
                                     onCheckedChange={(c) => handlePlanChange(`opponentAnalysis.${subTab}.areSetPlaysVisible`, c)}
                                   />
                               </div>
                           </TabsContent>
                       ))}
                   </Tabs>
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
                        <div className="flex gap-4 pb-4 overflow-x-auto min-h-[80px] bg-card/50 p-2 rounded-md">
                            {availablePlayers.map((p) => (
                                <div
                                    key={p.id}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 text-center w-16 flex-shrink-0"
                                    )}
                                >
                                    <div className="relative">
                                        <Image src={p.avatarUrl} alt={p.name} width={48} height={48} className="rounded-full" data-ai-hint="player avatar" />
                                        <div className="absolute -top-1 -left-2 text-xs font-semibold text-purple-400">{p.zporterId}</div>
                                        <div className="absolute -top-1 -right-2 text-xs font-semibold">{p.number}</div>
                                    </div>
                                    <p className="text-xs font-semibold truncate w-full">{p.name}</p>
                                </div>
                            ))}
                        </div>
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
                        {planData.teamLineup?.plannedExchanges?.isEnabled && (
                            <>
                                {planData.teamLineup?.plannedExchanges?.substitutions.map((sub, index) => (
                                    <div key={index} className="flex items-center justify-between gap-2">
                                        <Select onValueChange={(playerId) => handlePlanChange(`teamLineup.plannedExchanges.substitutions.${index}.playerOutId`, playerId)} value={sub.playerOutId}>
                                            <SelectTrigger className="w-20 h-20 bg-card rounded-md flex items-center justify-center">
                                                <SelectValue placeholder={<Plus className="w-6 h-6 text-muted-foreground"/>} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {invitedPlayers.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <NumberInput value={sub.minute} onValueChange={(v) => handlePlanChange(`teamLineup.plannedExchanges.substitutions.${index}.minute`, v)} />
                                        <Select onValueChange={(playerId) => handlePlanChange(`teamLineup.plannedExchanges.substitutions.${index}.playerInId`, playerId)} value={sub.playerInId}>
                                            <SelectTrigger className="w-20 h-20 bg-card rounded-md flex items-center justify-center">
                                                <SelectValue placeholder={<Plus className="w-6 h-6 text-muted-foreground"/>} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {invitedPlayers.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <div className="w-10 h-10" />
                                    </div>
                                ))}
                                 <div className="flex justify-end">
                                    <Button size="icon" variant="ghost" className="rounded-full bg-card w-10 h-10" onClick={handleAddSubstitution}>
                                        <Plus className="w-5 h-5"/>
                                    </Button>
                                </div>
                            </>
                        )}
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
                   <Select onValueChange={(v) => handlePlanChange('offenseTactics.planName', v)} value={planData.offenseTactics?.planName}>
                       <SelectTrigger>
                           <SelectValue placeholder="Choose Plan" />
                       </SelectTrigger>
                       <SelectContent>
                           <SelectItem value="New Offense Plan">New Offense Plan</SelectItem>
                           <SelectItem value="Maj FC - IFK Norrköping">Maj FC - IFK Norrköping</SelectItem>
                       </SelectContent>
                   </Select>
                   <Tabs defaultValue="general" className="w-full">
                       <TabsList className="grid w-full grid-cols-4">
                           <TabsTrigger value="general">General</TabsTrigger>
                           <TabsTrigger value="buildUp">Build up</TabsTrigger>
                           <TabsTrigger value="attack">Attack</TabsTrigger>
                           <TabsTrigger value="finishing">Finishing</TabsTrigger>
                       </TabsList>
                       {(['general', 'buildUp', 'attack', 'finishing'] as const).map(subTab => (
                           <TabsContent key={subTab} value={subTab} className="pt-4 space-y-4">
                               <div className="space-y-2">
                                   <Label>Tactics summary</Label>
                                   <Textarea 
                                     rows={4}
                                     placeholder="Offense tactics from another match"
                                     value={planData.offenseTactics?.[subTab]?.summary || ''}
                                     onChange={(e) => handlePlanChange(`offenseTactics.${subTab}.summary`, e.target.value)}
                                   />
                               </div>
                               <div className="flex gap-2">
                                   <div className="w-1/2 h-24 bg-card rounded-md flex items-center justify-center">
                                       <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div>
                                   </div>
                                   <div className="w-1/2 h-24 bg-card rounded-md flex items-center justify-center">
                                       <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div>
                                   </div>
                               </div>
                               <div className="flex items-center gap-2">
                                   <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                   <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                   <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                   <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                               </div>
                               <div className="flex items-center justify-between">
                                   <Label>Line up</Label>
                                   <Switch 
                                     checked={planData.offenseTactics?.[subTab]?.isLineupVisible}
                                     onCheckedChange={(c) => handlePlanChange(`offenseTactics.${subTab}.isLineupVisible`, c)}
                                   />
                               </div>
                               {planData.offenseTactics?.[subTab]?.isLineupVisible && renderFormationPitch(opponentPlayers)}
                               <div className="flex items-center justify-between">
                                   <Label>Set plays</Label>
                                   <Switch
                                     checked={planData.offenseTactics?.[subTab]?.areSetPlaysVisible}
                                     onCheckedChange={(c) => handlePlanChange(`offenseTactics.${subTab}.areSetPlaysVisible`, c)}
                                   />
                               </div>
                           </TabsContent>
                       ))}
                   </Tabs>
                </TabsContent>
                
                <TabsContent value="defense" className="pt-4 space-y-4">
                     <Select onValueChange={(v) => handlePlanChange('defenseTactics.planName', v)} value={planData.defenseTactics?.planName}>
                       <SelectTrigger>
                           <SelectValue placeholder="Choose Plan" />
                       </SelectTrigger>
                       <SelectContent>
                           <SelectItem value="New Defense Plan">New Defense Plan</SelectItem>
                           <SelectItem value="IF Brommapojkarna - Maj FC">IF Brommapojkarna - Maj FC</SelectItem>
                       </SelectContent>
                   </Select>
                   <Tabs defaultValue="general" className="w-full">
                       <TabsList className="grid w-full grid-cols-4">
                           <TabsTrigger value="general">General</TabsTrigger>
                           <TabsTrigger value="highBlock">High Block</TabsTrigger>
                           <TabsTrigger value="midBlock">Mid Block</TabsTrigger>
                           <TabsTrigger value="lowBlock">Low Block</TabsTrigger>
                       </TabsList>
                       {(['general', 'highBlock', 'midBlock', 'lowBlock'] as const).map(subTab => (
                           <TabsContent key={subTab} value={subTab} className="pt-4 space-y-4">
                               <div className="space-y-2">
                                   <Label>Tactics summary</Label>
                                   <Textarea 
                                     rows={4}
                                     placeholder="Defense tactics from another match"
                                     value={planData.defenseTactics?.[subTab]?.summary || ''}
                                     onChange={(e) => handlePlanChange(`defenseTactics.${subTab}.summary`, e.target.value)}
                                   />
                               </div>
                               <div className="grid grid-cols-3 gap-2">
                                   <div className="h-24 bg-card rounded-md flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div></div>
                                   <div className="h-24 bg-card rounded-md flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div></div>
                                   <div className="h-24 bg-card rounded-md flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div></div>
                                   <div className="h-24 bg-card rounded-md flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div></div>
                                   <div className="h-24 bg-card rounded-md flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div></div>
                                   <div className="h-24 bg-card rounded-md flex items-center justify-center"></div>
                               </div>
                               <div className="flex items-center gap-2">
                                   <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                                   <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                                   <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                                   <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                               </div>
                               <div className="flex items-center justify-between">
                                   <Label>Line up</Label>
                                   <Switch 
                                     checked={planData.defenseTactics?.[subTab]?.isLineupVisible}
                                     onCheckedChange={(c) => handlePlanChange(`defenseTactics.${subTab}.isLineupVisible`, c)}
                                   />
                               </div>
                               {planData.defenseTactics?.[subTab]?.isLineupVisible && renderFormationPitch(opponentPlayers)}
                               <div className="flex items-center justify-between">
                                   <Label>Set plays</Label>
                                   <Switch
                                     checked={planData.defenseTactics?.[subTab]?.areSetPlaysVisible}
                                     onCheckedChange={(c) => handlePlanChange(`defenseTactics.${subTab}.areSetPlaysVisible`, c)}
                                   />
                               </div>
                           </TabsContent>
                       ))}
                   </Tabs>
                </TabsContent>

                <TabsContent value="other" className="pt-4 space-y-4">
                    <Select onValueChange={(v) => handlePlanChange('otherTactics.planName', v)} value={planData.otherTactics?.planName}>
                       <SelectTrigger>
                           <SelectValue placeholder="Choose Plan" />
                       </SelectTrigger>
                       <SelectContent>
                           <SelectItem value="New Other Plan">New Other Plan</SelectItem>
                       </SelectContent>
                   </Select>
                    <div className="space-y-2">
                       <Label>Tactics summary</Label>
                       <Textarea 
                         rows={4}
                         placeholder="Other tactics from another match"
                         value={planData.otherTactics?.summary || ''}
                         onChange={(e) => handlePlanChange(`otherTactics.summary`, e.target.value)}
                       />
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                       <div className="h-24 bg-card rounded-md flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div></div>
                       <div className="h-24 bg-card rounded-md flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">✓</div></div>
                       <div className="h-24 bg-card rounded-md flex items-center justify-center"></div>
                   </div>
                   <div className="flex items-center gap-2">
                       <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                       <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                       <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                       <Button type="button" variant="outline" size="icon"><ZaiIcon className="w-4 h-4" /></Button>
                   </div>
                   <div className="flex items-center justify-between">
                       <Label>Line up</Label>
                       <Switch 
                         checked={planData.otherTactics?.isLineupVisible}
                         onCheckedChange={(c) => handlePlanChange(`otherTactics.isLineupVisible`, c)}
                       />
                   </div>
                   {planData.otherTactics?.isLineupVisible && renderFormationPitch(opponentPlayers)}
                   <div className="flex items-center justify-between">
                       <Label>Set plays</Label>
                       <Switch
                         checked={planData.otherTactics?.areSetPlaysVisible}
                         onCheckedChange={(c) => handlePlanChange(`otherTactics.areSetPlaysVisible`, c)}
                       />
                   </div>
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
