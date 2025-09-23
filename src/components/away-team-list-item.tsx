// src/components/away-team-list-item.tsx
import type { AwayInvitation, InvitationStatus } from "@/lib/models";
import Image from "next/image";
import { ChevronRight, Check, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AwayTeamListItemProps {
  team: AwayInvitation;
  onStatusChange: (newStatus: InvitationStatus) => void;
  onRemove: () => void;
}

const statusConfig: Record<InvitationStatus, { color: string, icon: React.ReactNode }> = {
    PRIMARY_PENDING: { color: 'border-green-500 bg-green-500/10', icon: <Check className="w-4 h-4 text-green-500" /> },
    ACCEPTED: { color: 'border-green-500 bg-green-500/10', icon: <Check className="w-4 h-4 text-green-500" /> },
    BACKUP_PENDING: { color: 'border-yellow-500 bg-yellow-500/10', icon: <Minus className="w-4 h-4 text-yellow-500" /> },
    REJECTED: { color: 'border-red-500 bg-red-500/10', icon: <X className="w-4 h-4 text-red-500" /> },
    CANCELED: { color: 'border-gray-500 bg-gray-500/10', icon: null },
};


export function AwayTeamListItem({ team, onStatusChange, onRemove }: AwayTeamListItemProps) {
  const currentStatus = statusConfig[team.status] || statusConfig.CANCELED;

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
            {/* Action buttons revealed on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" className="w-6 h-6 border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-500" onClick={() => onStatusChange('ACCEPTED')}>
                    <Check className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-6 h-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500" onClick={() => onStatusChange('BACKUP_PENDING')}>
                    <Minus className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-6 h-6 border-red-500 text-red-500 hover:bg-red-500/20 hover:text-red-500" onClick={() => onStatusChange('REJECTED')}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

             {/* Visible status indicator */}
            <div className={cn("w-6 h-6 rounded-sm border-2 flex items-center justify-center group-hover:opacity-0", currentStatus.color)}>
                {currentStatus.icon}
            </div>

            <Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100" onClick={onRemove}>
                <X className="w-4 h-4 text-destructive" />
            </Button>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
  );
}
