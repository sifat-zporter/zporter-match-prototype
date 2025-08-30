
"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, toDate } from "date-fns";
import { Calendar as CalendarIcon, Clock, Search, MapPin, Camera, Video, Link as LinkIcon } from "lucide-react";
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
import type { CreateMatchDraftDto } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import type { Match } from "@/lib/data";

const createMatchSchema = z.object({
  category: z.enum(["Friendly", "Cup", "League", "Other"]),
  format: z.enum(["11v11", "9v9", "8v8", "7v7", "5v5", "3v3", "2v2", "1v1", "Futsal", "Futnet", "Panna", "Teqball", "Other"]),
  evContest: z.string().optional(),
  date: z.date(),
  start: z.string().default("16:00"),
  periods: z.string().default("2"),
  periodTime: z.string().default("45"),
  pauseTime: z.string().default("15"),
  yourTeamName: z.string().min(1, "Your team name is required"),
  opponentTeamName: z.string().min(1, "Opponent team name is required"),
  headline: z.string().optional(),
  description: z.string().optional(),
  gatheringDate: z.date(),
  gatheringTime: z.string().default("15:00"),
  allDay: z.boolean().default(false),
  endDate: z.date(),
  endTime: z.string().default("18:00"),
  isRecurring: z.boolean().default(false),
  recurringUntil: z.date().optional(),
  locationName: z.string().default("Sollentunavallen"),
  locationAddress: z.string().default("Sollentunavägen 101"),
  notification: z.string().default("60"),
  occupied: z.boolean().default(true),
  private: z.boolean().default(false),
});

interface CreateMatchFormProps {
  onMatchCreated: (newMatch: Match) => void;
}

export function CreateMatchForm({ onMatchCreated }: CreateMatchFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof createMatchSchema>>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      category: "Cup",
      format: "11v11",
      evContest: "Zporter Cup 2023",
      date: new Date(),
      start: "16:00",
      periods: "2",
      periodTime: "45",
      pauseTime: "15",
      yourTeamName: "Maj FC - Boys U15",
      opponentTeamName: "FC Barcelona U15",
      headline: "Match Zporter Cup 2023",
      description: 'Match against FC Barcelona U15 starts at 16.00.',
      gatheringDate: new Date(),
      gatheringTime: "15:00",
      allDay: false,
      endDate: new Date(),
      endTime: "18:00",
      isRecurring: false,
      locationName: "Sollentunavallen",
      locationAddress: "Sollentunavägen 101, 191 40 Sollentuna",
      notification: "60",
      occupied: true,
      private: false,
    },
  });

  async function onSubmit(values: z.infer<typeof createMatchSchema>) {
    try {
      const gatheringDateTime = toDate(values.gatheringDate);
      const [fromHours, fromMinutes] = values.gatheringTime.split(':').map(Number);
      gatheringDateTime.setHours(fromHours, fromMinutes);

      const endDateTime = toDate(values.endDate);
      const [toHours, toMinutes] = values.endTime.split(':').map(Number);
      endDateTime.setHours(toHours, toMinutes);

      const payload: CreateMatchDraftDto = {
        homeTeam: { id: 'home-team-placeholder-id', name: values.yourTeamName },
        awayTeam: { id: 'away-team-placeholder-id', name: values.opponentTeamName },
        matchDate: format(values.date, 'yyyy-MM-dd'),
        startTime: values.start,
        location: {
          name: values.locationName,
          address: values.locationAddress,
          coordinates: { latitude: 59.42, longitude: 17.95 } // Placeholder coordinates
        },
        category: values.category,
        format: values.format,
        contestId: values.evContest,
        numberOfPeriods: parseInt(values.periods),
        periodTime: parseInt(values.periodTime),
        pauseTime: parseInt(values.pauseTime),
        headline: values.headline,
        description: values.description,
        gatheringTime: gatheringDateTime.toISOString(),
        fullDayScheduling: values.allDay,
        endTime: endDateTime.toISOString(),
        isRecurring: values.isRecurring,
        recurringUntil: values.recurringUntil ? format(values.recurringUntil, 'yyyy-MM-dd') : undefined,
        notificationMinutesBefore: parseInt(values.notification),
        markAsOccupied: values.occupied,
        isPrivate: values.private,
      };

      const newMatchResponse = await apiClient<Match>('/matches', {
        method: 'POST',
        body: payload,
      });
      
      // Fetch the full match details to pass to the parent
      const newMatchDetails = await apiClient<Match>(`/matches/${newMatchResponse.id}`);

      toast({
        title: "Match Draft Created!",
        description: "You can now fill out the rest of the match details in the tabs.",
      });

      onMatchCreated(newMatchDetails);

    } catch (error) {
      console.error("Failed to create match draft:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create match draft. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Cup">Cup</SelectItem>
                      <SelectItem value="League">League</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="11v11">11v11</SelectItem>
                        <SelectItem value="9v9">9v9</SelectItem>
                        <SelectItem value="7v7">7v7</SelectItem>
                        <SelectItem value="5v5">5v5</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="evContest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ev. Contest</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
        />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
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
                          {field.value ? format(field.value, "d MMM") : <span>Pick a date</span>}
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
              name="start"
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
              name="periods"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periods</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              name="allDay"
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
              name="endDate"
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
              name="endTime"
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
            name="recurringUntil"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Until</FormLabel>
                <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                    <Button
                        variant={"outline"}
                        className={cn("w-full justify-between text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                        {field.value ? format(field.value, "d MMM yyyy") : <span>-</span>}
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
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Name</FormLabel>
                <FormControl>
                  <Input icon={MapPin} {...field} />
                </FormControl>
              </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="locationAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Address</FormLabel>
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
              name="notification"
              render={({ field }) => (
                <FormItem className="w-1/2">
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              name="occupied"
              render={({ field }) => (
                <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
              )}
            />
        </div>
        <div className="flex items-center justify-between">
            <FormLabel>Private</FormLabel>
            <FormField
              control={form.control}
              name="private"
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
  )
}
