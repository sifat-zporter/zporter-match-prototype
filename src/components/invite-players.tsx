
"use client"

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Info, Loader2, X, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { UserSearchResult, Invite, CreateInviteDto, TeamRef } from "@/lib/models";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ApiDocumentationViewer } from "./api-documentation-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

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

const UserCard = ({ user, onSelect, isSelected, isInvited }: { user: UserSearchResult, onSelect: (user: UserSearchResult) => void, isSelected: boolean, isInvited: boolean }) => (
    <Card className={`p-2 ${isSelected ? 'ring-2 ring-primary' : ''} ${isInvited ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Image src={user.avatar || 'https://placehold.co/40x40.png'} alt={user.name} width={32} height={32} className="rounded-full" />
                <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Button
                size="icon"
                variant="ghost"
                onClick={() => onSelect(user)}
                disabled={isInvited}
            >
                {isInvited ? <span className="text-xs">Invited</span> : <PlusCircle className={`w-5 h-5 ${isSelected ? 'text-destructive' : 'text-primary'}`} />}
            </Button>
        </div>
    </Card>
);

export function InvitePlayers({ matchId, homeTeam, awayTeam }: InvitePlayersProps) {
    const { toast } = useToast();
    const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // States for different user types
    const [homePlayers, setHomePlayers] = useState<UserSearchResult[]>([]);
    const [awayPlayers, setAwayPlayers] = useState<UserSearchResult[]>([]);
    const [refereeSearch, setRefereeSearch] = useState("");
    const [refereeResults, setRefereeResults] = useState<UserSearchResult[]>([]);
    const [isSearchingReferees, setIsSearchingReferees] = useState(false);

    const debouncedRefereeSearch = useDebounce(refereeSearch, 300);

    const fetchInvites = useCallback(async () => {
        if (!matchId) return;
        try {
            setIsLoading(true);
            const [fetchedInvites, fetchedHomePlayers, fetchedAwayPlayers] = await Promise.all([
                apiClient<Invite[]>(`/invites/match/${matchId}`),
                apiClient<UserSearchResult[]>(`/users?teamId=${homeTeam.id}`),
                apiClient<UserSearchResult[]>(`/users?teamId=${awayTeam.id}`)
            ]);
            setInvites(fetchedInvites);
            setHomePlayers(fetchedHomePlayers);
            setAwayPlayers(fetchedAwayPlayers);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error fetching data",
                description: "Could not load existing invites or player lists.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [matchId, homeTeam.id, awayTeam.id, toast]);

    useEffect(() => {
        fetchInvites();
    }, [fetchInvites]);

    const handleSearchReferees = useCallback(async (query: string) => {
        if (query.length < 2) {
            setRefereeResults([]);
            return;
        }
        setIsSearchingReferees(true);
        try {
            const results = await apiClient<UserSearchResult[]>(`/users?name=${query}`);
            setRefereeResults(results);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Search Failed",
                description: "Could not fetch users.",
            });
        } finally {
            setIsSearchingReferees(false);
        }
    }, [toast]);
    
    useEffect(() => {
        handleSearchReferees(debouncedRefereeSearch);
    }, [debouncedRefereeSearch, handleSearchReferees]);

    const handleToggleUserSelection = (user: UserSearchResult) => {
        setSelectedUsers(prev => {
            if (prev.find(u => u.id === user.id)) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };

    const handleSendInvites = async () => {
        if (selectedUsers.length === 0) {
            toast({ title: "No new players selected to invite." });
            return;
        }
        setIsSubmitting(true);
        try {
            const invitePromises = selectedUsers.map(user => {
                const payload: CreateInviteDto = {
                    matchId: matchId,
                    inviteeId: user.id,
                    type: "player", // This should be dynamic based on tab
                };
                return apiClient('/invites', { method: 'POST', body: payload });
            });
            await Promise.all(invitePromises);
            toast({
                title: "Invites Sent!",
                description: `Successfully invited ${selectedUsers.length} new person(s).`,
            });
            setSelectedUsers([]);
            fetchInvites();
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
    
    const invitedUserIds = new Set(invites.map(i => i.inviteeId));
    const selectedUserIds = new Set(selectedUsers.map(u => u.id));

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
    }

    return (
        <div className="space-y-4">
            <Tabs defaultValue="players" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="players">Players</TabsTrigger>
                    <TabsTrigger value="referees">Referees</TabsTrigger>
                    <TabsTrigger value="hosts">Hosts</TabsTrigger>
                </TabsList>
                <TabsContent value="players" className="pt-4 space-y-4">
                    <h3 className="font-semibold">{homeTeam.name}</h3>
                    <ScrollArea className="h-48">
                        <div className="space-y-2 pr-4">
                           {homePlayers.map(p => <UserCard key={p.id} user={p} onSelect={handleToggleUserSelection} isSelected={selectedUserIds.has(p.id)} isInvited={invitedUserIds.has(p.id)} />)}
                        </div>
                    </ScrollArea>
                    <h3 className="font-semibold">{awayTeam.name}</h3>
                     <ScrollArea className="h-48">
                        <div className="space-y-2 pr-4">
                           {awayPlayers.map(p => <UserCard key={p.id} user={p} onSelect={handleToggleUserSelection} isSelected={selectedUserIds.has(p.id)} isInvited={invitedUserIds.has(p.id)} />)}
                        </div>
                    </ScrollArea>
                </TabsContent>
                <TabsContent value="referees" className="pt-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for referees to invite..."
                            className="pl-9"
                            value={refereeSearch}
                            onChange={(e) => setRefereeSearch(e.target.value)}
                        />
                    </div>
                     <ScrollArea className="h-64">
                        <div className="space-y-2 pr-4">
                            {isSearchingReferees ? <Loader2 className="animate-spin mx-auto" /> :
                             refereeResults.map(p => <UserCard key={p.id} user={p} onSelect={handleToggleUserSelection} isSelected={selectedUserIds.has(p.id)} isInvited={invitedUserIds.has(p.id)} />)
                            }
                        </div>
                    </ScrollArea>
                </TabsContent>
                 <TabsContent value="hosts" className="pt-4">
                    <p className="text-center text-muted-foreground p-8">Host search will be implemented here.</p>
                 </TabsContent>
            </Tabs>

            {selectedUsers.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">To Be Invited ({selectedUsers.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedUsers.map(user => (
                             <div key={user.id} className="flex items-center gap-2 p-1 pr-2 rounded-full bg-accent">
                                 <Image src={user.avatar || 'https://placehold.co/40x40.png'} alt={user.name} width={24} height={24} className="rounded-full" />
                                 <span className="text-sm">{user.name}</span>
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" onClick={() => handleToggleUserSelection(user)}><X className="w-3 h-3"/></Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <Button className="w-full" onClick={handleSendInvites} disabled={isSubmitting || selectedUsers.length === 0}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Sending...</> : 'Send Invites'}
            </Button>
            
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
                            title="Get Team Players"
                            description="Called on tab load to get players for the home and away teams."
                            endpoint="/users?teamId={teamId}"
                            method="GET"
                            response={`[
  {
    "id": "player-user-id-1",
    "name": "Player One",
    "avatar": "url-to-avatar"
  }
]`}
                        />
                        <ApiDocumentationViewer
                            title="Search for Referees/Hosts"
                            description="Called when typing in the search bar to find users by name."
                            endpoint="/users?name={name}"
                            method="GET"
                            response={`[
  {
    "id": "some-user-id",
    "name": "John Doe",
    "avatar": "url-to-avatar"
  }
]`}
                        />
                        <ApiDocumentationViewer
                            title="Send an Invitation"
                            description="Called when the 'Send Invites' button is clicked for each newly selected user."
                            endpoint="/invites"
                            method="POST"
                            requestPayload={`{
  "matchId": "your-match-id",
  "inviteeId": "user-id-to-invite",
  "type": "player | referee | host"
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
                            endpoint="/invites/match/:matchId"
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
