// src/components/invite-players.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Info, Loader2, Plus, ArrowUpDown, ListFilter, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { Invite, CreateInviteDto, TeamRef, InviteUserSearchResult, InvitationRole, MatchEntity, UserDto, AwayInvitation, TeamSearchResult, InvitationStatus } from "@/lib/models";
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
    
    // Holds the selected user IDs for each tab
    const [selectionsByTab, setSelectionsByTab] = useState<Record<string, Set<string>>>({});
    const [awayTeamInvites, setAwayTeamInvites] = useState<AwayInvitation[]>([]);

    // Holds scheduling info for each tab
    const [schedulingByTab, setSchedulingByTab] = useState<Record<string, { isEnabled: boolean; inviteDays: number; reminderDays: number; }>>({});
    
    const debouncedSearch = useDebounce(searchQuery, 300);
    
    const fetchInvitedUsers = useCallback(async () => {
        if (!matchId) return;
        try {
            const matchData = await apiClient<MatchEntity>(`/matches/${matchId}`);
            
            const newSelections: Record<string, Set<string>> = {};
            const newScheduling: Record<string, any> = {};

            const inviteGroups = matchData.userGeneratedData?.invites || {};
            
            ['Home', 'Referees', 'Hosts'].forEach(groupName => {
                const groupData = inviteGroups[groupName];
                if (groupData && Array.isArray(groupData.usersInvited)) {
                    newSelections[groupName] = new Set(groupData.usersInvited);
                }
                newScheduling[groupName] = {
                    isEnabled: (groupData?.inviteDaysBefore ?? 0) > 0 || (groupData?.reminderDaysBefore ?? 0) > 0,
                    inviteDays: groupData?.inviteDaysBefore ?? 14,
                    reminderDays: groupData?.reminderDaysBefore ?? 12,
                };
            });
            
            const awayInvitesData = inviteGroups['Away'] || [];
            // Here we would need to fetch team details for each away invite for the UI. For simplicity, we'll mock it if not present.
             const enrichedAwayInvites = await Promise.all(awayInvitesData.map(async (invite: any) => {
                 if(invite.teamDetails) return invite;
                 try {
                     // This is a hypothetical endpoint, assuming we can get team details by ID
                     const teamDetails = await apiClient<TeamSearchResult>(`/matches/search/teams?teamId=${invite.teamId}`);
                     return {...invite, teamDetails: { name: teamDetails.teamName, logoUrl: teamDetails.logo }};
                 } catch {
                     return {...invite, teamDetails: { name: `Team ${invite.teamId.substring(0,4)}`, logoUrl: 'https://placehold.co/64x64.png' }};
                 }
            }));


            setSelectionsByTab(newSelections);
            setSchedulingByTab(newScheduling);
            setAwayTeamInvites(enrichedAwayInvites);

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch existing invites." });
        }
    }, [matchId, toast]);


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
        setSelectionsByTab(prev => {
            const currentTabSelections = new Set(prev[activeTab] || []);
            if (currentTabSelections.has(userId)) {
                currentTabSelections.delete(userId);
            } else {
                currentTabSelections.add(userId);
            }
            return { ...prev, [activeTab]: currentTabSelections };
        });
    };
    
    const handleSelectAll = (checked: boolean | string) => {
        const allResultIds = new Set(searchResults.map(u => u.userId));
        setSelectionsByTab(prev => ({
            ...prev,
            [activeTab]: checked ? allResultIds : new Set()
        }));
    };

    const handleSchedulingChange = <K extends keyof (typeof schedulingByTab)[string]>(key: K, value: (typeof schedulingByTab)[string][K]) => {
        setSchedulingByTab(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab] || { isEnabled: false, inviteDays: 14, reminderDays: 12 },
                [key]: value,
            },
        }));
    };

    const handleAddAwayTeam = (team: TeamSearchResult) => {
        if (awayTeamInvites.some(t => t.teamId === team.teamId)) {
            toast({ variant: "default", title: "Team already invited." });
            return;
        }
        const newInvitation: AwayInvitation = {
            teamId: team.teamId,
            coachId: team.coachId,
            status: 'BACKUP_PENDING',
            teamDetails: { name: team.teamName, logoUrl: team.logo }
        };
        setAwayTeamInvites(prev => [...prev, newInvitation]);
    };

    const handleRemoveAwayTeam = (teamId: string) => {
        setAwayTeamInvites(prev => prev.filter(t => t.teamId !== teamId));
    };

    const handleAwayTeamStatusChange = (teamId: string, newStatus: InvitationStatus) => {
        setAwayTeamInvites(prev => {
            // If setting a team to primary, ensure no other team is primary
            if (newStatus === 'PRIMARY_PENDING' || newStatus === 'ACCEPTED') {
                return prev.map(t => ({
                    ...t,
                    status: t.teamId === teamId ? newStatus : (t.status === 'PRIMARY_PENDING' || t.status === 'ACCEPTED' ? 'BACKUP_PENDING' : t.status)
                }));
            }
            return prev.map(t => t.teamId === teamId ? { ...t, status: newStatus } : t);
        });
    };
    
    const handleSave = async () => {
        setIsSubmitting(true);
        
        const payload: { invites: Record<string, any> } = { invites: {} };

        // Prepare payload for user-based invites
        for (const tabName of ['Home', 'Referees', 'Hosts']) {
            const selections = selectionsByTab[tabName];
            const scheduling = schedulingByTab[tabName];
            if (selections || scheduling) {
                payload.invites[tabName] = {
                    usersInvited: selections ? Array.from(selections) : [],
                    inviteDaysBefore: scheduling?.isEnabled ? scheduling.inviteDays : 0,
                    reminderDaysBefore: scheduling?.isEnabled ? scheduling.reminderDays : 0,
                };
            }
        }
        
        // Prepare payload for away team invites
        if (awayTeamInvites.length > 0) {
            payload.invites['Away'] = awayTeamInvites.map(({ teamDetails, ...rest }) => rest);
        }
        
        try {
            await apiClient(`/matches/${matchId}/invites`, { 
                method: 'PATCH', 
                body: payload 
            });
            toast({ title: "Invites Updated!", description: `Successfully updated all invitations.` });
            fetchInvitedUsers(); // Refresh overall invited list and selections
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update invitations." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const currentTabSelections = selectionsByTab[activeTab] || new Set();
    const currentTabScheduling = schedulingByTab[activeTab] || { isEnabled: false, inviteDays: 14, reminderDays: 12 };
    
    const allInvitedUserIds = useMemo(() => {
        return Object.values(selectionsByTab).reduce((acc, currentSet) => {
            currentSet.forEach(id => acc.add(id));
            return acc;
        }, new Set<string>());
    }, [selectionsByTab]);

    const renderUserInviteTab = () => (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center text-sm">
                <p><span className="text-primary font-semibold">{currentTabSelections.size}</span> Selected</p>
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
                                isChecked={currentTabSelections.has(user.userId)}
                                onCheckedChange={() => handleSelectUser(user.userId)}
                                isInvited={allInvitedUserIds.has(user.userId) && !currentTabSelections.has(user.userId)}
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
                    <Switch checked={currentTabScheduling.isEnabled} onCheckedChange={(checked) => handleSchedulingChange('isEnabled', checked)} />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Invites</p>
                        <NumberInput value={currentTabScheduling.inviteDays} setValue={(value) => handleSchedulingChange('inviteDays', value)} />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Reminder</p>
                        <NumberInput value={currentTabScheduling.reminderDays} setValue={(value) => handleSchedulingChange('reminderDays', value)} />
                    </div>
                </div>
            </div>
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

                <TabsContent value="Home">{renderUserInviteTab()}</TabsContent>
                <TabsContent value="Referees">{renderUserInviteTab()}</TabsContent>
                <TabsContent value="Hosts">{renderUserInviteTab()}</TabsContent>
                <TabsContent value="Away">
                    <AwayTeamInvites 
                        matchId={matchId} 
                        invitedTeams={awayTeamInvites}
                        onAddTeam={handleAddAwayTeam}
                        onRemoveTeam={handleRemoveAwayTeam}
                        onStatusChange={handleAwayTeamStatusChange}
                    />
                </TabsContent>
            </Tabs>
            
             <div className="px-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Save All Invites"}
                </Button>
            </div>

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
    "name": "Super Team",
    "logoUrl": "url-to-logo",
    "coachId": "user-coach-789"
  }
]

// Example for ?name=andrei (user search)
[
  {
    "id": "user-123",
    "fullName": "John Doe",
    "avatar": "url-to-avatar"
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
