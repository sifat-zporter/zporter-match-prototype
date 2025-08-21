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
import { CalendarIcon, Clock, MapPin, Repeat, Bell, Users } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
  category: z.string().min(1, "Category is required."),
  format: z.string().min(1, "Format is required."),
  series: z.string().min(2, "Series/Cup name is required."),
  matchType: z.enum(["home", "away"]),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)." }),
  periods: z.number().int().positive(),
  duration: z.number().int().positive(),
  break: z.number().int().positive(),
  team: z.string().min(1, "Team is required."),
  opponent: z.string().min(1, "Opponent is required."),
  headline: z.string(),
  description: z.string(),
  allDay: z.boolean(),
  endDate: z.date().optional(),
  endTime: z.string().optional(),
  recurring: z.string(),
  matchArea: z.string(),
  matchAddress: z.string(),
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
      series: "Zporter Cup 2023",
      matchType: "home",
      time: "16:00",
      periods: 2,
      duration: 40,
      break: 15,
      team: "Maj FC - Boys U15",
      opponent: "",
      headline: "Match Zporter Cup 2023, Home, 11v11",
      description: "Match against 'Opponent' starts at 16:00. 2 Periods a 40 min with a 15 min paus.",
      allDay: false,
      recurring: "once",
      matchArea: "",
      matchAddress: "",
      notification: "45",
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
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cup">Cup</SelectItem>
                    <SelectItem value="league">League</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
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
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="11v11">11v11</SelectItem>
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
          name="series"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Series/Cup</FormLabel>
              <FormControl><Input placeholder="e.g. Zporter Cup 2023" {...field} /></FormControl>
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
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl><Input type="time" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField control={form.control} name="periods" render={({ field }) => (<FormItem><FormLabel>Periods</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl></FormItem>)} />
          <FormField control={form.control} name="duration" render={({ field }) => (<FormItem><FormLabel>Duration (min)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}/></FormControl></FormItem>)} />
          <FormField control={form.control} name="break" render={({ field }) => (<FormItem><FormLabel>Break (min)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}/></FormControl></FormItem>)} />
        </div>
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Team</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select your team" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="Maj FC - Boys U15">Maj FC - Boys U15</SelectItem></SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="opponent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opponent</FormLabel>
              <FormControl><Input placeholder="Search for opponent" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="headline" render={({ field }) => (<FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl></FormItem>)} />
        
        <div className="space-y-4 pt-4 border-t border-border">
            <FormField control={form.control} name="recurring" render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Repeat className="w-5 h-5"/>
                        <FormLabel>Recurring</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="w-auto bg-transparent border-0 shadow-none text-right"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="once">Once</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent>
                    </Select>
                </FormItem>
            )} />
            <FormField control={form.control} name="matchAddress" render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-5 h-5"/>
                        <FormLabel>Location</FormLabel>
                    </div>
                    <FormControl><Input className="w-auto bg-transparent border-0 shadow-none text-right" placeholder="Sollentunavallen" {...field} /></FormControl>
                </FormItem>
            )} />
             <FormField control={form.control} name="notification" render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Bell className="w-5 h-5"/>
                        <FormLabel>Notification</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="w-auto bg-transparent border-0 shadow-none text-right"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="15">15 min before</SelectItem>
                            <SelectItem value="30">30 min before</SelectItem>
                            <SelectItem value="45">45 min before</SelectItem>
                            <SelectItem value="60">1 hour before</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            )} />
            <FormField control={form.control} name="occupied" render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-5 h-5"/>
                        <FormLabel>Occupied</FormLabel>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
             )} />
        </div>
        
        <Button type="submit" className="w-full">Save</Button>
      </form>
    </Form>
  )
}
