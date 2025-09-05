
"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Search } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { CreateMatchLogDto } from "@/lib/models";
import type { Match } from "@/lib/data";

const createMatchLogSchema = z.object({
  contestName: z.string().min(1, "Contest name is required"),
  homeClub: z.string().min(1, "Home club is required"),
  homeTeam: z.string().min(1, "Home team is required"),
  awayClub: z.string().min(1, "Away club is required"),
  awayTeam: z.string().min(1, "Away team is required"),
  matchDate: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  periods: z.string(),
  periodDurationMinutes: z.string(),
  pauseDurationMinutes: z.string(),
  location: z.string().optional(),
});

export function CreateMatchLogForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createMatchLogSchema>>({
    resolver: zodResolver(createMatchLogSchema),
    defaultValues: {
      contestName: "Zporter Cup 2023",
      homeClub: "Maj FC",
      homeTeam: "U15",
      awayClub: "FC Barcelona",
      awayTeam: "U15",
      matchDate: new Date(),
      startTime: "15:00",
      periods: "2",
      periodDurationMinutes: "45",
      pauseDurationMinutes: "15",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createMatchLogSchema>) {
    // Read token directly from localStorage at the time of submission
    const apiToken = localStorage.getItem("zporter-api-token");

    if (!apiToken) {
      toast({
        variant: "destructive",
        title: "API Token Missing",
        description: "Please set your API token in the API Token page before creating a match.",
      });
      return;
    }
    
    try {
      const payload: CreateMatchLogDto = {
        ...values,
        matchDate: format(values.matchDate, 'yyyy-MM-dd'),
        periods: parseInt(values.periods),
        periodDurationMinutes: parseInt(values.periodDurationMinutes),
        pauseDurationMinutes: parseInt(values.pauseDurationMinutes),
        location: values.location || 'TBD',
        apiToken: apiToken,
      };
      
      const newMatchLog = await apiClient<Match>('/api/matches/match-logs', {
        method: 'POST',
        body: payload,
      });

      toast({
        title: "Match Log Created!",
        description: "You can now start logging live events for this match.",
      });
      
      router.push(`/matches/${newMatchLog.id}/log`);

    } catch (error) {
      console.error("Failed to create match log:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create match log. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="contestName"
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
        
        <FormField
            control={form.control}
            name="homeClub"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home - Club</FormLabel>
                <FormControl>
                  <Input icon={Search} {...field} />
                </FormControl>
              </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="homeTeam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home - Team</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="awayClub"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Away - Club</FormLabel>
                <FormControl>
                  <Input icon={Search} {...field} />
                </FormControl>
              </FormItem>
            )}
        />
         <FormField
          control={form.control}
          name="awayTeam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Away - Team</FormLabel>
               <FormControl>
                  <Input {...field} />
                </FormControl>
            </FormItem>
          )}
        />
        
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
                          {field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}
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
                  <FormLabel>Starting</FormLabel>
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
              name="periodDurationMinutes"
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
              name="pauseDurationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paus</FormLabel>
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Optional" {...field} />
                </FormControl>
              </FormItem>
            )}
        />
        <div className="pt-4">
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save'}
            </Button>
        </div>
      </form>
    </Form>
  )
}
