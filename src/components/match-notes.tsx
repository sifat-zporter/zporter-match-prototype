"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

// A simple type for a note object, assuming this structure from the backend
interface Note {
    note: string;
    authorId: string;
    createdAt: string;
}

export function MatchNotes({ matchId }: { matchId: string }) {
    const { toast } = useToast();
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    // In a real app, you would fetch existing notes for the matchId
    const [notes, setNotes] = useState<Note[]>([]); 
    
    const handleAddNote = async () => {
        if (!note.trim()) return;
        setIsSubmitting(true);
        try {
            const newNote = await apiClient<Note>(`/matches/${matchId}/notes`, {
                method: 'POST',
                body: { note },
            });
            // Add the new note to the top of the list
            setNotes(prevNotes => [newNote, ...prevNotes]);
            setNote(""); // Clear the input
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
                {notes.map((n, i) => (
                    <div className="space-y-2" key={i}>
                        <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                        <p className="text-sm whitespace-pre-line">{n.note}</p>
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
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                        disabled={isSubmitting}
                    />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-500 hover:text-blue-600"
                        onClick={handleAddNote}
                        disabled={isSubmitting || !note.trim()}
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
