"use client"

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronRight, Plus, ArrowUpDown, ListFilter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

const players = [
    { id: '1', name: "John Lundstram", handle: "#JohLun123456", location: "SE/Stockholm", team: "Hammarby IF", role: "CDM", avatar: "https://placehold.co/40x40.png", invited: true },
    { id: '2', name: "Devendra Banhart", handle: "#DevBan987654", location: "SE/Stockholm", team: "Maj FC", role: "CDM", avatar: "https://placehold.co/40x40.png", invited: true },
    { id: '3', name: "Lord Soyothu", handle: "#LorSoy123456", location: "SE/Stockholm", team: "Hammarby IF", role: "CDM", avatar: "https://placehold.co/40x40.png", invited: true },
    { id: '4', name: "Mark Hamill", handle: "#MarHam345678", location: "SE/Stockholm", team: "Wework AB", role: "Agent", avatar: "https://placehold.co/40x40.png", invited: true },
    { id: '5', name: "John Lundstram", handle: "#JohLun432567", location: "SE/Stockholm", team: "Hammarby IF", role: "Coach", avatar: "https://placehold.co/40x40.png", invited: false },
];

export function InvitePlayers() {
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>(players.filter(p => p.invited).map(p => p.id));

    const handlePlayerSelect = (playerId: string) => {
        setSelectedPlayers(prev => 
            prev.includes(playerId) ? prev.filter(p => p !== playerId) : [...prev, playerId]
        );
    }

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedPlayers(players.map(p => p.id));
        } else {
            setSelectedPlayers([]);
        }
    }

    const allSelected = selectedPlayers.length === players.length;
    const isIndeterminate = selectedPlayers.length > 0 && !allSelected;
    const invitedCount = selectedPlayers.length;
    const totalPlayers = players.length;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium"><span className="text-primary">{invitedCount} of {totalPlayers}</span> Invited</p>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><ArrowUpDown className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><ListFilter className="w-4 h-4" /></Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-9" />
            </div>

            <div className="flex items-center justify-end py-2 gap-2">
                <label htmlFor="select-all" className="text-sm font-medium">All</label>
                <Checkbox id="select-all" 
                    checked={allSelected || isIndeterminate}
                    onCheckedChange={handleSelectAll}
                />
            </div>
            
            <div className="space-y-2">
                {players.map(player => (
                    <div key={player.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                        <div className="flex items-center gap-3">
                            <Image src={player.avatar} alt={player.name} width={40} height={40} className="rounded-full" data-ai-hint="player avatar" />
                            <div className="grid grid-cols-2 items-center text-xs gap-x-2">
                                <p className="font-semibold col-span-2 text-sm">{player.name}</p>
                                <p className="text-muted-foreground">{player.handle}</p>
                                <p className="text-foreground">{player.role}</p>
                                <p className="text-muted-foreground">{player.location}</p>
                                <p className="text-foreground">{player.team}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox 
                                id={`player-${player.id}`}
                                checked={selectedPlayers.includes(player.id)}
                                onCheckedChange={() => handlePlayerSelect(player.id)}
                            />
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>
                ))}
            </div>

            <Separator />
            
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Add</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Search...." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="player1">Player 1</SelectItem>
                                <SelectItem value="player2">Player 2</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="icon" variant="outline"><Plus className="w-4 h-4" /></Button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Invite scheduling, before match start</label>
                    <Switch />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-muted-foreground">Invites</label>
                        <Select defaultValue="-14d">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-14d">- 14d</SelectItem>
                                <SelectItem value="-7d">- 7d</SelectItem>
                                <SelectItem value="-3d">- 3d</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground">Reminder</label>
                        <Select defaultValue="-12d">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-12d">- 12d</SelectItem>
                                <SelectItem value="-5d">- 5d</SelectItem>
                                <SelectItem value="-1d">- 1d</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button className="w-full">Save</Button>
            </div>
        </div>
    );
}
