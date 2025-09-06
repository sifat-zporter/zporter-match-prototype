// src/app/(app)/match-contest/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { MatchContest, CreateMatchContestDto, UpdateMatchContestDto } from "@/lib/models";
import { MatchContestTable } from "@/components/match-contest-table";
import { MatchContestForm } from "@/components/match-contest-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApiDocumentationViewer } from "@/components/api-documentation-viewer";

export default function MatchContestPage() {
  const { toast } = useToast();
  const [contests, setContests] = useState<MatchContest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<MatchContest | null>(null);

  const fetchContests = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient<MatchContest[]>("/match-contests");
      setContests(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch match contests.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleCreate = () => {
    setEditingContest(null);
    setIsFormOpen(true);
  };

  const handleEdit = (contest: MatchContest) => {
    setEditingContest(contest);
    setIsFormOpen(true);
  };

  const handleDelete = async (contestId: string) => {
    if (!confirm("Are you sure you want to deactivate this contest?")) return;

    try {
      await apiClient(`/match-contests/${contestId}`, { method: "DELETE" });
      toast({
        title: "Success",
        description: "Match contest deactivated successfully.",
      });
      fetchContests(); // Refresh list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate match contest.",
      });
    }
  };

  const handleFormSubmit = async (values: CreateMatchContestDto | UpdateMatchContestDto) => {
    try {
      if (editingContest) {
        // Update
        await apiClient(`/match-contests/${editingContest.id}`, {
          method: "PATCH",
          body: values,
        });
        toast({
          title: "Success",
          description: "Match contest updated successfully.",
        });
      } else {
        // Create
        await apiClient("/match-contests", {
          method: "POST",
          body: values,
        });
        toast({
          title: "Success",
          description: "Match contest created successfully.",
        });
      }
      setIsFormOpen(false);
      fetchContests(); // Refresh list
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save match contest.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Match Contests</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Contest
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <MatchContestTable
            contests={contests}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="api-docs">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Match Contest API Documentation</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <ApiDocumentationViewer
                        title="Get All Active Match Contests"
                        description="Called on page load to populate the table."
                        endpoint="/match-contests"
                        method="GET"
                        response={`[
  {
    "id": "string",
    "name": "string",
    "season": "string",
    "type": "LEAGUE | CUP | TOURNAMENT",
    "logoUrl": "string",
    "participatingTeams": ["string"],
    "isActive": true,
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]`}
                    />
                    <ApiDocumentationViewer
                        title="Create New Match Contest"
                        description="Called when submitting the 'Add New Contest' form."
                        endpoint="/match-contests"
                        method="POST"
                        requestPayload={`{
  "name": "string (required)",
  "season": "string (required)",
  "type": "LEAGUE | CUP | TOURNAMENT (required)",
  "logoUrl": "string (optional, URL)",
  "participatingTeams": ["string"] (optional),
  "isActive": "boolean (optional)"
}`}
                        response={`{
  "id": "string",
  "name": "string",
  "season": "string",
  "type": "string",
  "logoUrl": "string",
  "participatingTeams": ["string"],
  "isActive": true,
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}`}
                    />
                    <ApiDocumentationViewer
                        title="Update Match Contest"
                        description="Called when submitting the form after clicking 'Edit'."
                        endpoint="/match-contests/:id"
                        method="PATCH"
                        requestPayload={`{
  "name": "string (optional)",
  "season": "string (optional)",
  "type": "LEAGUE | CUP | TOURNAMENT (optional)",
  "logoUrl": "string (optional, URL)",
  "participatingTeams": ["string"] (optional),
  "isActive": "boolean (optional)"
}`}
                        response={`{
  "id": "string",
  "name": "string",
  "season": "string",
  "type": "string",
  "logoUrl": "string",
  "participatingTeams": ["string"],
  "isActive": true,
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}`}
                    />
                     <ApiDocumentationViewer
                        title="Deactivate Match Contest"
                        description="Called when clicking the 'Deactivate' action in the table."
                        endpoint="/match-contests/:id"
                        method="DELETE"
                        response={`{
  "id": "string",
  "message": "Match contest successfully deactivated."
}`}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>

      </main>
      <MatchContestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingContest}
      />
    </div>
  );
}

    
