

"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse, parseISO } from "date-fns";
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
import type { CreateMatchDto, MatchCategory, MatchContest, MatchFormat, MatchEntity, TeamDto, TeamSearchResult } from "@/lib/models";
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
  gatheringTime: z.date().optional(),
  fullDayScheduling: z.boolean().default(false),
  endTime: z.date().optional(),
  matchRecurringType: z.enum(["DOES_NOT_REPEAT", "DAILY", "WEEKLY", "BI_WEEKLY", "MONTHLY", "YEARLY"]).default("DOES_NOT_REPEAT"),
  matchRecurringUntil: z.date().optional(),
  notificationMinutesBefore: z.coerce.number().int().default(60),
  markAsOccupied: z.boolean().default(true),
  isPrivate: z.boolean().default(false),
}).refine(data => {
    if (data.matchRecurringType !== 'DOES_NOT_REPEAT' && !data.matchRecurringUntil) {
        return false;
    }
    return true;
}, {
    message: "An end date is required for recurring events.",
    path: ["matchRecurringUntil"],
});


interface CreateMatchFormProps {
  onMatchCreated: (newMatch: Match) => void;
  initialData?: Match | null;
  isUpdateMode?: boolean;
}

// Helper to safely create a Date object from Firestore's timestamp or an ISO string
const getDateFromTimestamp = (timestamp: any): Date | null => {
    if (!timestamp) return null;
    if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
        return new Date(timestamp._seconds * 1000);
    }
    if (typeof timestamp === 'string') {
        try {
            return parseISO(timestamp);
        } catch (e) {
            return null; // Invalid ISO string
        }
    }
    return null;
};


