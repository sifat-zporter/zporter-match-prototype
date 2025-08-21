
"use client"

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, ChevronRight, ChevronDown, Camera, Video, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const players = [
    { id: '1', name: "#ZporterID", role: "Role", avatar: "https://placehold.co/40x40.png" },
    { id: '2', name: "#Johnlund10", role: "CAM", avatar: "https://placehold.co/40x40.png" },
    { id: '3', name: "#Johnlund10", role: "CAM", avatar: "https://placehold.co/40x40.png" },
    { id: '4', name: "#Johnlund10", role: "CAM", avatar: "https://placehold.co/40x40.png" },
    { id: '5', name: "#Johnlund10", role: "CAM", avatar: "https://placehold.co/40x40.png" },
    { id: '6', name: "#ZporterID", role: "Role", avatar: "https://placehold.co/40x40.png" },
    { id: '7', name: "#Johnlund10", role: "CAM", avatar: "https://placehold.co/40x40.png" },
];

const StarRating = ({ rating, setRating }: { rating: number, setRating: (rating: number) => void }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                    aria-label={`Rate ${star} stars`}
                >
                    <Star
                        className={cn(
                            "w-6 h-6",
                            star <= rating ? "text-primary fill-primary" : "text-muted-foreground/50"
                        )}
                    />
                </button>
            ))}
        </div>
    );
};

const PlayerReviewItem = ({ player, initialRating }: { player: typeof players[0], initialRating: number }) => {
    const [rating, setRating] = useState(initialRating);

    return (
        <AccordionItem value={player.id}>
            <AccordionTrigger className="hover:no-underline -mx-2 px-2 py-1 rounded-md hover:bg-accent">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <Image src={player.avatar} alt={player.name} width={40} height={40} className="rounded-md" data-ai-hint="player avatar" />
                        <div>
                            <p className="font-semibold text-sm">{player.name}</p>
                            <p className="text-xs text-muted-foreground text-left">{player.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-2 pt-2">
                    <Textarea placeholder="Describe what he/she did well and what he could have done better" />
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon"><Camera className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}


function HomeReviews() {
    const [teamRating, setTeamRating] = useState(4);

    return (
         <Card>
            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Your Ztar of the Match</label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose player" />
                        </SelectTrigger>
                        <SelectContent>
                            {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Match review</label>
                    <Textarea />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Camera className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
                </div>
                
                <div className="flex items-center justify-between">
                    <p className="font-medium">Team review</p>
                    <StarRating rating={teamRating} setRating={setTeamRating} />
                </div>
                
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{players.length} Players</p>
                    <Button variant="ghost" size="icon"><ListFilter className="w-4 h-4" /></Button>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {players.map((player) => (
                        <PlayerReviewItem key={player.id} player={player} initialRating={4} />
                    ))}
                </Accordion>
                
                <div className="pt-4">
                    <Button className="w-full">Save</Button>
                </div>

            </CardContent>
        </Card>
    )
}


export function ReviewsPanel() {
  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
        <TabsTrigger value="home" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Home</TabsTrigger>
        <TabsTrigger value="ref-org" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Ref & Org</TabsTrigger>
        <TabsTrigger value="away" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Away</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="pt-6">
        <HomeReviews />
      </TabsContent>
      <TabsContent value="ref-org">
         <p className="text-muted-foreground text-center p-8">Referee & Organization reviews will appear here.</p>
      </TabsContent>
      <TabsContent value="away">
         <p className="text-muted-foreground text-center p-8">Away team reviews will appear here.</p>
      </TabsContent>
    </Tabs>
  );
}
