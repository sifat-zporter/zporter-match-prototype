
"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronRight, Plus, ArrowUpDown, ListFilter, Info, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Sheet, SheetTrigger } from "./ui/sheet";
import { InviteFilterSheet } from "./invite-filter-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { Invite, CreateInviteDto } from "@/lib/models";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ApiDocumentationViewer } from "./api-documentation-viewer";

// Mock data for available players to invite
const availablePlayers = [
    { id: 'user123', name: "John Lundstram", handle: "#JohLun123456", location: "SE/Stockholm", team: "Hammarby IF", role: "CDM", avatar: "https://placehold.co/40x40.png" },
    { id: 'user456', name: "Devendra Banhart", handle: "#DevBan987654", location: "SE/Stockholm", team: "Maj FC", role: "CDM", avatar: "https://placehold.co/40x40.png" },
    { id: 'user789', name: "Lord Soyothu", handle: "#LorSoy123456", location: "SE/Stockholm", team: "Hammarby IF", role: "CDM", avatar: "https://placehold.co/40x40.png" },
    { id: 'user101', name: "Mark Hamill", handle: "#MarHam345678", location: "SE/Stockholm", team: "Wework AB", role: "Agent", avatar: "https://placehold.co/40x40.png" },
    { id: 'user112', name: "John Lundstram", handle: "#JohLun432567", location: "SE/Stockholm", team: "Hammarby IF", role: "Coach", avatar: "https://placehold.co/40x40.png" },
];

interface InvitePlayersProps {
    matchId: string;
}

