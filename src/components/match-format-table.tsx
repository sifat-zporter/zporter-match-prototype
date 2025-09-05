// src/components/match-format-table.tsx
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
import type { MatchFormat } from "@/lib/models";
import { format as formatDate } from "date-fns";

interface MatchFormatTableProps {
  formats: MatchFormat[];
  onEdit: (format: MatchFormat) => void;
  onDelete: (id: string) => void;
}

export function MatchFormatTable({ formats, onEdit, onDelete }: MatchFormatTableProps) {
  return (
    <div className="rounded-lg border">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Player Count</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {formats.length === 0 ? (
            <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                No formats found.
                </TableCell>
            </TableRow>
            ) : (
            formats.map((format) => (
                <TableRow key={format.id}>
                <TableCell className="font-medium">{format.name}</TableCell>
                <TableCell>{format.playerCount}</TableCell>
                <TableCell className="text-muted-foreground max-w-sm truncate">{format.description || "-"}</TableCell>
                <TableCell>
                    <Badge variant={format.isActive ? "default" : "secondary"}>
                    {format.isActive ? "Active" : "Inactive"}
                    </Badge>
                </TableCell>
                <TableCell>{formatDate(new Date(format.updatedAt), "PPP")}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(format)}>
                           <Pencil className="mr-2 h-4 w-4"/> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(format.id)} className="text-destructive">
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
