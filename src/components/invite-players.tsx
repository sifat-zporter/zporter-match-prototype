// src/components/invite-players.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Info, Loader2, Plus, ArrowUpDown, ListFilter, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { Invite, CreateInviteDto, TeamRef, InviteUserSearchResult, InvitationRole, MatchEntity } from "@/lib/models";
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
        if (!matchId) return;
        try {
            const matchData = await apiClient<MatchEntity>(`/matches/${matchId}`);
            const allInvitedIds = new Set(matchData.invitedUserIds || []);
            setInvitedUserIds(allInvitedIds);

            // Pre-select users for the current tab
            const groupInvites = matchData.userGeneratedData?.invites?.[activeTab];
            if (groupInvites && groupInvites.usersInvited) {
                setSelectedUserIds(new Set(groupInvites.usersInvited));
            } else {
                 setSelectedUserIds(new Set());
            }

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch existing invites." });
        }
    }, [matchId, toast, activeTab]);


    const fetchUsers = useCallback(async (tab: string, query: string) => {
        if (!matchId) return;
        setIsLoading(true);
        setSearchResults([]);
        
        try {
            const params = new URLSearchParams();
            const roleMap: { [key: string]: string } = {
                'Home': 'PLAYER',
                'Away': 'PLAYER',
                'Referees': 'REFEREE',
                'Hosts': 'HOST'
            };

            if (query) {
                params.append('name', query);
            } else if (roleMap[tab]) {
                params.append('role', roleMap[tab]);
                if (tab === 'Home') params.append('teamId', homeTeam.id);
                if (tab === 'Away') params.append('teamId', awayTeam.id);
            }
           
            const data = await apiClient<InviteUserSearchResult[]>(`/matches/${matchId}/invites/search-users?${params.toString()}`);
            
            const uniqueUsers = data.filter((user, index, self) =>
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
            [activeTab]: {
                usersInvited: Array.from(selectedUserIds),
                inviteDaysBefore: isSchedulingEnabled ? inviteDays : 0,
                reminderDaysBefore: isSchedulingEnabled ? reminderDays : 0,
            }
        };

        try {
            const response = await apiClient(`/matches/${matchId}/invites`, { 
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

    return (
        <div className="space-y-4">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                    <TabsTrigger value="Home" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Home</TabsTrigger>
                    <TabsTrigger value="Referees" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Referees</TabsTrigger>
                    <TabsTrigger value="Away" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Away</TabsTrigger>
                    <TabsTrigger value="Hosts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Hosts</TabsTrigger>
                </TabsList>
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
                            title="1. Bulk Update Match Invites"
                            description="Updates invitation settings for multiple groups (Home, Away, Referees, etc.) in a single call. This replaces all previous invites for the specified groups."
                            endpoint="/matches/:matchId/invites"
                            method="PATCH"
                            requestPayload={`{
  "Home": {
    "usersInvited": [ "user_id_1", "user_id_2" ],
    "inviteDaysBefore": 3,
    "reminderDaysBefore": 1
  },
  "Referees": {
    "usersInvited": [ "referee_id_1" ],
    "inviteDaysBefore": 5,
    "reminderDaysBefore": 2
  }
}`}
                            response={`{
  "message": "Successfully updated invites for 3 users.",
  "updatedUserIds": [ "user_id_1", "user_id_2", "referee_id_1" ]
}`}
                        />
                        <ApiDocumentationViewer
                            title="2. Search for Users to Invite"
                            description="Searches for users to add to an invite list. Can filter by team, role, or name."
                            endpoint="/matches/:matchId/invites/search-users"
                            method="GET"
                            notes="Example: /matches/your-match-id/invites/search-users?teamId=your-team-id&role=PLAYER"
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
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
