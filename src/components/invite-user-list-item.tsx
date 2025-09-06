// src/components/invite-user-list-item.tsx
import type { InviteUserSearchResult } from "@/lib/models";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface InviteUserListItemProps {
  user: InviteUserSearchResult;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  isInvited: boolean;
}

export function InviteUserListItem({ user, isChecked, onCheckedChange, isInvited }: InviteUserListItemProps) {
  return (
      <div className={cn("flex items-center p-2 rounded-md hover:bg-accent", isInvited && "opacity-50")}>
        <div className="flex items-center gap-3 flex-1">
          <Image src={user.faceImage || 'https://placehold.co/64x64.png'} alt={user.name || user.username || 'User avatar'} width={48} height={48} className="rounded-md" data-ai-hint="player avatar" />
          <div className="grid grid-cols-2 items-center text-xs gap-x-3 gap-y-1">
            <p className="font-semibold col-span-2 text-sm text-left">{user.name}</p>
            <p className="text-muted-foreground">@{user.username}</p>
            <p className="text-foreground">{user.type}</p>
            <p className="text-muted-foreground">SE/Stockholm</p>
            <p className="text-foreground">Team Name</p>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-auto">
            <Checkbox
                checked={isInvited || isChecked}
                onCheckedChange={onCheckedChange}
                disabled={isInvited}
                aria-label={`Select ${user.name}`}
            />
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
  );
}
