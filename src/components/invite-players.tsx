
// src/components/invite-players.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Info, Loader2, Plus, ArrowUpDown, ListFilter, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { Invite, CreateInviteDto, TeamRef, InviteUserSearchResult } from "@/lib/models";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ApiDocumentationViewer } from "./api-documentation-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { InviteUserListItem } from "./invite-user-list-item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface InvitePlayersProps {
    matchId: string;
    homeTeam: TeamRef;
    awayTeam: TeamRef;
}

const NumberInput = ({ value, setValue }: { value: number, setValue: (value: number) => void }) => {
  return (
    <div className="relative bg-card border border-input rounded-md w-24 h-12 flex items-center justify-center">
      <span className="text-xl font-semibold">- {value}d</span>
      <div className="absolute right-2 flex flex-col items-center">
        <button onClick={() => setValue(value + 1)} className="h-5 w-5"><ChevronUp className="w-4 h-4 text-muted-foreground" /></button>
        <button onClick={() => setValue(Math.max(0, value - 1))} className="h-5 w-5"><ChevronDown className="w-4 h-4 text-muted-foreground" /></button>
      </div>
    </div>
  );
};


export function InvitePlayers({ matchId, homeTeam, awayTeam }: InvitePlayersProps) {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<InviteUserSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [invitedUsers, setInvitedUsers] = useState<Invite[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    
    // State for scheduling
    const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(false);
    const [inviteDays, setInviteDays] = useState(14);
    const [reminderDays, setReminderDays] = useState(12);

    const debouncedSearch = useDebounce(searchQuery, 300);

    const fetchInvitedUsers = useCallback(async () => {
        if (!matchId) return;
        try {
            const invites = await apiClient<Invite[]>(`/matches/${matchId}/invites`);
            setInvitedUsers(invites);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch existing invites." });
        }
    }, [matchId, toast]);

    const fetchUsers = useCallback(async (tab: string, query: string) => {
        if (!matchId) return;
        setIsLoading(true);
        setSearchResults([]);
        try {
            let url = `/matches/${matchId}/invites/search-users?`;
            const params = new URLSearchParams();

            if (query) {
                params.append('name', query);
            } else {
                 switch (tab) {
                    case 'home':
                        params.append('teamId', homeTeam.id);
                        params.append('role', 'PLAYER');
                        break;
                    case 'away':
                        params.append('teamId', awayTeam.id);
                        params.append('role', 'PLAYER');
                        break;
                    case 'referees':
                        params.append('role', 'REFEREE'); // Assuming this role exists
                        break;
                    case 'hosts':
                        params.append('role', 'HOST'); // Assuming this role exists
                        break;
                }
            }
           
            const data = await apiClient<InviteUserSearchResult[]>(url + params.toString());
            setSearchResults(data);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to search for users." });
        } finally {
            setIsLoading(false);
        }
    }, [matchId, homeTeam.id, awayTeam.id, toast]);

    useEffect(() => {
        fetchInvitedUsers();
    }, [fetchInvitedUsers]);

    useEffect(() => {
        fetchUsers(activeTab, debouncedSearch);
    }, [activeTab, debouncedSearch, fetchUsers]);

    const handleSelectUser = (userId: string) => {
        setSelectedUserIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };
    
    const handleSelectAll = (checked: boolean | string) => {
        if (checked) {
            const allIds = new Set(searchResults.map(u => u.userId));
            setSelectedUserIds(allIds);
        } else {
            setSelectedUserIds(new Set());
        }
    };
    
    const usersToDisplay = useMemo(() => {
        // This could be enhanced to merge search results with team lists etc.
        return searchResults;
    }, [searchResults]);

    const invitedUserIds = useMemo(() => new Set(invitedUsers.map(u => u.inviteeId)), [invitedUsers]);
    const newlySelectedIds = useMemo(() => {
        return new Set([...selectedUserIds].filter(id => !invitedUserIds.has(id)))
    }, [selectedUserIds, invitedUserIds]);

    const getRoleForTab = (tab: string): string => {
        switch (tab) {
            case 'home':
                return 'PLAYER_HOME';
            case 'away':
                return 'COACH_AWAY'; // Using COACH_AWAY as per enum for away team context
            case 'referees':
                return 'REFEREE';
            case 'hosts':
                return 'HOST';
            default:
                return 'PLAYER_HOME';
        }
    };

    const handleSave = async () => {
        if (newlySelectedIds.size === 0) {
            toast({ title: "No new users selected to invite." });
            return;
        }
        setIsSubmitting(true);
        
        const role = getRoleForTab(activeTab);

        try {
            const invitePromises = Array.from(newlySelectedIds).map(userId => {
                const user = searchResults.find(u => u.userId === userId);
                const payload: CreateInviteDto = {
                    inviteeId: userId,
                    type: user?.type.toLowerCase() as any || 'player', // 'player', 'referee', 'host'
                    role: role,
                    inviteDaysBefore: isSchedulingEnabled ? inviteDays : 0,
                    reminderDaysBefore: isSchedulingEnabled ? reminderDays : 0,
                };
                return apiClient(`/matches/${matchId}/invites`, { method: 'POST', body: payload });
            });
            await Promise.all(invitePromises);
            toast({ title: "Invites Sent!", description: `Successfully invited ${newlySelectedIds.size} new person(s).` });
            setSelectedUserIds(new Set());
            fetchInvitedUsers(); // Refresh invited list
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "One or more invitations failed." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                    <TabsTrigger value="home" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Home</TabsTrigger>
                    <TabsTrigger value="referees" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Referees</TabsTrigger>
                    <TabsTrigger value="away" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Away</TabsTrigger>
                    <TabsTrigger value="hosts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Hosts</TabsTrigger>
                </TabsList>
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <p><span className="text-primary font-semibold">{invitedUsers.length}</span> of {searchResults.length} Invited</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Search className="w-4 h-4" />
                            <ArrowUpDown className="w-4 h-4" />
                            <ListFilter className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search..." 
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex justify-end items-center gap-2">
                        <Label htmlFor="select-all" className="text-sm">All</Label>
                        <Checkbox id="select-all" onCheckedChange={handleSelectAll} />
                    </div>

                    <ScrollArea className="h-72">
                        <div className="space-y-1 pr-2">
                            {isLoading ? (
                                <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
                            ) : usersToDisplay.length > 0 ? (
                                usersToDisplay.map(user => (
                                    <InviteUserListItem 
                                        key={user.userId} 
                                        user={user} 
                                        isChecked={selectedUserIds.has(user.userId)}
                                        onCheckedChange={() => handleSelectUser(user.userId)}
                                        isInvited={invitedUserIds.has(user.userId)}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground p-8">No users found.</p>
                            )}
                        </div>
                    </ScrollArea>
                    
                    <div className="space-y-2">
                        <Label>Add</Label>
                        <div className="flex items-center gap-2">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Search...." />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Content for searching users to add */}
                                </SelectContent>
                            </Select>
                            <Button size="icon" variant="outline"><Plus className="w-5 h-5"/></Button>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Invite scheduling, before match start</Label>
                            <Switch checked={isSchedulingEnabled} onCheckedChange={setIsSchedulingEnabled} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Invites</p>
                                <NumberInput value={inviteDays} setValue={setInviteDays} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Reminder</p>
                                <NumberInput value={reminderDays} setValue={setReminderDays} />
                            </div>
                        </div>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={isSubmitting || newlySelectedIds.size === 0}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
                    </Button>
                </div>
            </Tabs>
            
             <Accordion type="single" collapsible className="w-full pt-4">
                <AccordionItem value="api-docs">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-400" />
                            <span className="font-semibold">Invites Tab API Documentation</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <ApiDocumentationViewer
                            title="Search Users to Invite"
                            description="A single endpoint to find users, either by team ID or by name."
                            endpoint="/matches/:matchId/invites/search-users"
                            method="GET"
                            notes="Use ?teamId={id}&role=PLAYER to get team members, or ?name={query} to search for referees/hosts."
                            response={`[
    {
        "userId": "user-id-abc",
        "name": "John Player",
        "username": "johnplayer",
        "faceImage": "https://example.com/avatar.jpg",
        "type": "PLAYER"
    }
]`}
                        />
                        <ApiDocumentationViewer
                            title="Send an Invitation"
                            description="Called when the 'Save' button is clicked for each newly selected user."
                            endpoint="/matches/:matchId/invites"
                            method="POST"
                            requestPayload={`{
  "inviteeId": "user-id-to-invite",
  "type": "player | referee | host",
  "role": "PLAYER_HOME | COACH_AWAY | REFEREE | HOST | ADMIN",
  "inviteDaysBefore": 14,
  "reminderDaysBefore": 12
}`}
                            response={`{
  "id": "new-invite-id",
  "matchId": "your-match-id",
  "inviteeId": "user-id-to-invite",
  "type": "player",
  "status": "pending"
}`}
                        />
                         <ApiDocumentationViewer
                            title="List Match Invitations"
                            description="Called when the tab loads to show who has already been invited."
                            endpoint="/matches/:matchId/invites"
                            method="GET"
                            response={`[
  {
    "id": "invite-id-1",
    "matchId": "your-match-id",
    "inviteeId": "user-id-1",
    "type": "player",
    "status": "accepted"
  }
]`}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
