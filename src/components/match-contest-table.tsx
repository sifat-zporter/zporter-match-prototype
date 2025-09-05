// src/components/match-contest-table.tsx
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
import type { MatchContest } from "@/lib/models";
import { format as formatDate } from "date-fns";

interface MatchContestTableProps {
  contests: MatchContest[];
  onEdit: (contest: MatchContest) => void;
  onDelete: (id: string) => void;
}

export function MatchContestTable({ contests, onEdit, onDelete }: MatchContestTableProps) {
  return (
    <div className="rounded-lg border">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Season</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {contests.length === 0 ? (
            <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                No contests found.
                </TableCell>
            </TableRow>
            ) : (
            contests.map((contest) => (
                <TableRow key={contest.id}>
                <TableCell className="font-medium">{contest.name}</TableCell>
                <TableCell>{contest.season}</TableCell>
                <TableCell>
                    <Badge variant="secondary">{contest.type}</Badge>
                </TableCell>
                <TableCell>
                    <Badge variant={contest.isActive ? "default" : "secondary"}>
                    {contest.isActive ? "Active" : "Inactive"}
                    </Badge>
                </TableCell>
                <TableCell>{formatDate(new Date(contest.updatedAt), "PPP")}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(contest)}>
                           <Pencil className="mr-2 h-4 w-4"/> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(contest.id)} className="text-destructive">
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
