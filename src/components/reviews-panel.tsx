"use client"

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, Camera, Video, ListFilter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { CreateMatchReviewDto, PlayerReviewDto, Match, Player } from "@/lib/models";

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

const PlayerReviewItem = ({ player, onReviewChange, initialReview }: { player: Player, onReviewChange: (review: PlayerReviewDto) => void, initialReview?: PlayerReviewDto }) => {
    const [rating, setRating] = useState(initialReview?.rating || 0);
    const [comment, setComment] = useState(initialReview?.comment || "");

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        onReviewChange({ playerId: player.id, rating: newRating, comment });
    };
    
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newComment = e.target.value;
        setComment(newComment);
        onReviewChange({ playerId: player.id, rating, comment: newComment });
    };

    return (
        <AccordionItem value={player.id}>
            <AccordionTrigger className="hover:no-underline -mx-2 px-2 py-1 rounded-md hover:bg-accent">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <Image src={player.avatarUrl} alt={player.name} width={40} height={40} className="rounded-md" data-ai-hint="player avatar" />
                        <div>
                            <p className="font-semibold text-sm">{player.name}</p>
                            <p className="text-xs text-muted-foreground text-left">{player.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StarRating rating={rating} setRating={handleRatingChange} />
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-2 pt-2">
                    <Textarea 
                      placeholder="Describe what they did well and what they could have done better" 
                      value={comment}
                      onChange={handleCommentChange}
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon"><Camera className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}


function HomeReviews({ match }: { match: Match }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [review, setReview] = useState<CreateMatchReviewDto>({ playerReviews: [] });

    const players = match.homeTeam.players || [];

    const handlePlayerReviewChange = (playerReview: PlayerReviewDto) => {
        setReview(prev => {
            const existingReviews = prev.playerReviews?.filter(r => r.playerId !== playerReview.playerId) || [];
            return {
                ...prev,
                playerReviews: [...existingReviews, playerReview]
            };
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await apiClient(`/matches/${match.id}/reviews`, {
                method: 'POST',
                body: review,
            });
            toast({
                title: "Review Saved!",
                description: "Your match review has been submitted successfully.",
            });
        } catch (error) {
            console.error("Failed to save review:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save your review. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <Card>
            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Your Ztar of the Match</label>
                    <Select onValueChange={(value) => setReview(prev => ({...prev, ztarOfTheMatchPlayerId: value}))}>
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
                    <Textarea onChange={(e) => setReview(prev => ({...prev, review: e.target.value}))} />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Camera className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
                </div>
                
                <div className="flex items-center justify-between">
                    <p className="font-medium">Team review</p>
                    <StarRating 
                      rating={review.rating || 0} 
                      setRating={(rating) => setReview(prev => ({...prev, rating}))}
                    />
                </div>
                
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{players.length} Players</p>
                    <Button variant="ghost" size="icon"><ListFilter className="w-4 h-4" /></Button>
                </div>

                <Accordion type="multiple" className="w-full">
                    {players.map((player) => (
                        <PlayerReviewItem 
                            key={player.id} 
                            player={player} 
                            onReviewChange={handlePlayerReviewChange}
                            initialReview={review.playerReviews?.find(r => r.playerId === player.id)}
                        />
                    ))}
                </Accordion>
                
                <div className="pt-4">
                    <Button className="w-full" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Review'}
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}


export function ReviewsPanel({ match }: { match: Match }) {
  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
        <TabsTrigger value="home" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Home</TabsTrigger>
        <TabsTrigger value="ref-org" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Ref & Org</TabsTrigger>
        <TabsTrigger value="away" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Away</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="pt-6">
        <HomeReviews match={match} />
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
