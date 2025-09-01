

"use client"

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Loader2 } from "lucide-react";
import { FootballPitchIcon } from "./icons";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { apiClient } from "@/lib/api-client";
import type { MatchPlanDto } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

// Mock data, in a real app this would come from an API
const invitedPlayers = [
    { id: 'player-1', name: 'Ronaldinho', number: 15, rating: 173, avatar: 'https://placehold.co/40x40.png' },
    { id: 'player-2', name: 'Iniesta', number: 9, rating: 173, avatar: 'https://placehold.co/40x40.png' },
    { id: 'player-3', name: 'Messi', number: 10, rating: 180, avatar: 'https://placehold.co/40x40.png' },
    { id: 'player-4', name: 'Xavi', number: 6, rating: 175, avatar: 'https://placehold.co/40x40.png' },
    { id: 'player-5', name: 'Sterling', number: 27, rating: 173, avatar: 'https://placehold.co/40x40.png' },
];

const PlayerPlaceholder = () => (
    <div className="w-12 h-14 bg-card/50 border border-dashed border-muted-foreground rounded-md flex items-center justify-center">
        <Plus className="w-5 h-5 text-muted-foreground" />
    </div>
);

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

// Main Component
export function MatchPlan({ matchId }: { matchId: string }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    // In a real app, this state would be initialized by fetching the existing plan for the matchId
    const [plan, setPlan] = useState<MatchPlanDto>({});

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // The new DTO for the PATCH request is now MatchPlanDto
            await apiClient(`/matches/${matchId}`, {
                method: 'PATCH',
                body: { tacticsNotes: plan },
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
            const newPlan = { ...p };
            if (subField) {
                // @ts-ignore
                if (!newPlan[section]) newPlan[section] = {};
                // @ts-ignore
                if (!newPlan[section][field]) newPlan[section][field] = {};
                // @ts-ignore
                newPlan[section][field][subField] = value;
            } else {
                 // @ts-ignore
                if (!newPlan[section]) newPlan[section] = {};
                 // @ts-ignore
                newPlan[section][field] = value;
            }
            return newPlan;
        });
    }

    const TacticSection = ({ title, section, fields }: { title: string, section: 'offense' | 'defense', fields: string[] }) => (
        <Card>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {fields.map(field => (
                    <div key={field} className="space-y-2">
                        <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
                        <Textarea 
                            placeholder={`Notes on ${field.toLowerCase()}...`}
                            // @ts-ignore
                            value={plan[section]?.[field] || ''}
                            onChange={(e) => handleTacticChange(section, field, e.target.value)}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );

     const SetPiecesSection = ({ title, section }: { title: string, section: 'offense' | 'defense' }) => {
        const setPieceFields = ["penalties", "corners", "freeKicks", "throwIns", "goalKicks", "other"];
        return (
            <Card>
                <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     {setPieceFields.map(field => (
                        <div key={field} className="space-y-2">
                            <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
                            <Textarea 
                                placeholder={`Notes on ${field.toLowerCase()}...`}
                                // @ts-ignore
                                value={plan[section]?.setPieces?.[field] || ''}
                                onChange={(e) => handleTacticChange(section, 'setPieces', e.target.value, field)}
                             />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
     };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="line-up">
                <TabsList className="grid w-full grid-cols-5 bg-transparent p-0">
                    <TabsTrigger value="opponent" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Opponent</TabsTrigger>
                    <TabsTrigger value="line-up" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Line Up</TabsTrigger>
                    <TabsTrigger value="offense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Offense</TabsTrigger>
                    <TabsTrigger value="defense" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Defense</TabsTrigger>
                    <TabsTrigger value="other" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Other</TabsTrigger>
                </TabsList>
                
                <TabsContent value="opponent" className="pt-4 space-y-4">
                    <h3 className="font-semibold">Opponent Analysis</h3>
                    <Textarea 
                        placeholder="General review of the opponent..." 
                        rows={4} 
                        value={plan.opponentTactics || ''}
                        onChange={(e) => setPlan(p => ({...p, opponentTactics: e.target.value}))}
                    />
                </TabsContent>

                <TabsContent value="line-up" className="pt-4 space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Starting Lineup & Formation</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex justify-center items-center">
                                <FootballPitchIcon className="w-full h-auto text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Invited Players</CardTitle></CardHeader>
                        <CardContent>
                            <ScrollArea>
                                <div className="flex space-x-4 pb-4">
                                    {invitedPlayers.map(p => <PlayerOnPitch key={p.id} player={p} />)}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="offense" className="pt-4 space-y-4">
                    <TacticSection title="General Offense" section="offense" fields={["general", "buildUp", "attack", "finishing", "turnovers"]} />
                    <SetPiecesSection title="Offensive Set Pieces" section="offense" />
                </TabsContent>
                
                <TabsContent value="defense" className="pt-4 space-y-4">
                    <TacticSection title="General Defense" section="defense" fields={["general", "highBlock", "midBlock", "lowBlock", "turnovers"]} />
                    <SetPiecesSection title="Defensive Set Pieces" section="defense" />
                </TabsContent>

                <TabsContent value="other" className="pt-4">
                     <div className="text-muted-foreground p-8 text-center">Other planning UI goes here.</div>
                </TabsContent>
            </Tabs>

            <div className="pt-4">
                <Button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Plan'}
                </Button>
            </div>
        </div>
    );
}
