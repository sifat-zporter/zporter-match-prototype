
"use client"

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, Camera, Video, ListFilter, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { CreateMatchReviewDto, PlayerReviewDto, TacticalRatingsDto, MentalRatingsDto } from "@/lib/models";
import type { Match, Player } from "@/lib/data";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ApiDocumentationViewer } from "./api-documentation-viewer";

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

const RatingCategory = ({ title, ratings, onRatingChange }: { title: string, ratings: Record<string, number>, onRatingChange: (field: string, value: number) => void }) => (
    <div className="space-y-2">
        <h4 className="font-semibold">{title}</h4>
        {Object.entries(ratings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
                <p className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <StarRating rating={value} setRating={(rating) => onRatingChange(key, rating)} />
            </div>
        ))}
    </div>
);


function HomeReviews({ match }: { match: Match }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const [review, setReview] = useState<Partial<CreateMatchReviewDto>>({
        playerReviews: [],
        teamRating: 0,
        tacticalRatings: { attack: 0, defence: 0, technique: 0, intelligence: 0, physical: 0 },
        mentalRatings: { attitude: 0, composure: 0, concentration: 0, determination: 0, teamWork: 0 },
        isShared: true,
        overallMatchReview: "",
        comment: "",
    });

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
    
    const handleTacticalRatingChange = (field: string, value: number) => {
        setReview(prev => ({
            ...prev,
            tacticalRatings: { ...prev.tacticalRatings!, [field]: value }
        }));
    };
    
    const handleMentalRatingChange = (field: string, value: number) => {
        setReview(prev => ({
            ...prev,
            mentalRatings: { ...prev.mentalRatings!, [field]: value }
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Add required fields that are not in the form yet
        const payload: CreateMatchReviewDto = {
            subjectId: match.homeTeam.id,
            reviewType: 'TeamPerformance', // Or determine dynamically
            ztarOfTheMatchPlayerId: review.ztarOfTheMatchPlayerId,
            overallMatchReview: review.overallMatchReview || '',
            teamRating: review.teamRating || 0,
            playerReviews: review.playerReviews || [],
            tacticalRatings: review.tacticalRatings as TacticalRatingsDto,
            mentalRatings: review.mentalRatings as MentalRatingsDto,
            comment: review.comment || "",
            isShared: review.isShared || false,
        };

        try {
            await apiClient(`/matches/${match.id}/reviews`, {
                method: 'POST',
                body: payload,
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
                    <Label>Your Star of the Match</Label>
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
                    <Label>Overall Match review</Label>
                    <Textarea onChange={(e) => setReview(prev => ({...prev, overallMatchReview: e.target.value}))} />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Camera className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
                </div>
                
                <div className="flex items-center justify-between">
                    <p className="font-medium">Team review</p>
                    <StarRating 
                      rating={review.teamRating || 0} 
                      setRating={(rating) => setReview(prev => ({...prev, teamRating: rating}))}
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
                
                <RatingCategory 
                    title="Tactical review" 
                    ratings={review.tacticalRatings!}
                    onRatingChange={handleTacticalRatingChange}
                />

                <RatingCategory 
                    title="Mental review" 
                    ratings={review.mentalRatings!}
                    onRatingChange={handleMentalRatingChange}
                />
                
                <div className="space-y-2">
                    <Label>Comment</Label>
                    <Textarea onChange={(e) => setReview(prev => ({...prev, comment: e.target.value}))} />
                </div>
                
                <div className="flex items-center justify-between">
                    <Label>Share review</Label>
                    <Switch 
                      checked={review.isShared}
                      onCheckedChange={(checked) => setReview(prev => ({...prev, isShared: checked}))}
                    />
                </div>

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
    <div className="space-y-4">
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

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="api-docs">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Reviews Tab API Documentation</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <ApiDocumentationViewer
                        title="1. Create a Match Review"
                        description="Called when the 'Save Review' button is clicked. Submits the entire review form for the match."
                        endpoint="/matches/{matchId}/reviews"
                        method="POST"
                        requestPayload={`{
  "subjectId": "user-id-of-player-or-team",
  "reviewType": "PlayerPerformance",
  "ztarOfTheMatchPlayerId": "player-user-id-abc",
  "overallMatchReview": "A fantastic display of skill and teamwork.",
  "teamRating": 5,
  "playerReviews": [
    {
      "playerId": "player-user-id-abc",
      "rating": 5,
      "comment": "Scored the winning goal."
    }
  ],
  "tacticalRatings": {
    "attack": 5, "defence": 4, "technique": 5, "intelligence": 4, "physical": 5
  },
  "mentalRatings": {
    "attitude": 5, "composure": 5, "concentration": 4, "determination": 5, "teamWork": 5
  },
  "comment": "Overall, a very positive performance.",
  "isShared": true
}`}
                        response={`// The newly created review object is returned
{
  "id": "review-xyz-789",
  "matchId": "match-abc-123",
  "reviewerId": "current-user-id",
  // ... all other fields from the request
}`}
                    />
                     <ApiDocumentationViewer
                        title="2. Get All Reviews for a Match"
                        description="Could be called when the component loads to see if any reviews already exist for this match."
                        endpoint="/matches/{matchId}/reviews"
                        method="GET"
                        response={`// An array of review objects
[
  {
    "id": "review-xyz-789",
    "matchId": "match-abc-123",
    // ... all other review fields
  }
]`}
                    />
                    <ApiDocumentationViewer
                        title="3. Get a Single Review"
                        description="Used to fetch the details of one specific review."
                        endpoint="/matches/{matchId}/reviews/{reviewId}"
                        method="GET"
                        response={`// A single complete review object
{
  "id": "review-xyz-789",
  "matchId": "match-abc-123",
  // ... all other review fields
}`}
                    />
                    <ApiDocumentationViewer
                        title="4. Update a Match Review"
                        description="Allows the author of a review to update specific fields without sending the whole object again."
                        endpoint="/matches/{matchId}/reviews/{reviewId}"
                        method="PATCH"
                        requestPayload={`{
  "overallMatchReview": "An updated review.",
  "teamRating": 4,
  "isShared": false
}`}
                        response={`// The complete, updated review object is returned
{
  "id": "review-xyz-789",
  "overallMatchReview": "An updated review.",
  "teamRating": 4,
  "isShared": false,
  // ... other fields remain
}`}
                    />
                    <ApiDocumentationViewer
                        title="5. Delete a Match Review"
                        description="Allows the author of a review to delete it permanently."
                        endpoint="/matches/{matchId}/reviews/{reviewId}"
                        method="DELETE"
                        response={`{
  "id": "review-xyz-789",
  "message": "Review successfully deleted."
}`}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
}