export function CreateMatchForm({ onMatchCreated, initialData = null, isUpdateMode = false }: CreateMatchFormProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MatchCategory[]>([]);
  const [formats, setFormats] = useState<MatchFormat[]>([]);
  const [contests, setContests] = useState<MatchContest[]>([]);
  const [isDropdownDataLoading, setIsDropdownDataLoading] = useState(true);

  // State for team search
  const [homeSearchQuery, setHomeSearchQuery] = useState("");
  const [awaySearchQuery, setAwaySearchQuery] = useState("");
  const [homeSearchResults, setHomeSearchResults] = useState<TeamSearchResult[]>([]);
  const [awaySearchResults, setAwaySearchResults] = useState<TeamSearchResult[]>([]);
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
      matchRecurringType: 'DOES_NOT_REPEAT',
      notificationMinutesBefore: 60,
      markAsOccupied: true,
      isPrivate: false,
      contestId: "",
    },
  });
  
  const recurringType = form.watch('matchRecurringType');

  // Effect to fetch dropdown data
  useEffect(() => {
    async function fetchDropdownData() {
      try {
        setIsDropdownDataLoading(true);
        const [catData, formatData, contestData] = await Promise.all([
          apiClient<MatchCategory[]>("/match-category"),
          apiClient<MatchFormat[]>("/match-format"),
          apiClient<MatchContest[]>("/match-contests"),
        ]);
        setCategories(catData.filter(c => c.name));
        setFormats(formatData.filter(f => f.name));
        setContests(contestData.filter(c => c.name));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load required data. Please try again.",
        });
      } finally {
        setIsDropdownDataLoading(false);
      }
    }
    fetchDropdownData();
  }, [toast]);

  // Effect to reset form when in update mode and all dropdown data is ready
  useEffect(() => {
    if (isUpdateMode && initialData && !isDropdownDataLoading) {
        const details = initialData.userGeneratedData?.eventDetails;
        const schedule = initialData.userGeneratedData?.scheduleDetails;
        const settings = initialData.userGeneratedData?.settings;

        // Correctly parse startDate and endDate
        const gatheringTimeDate = getDateFromTimestamp(initialData.startDate);
        const endTimeDate = getDateFromTimestamp(initialData.endDate);
        const recurringUntilDate = schedule?.recurringUntil ? parse(schedule.recurringUntil, 'yyyy-MM-dd', new Date()) : undefined;

        form.reset({
            homeTeamId: initialData.homeTeam.id,
            awayTeamId: initialData.awayTeam.id,
            categoryId: details?.categoryId || "",
            formatId: details?.formatId || "",
            contestId: details?.contestId || "",
            matchDate: details?.matchDate ? parse(details.matchDate, 'yyyy-MM-dd', new Date()) : new Date(),
            matchStartTime: details?.matchStartTime || "00:00",
            matchType: details?.matchType || "HOME",
            matchPeriod: details?.matchPeriod || 2,
            matchTime: details?.matchTime || 45,
            matchPause: details?.matchPause || 15,
            matchHeadLine: details?.matchHeadLine || "",
            matchLocation: details?.matchLocation || "N/A",
            matchArena: details?.matchArena || "",
            description: initialData.description || "",
            gatheringTime: gatheringTimeDate || new Date(),
            fullDayScheduling: schedule?.matchIsAllDay || false,
            endTime: endTimeDate || new Date(),
            matchRecurringType: schedule?.matchRecurringType || 'DOES_NOT_REPEAT',
            matchRecurringUntil: recurringUntilDate,
            notificationMinutesBefore: settings?.notificationSendBefore || 60,
            markAsOccupied: settings?.isOccupied || false,
            isPrivate: settings?.isPrivate || false,
        });

        if (initialData.homeTeam) {
            setSelectedHomeTeam({ id: initialData.homeTeam.id, name: initialData.homeTeam.name, logoUrl: initialData.homeTeam.logoUrl });
        }
        if (initialData.awayTeam) {
            setSelectedAwayTeam({ id: initialData.awayTeam.id, name: initialData.awayTeam.name, logoUrl: initialData.awayTeam.logoUrl });
        }
    }
  }, [initialData, isUpdateMode, isDropdownDataLoading, form]);


  const searchTeams = useCallback(async (query: string, setSearchResults: React.Dispatch<React.SetStateAction<TeamSearchResult[]>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient<TeamSearchResult[]>(`/matches/search/teams`, {
        params: { name: query }
      });
      setSearchResults(response);
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
  
  const handleSelectHomeTeam = (team: TeamSearchResult) => {
    setSelectedHomeTeam({ id: team.teamId, name: team.teamName, logoUrl: team.logo });
    form.setValue("homeTeamId", team.teamId);
    setHomeSearchQuery("");
    setHomeSearchResults([]);
  };
  
  const handleSelectAwayTeam = (team: TeamSearchResult) => {
    setSelectedAwayTeam({ id: team.teamId, name: team.teamName, logoUrl: team.logo });
    form.setValue("awayTeamId", team.teamId);
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

      // This payload is used for both create and update
      // For PATCH, only changed fields are sent, but for simplicity here we send all.
      const payload: any = {
        ...values,
        yourTeamName: selectedHomeTeam.name,
        opponentTeamName: selectedAwayTeam.name,
        matchDate: format(values.matchDate, 'yyyy-MM-dd'),
        gatheringTime: values.gatheringTime?.toISOString(),
        endTime: values.endTime?.toISOString(),
        matchRecurringUntil: values.matchRecurringUntil ? format(values.matchRecurringUntil, 'yyyy-MM-dd') : undefined,
      };

      // Remove the old isRecurring field if it exists
      delete payload.isRecurring;

      // Only send recurrence fields if a recurring option is selected
      if (payload.matchRecurringType === 'DOES_NOT_REPEAT') {
          delete payload.matchRecurringType;
          delete payload.matchRecurringUntil;
      }
      
      let newMatchResponse: any; // Use 'any' to handle the Firestore timestamp object
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
      
      const startDate = getDateFromTimestamp(newMatchResponse.startDate);

      // A more robust transformation might be needed, but this covers the basics
      const transformedMatch: Match = {
        id: newMatchResponse.id,
        homeTeam: { id: newMatchResponse.homeTeam.id, name: newMatchResponse.homeTeam.name, logoUrl: newMatchResponse.homeTeam.logoUrl || 'https://placehold.co/40x40.png' },
        awayTeam: { id: newMatchResponse.awayTeam.id, name: newMatchResponse.awayTeam.name, logoUrl: newMatchResponse.awayTeam.logoUrl || 'https://placehold.co/40x40.png' },
        matchDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
        startTime: startDate ? format(startDate, 'HH:mm') : '',
        location: { name: newMatchResponse.venue.name, address: '' },
        status: newMatchResponse.status,
        ...newMatchResponse
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

  if (isDropdownDataLoading && !initialData) {
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
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
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
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
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
                        <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
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
                                        <CommandItem key={team.teamId} onSelect={() => handleSelectHomeTeam(team)}>
                                            {team.teamName}
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
                                        <CommandItem key={team.teamId} onSelect={() => handleSelectAwayTeam(team)}>
                                            {team.teamName}
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
            
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="matchRecurringType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recurring</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select recurrence" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="DOES_NOT_REPEAT">Once</SelectItem>
                                    <SelectItem value="DAILY">Daily</SelectItem>
                                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                                    <SelectItem value="BI_WEEKLY">Bi-Weekly</SelectItem>
                                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                                    <SelectItem value="YEARLY">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="matchRecurringUntil"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Until</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild disabled={recurringType === 'DOES_NOT_REPEAT'}>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-between text-left font-normal", !field.value && "text-muted-foreground")}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>-</span>}
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
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
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
                        description="Called when the user types in the 'Your Team' or 'Opponent' fields. This is a simplified endpoint for finding teams."
                        endpoint="/matches/search/teams?name={query}"
                        method="GET"
                        response={`[
  {
    "teamId": "team-alpha-123",
    "teamName": "Alpha Tigers",
    "logo": "https://example.com/logos/alpha.png",
    "ownerId": "user-owner-456",
    "coachId": "user-coach-789"
  }
]`}
                    />
                    <ApiDocumentationViewer
                        title="Fetch Match Categories"
                        description="Called on component mount to populate the 'Category' dropdown."
                        endpoint="/match-category"
                        method="GET"
                        response={`[
  {
    "id": "BI96ZmQxBakw1hw2Lz3H",
    "name": "Friendly Match",
    "description": "A non-competitive match for practice.",
    "isActive": true,
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
]`}
                    />
                    <ApiDocumentationViewer
                        title="Fetch Match Formats"
                        description="Called on component mount to populate the 'Format' dropdown."
                        endpoint="/match-format"
                        method="GET"
                        response={`[
  {
    "id": "LAcQoRc2Rdn2UuqZABQd",
    "name": "11v11",
    "playerCount": 11,
    "description": "Standard 11-a-side match format.",
    "isActive": true,
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
]`}
                    />
                    <ApiDocumentationViewer
                        title="Fetch Match Contests"
                        description="Called on component mount to populate the 'Ev. Contest' dropdown."
                        endpoint="/match-contests"
                        method="GET"
                        response={`[
  {
    "id": "AyN2qV3i5OBmuwFz5Bsw",
    "name": "Zporter Youth Cup",
    "season": "2025",
    "type": "CUP",
    "logoUrl": "https://example.com/logos/zporter-cup.png",
    "participatingTeams": ["xjW4II6khRys9SFDTunP"],
    "isActive": true,
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
]`}
                    />
                     <ApiDocumentationViewer
                        title="Create Match Draft"
                        description="Called when the 'Save Draft & Continue' button is clicked in 'Create' mode. It creates the initial match record. Includes new recurrence fields."
                        endpoint="/matches"
                        method="POST"
                        notes="This is the first and most critical step for creating a new match. The 'id' returned in the response is required to save data in all other tabs (Invites, Plan, Notes, etc.)."
                        requestPayload={`{
  "homeTeamId": "xjW4II6khRys9SFDTunP",
  "awayTeamId": "fYv81QZ1K7ya7SUYqHoZ",
  "categoryId": "BI96ZmQxBakw1hw2Lz3H",
  "formatId": "LAcQoRc2Rdn2UuqZABQd",
  "matchDate": "2025-09-07",
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
  "gatheringTime": "2025-09-07T14:00:00.000Z",
  "fullDayScheduling": false,
  "endTime": "2025-09-07T18:00:00.000Z",
  "matchRecurringType": "WEEKLY",
  "matchRecurringUntil": "2025-09-28",
  "notificationMinutesBefore": 60,
  "markAsOccupied": true,
  "isPrivate": false
}`}
                        response={`{
  "id": "match-1757374871784",
  "source": "user-generated",
  "status": "draft",
  "createdAt": "2025-09-08T10:21:11.784Z",
  "updatedAt": "2025-09-08T10:21:11.784Z",
  "name": "Match Zporter Cup 2023",
  "homeTeam": {
    "id": "xjW4II6khRys9SFDTunP",
    "name": "Home Team Name"
  },
  "awayTeam": {
    "id": "fYv81QZ1K7ya7SUYqHoZ",
    "name": "Away Team Name"
  },
  "userGeneratedData": {
    "eventDetails": {
      "matchDate": "2025-09-07",
      "matchStartTime": "16:00",
      "matchHeadLine": "Match Zporter Cup 2023"
    },
     "scheduleDetails": {
      "matchRecurringType": "WEEKLY",
      "recurringUntil": "2025-09-28"
    }
  }
}`}
                    />
                    <ApiDocumentationViewer
                        title="Update Match Details (Event Tab)"
                        description="Called when the 'Update Match' button is clicked. Performs a partial update on the core event details. Now includes recurrence."
                        endpoint="/matches/{id}?updateScope=series"
                        method="PATCH"
                        notes="The 'updateScope' query param is crucial. 'series' updates all recurring events, while 'single' (default) updates only one instance."
                        requestPayload={`{
  "matchHeadLine": "The Grand Final: Titans vs. Giants",
  "matchDate": "2025-09-21",
  "matchStartTime": "20:00",
  "isPrivate": true,
  "matchRecurringType": "MONTHLY"
}`}
                        response={`{
  "id": "match-1757374871784",
  "source": "user-generated",
  "status": "scheduled",
  "updatedAt": "2025-09-08T11:00:00.000Z",
  "name": "The Grand Final: Titans vs. Giants",
  "userGeneratedData": {
    "eventDetails": {
      "matchHeadLine": "The Grand Final: Titans vs. Giants",
      "matchDate": "2025-09-21",
      "matchStartTime": "20:00"
    },
    "settings": {
      "isPrivate": true
    },
     "scheduleDetails": {
      "matchRecurringType": "MONTHLY"
    }
  }
}`}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  )
}
