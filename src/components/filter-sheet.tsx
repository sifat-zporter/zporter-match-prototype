import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SheetContent, SheetHeader, SheetTitle, SheetClose } from "./ui/sheet";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { SlidersHorizontal, X } from "lucide-react";

export function FilterSheet() {
  return (
    <SheetContent side="bottom" className="rounded-t-lg">
      <SheetHeader>
        <SheetTitle>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filter Matches</span>
                </div>
                <SheetClose asChild>
                    <Button variant="ghost" size="icon"><X className="w-5 h-5" /></Button>
                </SheetClose>
            </div>
        </SheetTitle>
      </SheetHeader>
      <div className="py-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="following-filter" className="font-normal text-base">Following</Label>
          <Switch id="following-filter" defaultChecked />
        </div>
         <div className="flex items-center justify-between">
          <Label htmlFor="popular-filter" className="font-normal text-base">Most Popular</Label>
          <Switch id="popular-filter" defaultChecked />
        </div>
        
        <Separator />

        <div className="space-y-2">
            <Label>Country</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="se">Sweden</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Gender</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Age Group</Label>
             <Select>
                <SelectTrigger>
                    <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="u15">U-15</SelectItem>
                    <SelectItem value="u17">U-17</SelectItem>
                    <SelectItem value="u19">U-19</SelectItem>
                    <SelectItem value="adult">Adults</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Sorted</Label>
            <Select defaultValue="start-time">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="start-time">Start time</SelectItem>
                    <SelectItem value="league">League</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
    </SheetContent>
  );
}
