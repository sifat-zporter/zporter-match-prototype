"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { CreateMatchNoteDto, MatchNoteResponse } from "@/lib/models";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Note {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    avatarUrl?: string; // Optional avatar for the author
}

interface MatchNotesProps {
  matchId: string;
  initialNotes: Note[];
}

// Mocking one note with an avatar for demonstration, as per the design
const mockInitialNotes: Note[] = [
    { id: 'note-3', author: 'System', content: 'Text as in the chat öskåjf ödöksjdö kl Kölsdflökd folksd ölksdj ölskd fasokld Jsdflksdjöksh', createdAt: '2021-12-12T18:49:00Z' },
    { id: 'note-2', author: 'John Doe', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing. Donec in dui dapibus, blandit nibh eget,', createdAt: '2021-12-12T18:48:00Z', avatarUrl: 'https://placehold.co/40x40.png' },
    { id: 'note-1', author: 'System', content: 'Text as in the chat about this event\nFrom participants in the event.', createdAt: '2021-12-12T18:47:00Z' },
];


export function MatchNotes({ matchId, initialNotes }: MatchNotesProps) {
    const { toast } = useToast();
    const [noteContent, setNoteContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Using a combination of mock and initial notes for styling purposes
    const [notes, setNotes] = useState<Note[]>([...initialNotes, ...mockInitialNotes].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); 
    
    const handleAddNote = async () => {
        if (!noteContent.trim()) return;
        setIsSubmitting(true);
        try {
            const payload: CreateMatchNoteDto = {
                content: noteContent,
            };
            const newNote = await apiClient<MatchNoteResponse>(`/matches/${matchId}/notes`, {
                method: 'POST',
                body: payload,
            });
            
            setNotes(prevNotes => [newNote, ...prevNotes]);
            setNoteContent("");
            toast({
                title: "Note Added",
                description: "Your note has been saved successfully.",
            });
        } catch (error) {
            console.error("Failed to add note:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save your note. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {notes.map((n) => (
                    <div key={n.id} className={cn("flex w-full", n.avatarUrl ? "justify-start" : "justify-end")}>
                        <div className="flex items-start gap-3 max-w-xs">
                           {n.avatarUrl && <Image src={n.avatarUrl} alt={n.author} width={32} height={32} className="rounded-full mt-2" data-ai-hint="person avatar" />}
                           <div className="flex-1">
                                <p className="text-xs text-muted-foreground mb-1">
                                    {new Date(n.createdAt).toLocaleString('sv-SE').replace(',', '')}
                                </p>
                                <div className={cn("p-3 rounded-lg text-sm", n.avatarUrl ? "bg-card" : "bg-primary text-primary-foreground")}>
                                    <p className="whitespace-pre-line">{n.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                 {notes.length === 0 && (
                    <div className="text-center text-muted-foreground pt-16">
                        <p>No notes for this match yet.</p>
                        <p>Add the first one below!</p>
                    </div>
                 )}
            </div>

            <div className="p-4 border-t border-border bg-background">
                <div className="relative">
                    <Input 
                        placeholder="Hint text"
                        className="pr-12 bg-card border-none"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                        disabled={isSubmitting}
                    />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:text-primary/80"
                        onClick={handleAddNote}
                        disabled={isSubmitting || !noteContent.trim()}
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
