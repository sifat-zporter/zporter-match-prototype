
"use client"

import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Camera, Video, Plus } from "lucide-react";
import { Switch } from "./ui/switch";

const ZaiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FBBF24"/>
        <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="#F59E0B"/>
        <path d="M22 7L12 12V22L22 17V7Z" fill="#FBBF24"/>
        <path d="M2 7L12 12V22L2 17V7Z" fill="#FCD34D"/>
    </svg>
);

export function OtherPlanPanel() {
  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium">Choose Plan</label>
            <Select defaultValue="new-plan">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="new-plan">New Plan</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <label className="text-sm font-medium">Tactics summary</label>
            <Textarea 
                placeholder="Enter tactics summary..."
                rows={4} 
                className="mt-1" 
            />
        </div>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Camera /></Button>
            <Button variant="ghost" size="icon"><Video /></Button>
            <Button variant="ghost" size="icon"><Plus /></Button>
            <Button variant="ghost" size="icon" className="ml-auto"><ZaiIcon /></Button>
        </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold">Line up</h3>
            <Switch defaultChecked />
        </div>
        <div className="flex justify-between items-center">
            <h3 className="font-semibold">Set plays</h3>
            <Switch />
        </div>
      </div>
      
      <div className="pt-4">
          <Button className="w-full" size="lg">Save</Button>
      </div>

    </div>
  );
}
