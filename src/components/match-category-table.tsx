// src/components/match-category-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { MatchCategory } from "@/lib/models";
import { format } from "date-fns";

interface MatchCategoryTableProps {
  categories: MatchCategory[];
  onEdit: (category: MatchCategory) => void;
  onDelete: (id: string) => void;
}

export function MatchCategoryTable({ categories, onEdit, onDelete }: MatchCategoryTableProps) {
  return (
    <div className="rounded-lg border">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {categories.length === 0 ? (
            <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                No categories found.
                </TableCell>
            </TableRow>
            ) : (
            categories.map((category) => (
                <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-sm truncate">{category.description || "-"}</TableCell>
                <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                </TableCell>
                <TableCell>{format(new Date(category.updatedAt), "PPP")}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(category)}>
                           <Pencil className="mr-2 h-4 w-4"/> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(category.id)} className="text-destructive">
                           <Trash2 className="mr-2 h-4 w-4"/> Deactivate
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            ))
            )}
        </TableBody>
        </Table>
    </div>
  );
}
