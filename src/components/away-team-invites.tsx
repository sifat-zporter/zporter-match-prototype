// src/components/away-team-invites.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Info, Loader2, ArrowUpDown, ListFilter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { AwayInvitation, TeamSearchResult, InvitationStatus } from "@/lib/models";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
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
    invitedTeams: AwayInvitation[];
    onAddTeam: (team: TeamSearchResult) => void;
    onRemoveTeam: (teamId: string) => void;
    onStatusChange: (teamId: string, newStatus: InvitationStatus) => void;
}

export function AwayTeamInvites({ matchId, invitedTeams, onAddTeam, onRemoveTeam, onStatusChange }: AwayTeamInvitesProps) {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<TeamSearchResult[]>([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    
    const debouncedSearch = useDebounce(searchQuery, 300);

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

    const handleSelectTeam = (team: TeamSearchResult) => {
        onAddTeam(team);
        setSearchQuery('');
        setSearchResults([]);
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

            <ScrollArea className="h-[350px]">
                <div className="space-y-2 pr-2">
                    {invitedTeams.length > 0 ? (
                        invitedTeams.map(team => (
                           <AwayTeamListItem 
                             key={team.teamId}
                             team={team}
                             onStatusChange={(newStatus) => onStatusChange(team.teamId, newStatus)}
                             onRemove={() => onRemoveTeam(team.teamId)}
                           />
                        ))
                    ) : (
                         <p className="text-center text-muted-foreground p-8">No opponent teams invited yet.</p>
                    )}
                </div>
            </ScrollArea>
            
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
                                    <CommandItem key={team.teamId} onSelect={() => handleSelectTeam(team)}>
                                        {team.teamName}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
