
"use client"

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronRight, Plus, ArrowUpDown, ListFilter, Info, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { UserSearchResult, Invite, CreateInviteDto } from "@/lib/models";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ApiDocumentationViewer } from "./api-documentation-viewer";
import { Command, CommandEmpty, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";

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
}

export function InvitePlayers({ matchId }: InvitePlayersProps) {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const fetchInvites = useCallback(async () => {
        if (!matchId) return;
        try {
            setIsLoading(true);
            const fetchedInvites = await apiClient<Invite[]>(`/invites/match/${matchId}`);
            setInvites(fetchedInvites);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error fetching invites",
                description: "Could not load existing invites for this match.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [matchId, toast]);

    useEffect(() => {
        fetchInvites();
    }, [fetchInvites]);

    const handleSearch = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const results = await apiClient<UserSearchResult[]>(`/users/search?name=${query}`);
            setSearchResults(results);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Search Failed",
                description: "Could not fetch users.",
            });
        } finally {
            setIsSearching(false);
        }
    }, [toast]);
    
    useEffect(() => {
        handleSearch(debouncedSearchQuery);
    }, [debouncedSearchQuery, handleSearch]);

    const handleSelectUser = (user: UserSearchResult) => {
        if (!selectedUsers.find(u => u.id === user.id) && !invites.some(i => i.inviteeId === user.id)) {
            setSelectedUsers(prev => [...prev, user]);
        }
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleRemoveSelectedUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
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
                    type: "player",
                };
                return apiClient('/invites', { method: 'POST', body: payload });
            });
            await Promise.all(invitePromises);
            toast({
                title: "Invites Sent!",
                description: `Successfully invited ${selectedUsers.length} new player(s).`,
            });
            setSelectedUsers([]);
            fetchInvites(); // Refresh the list of invites
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

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Invite Players</Label>
                <Popover open={searchQuery.length > 1 && searchResults.length > 0}>
                    <PopoverTrigger asChild>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search for users to invite..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandList>
                                {isSearching && <div className="p-2 text-sm text-center">Searching...</div>}
                                <CommandEmpty>No users found.</CommandEmpty>
                                {searchResults.map(user => (
                                    <CommandItem
                                        key={user.id}
                                        onSelect={() => handleSelectUser(user)}
                                        disabled={invitedUserIds.has(user.id)}
                                        className="flex items-center gap-2"
                                    >
                                        <Image src={user.avatar || 'https://placehold.co/40x40.png'} alt={user.name} width={24} height={24} className="rounded-full" />
                                        <span>{user.name}</span>
                                        {invitedUserIds.has(user.id) && <span className="text-xs text-muted-foreground ml-auto">Invited</span>}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            
            {selectedUsers.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">To Be Invited ({selectedUsers.length})</h3>
                    <div className="space-y-1">
                        {selectedUsers.map(user => (
                             <div key={user.id} className="flex items-center justify-between p-2 rounded-md bg-accent">
                                <div className="flex items-center gap-2">
                                     <Image src={user.avatar || 'https://placehold.co/40x40.png'} alt={user.name} width={32} height={32} className="rounded-full" />
                                     <span>{user.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveSelectedUser(user.id)}><X className="w-4 h-4"/></Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <Button className="w-full" onClick={handleSendInvites} disabled={isSubmitting || selectedUsers.length === 0}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Sending...</> : 'Send Invites'}
            </Button>
            
            <div className="space-y-2 pt-4">
                 <h3 className="text-sm font-medium">Already Invited ({invites.length})</h3>
                 <div className="space-y-1">
                    {invites.map(invite => (
                        <div key={invite.id} className="flex items-center justify-between p-2 rounded-md bg-card">
                            <p>{invite.inviteeId}</p>
                            <span className="text-xs font-semibold uppercase text-muted-foreground">{invite.status}</span>
                        </div>
                    ))}
                    {invites.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No players have been invited yet.</p>}
                 </div>
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
                            title="Search for Users to Invite"
                            description="Called when typing in the search bar to find users."
                            endpoint="/users/search?name={name}"
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
                            notes="The component currently only displays the user ID and status. A future improvement would be to fetch user details for each invite."
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
                         <ApiDocumentationViewer
                            title="Respond to an Invitation"
                            description="This endpoint is used by the invitee to accept or decline, not by the match creator."
                            endpoint="/invites/:id"
                            method="PATCH"
                             requestPayload={`{
  "status": "accepted"
}`}
                            response={`{
  "id": "invite-id",
  "status": "accepted"
}`}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

    