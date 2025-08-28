

"use client"

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Camera, Video, Plus, List, ChevronUp, ChevronDown, CheckSquare, Loader2 } from "lucide-react";
import { FootballPitchIcon } from "./icons";
import { Switch } from "./ui/switch";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { apiClient } from "@/lib/api-client";
import type { PlanTabModel } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";

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
    const [plan, setPlan] = useState<PlanTabModel>({});

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await apiClient(`/matches/${matchId}`, {
                method: 'PATCH',
                body: { plan },
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
                <TabsContent value="line-up">
                    {/* Placeholder for LineUpPlan component content */}
                    <div className="text-muted-foreground p-8 text-center">Line Up planning UI goes here.</div>
                </TabsContent>
                <TabsContent value="offense">
                    <div className="text-muted-foreground p-8 text-center">Offense planning UI goes here.</div>
                </TabsContent>
                <TabsContent value="defense">
                    <div className="text-muted-foreground p-8 text-center">Defense planning UI goes here.</div>
                </TabsContent>
                <TabsContent value="opponent">
                    <div className="space-y-4 pt-4">
                        <h3 className="font-semibold">Opponent Analysis</h3>
                        <Textarea 
                            placeholder="General review of the opponent..." 
                            rows={4} 
                            value={plan.opponent?.tacticalSummary?.summary || ''}
                            onChange={(e) => setPlan(p => ({...p, opponent: {...p.opponent, tacticalSummary: {...p.opponent?.tacticalSummary, summary: e.target.value}} }))}
                        />
                         <Select
                            value={plan.opponent?.expectedFormation?.formationName || ''}
                            onValueChange={(value) => setPlan(p => ({...p, opponent: {...p.opponent, expectedFormation: {...p.opponent?.expectedFormation, formationName: value}}}))}
                         >
                            <SelectTrigger>
                                <SelectValue placeholder="Opponent's Expected Formation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="4-4-2">4-4-2</SelectItem>
                                <SelectItem value="4-3-3">4-3-3</SelectItem>
                                <SelectItem value="3-5-2">3-5-2</SelectItem>
                                <SelectItem value="5-3-2">5-3-2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>
                <TabsContent value="other">
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