export function InvitePlayers({ matchId }: InvitePlayersProps) {
    const { toast } = useToast();
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state for invite settings
    const [inviteDaysBefore, setInviteDaysBefore] = useState(7);
    const [reminderDaysBefore, setReminderDaysBefore] = useState(1);

    useEffect(() => {
        const fetchInvites = async () => {
            if (!matchId) return;
            try {
                setIsLoading(true);
                const fetchedInvites = await apiClient<Invite[]>(`/api/matches/${matchId}/invites`);
                setInvites(fetchedInvites);
                // Pre-select players who have already been invited
                setSelectedPlayerIds(fetchedInvites.map(i => i.inviteeId));
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error fetching invites",
                    description: "Could not load existing invites for this match.",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvites();
    }, [matchId, toast]);


    const handlePlayerSelect = (playerId: string) => {
        setSelectedPlayerIds(prev =>
            prev.includes(playerId) ? prev.filter(p => p !== playerId) : [...prev, playerId]
        );
    }

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        setSelectedPlayerIds(checked ? availablePlayers.map(p => p.id) : []);
    }

    const handleSaveInvites = async () => {
        setIsSubmitting(true);

        const playersToInvite = availablePlayers.filter(p => 
            selectedPlayerIds.includes(p.id) && !invites.some(i => i.inviteeId === p.id)
        );

        if (playersToInvite.length === 0) {
            toast({ title: "No new invites to send." });
            setIsSubmitting(false);
            return;
        }

        try {
            const invitePromises = playersToInvite.map(player => {
                const payload: CreateInviteDto = {
                    inviteeId: player.id,
                    role: 'PLAYER_HOME', // This should be dynamic in a real app
                    inviteDaysBefore,
                    reminderDaysBefore,
                };
                return apiClient(`/api/matches/${matchId}/invites`, {
                    method: 'POST',
                    body: payload,
                });
            });

            const results = await Promise.all(invitePromises);
            
            // Add new invites to the state
            setInvites(prev => [...prev, ...results]);
            
            toast({
                title: "Invites Sent!",
                description: `Successfully sent ${results.length} new invitations.`,
            });

        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error Sending Invites",
                description: "One or more invitations could not be sent.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const allSelected = selectedPlayerIds.length === availablePlayers.length;
    const isIndeterminate = selectedPlayerIds.length > 0 && !allSelected;
    const totalPlayers = 18; // As per design

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
    }

    return (
        <Sheet>
            <div className="space-y-4">
                <Tabs defaultValue="home">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                        <TabsTrigger value="home" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Home</TabsTrigger>
                        <TabsTrigger value="referees" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Referees</TabsTrigger>
                        <TabsTrigger value="away" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Away</TabsTrigger>
                        <TabsTrigger value="hosts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Hosts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="home" className="pt-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium"><span className="text-primary">{invites.length} of {totalPlayers}</span> Invited</p>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon"><Search className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon"><ArrowUpDown className="w-4 h-4" /></Button>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon"><ListFilter className="w-4 h-4" /></Button>
                                </SheetTrigger>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-9" />
                        </div>

                        <div className="flex items-center justify-end py-2 gap-2">
                            <label htmlFor="select-all" className="text-sm font-medium">All</label>
                            <Checkbox id="select-all"
                                checked={allSelected || isIndeterminate}
                                onCheckedChange={handleSelectAll}
                            />
                        </div>

                        <div className="space-y-2">
                            {availablePlayers.map(player => {
                                const isInvited = invites.some(i => i.inviteeId === player.id);
                                return (
                                <div key={player.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                                    <div className="flex items-center gap-3">
                                        <Image src={player.avatar} alt={player.name} width={40} height={40} className="rounded-full" data-ai-hint="player avatar" />
                                        <div className="grid grid-cols-2 items-center text-xs gap-x-2">
                                            <p className="font-semibold col-span-2 text-sm">{player.name}</p>
                                            <p className="text-muted-foreground">{player.handle}</p>
                                            <p className="text-foreground">{player.role}</p>
                                            <p className="text-muted-foreground">{player.location}</p>
                                            <p className="text-foreground">{player.team}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id={`player-${player.id}`}
                                            checked={selectedPlayerIds.includes(player.id)}
                                            onCheckedChange={() => handlePlayerSelect(player.id)}
                                            disabled={isInvited}
                                        />
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </div>
                            )})}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                             <div>
                                <label className="text-sm font-medium">Add</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Search...." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* In a real app, this would be a user search component */}
                                        </SelectContent>
                                    </Select>
                                    <Button size="icon" variant="outline"><Plus className="w-4 h-4" /></Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Invite scheduling, before match start</label>
                                <Switch defaultChecked/>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-muted-foreground">Invites</label>
                                    <Select value={String(inviteDaysBefore)} onValueChange={(v) => setInviteDaysBefore(Number(v))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="14">- 14d</SelectItem>
                                            <SelectItem value="7">- 7d</SelectItem>
                                            <SelectItem value="3">- 3d</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">Reminder</label>
                                    <Select value={String(reminderDaysBefore)} onValueChange={(v) => setReminderDaysBefore(Number(v))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">- 3d</SelectItem>
                                            <SelectItem value="2">- 2d</SelectItem>
                                            <SelectItem value="1">- 1d</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSaveInvites} disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Invites'}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
                <Separator className="my-8" />
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="api-docs">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-400" />
                                <span className="font-semibold">Invites Tab API Documentation</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <ApiDocumentationViewer
                                title="Get All Match Invitations"
                                description="Called when the Invites tab loads to fetch all existing invites for the current match."
                                endpoint="/api/matches/:matchId/invites"
                                method="GET"
                                response={`[
  {
    "id": "string",
    "matchId": "string",
    "inviteeId": "string",
    "inviterId": "string",
    "role": "string",
    "status": "string",
    "inviteDaysBefore": "number",
    "reminderDaysBefore": "number",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)",
    "matchDetails": {
      "id": "string",
      "name": "string",
      "startDate": "string (ISO 8601)",
      "homeTeam": { "id": "string", "name": "string" },
      "awayTeam": { "id": "string", "name": "string" },
      "competition": { "id": "string", "name": "string" }
    }
  }
]`}
                            />
                            <ApiDocumentationViewer
                                title="Send New Invitation"
                                description="Called by the 'Save Invites' button for each newly selected player."
                                endpoint="/api/matches/:matchId/invites"
                                method="POST"
                                requestPayload={`{
  "inviteeId": "string (required)",
  "role": "PLAYER_HOME | COACH_AWAY | ... (required)",
  "inviteDaysBefore": "number (required)",
  "reminderDaysBefore": "number (required)"
}`}
                                response={`{
  "id": "string",
  "matchId": "string",
  "inviteeId": "string",
  "inviterId": "string",
  "role": "string",
  "status": "PENDING",
  "inviteDaysBefore": "number",
  "reminderDaysBefore": "number",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "matchDetails": { /* ... */ }
}`}
                            />
                             <ApiDocumentationViewer
                                title="Update Invitation Status"
                                description="Used to change an invitation's status (e.g., PENDING to ACCEPTED)."
                                endpoint="/api/matches/:matchId/invites/:inviteId/status"
                                method="PATCH"
                                requestPayload={`{
  "status": "ACCEPTED | DECLINED | ... (required)"
}`}
                                response="200 OK (No body)"
                            />
                             <ApiDocumentationViewer
                                title="Delete/Retract Invitation"
                                description="Used to remove an invitation."
                                endpoint="/api/matches/:matchId/invites/:inviteId"
                                method="DELETE"
                                response="200 OK (No body)"
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <InviteFilterSheet />
        </Sheet>
    );
}
