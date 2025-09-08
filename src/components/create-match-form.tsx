

"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock, Search, MapPin, Loader2, Camera, Video, Link as LinkIcon, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { apiClient } from "@/lib/api-client";
import type { CreateMatchDto, MatchCategory, MatchContest, MatchFormat, MatchEntity, TeamDto } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import type { Match } from "@/lib/data";
import { useEffect, useState, useCallback } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ApiDocumentationViewer } from "./api-documentation-viewer";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/ui/command";
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

// Updated schema to match backend expectations
const createMatchSchema = z.object({
  homeTeamId: z.string().min(1, "Your team is required."),
  awayTeamId: z.string().min(1, "Opponent team is required."),
  categoryId: z.string().min(1, "Category is required."),
  formatId: z.string().min(1, "Format is required."),
  matchDate: z.date(),
  matchStartTime: z.string().default("16:00"),
  matchType: z.enum(["HOME", "AWAY"]),
  matchPeriod: z.coerce.number().int().positive().default(2),
  matchTime: z.coerce.number().int().positive().default(45),
  matchPause: z.coerce.number().int().positive().default(15),
  matchHeadLine: z.string().min(1, "Headline is required."),
  matchLocation: z.string().min(1, "Location is required"),
  matchArena: z.string().min(1, "Arena is required."),
  contestId: z.string().optional(),
  description: z.string().optional(),
  gatheringTime: z.date(),
  fullDayScheduling: z.boolean().default(false),
  endTime: z.date(),
  isRecurring: z.boolean().default(false),
  recurringUntil: z.string().optional(),
  notificationMinutesBefore: z.coerce.number().int().default(60),
  markAsOccupied: z.boolean().default(true),
  isPrivate: z.boolean().default(false),
});

interface CreateMatchFormProps {
  onMatchCreated: (newMatch: Match) => void;
  initialData?: Match | null;
  isUpdateMode?: boolean;
}

