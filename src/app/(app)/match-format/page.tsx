// src/app/(app)/match-format/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { MatchFormat, CreateMatchFormatDto, UpdateMatchFormatDto } from "@/lib/models";
import { MatchFormatTable } from "@/components/match-format-table";
import { MatchFormatForm } from "@/components/match-format-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApiDocumentationViewer } from "@/components/api-documentation-viewer";

export default function MatchFormatPage() {
  const { toast } = useToast();
  const [formats, setFormats] = useState<MatchFormat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFormat, setEditingFormat] = useState<MatchFormat | null>(null);

  const fetchFormats = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient<MatchFormat[]>("/match-format");
      setFormats(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch match formats.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFormats();
  }, []);

  const handleCreate = () => {
    setEditingFormat(null);
    setIsFormOpen(true);
  };

  const handleEdit = (format: MatchFormat) => {
    setEditingFormat(format);
    setIsFormOpen(true);
  };

  const handleDelete = async (formatId: string) => {
    if (!confirm("Are you sure you want to deactivate this format?")) return;

    try {
      await apiClient(`/match-format/${formatId}`, { method: "DELETE" });
      toast({
        title: "Success",
        description: "Match format deactivated successfully.",
      });
      fetchFormats(); // Refresh list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate match format.",
      });
    }
  };

  const handleFormSubmit = async (values: CreateMatchFormatDto | UpdateMatchFormatDto) => {
    try {
      if (editingFormat) {
        // Update
        await apiClient(`/match-format/${editingFormat.id}`, {
          method: "PATCH",
          body: values,
        });
        toast({
          title: "Success",
          description: "Match format updated successfully.",
        });
      } else {
        // Create
        await apiClient("/match-format", {
          method: "POST",
          body: values,
        });
        toast({
          title: "Success",
          description: "Match format created successfully.",
        });
      }
      setIsFormOpen(false);
      fetchFormats(); // Refresh list
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save match format.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Match Formats</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Format
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <MatchFormatTable
            formats={formats}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="api-docs">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Match Format API Documentation</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <ApiDocumentationViewer
                        title="Get All Active Match Formats"
                        description="Called on page load to populate the table."
                        endpoint="/match-format"
                        method="GET"
                        response={`[
  {
    "id": "string",
    "name": "string",
    "playerCount": "number",
    "description": "string",
    "isActive": true,
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]`}
                    />
                    <ApiDocumentationViewer
                        title="Create New Match Format"
                        description="Called when submitting the 'Add New Format' form."
                        endpoint="/match-format"
                        method="POST"
                        requestPayload={`{
  "name": "string (required)",
  "playerCount": "number (required, positive)",
  "description": "string (optional)",
  "isActive": "boolean (optional)"
}`}
                        response={`{
  "id": "string",
  "name": "string",
  "playerCount": "number",
  "description": "string",
  "isActive": true,
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}`}
                    />
                    <ApiDocumentationViewer
                        title="Update Match Format"
                        description="Called when submitting the form after clicking 'Edit'."
                        endpoint="/match-format/:id"
                        method="PATCH"
                        requestPayload={`{
  "name": "string (optional)",
  "playerCount": "number (optional, positive)",
  "description": "string (optional)",
  "isActive": "boolean (optional)"
}`}
                        response={`{
  "id": "string",
  "name": "string",
  "playerCount": "number",
  "description": "string",
  "isActive": true,
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}`}
                    />
                     <ApiDocumentationViewer
                        title="Deactivate Match Format"
                        description="Called when clicking the 'Deactivate' action in the table."
                        endpoint="/match-format/:id"
                        method="DELETE"
                        response={`{
  "id": "string",
  "message": "Match format successfully deactivated."
}`}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>

      </main>
      <MatchFormatForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingFormat}
      />
    </div>
  );
}
