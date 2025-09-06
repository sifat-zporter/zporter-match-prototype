

"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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


const createMatchSchema = z.object({
  yourTeamName: z.string().min(1, "Your team name is required."),
  opponentTeamName: z.string().min(1, "Opponent team name is required."),
  homeTeamId: z.string().min(1, "Your team is required."),
  matchDate: z.date(),
  startTime: z.string().default("16:00"),
  location: z.string().default("Sollentunavallen"),
  category: z.enum(["Friendly", "Cup", "League", "Other"]),
  format: z.enum(["11v11", "9v9", "8v8", "7v7", "5v5", "3v3", "2v2", "1v1", "Futsal", "Futnet", "Panna", "Teqball", "Other"]),
  contestId: z.string().optional(),
  numberOfPeriods: z.coerce.number().int().positive().default(2),
  periodTime: z.coerce.number().int().positive().default(45),
  pauseTime: z.coerce.number().int().positive().default(15),
  headline: z.string().optional(),
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
}

export function CreateMatchForm({ onMatchCreated }: CreateMatchFormProps) {
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
  }, [toast]);

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
  
  const form = useForm<z.infer<typeof createMatchSchema>>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      yourTeamName: "Maj FC",
      opponentTeamName: "FC Barcelona",
      homeTeamId: "placeholder-home-id",
      matchDate: new Date(),
      startTime: "16:00",
      location: "Sollentunavallen",
      category: "Friendly",
      format: "11v11",
      numberOfPeriods: 2,
      periodTime: 45,
      pauseTime: 15,
      headline: "Match Zporter Cup 2023",
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
  
  const handleSelectHomeTeam = (team: TeamDto) => {
    setSelectedHomeTeam(team);
    form.setValue("homeTeamId", team.id);
    form.setValue("yourTeamName", team.name);
    setHomeSearchQuery("");
    setHomeSearchResults([]);
  };
  
  const handleSelectAwayTeam = (team: TeamDto) => {
    setSelectedAwayTeam(team);
    form.setValue("opponentTeamName", team.name);
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
        homeTeamId: selectedHomeTeam.id,
        // The API doc uses `opponentTeamName` but let's assume we need an ID for it too
        // if not, the backend might just use the name. For now, we only have the name for opponent.
        opponentTeamName: selectedAwayTeam.name,
        matchDate: format(values.matchDate, 'yyyy-MM-dd'),
        gatheringTime: values.gatheringTime.toISOString(),
        endTime: values.endTime.toISOString(),
      };
      
      const newMatchResponse = await apiClient<MatchEntity>('/api/matches', {
        method: 'POST',
        body: payload as any,
      });

      // Transform the response to the frontend Match type
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
      console.error("Failed to create match draft:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create match draft. Please try again.",
      });
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  const getCategoryName = (value: string): "Friendly" | "Cup" | "League" | "Other" => {
    const found = categories.find(c => c.id === value);
    return found?.name as "Friendly" | "Cup" | "League" | "Other" || "Other";
  }
  const getFormatName = (value: string): "11v11" | "9v9" | "8v8" | "7v7" | "5v5" | "3v3" | "2v2" | "1v1" | "Futsal" | "Futnet" | "Panna" | "Teqball" | "Other" => {
    const found = formats.find(f => f.id === value);
    return found?.name as "11v11" | "9v9" | "8v8" | "7v7" | "5v5" | "3v3" | "2v2" | "1v1" | "Futsal" | "Futnet" | "Panna" | "Teqball" | "Other" || "Other";
  }


  return (
    <div className="space-y-6">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={(value) => field.onChange(getCategoryName(value))} defaultValue={field.value}>
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
                name="format"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select onValueChange={(value) => field.onChange(getFormatName(value))} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            
            <div className="grid grid-cols-2 gap-4">
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
                name="startTime"
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
                name="numberOfPeriods"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Periods</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
                name="periodTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
                name="pauseTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Pause</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
                            form.setValue("yourTeamName", "");
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
                            form.setValue("opponentTeamName", "");
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
                <p className="text-sm font-medium text-destructive">{form.formState.errors.opponentTeamName?.message}</p>
            </div>

            <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
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
                name="location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                    <Input icon={MapPin} {...field} />
                    </FormControl>
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
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
            {form.formState.isSubmitting ? 'Saving...' : 'Save Draft & Continue'}
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
                        endpoint="/api/matches"
                        method="POST"
                        notes="This is the first and most critical step. The 'id' returned in the response is required to save data in all other tabs (Invites, Plan, Notes, etc.)."
                        requestPayload={`{
  "yourTeamName": "string",
  "opponentTeamName": "string",
  "homeTeamId": "string",
  "matchDate": "string (YYYY-MM-DD)",
  "startTime": "string (HH:MM)",
  "location": "string",
  "category": "Friendly | Cup | League | Other",
  "format": "11v11 | 9v9 | 8v8 | 7v7 | 5v5 | 3v3 | 2v2 | 1v1 | Futsal | Futnet | Panna | Teqball | Other",
  "contestId": "string" (optional),
  "numberOfPeriods": "number",
  "periodTime": "number",
  "pauseTime": "number",
  "headline": "string" (optional),
  "description": "string" (optional),
  "gatheringTime": "string (ISO 8601, e.g., YYYY-MM-DDTHH:MM:SSZ)",
  "fullDayScheduling": "boolean",
  "endTime": "string (ISO 8601, e.g., YYYY-MM-DDTHH:MM:SSZ)",
  "isRecurring": "boolean",
  "recurringUntil": "string (YYYY-MM-DD)" (optional),
  "notificationMinutesBefore": "number",
  "markAsOccupied": "boolean",
  "isPrivate": "boolean"
}`}
                        response={`{
  "id": "string",
  "homeTeam": {
    "id": "string",
    "name": "string"
  },
  "awayTeam": {
    "id": "string",
    "name": "string"
  },
  "matchDate": "string (YYYY-MM-DD)",
  "startTime": "string (HH:MM)",
  "location": {
    "name": "string",
    "address": "string"
  },
  "status": "draft",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}`}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  )
}
