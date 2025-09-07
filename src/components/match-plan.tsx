
"use client"

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Camera, Video, Loader2, ListFilter, Info } from "lucide-react";
import { Switch } from "./ui/switch";
import { apiClient } from "@/lib/api-client";
import type { MatchPlanPayload, Invite } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ApiDocumentationViewer } from "./api-documentation-viewer";
import type { Player } from "@/lib/data";

// Main Component
export function MatchPlan({ matchId }: { matchId: string }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState<Partial<MatchPlanPayload>>({});
    const [invitedPlayers, setInvitedPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchInvites = async () => {
            if (!matchId) return;
            try {
                // Using the search endpoint to get players for the home team
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

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await apiClient(`/matches/${matchId}`, {
                method: 'PATCH',
                body: plan,
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

    // Generic handler to update nested state
    const handlePlanChange = (path: string, value: any) => {
        setPlan(prev => {
            const newPlan = JSON.parse(JSON.stringify(prev || {})); // Deep copy
            const keys = path.split('.');
            let current = newPlan;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newPlan;
        });
    };

    const TacticSubTabs = ({ section, subTabs }: { section: 'offenseTactics' | 'defenseTactics' | 'opponentAnalysis', subTabs: Record<string, string> }) => {
        const sectionData = plan[section] || {};
        return (
             <Tabs defaultValue={Object.keys(subTabs)[0]} className="w-full">
                <TabsList className={`grid w-full grid-cols-${Object.keys(subTabs).length}`}>
                    {Object.entries(subTabs).map(([key, title]) => (
                        <TabsTrigger key={key} value={key}>{title}</TabsTrigger>
                    ))}
                </TabsList>
                {Object.keys(subTabs).map(tabKey => (
                    <TabsContent key={tabKey} value={tabKey} className="pt-4">
                        <Label>Tactics summary for {subTabs[tabKey]}</Label>
                        <Textarea 
                            placeholder={`Notes on ${subTabs[tabKey]}...`}
                            value={(sectionData as any)?.[tabKey]?.summary || ''}
                            onChange={(e) => handlePlanChange(`${section}.${tabKey}.summary`, e.target.value)}
                        />
                         <div className="flex items-center justify-between pt-4">
                           <Label>Show Lineup</Label>
                           <Switch
                             checked={(sectionData as any)?.[tabKey]?.isLineupVisible || false}
                             onCheckedChange={(checked) => handlePlanChange(`${section}.${tabKey}.isLineupVisible`, checked)}
                           />
                        </div>
                    </TabsContent>
                ))}
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
                        <CardHeader><CardTitle>Opponent Analysis</CardTitle></CardHeader>
                        <CardContent>
                            <TacticSubTabs section="opponentAnalysis" subTabs={{ general: 'General', offense: 'Offense', defense: 'Defense', other: 'Other' }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="line-up" className="pt-4 space-y-4">
                     <Card>
                        <CardHeader><CardTitle>Your Team Line Up</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                                <Label>Plan Name</Label>
                                <Textarea 
                                    placeholder="e.g., Plan A, Starting XI..." 
                                    value={plan.teamLineup?.planName || ''}
                                    onChange={(e) => handlePlanChange('teamLineup.planName', e.target.value)}
                                />
                           </div>
                           <div>
                                <Label>General Tactics Summary</Label>
                                <Textarea 
                                     value={plan.teamLineup?.generalTactics?.summary || ''}
                                     onChange={(e) => handlePlanChange('teamLineup.generalTactics.summary', e.target.value)}
                                />
                           </div>
                           <div>
                                <Label>Formation</Label>
                                <Select
                                    value={plan.teamLineup?.lineup?.formation}
                                    onValueChange={(value) => handlePlanChange('teamLineup.lineup.formation', value)}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select formation..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="4-3-3">4-3-3</SelectItem>
                                        <SelectItem value="4-4-2">4-4-2</SelectItem>
                                        <SelectItem value="3-5-2">3-5-2</SelectItem>
                                        <SelectItem value="5-3-2">5-3-2</SelectItem>
                                    </SelectContent>
                                </Select>
                           </div>
                           <p className="text-sm font-medium">Invited Players ({invitedPlayers.length})</p>
                           {/* Add player selection for lineup here */}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="offense" className="pt-4 space-y-4">
                     <Card>
                        <CardHeader><CardTitle>Offense Tactics</CardTitle></CardHeader>
                        <CardContent>
                            <TacticSubTabs section="offenseTactics" subTabs={{ general: 'General', buildUp: 'Build Up', attack: 'Attack', finishing: 'Finishing' }} />
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="defense" className="pt-4 space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Defense Tactics</CardTitle></CardHeader>
                        <CardContent>
                             <TacticSubTabs section="defenseTactics" subTabs={{ general: 'General', highBlock: 'High Block', midBlock: 'Mid Block', lowBlock: 'Low Block' }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="other" className="pt-4">
                    <Card>
                        <CardHeader><CardTitle>Other Tactics</CardTitle></CardHeader>
                        <CardContent>
                            <Textarea 
                                placeholder="Other tactical notes..." 
                                value={plan.otherTactics?.summary || ''}
                                onChange={(e) => handlePlanChange('otherTactics.summary', e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="pt-4">
                <Button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Plan...</> : 'Save Plan'}
                </Button>
            </div>
            
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="api-docs">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-400" />
                            <span className="font-semibold">Plan Tab API Documentation</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <ApiDocumentationViewer
                            title="Update Match Plan"
                            description="Saves all the data from the 'Plan' tab. Called when the 'Save Plan' button is clicked."
                            endpoint="/matches/:id"
                            method="PATCH"
                            requestPayload={`{
  "opponentAnalysis": { ... },
  "teamLineup": { ... },
  "offenseTactics": { ... },
  "defenseTactics": { ... },
  "otherTactics": { ... }
}`}
                            response={`// Returns the updated match object
{
  "id": "string",
  "updatedAt": "string (ISO 8601)",
  // ... all other match fields
}`}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
