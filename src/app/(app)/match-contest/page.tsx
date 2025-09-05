// src/app/(app)/match-contest/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { MatchContest, CreateMatchContestDto, UpdateMatchContestDto } from "@/lib/models";
import { MatchContestTable } from "@/components/match-contest-table";
import { MatchContestForm } from "@/components/match-contest-form";

export default function MatchContestPage() {
  const { toast } = useToast();
  const [contests, setContests] = useState<MatchContest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<MatchContest | null>(null);

  const fetchContests = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient<MatchContest[]>("/api/match-contests");
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
      await apiClient(`/api/match-contests/${contestId}`, { method: "DELETE" });
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
        await apiClient(`/api/match-contests/${editingContest.id}`, {
          method: "PATCH",
          body: values,
        });
        toast({
          title: "Success",
          description: "Match contest updated successfully.",
        });
      } else {
        // Create
        await apiClient("/api/match-contests", {
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
      <main className="flex-1 overflow-y-auto p-4">
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
