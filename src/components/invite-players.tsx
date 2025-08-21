"use client"

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, UserPlus, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const players = [
    { name: "John Lundstram", role: "CDM", level: 4, avatar: "https://placehold.co/40x40.png", invited: true },
    { name: "Devendra Banhart", role: "CAM", level: 4, avatar: "https://placehold.co/40x40.png", invited: true },
    { name: "Lord Soyothu", role: "ST", level: 4, avatar: "https://placehold.co/40x40.png", invited: false },
    { name: "Dražen Petrović", role: "CAM", level: 4, avatar: "https://placehold.co/40x40.png", invited: false },
    { name: "Mark Hamill", role: "GK", level: 4, avatar: "https://placehold.co/40x40.png", invited: true },
];

export function InvitePlayers() {
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>(players.filter(p => p.invited).map(p => p.name));

    const handlePlayerSelect = (playerName: string) => {
        setSelectedPlayers(prev => 
            prev.includes(playerName) ? prev.filter(p => p !== playerName) : [...prev, playerName]
        );
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedPlayers(players.map(p => p.name));
        } else {
            setSelectedPlayers([]);
        }
    }

    const allSelected = selectedPlayers.length === players.length;
    const invitedCount = selectedPlayers.length;

    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="p-0 mb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Home</CardTitle>
                    <p className="text-sm font-medium">{invitedCount} of {players.length} invited</p>
                </div>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search" className="pl-9" />
                    </div>
                    <Button variant="ghost" size="icon"><Filter className="w-5 h-5" /></Button>
                </div>

                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                        <Checkbox id="select-all" 
                            checked={allSelected} 
                            onCheckedChange={handleSelectAll}
                        />
                        <label htmlFor="select-all" className="text-sm font-medium">Select All</label>
                    </div>
                </div>

                <Separator />
                
                <div className="space-y-3">
                    {players.map(player => (
                        <div key={player.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox 
                                    id={player.name}
                                    checked={selectedPlayers.includes(player.name)}
                                    onCheckedChange={() => handlePlayerSelect(player.name)}
                                />
                                <Image src={player.avatar} alt={player.name} width={40} height={40} className="rounded-full" data-ai-hint="player avatar" />
                                <div>
                                    <p className="font-semibold">{player.name}</p>
                                    <p className="text-xs text-muted-foreground">{player.role} &middot; Fitness Level {player.level}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon"><UserPlus className="w-5 h-5" /></Button>
                        </div>
                    ))}
                </div>
                
                <div className="pt-4">
                    <Button className="w-full">Save</Button>
                </div>
            </CardContent>
        </Card>
    );
}
