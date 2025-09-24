// src/components/away-team-invites.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Info, Loader2, Plus, ArrowUpDown, ListFilter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { AwayInvitation, TeamSearchResult, MatchEntity, InvitationStatus } from "@/lib/models";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandItem, CommandList } from "./ui/command";
import { AwayTeamListItem } from "./away-team-list-item";

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

interface AwayTeamInvitesProps {
    matchId: string;
    awayTeamId: string;
}

export function AwayTeamInvites({ matchId, awayTeamId }: AwayTeamInvitesProps) {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<TeamSearchResult[]>([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [invitedTeams, setInvitedTeams] = useState<AwayInvitation[]>([]);

    const debouncedSearch = useDebounce(searchQuery, 300);

    const fetchInvitedTeams = useCallback(async () => {
        if (!matchId) return;
        try {
            const matchData = await apiClient<MatchEntity>(`/matches/${matchId}`);
            const awayInvites = matchData.userGeneratedData?.invites?.Away || [];
            if (Array.isArray(awayInvites)) {
                setInvitedTeams(awayInvites);
            } else {
                setInvitedTeams([]);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch existing Away team invites." });
        }
    }, [matchId, toast]);

    useEffect(() => {
        fetchInvitedTeams();
    }, [fetchInvitedTeams]);

    const handleSearchTeams = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setIsLoadingSearch(true);
        try {
            const results = await apiClient<TeamSearchResult[]>(`/matches/search/teams`, {
                params: { name: query }
            });
            setSearchResults(results);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to search for teams." });
        } finally {
            setIsLoadingSearch(false);
        }
    }, [toast]);

    useEffect(() => {
        handleSearchTeams(debouncedSearch);
    }, [debouncedSearch, handleSearchTeams]);

    const handleAddTeam = (team: TeamSearchResult) => {
        if (invitedTeams.some(t => t.teamId === team.teamId)) {
            toast({ variant: "default", title: "Team already invited." });
            return;
        }
        const newInvitation: AwayInvitation = {
            teamId: team.teamId,
            coachId: team.coachId,
            status: 'BACKUP_PENDING',
            teamDetails: { name: team.teamName, logoUrl: team.logo }
        };
        setInvitedTeams(prev => [...prev, newInvitation]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleRemoveTeam = (teamId: string) => {
        setInvitedTeams(prev => prev.filter(t => t.teamId !== teamId));
    };

    const handleStatusChange = (teamId: string, newStatus: InvitationStatus) => {
        setInvitedTeams(prev => {
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
        try {
            const primaryTeam = invitedTeams.find(t => t.status === 'PRIMARY_PENDING' || t.status === 'ACCEPTED');
            
            // Step 1: Update the main match object with the primary away team
            if (primaryTeam && primaryTeam.teamId !== awayTeamId) {
                await apiClient(`/matches/${matchId}`, {
                    method: 'PATCH',
                    body: { awayTeamId: primaryTeam.teamId }
                });
            }

            // Step 2: Update the invites object
            const payload = {
                invites: {
                    Away: invitedTeams.map(({teamDetails, ...rest}) => rest) // Remove temporary teamDetails before sending
                }
            };
            await apiClient(`/matches/${matchId}/invites`, {
                method: 'PATCH',
                body: payload
            });

            toast({ title: "Away Invites Saved!", description: "The list of opponent invitations has been updated." });
            fetchInvitedTeams();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to save away invitations." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const primaryTeam = invitedTeams.find(t => t.status === 'PRIMARY_PENDING' || t.status === 'ACCEPTED');

    return (
        <div className="p-4 space-y-4">
             <div className="flex justify-between items-center text-sm">
                <p><span className="text-primary font-semibold">{primaryTeam ? '1' : '0'} of {invitedTeams.length}</span> Invited</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="w-4 h-4" />
                    <ArrowUpDown className="w-4 h-4" />
                    <ListFilter className="w-4 h-4" />
                </div>
            </div>

            <ScrollArea className="h-72">
                <div className="space-y-2 pr-2">
                    {invitedTeams.length > 0 ? (
                        invitedTeams.map(team => (
                           <AwayTeamListItem 
                             key={team.teamId}
                             team={team}
                             onStatusChange={(newStatus) => handleStatusChange(team.teamId, newStatus)}
                             onRemove={() => handleRemoveTeam(team.teamId)}
                           />
                        ))
                    ) : (
                         <p className="text-center text-muted-foreground p-8">No opponent teams invited yet.</p>
                    )}
                </div>
            </ScrollArea>

             <Separator />
            
            <div className="space-y-2">
                <Label>Add Team</Label>
                <Popover open={searchQuery.length > 1 && searchResults.length > 0}>
                    <PopoverTrigger asChild>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search Team"
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandList>
                                {isLoadingSearch && <div className="p-2 text-sm text-center">Searching...</div>}
                                <CommandEmpty>No team found, <Button variant="link" className="p-0 h-auto">add new Team</Button></CommandEmpty>
                                {searchResults.map(team => (
                                    <CommandItem key={team.teamId} onSelect={() => handleAddTeam(team)}>
                                        {team.teamName}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>

        </div>
    );
}
