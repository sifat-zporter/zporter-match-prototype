"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock, MapPin, Repeat, Bell, Users, Camera, Video, Link2, Search } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  category: z.string().min(1, "Category is required."),
  format: z.string().min(1, "Format is required."),
  contest: z.string().min(2, "Contest name is required."),
  homeAway: z.enum(["home", "away"]),
  date: z.date({ required_error: "A date is required." }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)." }),
  periods: z.string(),
  periodDuration: z.string(),
  pauseDuration: z.string(),
  team: z.string().min(1, "Team is required."),
  opponent: z.string().min(1, "Opponent is required."),
  headline: z.string(),
  description: z.string(),
  fromDate: z.date().optional(),
  fromTime: z.string().optional(),
  allDay: z.boolean(),
  toDate: z.date().optional(),
  toTime: z.string().optional(),
  recurring: z.string(),
  untilDate: z.date().optional(),
  location: z.string(),
  matchArena: z.string(),
  notification: z.string(),
  occupied: z.boolean(),
  private: z.boolean(),
})

export function CreateMatchForm() {
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "cup",
      format: "11v11",
      contest: "Zporter Cup 2023",
      homeAway: "home",
      startTime: "16:00",
      periods: "2",
      periodDuration: "45",
      pauseDuration: "15",
      team: "Maj FC - Boys U15",
      opponent: "",
      headline: "Match Zporter Cup 2023, Home, 11v11",
      description: "Match against 'Opponent' starts at 16:00. 2 Periods a 45 min with a 15 min paus.",
      fromTime: "15:00",
      allDay: false,
      toTime: "18:00",
      recurring: "once",
      location: "Sollentunavallen",
      matchArena: "Sollentunavallen 2B",
      notification: "60",
      occupied: true,
      private: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Match Created!",
      description: `Scheduled ${values.team} vs ${values.opponent}.`,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="cup">Cup</SelectItem><SelectItem value="league">League</SelectItem><SelectItem value="friendly">Friendly</SelectItem></SelectContent></Select></FormItem> )} />
          <FormField control={form.control} name="format" render={({ field }) => ( <FormItem><FormLabel>Format</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="11v11">11v11</SelectItem><SelectItem value="7v7">7v7</SelectItem><SelectItem value="5v5">5v5</SelectItem></SelectContent></Select></FormItem> )} />
        </div>
        
        <FormField control={form.control} name="contest" render={({ field }) => ( <FormItem><FormLabel>Ev. Contest</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Zporter Cup 2023">Zporter Cup 2023</SelectItem></SelectContent></Select></FormItem> )} />

        <div className="grid grid-cols-3 gap-4">
          <FormField control={form.control} name="homeAway" render={({ field }) => ( <FormItem><FormLabel>Home/Away</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="home">Home</SelectItem><SelectItem value="away">Away</SelectItem></SelectContent></Select></FormItem> )} />
          <FormField control={form.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2" />{field.value ? format(field.value, "d MMM") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover></FormItem> )} />
          <FormField control={form.control} name="startTime" render={({ field }) => ( <FormItem><FormLabel>Start</FormLabel><FormControl><Input type="time" icon={Clock} {...field} /></FormControl></FormItem> )} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField control={form.control} name="periods" render={({ field }) => ( <FormItem><FormLabel>Periods</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem></SelectContent></Select></FormItem> )} />
          <FormField control={form.control} name="periodDuration" render={({ field }) => ( <FormItem><FormLabel>Time</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="30">30 m</SelectItem><SelectItem value="45">45 m</SelectItem><SelectItem value="60">60 m</SelectItem></SelectContent></Select></FormItem> )} />
          <FormField control={form.control} name="pauseDuration" render={({ field }) => ( <FormItem><FormLabel>Paus</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="10">10 m</SelectItem><SelectItem value="15">15 m</SelectItem><SelectItem value="20">20 m</SelectItem></SelectContent></Select></FormItem> )} />
        </div>
        
        <FormField control={form.control} name="team" render={({ field }) => ( <FormItem><FormLabel>You</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Maj FC - Boys U15">Maj FC - Boys U15</SelectItem></SelectContent></Select></FormItem> )} />
        <FormField control={form.control} name="opponent" render={({ field }) => ( <FormItem><FormLabel>Opponent</FormLabel><FormControl><Input placeholder="Search" icon={Search} {...field} /></FormControl></FormItem> )} />
        <FormField control={form.control} name="headline" render={({ field }) => ( <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl></FormItem> )} />
        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl></FormItem> )} />

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Camera /></Button>
            <Button variant="ghost" size="icon"><Video /></Button>
            <Button variant="ghost" size="icon"><Link2 /></Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="fromDate" render={({ field }) => ( <FormItem><FormLabel>From</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2" />{field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover></FormItem> )} />
            <FormField control={form.control} name="fromTime" render={({ field }) => ( <FormItem><FormLabel>From</FormLabel><FormControl><Input type="time" icon={Clock} {...field} /></FormControl></FormItem> )} />
        </div>

        <FormField control={form.control} name="allDay" render={({ field }) => (
            <FormItem className="flex items-center justify-between">
                <FormLabel>All day</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
        )} />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="toDate" render={({ field }) => ( <FormItem><FormLabel>To</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2" />{field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover></FormItem> )} />
            <FormField control={form.control} name="toTime" render={({ field }) => ( <FormItem><FormLabel>To</FormLabel><FormControl><Input type="time" icon={Clock} {...field} /></FormControl></FormItem> )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="recurring" render={({ field }) => ( <FormItem><FormLabel>Recurring</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger icon={Repeat}><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="once">Once</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent></Select></FormItem> )} />
            <FormField control={form.control} name="untilDate" render={({ field }) => ( <FormItem><FormLabel>Until</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2" />{field.value ? format(field.value, "PPP") : <span>-</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover></FormItem> )} />
        </div>

        <FormField control={form.control} name="location" render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="Sollentunavallen" icon={MapPin} {...field} /></FormControl></FormItem> )} />
        <FormField control={form.control} name="matchArena" render={({ field }) => ( <FormItem><FormLabel>Match arena</FormLabel><FormControl><Input placeholder="Sollentunavallen 2B" icon={MapPin} {...field} /></FormControl></FormItem> )} />

        <FormField control={form.control} name="notification" render={({ field }) => (
            <FormItem className="flex items-center justify-between">
                <FormLabel>Notification</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="w-auto bg-transparent border-0 shadow-none text-right focus:ring-0"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="15">15 min before</SelectItem>
                        <SelectItem value="30">30 min before</SelectItem>
                        <SelectItem value="45">45 min before</SelectItem>
                        <SelectItem value="60">-60 min</SelectItem>
                    </SelectContent>
                </Select>
            </FormItem>
        )} />

        <FormField control={form.control} name="occupied" render={({ field }) => (
            <FormItem className="flex items-center justify-between">
                <FormLabel>Occupied</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
        )} />
        
        <FormField control={form.control} name="private" render={({ field }) => (
            <FormItem className="flex items-center justify-between">
                <FormLabel>Private</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
        )} />
        
        <div className="pt-4">
            <Button type="submit" className="w-full">Save</Button>
        </div>
      </form>
    </Form>
  )
}
