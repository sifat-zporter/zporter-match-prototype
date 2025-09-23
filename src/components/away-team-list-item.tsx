// src/components/away-team-list-item.tsx
import type { AwayInvitation } from "@/lib/models";
import Image from "next/image";
import { ChevronRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AwayTeamListItemProps {
  team: AwayInvitation;
  isPrimary: boolean;
  onSetPrimary: () => void;
  onRemove: () => void;
}

const statusConfig = {
    PRIMARY_PENDING: { color: 'border-green-500', icon: <Check className="w-4 h-4 text-green-500" /> },
    BACKUP_PENDING: { color: 'border-gray-500', icon: null },
    ACCEPTED: { color: 'border-green-500', icon: <Check className="w-4 h-4 text-green-500" /> },
    REJECTED: { color: 'border-red-500', icon: <X className="w-4 h-4 text-red-500" /> },
    CANCELED: { color: 'border-yellow-500', icon: null },
};


export function AwayTeamListItem({ team, isPrimary, onSetPrimary, onRemove }: AwayTeamListItemProps) {
  const currentStatus = statusConfig[team.status] || statusConfig.BACKUP_PENDING;

  return (
      <div className="flex items-center p-2 rounded-md hover:bg-accent group">
        <div className="flex items-center gap-3 flex-1">
          <Image src={team.teamDetails?.logoUrl || 'https://placehold.co/64x64.png'} alt={team.teamDetails?.name || 'Team Logo'} width={40} height={40} className="rounded-md" data-ai-hint="team logo" />
          <div>
            <p className="font-semibold text-sm">{team.teamDetails?.name || team.teamId}</p>
            <p className="text-xs text-muted-foreground">SE/Stockholm • B-2007</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
            <Button
                variant="outline"
                size="icon"
                className={cn("w-6 h-6 rounded-sm border-2", currentStatus.color)}
                onClick={onSetPrimary}
            >
              {isPrimary && currentStatus.icon}
            </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100" onClick={onRemove}>
                <X className="w-4 h-4 text-destructive" />
            </Button>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
  );
}
