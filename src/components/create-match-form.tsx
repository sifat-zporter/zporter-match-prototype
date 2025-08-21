"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Search, MapPin, Camera, Video, Link as LinkIcon, RefreshCw } from "lucide-react";

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

const createMatchSchema = z.object({
  category: z.string().default("Cup"),
  format: z.string().default("11v11"),
  evContest: z.string().default("Zporter Cup 2023"),
  homeAway: z.string().default("Home"),
  date: z.date(),
  start: z.string().default("16:00"),
  periods: z.string().default("2"),
  periodTime: z.string().default("45 m"),
  pauseTime: z.string().default("15 m"),
  yourTeam: z.string().default("Maj FC - Boys U15"),
  opponent: z.string().optional(),
  headline: z.string().default("Match Zporter Cup 2023, Home, 11v11"),
  description: z.string().default('Match against "Opponent" starts at 16.00, 2 Periods a 45 min with a 15 min paus.'),
  fromDate: z.date(),
  fromTime: z.string().default("15:00"),
  allDay: z.boolean().default(false),
  toDate: z.date(),
  toTime: z.string().default("18:00"),
  recurring: z.string().default("Once"),
  until: z.date().optional(),
  location: z.string().default("Sollentunavallen"),
  matchArena: z.string().default("Sollentunavallen 2B"),
  notification: z.string().default("-60"),
  occupied: z.boolean().default(true),
  private: z.boolean().default(false),
});

export function CreateMatchForm() {
  const form = useForm<z.infer<typeof createMatchSchema>>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      category: "Cup",
      format: "11v11",
      evContest: "Zporter Cup 2023",
      homeAway: "Home",
      date: new Date('2022-04-19'),
      start: "16:00",
      periods: "2",
      periodTime: "45",
      pauseTime: "15",
      yourTeam: "Maj FC - Boys U15",
      opponent: "",
      headline: "Match Zporter Cup 2023, Home, 11v11",
      description: 'Match against "Opponent" starts at 16.00, 2 Periods a 45 min with a 15 min paus.',
      fromDate: new Date('2022-04-19'),
      fromTime: "15:00",
      allDay: false,
      toDate: new Date('2022-04-19'),
      toTime: "18:00",
      recurring: "Once",
      location: "Sollentunavallen",
      matchArena: "Sollentunavallen 2B",
      notification: "-60",
      occupied: true,
      private: false,
    },
  });

  function onSubmit(values: z.infer<typeof createMatchSchema>) {
    console.log(values);
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
                    <SelectItem value="Cup">Cup</SelectItem>
                    <SelectItem value="League">League</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
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
        
        <div className="grid grid-cols-3 gap-4">
             <FormField
                control={form.control}
                name="homeAway"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Home/Away</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Home">Home</SelectItem><SelectItem value="Away">Away</SelectItem></SelectContent>
                        </Select>
                    </FormItem>
                )}
            />
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
            name="yourTeam"
            render={({ field }) => (
                <FormItem>
                <FormLabel>You</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Maj FC - Boys U15">Maj FC - Boys U15</SelectItem>
                        <SelectItem value="Other Team">Other Team</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="opponent"
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
              name="fromDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
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
              name="fromTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
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
              name="toDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
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
              name="toTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input icon={Clock} type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
        </div>

         <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Recurring</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger icon={RefreshCw}><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Once">Once</SelectItem>
                                <SelectItem value="Daily">Daily</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="until"
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
        <FormField
            control={form.control}
            name="matchArena"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Match arena</FormLabel>
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
                        <SelectItem value="-15">-15 min</SelectItem>
                        <SelectItem value="-30">-30 min</SelectItem>
                        <SelectItem value="-60">-60 min</SelectItem>
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


        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
      </form>
    </Form>
  )
}
