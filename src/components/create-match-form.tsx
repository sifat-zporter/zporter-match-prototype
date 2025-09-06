

"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Search, MapPin, Loader2, Camera, Video, Link as LinkIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
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
import type { CreateMatchDto, MatchCategory, MatchContest, MatchFormat, MatchEntity } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import type { Match } from "@/lib/data";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ApiDocumentationViewer } from "./api-documentation-viewer";

const createMatchSchema = z.object({
  categoryId: z.string().min(1, "Category is required."),
  formatId: z.string().min(1, "Format is required."),
  contestId: z.string().min(1, "Contest is required."),
  matchType: z.enum(["HOME", "AWAY"]).default("HOME"),
  matchDate: z.date(),
  matchStartTime: z.string().default("16:00"),
  matchPeriod: z.coerce.number().int().positive().default(2),
  matchTime: z.coerce.number().int().positive().default(45),
  matchPause: z.coerce.number().int().positive().default(15),
  // Placeholder IDs - in a real app, these would come from team selection UI
  homeTeamId: z.string().default("team-alpha-placeholder"), 
  awayTeamId: z.string().default("team-beta-placeholder"),
  yourTeamName: z.string().min(1, "Your team name is required"),
  opponentTeamName: z.string().min(1, "Opponent team name is required"),
  matchHeadLine: z.string().optional(),
  description: z.string().optional(),
  gatheringDate: z.date(),
  gatheringTime: z.string().default("15:00"),
  matchIsAllDay: z.boolean().default(false),
  matchEnd: z.date(),
  matchEndTime: z.string().default("18:00"),
  matchRecurringType: z.enum(["DOES_NOT_REPEAT", "DAILY", "WEEKLY", "MONTHLY"]).default("DOES_NOT_REPEAT"),
  matchLocation: z.string().default("Sollentunavallen"),
  matchArena: z.string().default("Sollentunavägen 101"),
  notificationSendBefore: z.coerce.number().int().default(60),
  isOccupied: z.boolean().default(true),
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

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        setIsLoading(true);
        const [catData, formatData, contestData] = await Promise.all([
          apiClient<MatchCategory[]>("/match-category"),
          apiClient<MatchFormat[]>("/match-format"),
          apiClient<MatchContest[]>("/match-contests"),
        ]);
        setCategories(catData);
        setFormats(formatData);
        setContests(contestData);
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
  
  const form = useForm<z.infer<typeof createMatchSchema>>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      matchType: "HOME",
      matchDate: new Date(),
      matchStartTime: "16:00",
      matchPeriod: 2,
      matchTime: 45,
      matchPause: 15,
      yourTeamName: "Maj FC - Boys U15",
      opponentTeamName: "FC Barcelona U15",
      matchHeadLine: "Match Zporter Cup 2023",
      description: 'Match against FC Barcelona U15 starts at 16.00.',
      gatheringDate: new Date(),
      gatheringTime: "15:00",
      matchIsAllDay: false,
      matchEnd: new Date(),
      matchEndTime: "18:00",
      matchRecurringType: "DOES_NOT_REPEAT",
      matchLocation: "Sollentunavallen",
      matchArena: "Sollentunavägen 101, 191 40 Sollentuna",
      notificationSendBefore: 60,
      isOccupied: true,
      isPrivate: false,
    },
  });

  async function onSubmit(values: z.infer<typeof createMatchSchema>) {
    try {
      const payload: CreateMatchDto = {
        categoryId: values.categoryId,
        formatId: values.formatId,
        contestId: values.contestId,
        matchType: values.matchType,
        matchDate: format(values.matchDate, 'yyyy-MM-dd'),
        matchStartTime: values.matchStartTime,
        matchPeriod: values.matchPeriod,
        matchTime: values.matchTime,
        matchPause: values.matchPause,
        homeTeamId: values.homeTeamId,
        awayTeamId: values.awayTeamId,
        matchHeadLine: values.matchHeadLine || `${values.yourTeamName} vs ${values.opponentTeamName}`,
        matchLocation: values.matchLocation,
        matchArena: values.matchArena,
        matchIsAllDay: values.matchIsAllDay,
        matchEnd: format(values.matchEnd, 'yyyy-MM-dd'),
        matchEndTime: values.matchEndTime,
        matchRecurringType: values.matchRecurringType,
        notificationSendBefore: values.notificationSendBefore,
        isOccupied: values.isOccupied,
        isPrivate: values.isPrivate,
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="matchTime"
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
                name="matchPause"
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

            <FormField
                control={form.control}
                name="yourTeamName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Your Team</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="opponentTeamName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Opponent</FormLabel>
                    <FormControl>
                    <Input icon={Search} placeholder="Search" {...field} />
                    </FormControl>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="matchHeadLine"
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
                name="gatheringDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gathering Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn("w-full justify-between text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}
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
                <FormField
                control={form.control}
                name="gatheringTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gathering Time</FormLabel>
                    <FormControl>
                        <Input icon={Clock} type="time" {...field} />
                    </FormControl>
                    </FormItem>
                )}
                />
            </div>
            
            <div className="flex items-center justify-between">
                <FormLabel>All day</FormLabel>
                <FormField
                control={form.control}
                name="matchIsAllDay"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    </FormItem>
                )}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="matchEnd"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn("w-full justify-between text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}
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
                <FormField
                control={form.control}
                name="matchEndTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                        <Input icon={Clock} type="time" {...field} />
                    </FormControl>
                    </FormItem>
                )}
                />
            </div>

            <div className="flex items-center justify-between">
                <FormLabel>Recurring</FormLabel>
                <FormField
                control={form.control}
                name="matchRecurringType"
                render={({ field }) => (
                    <FormItem className="w-1/2">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="DOES_NOT_REPEAT">Does not repeat</SelectItem>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
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
                    <Input icon={MapPin} {...field} />
                    </FormControl>
                </FormItem>
                )}
            />

            <div className="flex items-center justify-between">
                <FormLabel>Notification</FormLabel>
                <FormField
                control={form.control}
                name="notificationSendBefore"
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
                name="isOccupied"
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
  "categoryId": "string",
  "formatId": "string",
  "contestId": "string",
  "matchType": "HOME",
  "matchDate": "2025-09-05",
  "matchStartTime": "18:00",
  "matchPeriod": 2,
  "matchTime": 45,
  "matchPause": 15,
  "homeTeamId": "team-home-123",
  "awayTeamId": "team-away-456",
  "matchHeadLine": "Exciting Match",
  "matchLocation": "City Stadium",
  "matchArena": "Main Arena",
  "matchIsAllDay": false,
  "matchEnd": "2025-09-05",
  "matchEndTime": "20:00",
  "matchRecurringType": "DOES_NOT_REPEAT",
  "notificationSendBefore": 60,
  "isOccupied": false,
  "isPrivate": false
}`}
                        response={`{
  "id": "match-draft-12345",
  "status": "draft",
  "homeTeam": { "id": "team-home-123", "name": "Home Team" },
  "awayTeam": { "id": "team-away-456", "name": "Away Team" },
  "startDate": "2025-09-05T18:00:00Z",
  "venue": { "name": "City Stadium" },
  "userGeneratedData": {
    "eventDetails": {
      "matchHeadLine": "Exciting Match"
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
