

// src/components/reviews-panel.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, Camera, Video, ListFilter, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { CreateMatchReviewDto, PlayerReviewDto, Invite, UserDto } from "@/lib/models";
import type { Match, Player } from "@/lib/data";
import { Label } from "./ui/label";
import { ApiDocumentationViewer } from "./api-documentation-viewer";

const StarRating = ({ rating, setRating, size = "md" }: { rating: number; setRating?: (rating: number) => void; size?: "sm" | "md" }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating?.(star)}
                    className="p-1 disabled:cursor-default"
                    aria-label={`Rate ${star} stars`}
                    disabled={!setRating}
                >
                    <Star
                        className={cn(
                            size === "md" ? "w-6 h-6" : "w-5 h-5",
                            star <= rating ? "text-primary fill-primary" : "text-muted-foreground/50"
                        )}
                    />
                </button>
            ))}
        </div>
    );
};

const PlayerReviewItem = ({ player, onReviewChange, initialReview }: { player: Player; onReviewChange: (review: PlayerReviewDto) => void; initialReview?: PlayerReviewDto }) => {
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
                        <StarRating rating={rating} setRating={handleRatingChange} size="sm" />
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-2 pt-2">
                    <Label className="text-xs text-muted-foreground">Match review</Label>
                    <Textarea
                        placeholder="Describe what he/she did well and what he could have done better"
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
};

