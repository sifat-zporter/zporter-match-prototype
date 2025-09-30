// src/components/invite-players.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Info, Loader2, Plus, ArrowUpDown, ListFilter, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { Invite, CreateInviteDto, TeamRef, InviteUserSearchResult, InvitationRole, MatchEntity, UserDto } from "@/lib/models";
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
import { startCase } from 'lodash';
import { AwayTeamInvites } from "./away-team-invites";

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
    const [activeTab, setActiveTab] = useState('Home');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<InviteUserSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // This state now holds the IDs of users already invited for ALL groups
    const [invitedUserIds, setInvitedUserIds] = useState<Set<string>>(new Set());
    
    // This holds the currently selected user IDs for the active tab
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    
    // State for scheduling
    const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(false);
    const [inviteDays, setInviteDays] = useState(14);
    const [reminderDays, setReminderDays] = useState(12);

    const debouncedSearch = useDebounce(searchQuery, 300);
    
    // Fetches the entire match object to get the current invite structure
    const fetchInvitedUsers = useCallback(async () => {
        if (!matchId || activeTab === 'Away') return; // Away tab has its own data fetching
        try {
            const matchData = await apiClient<MatchEntity>(`/matches/${matchId}`);
            const allInvitedIds = new Set(matchData.invitedUserIds || []);
            setInvitedUserIds(allInvitedIds);

            // Pre-select users for the current tab
            const groupInvites = matchData.userGeneratedData?.invites?.[activeTab];
            if (groupInvites && groupInvites.usersInvited) {
                setSelectedUserIds(new Set(groupInvites.usersInvited));
                 if (groupInvites.inviteDaysBefore > 0 || groupInvites.reminderDaysBefore > 0) {
                    setIsSchedulingEnabled(true);
                    setInviteDays(groupInvites.inviteDaysBefore);
                    setReminderDays(groupInvites.reminderDaysBefore);
                } else {
                    setIsSchedulingEnabled(false);
                }
            } else {
                 setSelectedUserIds(new Set());
                 setIsSchedulingEnabled(false);
            }

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch existing invites." });
        }
    }, [matchId, toast, activeTab]);


    const fetchUsers = useCallback(async (tab: string, query: string) => {
        if (!matchId || tab === 'Away') return;
        setIsLoading(true);
        setSearchResults([]);
        
        try {
            const params: Record<string, string> = {};
            
            // Player Search Logic
            if (tab === 'Home' || tab === 'Away') {
                params.role = 'PLAYER';
                const teamId = tab === 'Home' ? homeTeam.id : awayTeam.id;
                if (!teamId) {
                    toast({ variant: "destructive", title: "Missing Team ID", description: `Cannot search for players without a team ID for ${tab}.` });
                    setIsLoading(false);
                    return;
                }
                params.teamId = teamId;
                if (query) {
                    params.name = query;
                }
            // Global User Search Logic
            } else if (query) {
                 params.name = query;
            } else {
                // Don't search if there's no query for non-player tabs
                setIsLoading(false);
                return;
            }
           
            const data = await apiClient<UserDto[]>(`/matches/${matchId}/invites/search-potential-invitees`, { params });
            
            // Transform the detailed UserDto to the simpler InviteUserSearchResult
            const transformedResults = data.map(user => ({
                userId: user.userId,
                name: user.fullName,
                username: user.username,
                faceImage: user.faceImage,
                type: user.type,
            }));

            const uniqueUsers = transformedResults.filter((user, index, self) =>
                index === self.findIndex((u) => u.userId === user.userId)
            );
            
            setSearchResults(uniqueUsers);
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
    
    const handleSave = async () => {
        setIsSubmitting(true);
        
        const payload = {
            invites: {
                [activeTab]: {
                    usersInvited: Array.from(selectedUserIds),
                    inviteDaysBefore: isSchedulingEnabled ? inviteDays : 0,
                    reminderDaysBefore: isSchedulingEnabled ? reminderDays : 0,
                }
            }
        };

        try {
            await apiClient(`/matches/${matchId}/invites`, { 
                method: 'PATCH', 
                body: payload 
            });
            toast({ title: "Invites Updated!", description: `Successfully updated invites for the ${activeTab} group.` });
            fetchInvitedUsers(); // Refresh invited list
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update invitations." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderUserInviteTab = () => (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center text-sm">
                <p><span className="text-primary font-semibold">{selectedUserIds.size}</span> Selected</p>
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
                    ) : searchResults.length > 0 ? (
                        searchResults.map(user => (
                            <InviteUserListItem 
                                key={user.userId} 
                                user={user} 
                                isChecked={selectedUserIds.has(user.userId)}
                                onCheckedChange={() => handleSelectUser(user.userId)}
                                isInvited={false} // We are now managing selection per tab, not global invites
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
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
        </div>
    );

    return (
        <div className="space-y-4">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                    <TabsTrigger value="Home" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Home</TabsTrigger>
                    <TabsTrigger value="Referees" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Referees</TabsTrigger>
                    <TabsTrigger value="Away" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Away</TabsTrigger>
                    <TabsTrigger value="Hosts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Hosts</TabsTrigger>
                </TabsList>

                {activeTab === 'Away' ? (
                    <AwayTeamInvites matchId={matchId} awayTeamId={awayTeam.id} />
                ) : (
                    renderUserInviteTab()
                )}

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
                            title="1. Add or Update Invites"
                            description="Atomically adds or updates invitations. For standard roles, it sets the user list. For the 'Away' role, it manages an array of team invitations. This endpoint does not remove invites."
                            endpoint="/matches/:matchId/invites"
                            method="PATCH"
                            requestPayload={`{
  "invites": {
    "Away": [
      {
        "teamId": "team-opponent-alpha-123",
        "coachId": "user-coach-of-alpha-456",
        "status": "PRIMARY_PENDING"
      }
    ],
    "Referees": {
      "usersInvited": ["user-referee-1", "user-referee-2"],
      "inviteDaysBefore": 7,
      "reminderDaysBefore": 2
    }
  }
}`}
                            response={`{
  "success": true,
  "updatedMatchId": "match-123"
}`}
                        />
                         <ApiDocumentationViewer
                            title="2. Remove Invites"
                            description="Atomically removes specified invitees from a match. For standard roles, provide user IDs. For the 'Away' role, provide team IDs."
                            endpoint="/matches/:matchId/invites"
                            method="DELETE"
                            requestPayload={`{
  "invites": {
    "Away": [ { "teamId": "team-opponent-alpha-123" } ],
    "Referees": { "usersInvited": ["user-referee-1"] }
  }
}`}
                            response={`{
  "success": true,
  "updatedMatchId": "match-123"
}`}
                        />
                        <ApiDocumentationViewer
                            title="3. Search for Potential Invitees"
                            description="Utility to find users or teams to invite."
                            endpoint="/matches/{matchId}/invites/search-potential-invitees"
                            method="GET"
                            notes="Search Logic: To find TEAMS, use ?searchType=team&name={query}. To find PLAYERS for a team, use ?role=PLAYER&teamId={id}. To find other USERS, use ?name={query}."
                            response={`// Example for ?searchType=team&name=Tigers
[
  {
    "teamId": "team-tigers-789",
    "name": "Tigers FC",
    "logoUrl": "https://example.com/logos/tigers.png",
    "coachId": "user-coach-jane-doe"
  }
]

// Example for ?name=andrei (user search)
[
  {
    "id": "54f2d8bf-fae2-4d48-ad06-40db0f7bf804",
    "fullName": "Andrei Teodorescu",
    "avatar": "https://lh3.googleusercontent.com/..."
  }
]`}
                        />
                         <ApiDocumentationViewer
                            title="4. Confirm Official Opponent"
                            description="When an opponent's invitation is accepted, this endpoint is called first to lock them in as the official away team on the main match object."
                            endpoint="/matches/{id}"
                            method="PATCH"
                            requestPayload={`{
  "awayTeamId": "team-tigers-789"
}`}
                            response={`{
  "id": "match-12345",
  "updatedAt": "2025-09-08T12:30:00.000Z",
  "awayTeam": {
    "id": "team-tigers-789",
    "name": "Tigers FC"
  }
}`}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
