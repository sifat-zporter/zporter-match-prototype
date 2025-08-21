"use client"

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

type Note = {
  id: number;
  timestamp: string;
  text: string;
  author?: {
    name: string;
    avatarUrl: string;
  };
};

const initialNotes: Note[] = [
  {
    id: 1,
    timestamp: "2021/12/12 at 18:47",
    text: "Text as in the chat about this event\nFrom participants in the event.",
  },
  {
    id: 2,
    timestamp: "2021/12/12 at 18:48",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing. Donec in dui dapibus, blandit nibh eget.",
    author: {
      name: "John Doe",
      avatarUrl: "https://placehold.co/40x40.png",
    },
  },
  {
    id: 3,
    timestamp: "2021/12/12 at 18:49",
    text: "Text as in the chat öskdjf ödöklsjdö kl\nKölsdfjlökd fölksd ölksdj ölsd fasökld\nJsdflksdjöksh",
  },
];

export function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim() === "") return;

    const noteToAdd: Note = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' }).replace(',',' at'),
      text: newNote,
      // You can add author info here if you have user authentication
    };
    setNotes([...notes, noteToAdd]);
    setNewNote("");
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col h-[600px]">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {notes.map((note) => (
                <div key={note.id} className="flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">{note.timestamp}</p>
                      <p className="text-sm whitespace-pre-line">{note.text}</p>
                    </div>
                    {note.author && (
                      <Image
                        src={note.author.avatarUrl}
                        alt={note.author.name}
                        width={40}
                        height={40}
                        className="rounded-full ml-4"
                        data-ai-hint="user avatar"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleAddNote} className="flex items-center gap-2">
              <Input
                placeholder="Hint text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
