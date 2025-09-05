// src/app/(app)/match-category/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { MatchCategory, CreateMatchCategoryDto, UpdateMatchCategoryDto } from "@/lib/models";
import { MatchCategoryTable } from "@/components/match-category-table";
import { MatchCategoryForm } from "@/components/match-category-form";

export default function MatchCategoryPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MatchCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MatchCategory | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient<MatchCategory[]>("/match-category");
      setCategories(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch match categories.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: MatchCategory) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to deactivate this category?")) return;

    try {
      await apiClient(`/match-category/${categoryId}`, { method: "DELETE" });
      toast({
        title: "Success",
        description: "Match category deactivated successfully.",
      });
      fetchCategories(); // Refresh list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate match category.",
      });
    }
  };

  const handleFormSubmit = async (values: CreateMatchCategoryDto | UpdateMatchCategoryDto) => {
    try {
      if (editingCategory) {
        // Update
        await apiClient(`/match-category/${editingCategory.id}`, {
          method: "PATCH",
          body: values,
        });
        toast({
          title: "Success",
          description: "Match category updated successfully.",
        });
      } else {
        // Create
        await apiClient("/match-category", {
          method: "POST",
          body: values,
        });
        toast({
          title: "Success",
          description: "Match category created successfully.",
        });
      }
      setIsFormOpen(false);
      fetchCategories(); // Refresh list
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save match category.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">Match Categories</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <MatchCategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
      <MatchCategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
      />
    </div>
  );
}
