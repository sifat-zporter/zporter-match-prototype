"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { CreateMatchNoteDto, MatchNoteResponse } from "@/lib/models";

interface Note {
    id: string;
    author: string;
    content: string;
    createdAt: string;
}

interface MatchNotesProps {
  matchId: string;
  initialNotes: Note[];
}

export function MatchNotes({ matchId, initialNotes }: MatchNotesProps) {
    const { toast } = useToast();
    const [noteContent, setNoteContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState<Note[]>(initialNotes); 
    
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
            
            // Add the new note to the top of the list
            setNotes(prevNotes => [newNote, ...prevNotes]);
            setNoteContent(""); // Clear the input
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
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {notes.map((n) => (
                    <div className="space-y-2" key={n.id}>
                        <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()} by {n.author}</p>
                        <p className="text-sm whitespace-pre-line">{n.content}</p>
                    </div>
                ))}

                 {notes.length === 0 && (
                    <div className="text-center text-muted-foreground pt-16">
                        <p>No notes for this match yet.</p>
                        <p>Add the first one below!</p>
                    </div>
                 )}
            </div>

            <div className="p-4 border-t border-border">
                <div className="relative">
                    <Input 
                        placeholder="Add a note..."
                        className="pr-12"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                        disabled={isSubmitting}
                    />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-500 hover:text-blue-600"
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