export function CreateMatchForm({ onMatchCreated, initialData = null, isUpdateMode = false }: CreateMatchFormProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MatchCategory[]>([]);
  const [formats, setFormats] = useState<MatchFormat[]>([]);
  const [contests, setContests] = useState<MatchContest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for team search
  const [homeSearchQuery, setHomeSearchQuery] = useState("");
  const [awaySearchQuery, setAwaySearchQuery] = useState("");
  const [homeSearchResults, setHomeSearchResults] = useState<TeamDto[]>([]);
  const [awaySearchResults, setAwaySearchResults] = useState<TeamDto[]>([]);
  const [isHomeSearching, setIsHomeSearching] = useState(false);
  const [isAwaySearching, setIsAwaySearching] = useState(false);
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<TeamDto | null>(null);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState<TeamDto | null>(null);

  const debouncedHomeSearch = useDebounce(homeSearchQuery, 300);
  const debouncedAwaySearch = useDebounce(awaySearchQuery, 300);

  const form = useForm<z.infer<typeof createMatchSchema>>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      homeTeamId: "",
      awayTeamId: "",
      matchDate: new Date(),
      matchStartTime: "16:00",
      matchLocation: "Sollentunavallen",
      matchArena: "Main Pitch",
      categoryId: "",
      formatId: "",
      matchType: "HOME",
      matchPeriod: 2,
      matchTime: 45,
      matchPause: 15,
      matchHeadLine: "Match Zporter Cup 2023",
      description: 'Match against FC Barcelona U15 starts at 16.00.',
      gatheringTime: new Date(),
      fullDayScheduling: false,
      endTime: new Date(),
      isRecurring: false,
      notificationMinutesBefore: 60,
      markAsOccupied: true,
      isPrivate: false,
    },
  });

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        setIsLoading(true);
        const [catData, formatData, contestData] = await Promise.all([
          apiClient<MatchCategory[]>("/match-category"),
          apiClient<MatchFormat[]>("/match-format"),
          apiClient<MatchContest[]>("/match-contests"),
        ]);
        setCategories(catData.filter(c => c.name));
        setFormats(formatData.filter(f => f.name));
        setContests(contestData.filter(c => c.name));

        if (initialData && initialData.userGeneratedData?.eventDetails) {
            const details = initialData.userGeneratedData.eventDetails;
            form.reset({
                homeTeamId: details.homeTeamId || initialData.homeTeam.id,
                awayTeamId: details.awayTeamId || initialData.awayTeam.id,
                categoryId: details.categoryId,
                formatId: details.formatId,
                matchDate: new Date(details.matchDate),
                matchStartTime: details.matchStartTime,
                matchType: details.matchType,
                matchPeriod: details.matchPeriod,
                matchTime: details.matchTime,
                matchPause: details.matchPause,
                matchHeadLine: details.matchHeadLine,
                matchLocation: details.matchLocation,
                matchArena: details.matchArena,
                contestId: details.contestId,
                description: details.description,
                gatheringTime: new Date(details.gatheringTime),
                fullDayScheduling: details.fullDayScheduling,
                endTime: new Date(details.endTime),
                isRecurring: details.isRecurring,
                recurringUntil: details.recurringUntil,
                notificationMinutesBefore: details.notificationMinutesBefore,
                markAsOccupied: details.markAsOccupied,
                isPrivate: details.isPrivate,
            });
            setSelectedHomeTeam(initialData.homeTeam);
            setSelectedAwayTeam(initialData.awayTeam);
        }

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load required data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchDropdownData();
  }, [toast, initialData, form]);

  const searchTeams = useCallback(async (query: string, setSearchResults: React.Dispatch<React.SetStateAction<TeamDto[]>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const clubId = "phL7vvhFwA3K3jrmN3ha"; // As specified in the instructions
      const response = await apiClient<TeamDto[]>(`/clubs/teams?limit=10&sorted=asc&clubId=${clubId}&searchQuery=${query}&gender=MALE&userType=PLAYER`);
      
      const resultsWithMappedFields = response.map(team => ({
        id: team.teamId!,
        name: team.teamName!,
        logoUrl: team.logoUrl,
        clubId: team.clubId,
      }));
      setSearchResults(resultsWithMappedFields);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Team Search Failed",
        description: "Could not fetch teams. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    searchTeams(debouncedHomeSearch, setHomeSearchResults, setIsHomeSearching);
  }, [debouncedHomeSearch, searchTeams]);

  useEffect(() => {
    searchTeams(debouncedAwaySearch, setAwaySearchResults, setIsAwaySearching);
  }, [debouncedAwaySearch, searchTeams]);
  
  const handleSelectHomeTeam = (team: TeamDto) => {
    setSelectedHomeTeam(team);
    form.setValue("homeTeamId", team.id);
    setHomeSearchQuery("");
    setHomeSearchResults([]);
  };
  
  const handleSelectAwayTeam = (team: TeamDto) => {
    setSelectedAwayTeam(team);
    form.setValue("awayTeamId", team.id);
    setAwaySearchQuery("");
    setAwaySearchResults([]);
  };

  async function onSubmit(values: z.infer<typeof createMatchSchema>) {
    try {
      if (!selectedHomeTeam || !selectedAwayTeam) {
        toast({
          variant: "destructive",
          title: "Team selection missing",
          description: "Please search and select both teams.",
        });
        return;
      }

      const payload: CreateMatchDto = {
        ...values,
        yourTeamName: selectedHomeTeam.name,
        opponentTeamName: selectedAwayTeam.name,
        matchDate: format(values.matchDate, 'yyyy-MM-dd'),
        gatheringTime: values.gatheringTime.toISOString(),
        endTime: values.endTime.toISOString(),
      };
      
      let newMatchResponse: MatchEntity;
      if (isUpdateMode && initialData) {
         newMatchResponse = await apiClient<MatchEntity>(`/matches/${initialData.id}`, {
            method: 'PATCH',
            body: payload,
         });
      } else {
         newMatchResponse = await apiClient<MatchEntity>('/matches', {
            method: 'POST',
            body: payload,
         });
      }


      const transformedMatch: Match = {
        id: newMatchResponse.id,
        homeTeam: { id: newMatchResponse.homeTeam.id, name: newMatchResponse.homeTeam.name, logoUrl: newMatchResponse.homeTeam.logoUrl || 'https://placehold.co/40x40.png' },
        awayTeam: { id: newMatchResponse.awayTeam.id, name: newMatchResponse.awayTeam.name, logoUrl: newMatchResponse.awayTeam.logoUrl || 'https://placehold.co/40x40.png' },
        matchDate: format(new Date(newMatchResponse.startDate), 'yyyy-MM-dd'),
        startTime: format(new Date(newMatchResponse.startDate), 'HH:mm'),
        location: { name: newMatchResponse.venue.name, address: '' },
        status: newMatchResponse.status,
        ...newMatchResponse.userGeneratedData.eventDetails,
      } as Match; 

      onMatchCreated(transformedMatch);

    } catch (error) {
      console.error("Failed to save match:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isUpdateMode ? 'update' : 'create'} match. Please try again.`,
      });
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="formatId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a format..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {formats.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="contestId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Ev. Contest</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a contest..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {contests.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="matchType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Home/Away</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="HOME">Home</SelectItem>
                                <SelectItem value="AWAY">Away</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                control={form.control}
                name="matchDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn("w-full justify-between text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="matchStartTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                        <Input icon={Clock} type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="matchPeriod"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Periods</FormLabel>
                    <Select onValueChange={field.onChange} value={String(field.value)}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="matchTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} value={String(field.value)}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                        {[...Array(60).keys()].map(i => <SelectItem key={i+1} value={String(i+1)}>{i+1} m</SelectItem>)}
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="matchPause"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Pause</FormLabel>
                        <Select onValueChange={field.onChange} value={String(field.value)}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                            {[...Array(30).keys()].map(i => <SelectItem key={i+1} value={String(i+1)}>{i+1} m</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
                />
            </div>

            {/* Your Team Search */}
            <div className="space-y-2">
                <Label>Your Team</Label>
                {selectedHomeTeam ? (
                    <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>{selectedHomeTeam.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => {
                            setSelectedHomeTeam(null);
                            form.setValue("homeTeamId", "");
                        }}><X className="w-4 h-4" /></Button>
                    </div>
                ) : (
                    <Popover open={homeSearchQuery.length > 1 && homeSearchResults.length > 0}>
                        <PopoverTrigger asChild>
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search your team..."
                                    className="pl-9"
                                    value={homeSearchQuery}
                                    onChange={(e) => setHomeSearchQuery(e.target.value)}
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandList>
                                    {isHomeSearching && <div className="p-2 text-sm text-center">Searching...</div>}
                                    <CommandEmpty>No team found.</CommandEmpty>
                                    {homeSearchResults.map(team => (
                                        <CommandItem key={team.id} onSelect={() => handleSelectHomeTeam(team)}>
                                            {team.name}
                                        </CommandItem>
                                    ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}
                <p className="text-sm font-medium text-destructive">{form.formState.errors.homeTeamId?.message}</p>
            </div>
            
            {/* Opponent Team Search */}
            <div className="space-y-2">
                <Label>Opponent</Label>
                    {selectedAwayTeam ? (
                    <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>{selectedAwayTeam.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => {
                            setSelectedAwayTeam(null);
                            form.setValue("awayTeamId", "");
                        }}><X className="w-4 h-4" /></Button>
                    </div>
                ) : (
                    <Popover open={awaySearchQuery.length > 1 && awaySearchResults.length > 0}>
                        <PopoverTrigger asChild>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search opponent team..."
                                    className="pl-9"
                                    value={awaySearchQuery}
                                    onChange={(e) => setAwaySearchQuery(e.target.value)}
                                />
                            </div>
                        </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandList>
                                    {isAwaySearching && <div className="p-2 text-sm text-center">Searching...</div>}
                                    <CommandEmpty>No team found.</CommandEmpty>
                                    {awaySearchResults.map(team => (
                                        <CommandItem key={team.id} onSelect={() => handleSelectAwayTeam(team)}>
                                            {team.name}
                                        </CommandItem>
                                    ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}
                <p className="text-sm font-medium text-destructive">{form.formState.errors.awayTeamId?.message}</p>
            </div>

            <FormField
                control={form.control}
                name="matchHeadLine"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} rows={3} /></FormControl>
                </FormItem>
                )}
            />

            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon"><Camera className="w-4 h-4" /></Button>
                <Button type="button" variant="outline" size="icon"><Video className="w-4 h-4" /></Button>
                <Button type="button" variant="outline" size="icon"><LinkIcon className="w-4 h-4" /></Button>
            </div>

            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="gatheringTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gathering</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn("w-full justify-between text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                            {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date</span>}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        {/* Simple time picker could be added here */}
                        </PopoverContent>
                    </Popover>
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="fullDayScheduling"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-6">
                        <FormLabel>All day</FormLabel>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn("w-full justify-between text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                            {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date</span>}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                    </FormItem>
                )}
                />
            

            <div className="flex items-center justify-between">
                <FormLabel>Recurring</FormLabel>
                 <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
                control={form.control}
                name="matchLocation"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                    <Input icon={MapPin} {...field} />
                    </FormControl>
                     <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="matchArena"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Arena</FormLabel>
                    <FormControl>
                    <Input {...field} />
                    </FormControl>
                     <FormMessage />
                </FormItem>
                )}
            />

            <div className="flex items-center justify-between">
                <FormLabel>Notification</FormLabel>
                <FormField
                control={form.control}
                name="notificationMinutesBefore"
                render={({ field }) => (
                    <FormItem className="w-1/2">
                    <Select onValueChange={field.onChange} value={String(field.value)}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="15">15 min before</SelectItem>
                            <SelectItem value="30">30 min before</SelectItem>
                            <SelectItem value="60">60 min before</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
                />
            </div>
            <div className="flex items-center justify-between">
                <FormLabel>Occupied</FormLabel>
                <FormField
                control={form.control}
                name="markAsOccupied"
                render={({ field }) => (
                    <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )}
                />
            </div>
            <div className="flex items-center justify-between">
                <FormLabel>Private</FormLabel>
                <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                    <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )}
                />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : (isUpdateMode ? 'Update Match' : 'Save Draft & Continue')}
            </Button>
        </form>
        </Form>
        <Separator className="my-8" />
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="api-docs">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Event Tab API Documentation</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                     <ApiDocumentationViewer
                        title="Search Teams by Name"
                        description="Called when the user types in the 'Your Team' or 'Opponent' fields. Requires clubId and other parameters."
                        endpoint="/clubs/teams?limit=10&sorted=asc&clubId={clubId}&searchQuery={query}&gender=MALE&userType=PLAYER"
                        method="GET"
                        notes="This dynamic search populates the team selection dropdowns. The clubId is currently hardcoded to 'phL7vvhFwA3K3jrmN3ha'."
                        response={`[
  {
    "teamId": "string",
    "teamName": "string",
    "logoUrl": "string (URL)",
    "clubId": "string"
  }
]`}
                    />
                    <ApiDocumentationViewer
                        title="Fetch Match Categories"
                        description="Called on component mount to populate the 'Category' dropdown."
                        endpoint="/match-category"
                        method="GET"
                        notes="This endpoint populates the options available in the 'Category' select field."
                        response={`[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "isActive": true,
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]`}
                    />
                    <ApiDocumentationViewer
                        title="Fetch Match Formats"
                        description="Called on component mount to populate the 'Format' dropdown."
                        endpoint="/match-format"
                        method="GET"
                        notes="This endpoint populates the options available in the 'Format' select field."
                        response={`[
  {
    "id": "string",
    "name": "string",
    "playerCount": "number",
    "description": "string",
    "isActive": true,
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]`}
                    />
                    <ApiDocumentationViewer
                        title="Fetch Match Contests"
                        description="Called on component mount to populate the 'Ev. Contest' dropdown."
                        endpoint="/match-contests"
                        method="GET"
                        notes="This endpoint populates the options available in the 'Ev. Contest' select field."
                        response={`[
  {
    "id": "string",
    "name": "string",
    "season": "string",
    "type": "LEAGUE | CUP | TOURNAMENT",
    "logoUrl": "string",
    "participatingTeams": ["string"],
    "isActive": true,
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]`}
                    />
                     <ApiDocumentationViewer
                        title="Create Match Draft"
                        description="Called when the 'Save Draft & Continue' button is clicked. It creates the initial match record."
                        endpoint="/matches"
                        method="POST"
                        notes="This is the first and most critical step. The 'id' returned in the response is required to save data in all other tabs (Invites, Plan, Notes, etc.)."
                        requestPayload={`{
  "homeTeamId": "string",
  "awayTeamId": "string",
  "categoryId": "string",
  "formatId": "string",
  "matchDate": "string (YYYY-MM-DD)",
  "matchStartTime": "string (HH:MM)",
  "matchType": "HOME | AWAY",
  "matchPeriod": "number",
  "matchTime": "number",
  "matchPause": "number",
  "matchHeadLine": "string",
  "matchLocation": "string",
  "matchArena": "string",
  "contestId": "string" (optional),
  "description": "string" (optional),
  "gatheringTime": "string (ISO 8601)",
  "fullDayScheduling": "boolean",
  "endTime": "string (ISO 8601)",
  "isRecurring": "boolean",
  "recurringUntil": "string (YYYY-MM-DD)" (optional),
  "notificationMinutesBefore": "number",
  "markAsOccupied": "boolean",
  "isPrivate": "boolean"
}`}
                        response={`
{
  "id": "match-1757157909618",
  "source": "user-generated",
  "sourceId": null,
  "createdBy": "4uc8OAiLTLZXAxNFa96fNW0pcDH3",
  "status": "draft",
  "createdAt": "2025-09-06T11:25:09.618Z",
  "updatedAt": "2025-09-06T11:25:09.618Z",
  "name": "Match Zporter Cup 2023",
  "description": "Match against FC Barcelona U15 starts at 16.00.",
  "startDate": "2025-09-06T10:00:00.000Z",
  "endDate": "2025-09-06T10:45:00.000Z",
  "timezone": "Asia/Dhaka",
  "duration": 45,
  "homeTeam": {
    "id": "xjW4II6khRys9SFDTunP",
    "source": "user-generated",
    "sourceId": null,
    "name": "Home Team",
    "shortName": "HT",
    "code": "HT",
    "logoUrl": "",
    "country": "",
    "founded": null,
    "isNational": false,
    "venue": null,
    "players": []
  },
  "awayTeam": {
    "id": "fYv81QZ1K7ya7SUYqHoZ",
    "source": "user-generated",
    "sourceId": null,
    "name": "Away Team",
    "shortName": "AT",
    "code": "AT",
    "logoUrl": "",
    "country": "",
    "founded": null,
    "isNational": false,
    "venue": null,
    "players": []
  },
  "competition": {
    "id": "AyN2qV3i5OBmuwFz5Bsw",
    "source": "user-generated",
    "sourceId": null,
    "name": "Friendly Match",
    "shortName": "Friendly",
    "type": "friendly",
    "country": "",
    "logoUrl": "",
    "tier": 0
  },
  "season": null,
  "stage": null,
  "round": null,
  "scores": {
    "home": 0,
    "away": 0,
    "homePeriod1": 0,
    "awayPeriod1": 0,
    "homePeriod2": 0,
    "awayPeriod2": 0,
    "homeExtraTime": 0,
    "awayExtraTime": 0,
    "homePenalties": 0,
    "awayPenalties": 0,
    "winner": null
  },
  "venue": {
    "id": null,
    "sourceId": null,
    "name": "Sollentunavallen",
    "city": "",
    "country": "",
    "capacity": 0,
    "surface": "",
    "coordinates": {
      "lat": 0,
      "lng": 0
    }
  },
  "referee": null,
  "assistantReferees": [],
  "fourthOfficial": null,
  "attendance": 0,
  "weather": {
    "temperature": 0,
    "humidity": 0,
    "windSpeed": 0,
    "description": ""
  },
  "featuredPlayers": [],
  "isFeatured": false,
  "isPrivate": false,
  "likes": 0,
  "followers": 0,
  "sportmonksData": {
    "raw": null,
    "lastChanged": null,
    "hasLineup": false,
    "hasEvents": false,
    "hasStats": false,
    "live": false
  },
  "userGeneratedData": {
    "notes": [],
    "reviews": [],
    "invites": [],
    "tacticalPlan": null,
    "eventDetails": {
      "homeTeamId": "xjW4II6khRys9SFDTunP",
      "awayTeamId": "fYv81QZ1K7ya7SUYqHoZ",
      "categoryId": "BI96ZmQxBakw1hw2Lz3H",
      "formatId": "LAcQoRc2Rdn2UuqZABQd",
      "matchDate": "2025-09-06",
      "matchStartTime": "16:00",
      "matchType": "HOME",
      "matchPeriod": 2,
      "matchTime": 45,
      "matchPause": 15,
      "matchHeadLine": "Match Zporter Cup 2023",
      "matchLocation": "Sollentunavallen",
      "matchArena": "Main Pitch",
      "contestId": "AyN2qV3i5OBmuwFz5Bsw",
      "description": "Match against FC Barcelona U15 starts at 16.00.",
      "gatheringTime": "2025-09-06T11:23:34.208Z",
      "fullDayScheduling": false,
      "endTime": "2025-09-06T11:23:34.208Z",
      "isRecurring": false,
      "notificationMinutesBefore": 60,
      "markAsOccupied": true,
      "isPrivate": false,
      "yourTeamName": "Drake Team",
      "opponentTeamName": "123123123"
    },
    "scheduleDetails": null,
    "settings": {
      "isNotificationOn": false,
      "notificationSendBefore": 60,
      "isOccupied": false,
      "isPrivate": false
    }
  },
  "liveLog": {
    "events": [],
    "stats": {
      "goals": {
        "home": 0,
        "away": 0
      },
      "shots": {
        "home": 0,
        "away": 0
      },
      "shotsOnGoal": {
        "home": 0,
        "away": 0
      },
      "shotsOffGoal": {
        "home": 0,
        "away": 0
      },
      "shotsBlocked": {
        "home": 0,
        "away": 0
      },
      "penalties": {
        "home": 0,
        "away": 0
      },
      "corners": {
        "home": 0,
        "away": 0
      },
      "freeKicks": {
        "home": 0,
        "away": 0
      },
      "goalKicks": {
        "home": 0,
        "away": 0
      },
      "throwIns": {
        "home": 0,
        "away": 0
      },
      "offsides": {
        "home": 0,
        "away": 0
      },
      "yellowCards": {
        "home": 0,
        "away": 0
      },
      "redCards": {
        "home": 0,
        "away": 0
      },
      "possession": {
        "home": 0,
        "away": 0
      },
      "possessionMinutes": {
        "home": 0,
        "away": 0
      },
      "passesOn": {
        "home": 0,
        "away": 0
      },
      "passesOff": {
        "home": 0,
        "away": 0
      },
      "wonBalls": {
        "home": 0,
        "away": 0
      },
      "fouls": {
        "home": 0,
        "away": 0
      }
    },
    "isActive": false
  },
  "tags": [],
  "popularity": 0.9863049359178344,
  "version": 1,
  "homeTeamId": "xjW4II6khRys9SFDTunP",
  "awayTeamId": "fYv81QZ1K7ya7SUYqHoZ",
  "categoryId": "BI96ZmQxBakw1hw2Lz3H",
  "formatId": "LAcQoRc2Rdn2UuqZABQd",
  "matchDate": "2025-09-06",
  "matchStartTime": "16:00",
  "matchType": "HOME",
  "matchPeriod": 2,
  "matchTime": 45,
  "matchPause": 15,
  "matchHeadLine": "Match Zporter Cup 2023",
  "matchLocation": "Sollentunavallen",
  "matchArena": "Main Pitch",
  "contestId": "AyN2qV3i5OBmuwFz5Bsw",
  "gatheringTime": "2025-09-06T11:23:34.208Z",
  "fullDayScheduling": false,
  "endTime": "2025-09-06T11:23:34.208Z",
  "isRecurring": false,
  "notificationMinutesBefore": 60,
  "markAsOccupied": true,
  "yourTeamName": "Drake Team",
  "opponentTeamName": "123123123"
}`}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  )
}
