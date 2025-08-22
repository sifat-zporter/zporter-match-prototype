
"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Search } from "lucide-react";
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

const createMatchLogSchema = z.object({
  contest: z.string().default("Zporter Cup 2023"),
  homeClub: z.string().default("Maj FC"),
  homeTeam: z.string().default("U15"),
  awayClub: z.string().default("FC Barcelona"),
  awayTeam: z.string().default("U15"),
  date: z.date(),
  starting: z.string().default("15:00"),
  periods: z.string().default("2"),
  periodTime: z.string().default("45"),
  pauseTime: z.string().default("15"),
  location: z.string().optional(),
});

export function CreateMatchLogForm() {
  const form = useForm<z.infer<typeof createMatchLogSchema>>({
    resolver: zodResolver(createMatchLogSchema),
    defaultValues: {
      contest: "Zporter Cup 2023",
      homeClub: "Maj FC",
      homeTeam: "U15",
      awayClub: "FC Barcelona",
      awayTeam: "U15",
      date: new Date('2022-04-19'),
      starting: "15:00",
      periods: "2",
      periodTime: "45",
      pauseTime: "15",
      location: "",
    },
  });

  function onSubmit(values: z.infer<typeof createMatchLogSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="contest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ev. Contest</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Zporter Cup 2023">Zporter Cup 2023</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="U15">U15</SelectItem>
                  <SelectItem value="U17">U17</SelectItem>
                </SelectContent>
              </Select>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="U15">U15</SelectItem>
                  <SelectItem value="U17">U17</SelectItem>
                </SelectContent>
              </Select>
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
              name="starting"
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
            <Button type="submit" className="w-full">Save</Button>
        </div>
      </form>
    </Form>
  )
}
