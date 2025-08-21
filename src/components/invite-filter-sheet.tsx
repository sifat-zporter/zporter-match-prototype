import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { SlidersHorizontal } from "lucide-react";

export function InviteFilterSheet() {
  return (
    <SheetContent side="bottom" className="rounded-t-lg">
      <SheetHeader>
        <SheetTitle>
            <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filter who to Invite</span>
            </div>
        </SheetTitle>
      </SheetHeader>
      <div className="py-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="calendar-availability" className="font-normal">Check Calendar Availability</Label>
          <Switch id="calendar-availability" />
        </div>
        <Separator />
        <div className="space-y-2">
            <Label>Country</Label>
            <Select defaultValue="se">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="se">SE - Sweden</SelectItem>
                    <SelectItem value="us">US - United States</SelectItem>
                    <SelectItem value="gb">GB - United Kingdom</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Region</Label>
            <Select defaultValue="stockholm">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="stockholm">Stockholm</SelectItem>
                    <SelectItem value="gothenburg">Gothenburg</SelectItem>
                    <SelectItem value="malmo">Malmö</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Level</Label>
            <Select defaultValue="all">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="amateur">Amateur</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Sorted by</Label>
            <Select defaultValue="reviews">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="reviews">Reviews</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="level">Level</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
    </SheetContent>
  );
}