function TeamReviewForm({ match, players, teamId, reviewType }: { match: Match; players: Player[]; teamId: string; reviewType: string }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [review, setReview] = useState<Partial<CreateMatchReviewDto>>({
        playerReviews: [],
        teamRating: 0,
        overallMatchReview: "",
    });

    const handlePlayerReviewChange = (playerReview: PlayerReviewDto) => {
        setReview(prev => {
            const existingReviews = prev.playerReviews?.filter(r => r.playerId !== playerReview.playerId) || [];
            return {
                ...prev,
                playerReviews: [...existingReviews, playerReview],
            };
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        const payload: CreateMatchReviewDto = {
            subjectId: teamId,
            reviewType: reviewType,
            ztarOfTheMatchPlayerId: review.ztarOfTheMatchPlayerId,
            overallMatchReview: review.overallMatchReview || '',
            teamRating: review.teamRating || 0,
            playerReviews: review.playerReviews || [],
            comment: review.comment,
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

    if (players.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <p>No players available to review for this team.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Your Ztar of the Match</Label>
                <Select onValueChange={(value) => setReview(prev => ({ ...prev, ztarOfTheMatchPlayerId: value }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose player" />
                    </SelectTrigger>
                    <SelectContent>
                        {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Match review</Label>
                <Textarea onChange={(e) => setReview(prev => ({ ...prev, overallMatchReview: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Camera className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
            </div>

            <div className="flex items-center justify-between">
                <p className="font-medium">Team review</p>
                <StarRating
                    rating={review.teamRating || 0}
                    setRating={(rating) => setReview(prev => ({ ...prev, teamRating: rating }))}
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save'}
                </Button>
            </div>
        </div>
    );
}

export function ReviewsPanel({ match }: { match: Match }) {
    const { toast } = useToast();
    const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
    const [homePlayers, setHomePlayers] = useState<Player[]>([]);
    const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
    const [referees, setReferees] = useState<Player[]>([]);

    const fetchInvitedUsers = useCallback(async () => {
        if (!match.id) return;
        setIsLoadingPlayers(true);
        try {
            const invites = await apiClient<Invite[]>(`/matches/${match.id}/invites`);

            const userPromises = invites
                .filter(invite => invite.inviteeId)
                .map(async (invite) => {
                    try {
                        const user = await apiClient<UserDto>(`/users/${invite.inviteeId}`);
                        return {
                            id: user.userId,
                            name: `${user.profile.firstName} ${user.profile.lastName}`,
                            avatarUrl: user.media.faceImage || `https://picsum.photos/seed/${user.userId}/40/40`,
                            number: user.playerCareer?.shirtNumber || Math.floor(Math.random() * 99) + 1,
                            zporterId: user.username,
                            role: invite.role, // Use the role from the invite
                        };
                    } catch (error) {
                        console.error(`Failed to fetch details for user ${invite.inviteeId}`, error);
                        return null;
                    }
                });

            const users = (await Promise.all(userPromises)).filter(Boolean) as Player[];

            setHomePlayers(users.filter(u => u.role && u.role.includes('HOME')));
            setAwayPlayers(users.filter(u => u.role && u.role.includes('AWAY')));
            setReferees(users.filter(u => u.role === 'REFEREE' || u.role === 'HOST' || u.role === 'ADMIN'));

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to load players",
                description: "Could not fetch the list of invited players for reviews.",
            });
        } finally {
            setIsLoadingPlayers(false);
        }
    }, [match.id, toast]);

    useEffect(() => {
        fetchInvitedUsers();
    }, [fetchInvitedUsers]);

    return (
        <div className="space-y-4">
            <Tabs defaultValue="home" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
                    <TabsTrigger value="home" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Home</TabsTrigger>
                    <TabsTrigger value="ref-org" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Ref & Org</TabsTrigger>
                    <TabsTrigger value="away" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Away</TabsTrigger>
                </TabsList>
                <TabsContent value="home" className="pt-6">
                    {isLoadingPlayers ? <Loader2 className="mx-auto my-16 w-8 h-8 animate-spin" /> : <TeamReviewForm match={match} players={homePlayers} teamId={match.homeTeam.id} reviewType="TeamPerformance" />}
                </TabsContent>
                <TabsContent value="ref-org" className="pt-6">
                    {isLoadingPlayers ? <Loader2 className="mx-auto my-16 w-8 h-8 animate-spin" /> : <TeamReviewForm match={match} players={referees} teamId={"organization-placeholder"} reviewType="RefereePerformance" />}
                </TabsContent>
                <TabsContent value="away" className="pt-6">
                    {isLoadingPlayers ? <Loader2 className="mx-auto my-16 w-8 h-8 animate-spin" /> : <TeamReviewForm match={match} players={awayPlayers} teamId={match.awayTeam.id} reviewType="TeamPerformance" />}
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
                            description="Called when the 'Save' button is clicked. Submits the entire review form for the match."
                            endpoint="/matches/{matchId}/reviews"
                            method="POST"
                            requestPayload={`{
  "subjectId": "team-id-string",
  "reviewType": "TeamPerformance",
  "ztarOfTheMatchPlayerId": "player-user-id-abc",
  "overallMatchReview": "A fantastic display of skill and teamwork.",
  "teamRating": 5,
  "playerReviews": [
    {
      "playerId": "player-user-id-abc",
      "rating": 5,
      "comment": "Scored the winning goal."
    },
    {
      "playerId": "player-user-id-def",
      "rating": 4,
      "comment": "Solid defensive work."
    }
  ],
  "comment": "Overall, a very positive performance."
}`}
                            response={`{
  "id": "review-xyz-789",
  "matchId": "match-abc-123",
  "reviewerId": "current-user-id",
  "subjectId": "team-id-string",
  "reviewType": "TeamPerformance",
  "createdAt": "2025-09-07T10:00:00.000Z",
  "updatedAt": "2025-09-07T10:00:00.000Z"
}`}
                        />
                         <ApiDocumentationViewer
                            title="2. Get All Reviews for a Match"
                            description="Could be called when the component loads to see if any reviews already exist for this match."
                            endpoint="/matches/{matchId}/reviews"
                            method="GET"
                            response={`[
  {
    "id": "review-xyz-789",
    "matchId": "match-abc-123",
    "reviewerId": "user-id-of-reviewer-1",
    "subjectId": "team-id-string",
    "reviewType": "TeamPerformance",
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
    "comment": "Overall, a very positive performance from the team.",
    "createdAt": "2025-09-07T10:00:00.000Z",
    "updatedAt": "2025-09-07T10:00:00.000Z"
  }
]`}
                        />
                        <ApiDocumentationViewer
                            title="3. Get a Single Review"
                            description="Used to fetch the details of one specific review."
                            endpoint="/matches/{matchId}/reviews/{reviewId}"
                            method="GET"
                            response={`{
  "id": "review-xyz-789",
  "matchId": "match-abc-123",
  "reviewerId": "user-id-of-reviewer-1",
  "subjectId": "team-id-string",
  "reviewType": "TeamPerformance",
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
  "comment": "Overall, a very positive performance from the team.",
  "createdAt": "2025-09-07T10:00:00.000Z",
  "updatedAt": "2025-09-07T10:15:00.000Z"
}`}
                        />
                        <ApiDocumentationViewer
                            title="4. Update a Match Review"
                            description="Allows the author of a review to update specific fields without sending the whole object again."
                            endpoint="/matches/{matchId}/reviews/{reviewId}"
                            method="PATCH"
                            requestPayload={`{
  "overallMatchReview": "An updated and more detailed review of the performance.",
  "teamRating": 4
}`}
                            response={`{
  "id": "review-xyz-789",
  "matchId": "match-abc-123",
  "reviewerId": "current-user-id",
  "subjectId": "team-id-string",
  "overallMatchReview": "An updated and more detailed review of the performance.",
  "teamRating": 4,
  "createdAt": "2025-09-07T10:00:00.000Z",
  "updatedAt": "2025-09-07T10:20:00.000Z"
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
