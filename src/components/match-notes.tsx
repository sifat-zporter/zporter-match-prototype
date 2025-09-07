// src/components/match-notes.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Star, Reply, MoreVertical, Pencil, Trash2, Info, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { MatchNote, CreateMatchNoteDto, UpdateMatchNoteDto } from "@/lib/models";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Textarea } from "./ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ApiDocumentationViewer } from "./api-documentation-viewer";

interface NoteItemProps {
    note: MatchNote;
    onReply: (noteId: string, authorName: string) => void;
    onEdit: (note: MatchNote) => void;
    onDelete: (noteId: string) => void;
    isReply?: boolean;
}

const NoteItem = ({ note, onReply, onEdit, onDelete, isReply = false }: NoteItemProps) => {
    // A real app would get the current user's ID from an auth context
    const currentUserId = "current-user-placeholder"; 
    const isAuthor = note.authorId === currentUserId;

    return (
        <div className={cn("flex items-start gap-3", isReply && "ml-8")}>
            <Image
                src={note.authorDetails?.avatarUrl || 'https://placehold.co/40x40.png'}
                alt={note.authorDetails?.name || 'User'}
                width={32}
                height={32}
                className="rounded-full mt-1"
                data-ai-hint="person avatar"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{note.authorDetails?.name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </p>
                    {note.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                </div>
                <p className="text-sm text-foreground whitespace-pre-line">{note.text}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" onClick={() => onReply(note.noteId, note.authorDetails?.name || 'User')}>
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                    </Button>
                    {isAuthor && (
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => onEdit(note)}>
                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDelete(note.noteId)} className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
};

interface MatchNotesProps {
  matchId: string;
  initialNotes?: MatchNote[];
}

export function MatchNotes({ matchId, initialNotes = [] }: MatchNotesProps) {
    const { toast } = useToast();
    const [notes, setNotes] = useState<MatchNote[]>(initialNotes);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for new/editing note
    const [noteContent, setNoteContent] = useState("");
    const [isStarred, setIsStarred] = useState(false);
    const [editingNote, setEditingNote] = useState<MatchNote | null>(null);
    
    // State for replying
    const [replyingTo, setReplyingTo] = useState<{ noteId: string; authorName: string } | null>(null);

    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedNotes = await apiClient<MatchNote[]>(`/matches/${matchId}/notes`);
            
            // In a real app, you might fetch user details for each authorId here.
            // For now, we'll mock it.
            const notesWithAuthors = fetchedNotes.map(n => ({
                ...n,
                authorDetails: { name: `User ${n.authorId.substring(0,4)}`, avatarUrl: `https://i.pravatar.cc/40?u=${n.authorId}` }
            }));
            
            setNotes(notesWithAuthors);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch notes." });
        } finally {
            setIsLoading(false);
        }
    }, [matchId, toast]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleEdit = (note: MatchNote) => {
        setEditingNote(note);
        setNoteContent(note.text);
        setIsStarred(note.isStarred);
        setReplyingTo(null);
    };
    
    const handleDelete = async (noteId: string) => {
        try {
            await apiClient(`/matches/${matchId}/notes/${noteId}`, { method: 'DELETE' });
            toast({ title: "Note Deleted", description: "The note has been successfully removed." });
            fetchNotes(); // Refresh list
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete the note." });
        }
    };

    const resetForm = () => {
        setNoteContent("");
        setIsStarred(false);
        setEditingNote(null);
        setReplyingTo(null);
    };

    const handleSubmit = async () => {
        if (!noteContent.trim()) return;
        setIsSubmitting(true);

        try {
            if (editingNote) {
                // Update existing note
                const payload: UpdateMatchNoteDto = {
                    text: noteContent,
                    isStarred: isStarred,
                };
                await apiClient(`/matches/${matchId}/notes/${editingNote.noteId}`, {
                    method: 'PATCH',
                    body: payload
                });
                toast({ title: "Note Updated" });
            } else {
                // Create new note or reply
                const payload: CreateMatchNoteDto = {
                    text: noteContent,
                    isStarred: isStarred,
                    isReply: !!replyingTo,
                    parentNoteId: replyingTo?.noteId,
                };
                await apiClient(`/matches/${matchId}/notes`, {
                    method: 'POST',
                    body: payload
                });
                toast({ title: "Note Added" });
            }
            resetForm();
            fetchNotes(); // Refresh the list
        } catch (error) {
             toast({ variant: "destructive", title: "Error", description: "Failed to save your note." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const topLevelNotes = useMemo(() => {
        const noteMap = new Map(notes.map(n => [n.noteId, {...n, replies: []}]));
        const topLevel: MatchNote[] = [];

        for (const note of noteMap.values()) {
            if (note.isReply && note.parentNoteId && noteMap.has(note.parentNoteId)) {
                noteMap.get(note.parentNoteId)?.replies?.push(note);
            } else {
                topLevel.push(note);
            }
        }
        return topLevel.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [notes]);
    
    return (
        <div className="space-y-4">
            <div className="flex flex-col h-[calc(100vh-350px)] border rounded-lg">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>
                    ) : topLevelNotes.length > 0 ? (
                        topLevelNotes.map((note) => (
                            <div key={note.noteId}>
                                <NoteItem note={note} onReply={(noteId, authorName) => setReplyingTo({noteId, authorName})} onEdit={handleEdit} onDelete={handleDelete} />
                                {note.replies && note.replies.length > 0 && (
                                    <div className="space-y-4 mt-2">
                                        {note.replies.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(reply => (
                                             <NoteItem key={reply.noteId} note={reply} onReply={(noteId, authorName) => setReplyingTo({noteId, authorName})} onEdit={handleEdit} onDelete={handleDelete} isReply />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground pt-16">
                            <p>No notes for this match yet.</p>
                            <p>Add the first one below!</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-background rounded-b-lg">
                     {replyingTo && (
                        <div className="text-sm text-muted-foreground mb-2 flex items-center justify-between">
                            <span>Replying to <strong>{replyingTo.authorName}</strong></span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyingTo(null)}><X className="w-4 h-4" /></Button>
                        </div>
                    )}
                    <div className="relative">
                        <Textarea 
                            placeholder={editingNote ? "Edit your note..." : "Add a note..."}
                            className="pr-20 bg-card border-none"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-yellow-400"
                                onClick={() => setIsStarred(!isStarred)}
                                disabled={isSubmitting}
                            >
                                <Star className={cn("w-5 h-5", isStarred && "text-yellow-400 fill-yellow-400")} />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-primary hover:text-primary/80"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !noteContent.trim()}
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="api-docs">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-400" />
                            <span className="font-semibold">Notes Tab API Documentation</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <ApiDocumentationViewer
                            title="1. Get All Match Notes"
                            description="Called on component load to fetch and display all notes for the current match."
                            endpoint="/matches/{matchId}/notes"
                            method="GET"
                            response={`[
  {
    "noteId": "string",
    "authorId": "string",
    "text": "string",
    "isStarred": "boolean",
    "isReply": "boolean",
    "parentNoteId": "string | null",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]`}
                        />
                        <ApiDocumentationViewer
                            title="2. Create a Match Note"
                            description="Called when the user submits a new note or a reply."
                            endpoint="/matches/{matchId}/notes"
                            method="POST"
                            requestPayload={`{
  "text": "string (required)",
  "isReply": "boolean (optional)",
  "parentNoteId": "string (optional)",
  "isStarred": "boolean (optional)"
}`}
                            response={`{
  "noteId": "string",
  "authorId": "string",
  ... // The full note object
}`}
                        />
                         <ApiDocumentationViewer
                            title="3. Update a Match Note"
                            description="Called when a user saves changes after clicking 'Edit' on their own note."
                            endpoint="/matches/{matchId}/notes/{noteId}"
                            method="PATCH"
                            requestPayload={`{
  "text": "string (optional)",
  "isStarred": "boolean (optional)"
}`}
                            response={`{
  "noteId": "string",
  ... // The updated note object
}`}
                        />
                         <ApiDocumentationViewer
                            title="4. Delete a Match Note"
                            description="Called when a user clicks 'Delete' on their own note."
                            endpoint="/matches/{matchId}/notes/{noteId}"
                            method="DELETE"
                            response={`{
  "message": "Note successfully deleted."
}`}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
